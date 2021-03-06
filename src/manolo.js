import macro from '@/macro'
import Intern from '@/intern'

var CONTROL = '.'
var COMMENT = /^\.\\"/

/*
 * params:
 *   input: String containing roff/troff/groff markup
 *   opt: Object with options for return value (optional)
 * returns: String containing html markup
 */
export default function Manolo (input, opt) {
  var ir = new Intern()
  var inputLines = input.split('\n')

  inputLines.forEach(function (line) {
    var m, mFunction

    if (commentLine(line)) {
      // TODO: separate execution flow
      return
    }

    line = processLineEscapes(line)

    if (line.length === 0) {
      ir.addLineBreak()
    } else if (textLine(line)) {
      ir.addText(line)
    } else {
      m = macro.parse(line)
      mFunction = macro[m.command]

      if (mFunction) {
        ir.macro(mFunction, m.args)
      } else {
        console.warn('Unrecognized macro: %s', m.command)
      }
      // console.log(util.inspect(line))
    }

    ir.lineComplete()
  })

  return ir
}

/*
 * params:
 *  line (String): a line of roff markup
 * returns: boolean -
 *   true if the string is a text line
 *   false if it's a control line
 */
function textLine (line) {
  return line.charAt(0) !== CONTROL
}

/*
 * params:
 *  line (String): a line of roff markup
 * returns: boolean -
 *   true if the string is a textline
 *   false if it's a control line
 */
function commentLine (line) {
  return COMMENT.test(line)
}

function processLineEscapes (line) {
  return line.replace(/\\-/g, '-')
    .replace(/\\\^/g, '') // honestly, I dunno what it does
    .replace(/\\e/g, '\\')
}
