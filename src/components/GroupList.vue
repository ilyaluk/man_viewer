<template>
  <div class="cont">
    <md-card class="card">
      <md-card-content>
        <div>
          <router-link v-for="page in pages" :key="page"
                       :to="'/page/' + page">
            {{ page }}<br>
          </router-link>
        </div>
      </md-card-content>
    </md-card>
  </div>
</template>

<script>
import * as pages from '../assets/pages.json'

export default {
  mounted () {
    this.updateList()
  },
  data () {
    return {
      pages: []
    }
  },
  props: {
    groupId: String,
    letter: String
  },
  wathch: {
    'groupId': this.updateList,
    'letter': this.updateList
  },
  methods: {
    updateList () {
      let regex = RegExp('^_*' + this.letter)
      this.pages = pages['man' + this.groupId].filter(regex.test.bind(regex))
    }
  }
  // app.pages_list = app.pages['man' + app.group_number].filter(regex.test.bind(regex));
}
</script>

<style scoped>
 .card {
   margin: 15px;
 }
 .cont {
   overflow-y: auto;
 }
</style>
