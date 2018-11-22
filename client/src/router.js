import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import heroList from './views/heroList.vue'
import heroDetail from './views/heroDetail.vue'
import editHero from './views/editHero.vue'
import uploadImg from './views/uploadImg.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
 // mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    {
        path: '/heroList',
        name: 'heroList',
        component: heroList
    },
    {
        path: '/heroDetail',
        name: 'heroDetail',
        component: heroDetail
    },
      {
          path: '/editHero',
          name: 'editHero',
          component: editHero
      },
      {
          path: '/uploadImg',
          name: 'uploadImg',
          component: uploadImg
      },
  ]
})
