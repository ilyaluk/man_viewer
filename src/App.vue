<template>
  <div id="app" class="container">
    <md-sidenav class="main-sidebar md-left md-fixed" md-swipable ref="sidenav">
      <md-whiteframe md-elevation="4dp">
        <md-toolbar>
          <div class="md-toolbar-container">
            <p class="md-title">Man pages</p>
          </div>
        </md-toolbar>
      </md-whiteframe>
      <md-list @click.native="closeSidenav" class="list">
        <md-list-item v-for="group in groups" key="group">
          <router-link :to="'/group/' + group.num">{{group.short}}</router-link>
        </md-list-item>
      </md-list>
    </md-sidenav>

    <md-whiteframe md-elevation="4dp">
      <md-toolbar>
        <md-button class="md-icon-button nav-trigger" @click.native="toggleSidenav">
          <md-icon>menu</md-icon>
        </md-button>

        <p class="md-title-left md-title" style="margin-left: 10px">{{ title }}</p>
      </md-toolbar>
    </md-whiteframe>

    <router-view></router-view>
  </div>
</template>

<script>
import * as groups from './assets/groups.json'

export default {
  name: 'app',
  data () {
    return {
      groups: groups,
      title: 'Man pages'
    }
  },
  methods: {
    toggleSidenav () {
      this.$refs.sidenav.toggle()
    },
    closeSidenav () {
      this.$refs.sidenav.close()
    }
  },
  watch: {
    '$route' (from, to) {
      console.log(to)
    }
  }
}
</script>

<style>
 html,
 body {
   height: 100%;
   overflow: hidden;
 }

 body {
   display: flex;
 }

 .container {
   min-height: 100%;
   display: flex;
   flex-flow: column nowrap;
   flex: 1;
 }

 .list {
   overflow-y: auto;
 }

 .main-sidebar > .md-sidenav-content {
   width: 200px !important;
   display: flex;
   flex-flow: column;
   overflow: hidden;
 }

 @media (min-width: 1281px) {
   .container {
     padding-left: 200px !important;
   }

   .main-sidebar > .md-sidenav-content {
     top: 0 !important;
     pointer-events: auto !important;
     transform: translate3d(0, 0, 0) !important;
     box-shadow: 0 1px 5px rgba(0,0,0,.2), 0 2px 2px rgba(0,0,0,.14), 0 3px 1px -2px rgba(0,0,0,.12) !important;
   }

   .main-sidebar > md-whiteframe {
   }

   .main-sidebar > .md-backdrop {
     opacity: 0 !important;
     pointer-events: none !important;
   }

   .nav-trigger {
     display: none;
   }
 }

 * {
   font-family: 'Roboto','Noto',sans-serif;
 }
</style>
