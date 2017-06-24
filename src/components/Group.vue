<template>
  <div>
    <router-link v-for="letter in letters" :key="letter"
                 :to="'/group/' + groupId + '/' + letter">
      <md-button class="md-raised">
        {{ letter }}
      </md-button>
    </router-link>
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
      letters: []
    }
  },
  props: {
    groupId: String
  },
  wathch: {
    'groupId': this.updateList
  },
  methods: {
    updateList () {
      this.letters = Array.from(new Set(
        pages['man' + this.groupId].map(
          s => s.replace(/^_*([^_])[\s\S]*$/, '$1').toLowerCase()
      )))
    }
  }
}
</script>

<style scoped>
</style>
