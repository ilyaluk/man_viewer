import Manolo from '@/manolo.js'
import * as Zlib from 'zlibjs/bin/gunzip.min.js'

let macro = {}
var WHITESPACE = /\s+/
var FONTS = {
  B: 'bold',
  I: 'italics',
  R: 'roman'
}

function parseArgs (argsString) {
  var args = []
  var i = 0
  var inQuote = false
  var current = ''

  for (i; i < argsString.length; i++) {
    if (argsString[i] === '"') {
      if (inQuote) {
        inQuote = false
        args.push(current)
        current = ''
      } else {
        inQuote = true
      }
    } else if (argsString[i].match(WHITESPACE)) {
      if (inQuote) {
        current += argsString[i]
      } else {
        args.push(current)
        current = ''
      }
    } else {
      current += argsString[i]
    }
  }

  if (current.length) {
    args.push(current)
  }

  return args
}

function inlineFormat (str, font, nodeList) {
  var mark = str.indexOf('\\f')
  var start = 0

  FONTS.P = font

  if (mark === -1) {
    nodeList.push({ type: font, text: str })
    return
  }

  while (mark < str.length && mark > -1) {
    nodeList.push({ type: font, text: str.substr(start, mark) })

    font = FONTS[str.charAt(mark + 2)]
    str = str.substr(mark + 3)
    mark = str.indexOf('\\f')
  }

  if (str.length) {
    nodeList.push({ type: font, text: str })
  }
}

/*
 * input: control line calling a macro
 * output: object containing:
 *  { command: string name of the command,
 *    args: array of arguments passed to the macro }
 */
macro.parse = function (line) {
  line = line.substr(1)
  var space = line.match(WHITESPACE)
  var spaceIndex, cmd, args

  if (space) {
    spaceIndex = space.index
    cmd = line.substr(0, spaceIndex)
    args = line.substr(spaceIndex + 1)
  } else {
    cmd = line
    args = []
  }

  return {
    command: cmd,
    args: parseArgs(args)
  }
}

/* (T|G)ROFF Macros */

macro.alternateText = function (first, second) {
  return function (args) {
    var current = this.current()
    var i
    var type = first

    for (i = 0; i < args.length; i++) {
      inlineFormat(args[i], type, current.nodes)

      if (type === first) {
        type = second
      } else {
        type = first
      }
    }
  }
}

macro.singleText = function (type) {
  return function (args) {
    var current = this.current()

    inlineFormat(args.join(' '), type, current.nodes)
  }
}

macro['B'] = macro.singleText('bold')

macro['I'] = macro.singleText('italics')

macro['BI'] = macro.alternateText('bold', 'italics')

macro['BR'] = macro.alternateText('bold', 'roman')

macro['IB'] = macro.alternateText('italics', 'bold')

macro['IR'] = macro.alternateText('italics', 'roman')

macro['RB'] = macro.alternateText('roman', 'bold')

macro['RI'] = macro.alternateText('roman', 'italics')

function newParagraph () {
  this.nodes.push({ type: 'paragraph', nodes: [] })
}

macro['PP'] = newParagraph
macro['LP'] = newParagraph
macro['P'] = newParagraph

// section header (h2)
macro['SH'] = function (args) {
  this.nodes.push({ type: 'section-header', text: args[0] })
  this.nodes.push({ type: 'paragraph', nodes: [] })
}

// definition list (dl/dt/dd)
macro['TP'] = function (args) {
  var list

  if (this.currentTopLevel() && this.currentTopLevel().type !== 'definition-list') {
    this.nodes.push({ type: 'definition-list', items: [] })
  }

  list = this.currentTopLevel()
  list.items.push({ type: 'definition-term', nodes: [] })
}

macro['br'] = function () {
  this.addLineBreak()
}

// ABOUT - not directly translatable to DOM
macro['TH'] = function (args) {
  this.title = args[0]

  if (args.length > 1) this.section = args[1]
}

macro['LO'] = function (args) {
  this.section = args[0]
}

macro['so'] = function (args) {
  var url = '/.static/mans/' + args[0]

  var comp = false
  var http = new XMLHttpRequest()
  http.open('HEAD', url, false)
  http.send()
  if (http.status === 404) {
    url += '.gz'
    comp = true
  }

  window.http.get(url, {responseType: 'blob'}).then(response => {
    return response.blob()
  }).then(blob => {
    let res
    let reader = new FileReader()
    reader.onload = function () {
      res = new Uint8Array(this.result)

      let str = String.fromCharCode.apply(null, res)

      if (comp) {
        let inflate = new Zlib.Zlib.Gunzip(res)
        let plain = inflate.decompress()
        str = String.fromCharCode.apply(null, plain)
      }

      str = decodeURIComponent(escape(str))

      this.html = Manolo(str).toHTML()
    }
    reader.readAsArrayBuffer(blob)
  })
}

export default macro
