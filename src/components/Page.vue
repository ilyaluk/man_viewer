<template>
  <div class="hello">
    <md-card class="card">
      <md-card-content>
        <div v-html="html" class="content"></div>
      </md-card-content>
    </md-card>
  </div>
</template>

<script>
import Manolo from '@/manolo.js'
import * as Zlib from 'zlibjs/bin/gunzip.min.js'

export default {
  props: {
    page: String
  },
  data () {
    return {
      html: ''
    }
  },
  mounted () {
    this.loadNparse(this.page)
  },
  watch: {
    'page' (from, to) {
      this.loadNparse(this.page)
    }
  },
  methods: {
    loadNparse (fname) {
      let tmp = fname.split('.')
      let ext = tmp.pop()
      tmp.push(ext)
      let comp = (ext === 'gz')

      let url = '/.static/mans/man' + tmp[tmp.length - 1 - comp][0] + '/' + fname

      let that = this
      this.$http.get(url, {responseType: 'blob'}).then(response => {
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

          that.html = Manolo(str).toHTML()
        }
        reader.readAsArrayBuffer(blob)
      })
    }
  }
}
</script>

<style scoped>
 .hello {
   overflow-y: auto;
 }
 .card {
   margin: 15px;
 }
</style>
