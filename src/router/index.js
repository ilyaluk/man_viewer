import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Group from '@/components/Group'
import GroupList from '@/components/GroupList'
import Page from '@/components/Page'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      component: Home
    }, {
      path: '/group/:groupId',
      props: true,
      component: Group
    }, {
      path: '/group/:groupId/:letter',
      props: true,
      component: GroupList
    }, {
      path: '/page/:page',
      props: true,
      component: Page
    }, {
      path: '*',
      redirect: '/'
    }
  ]
})
