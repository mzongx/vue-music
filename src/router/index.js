import Vue from 'vue'
import Router from 'vue-router'
import recommend from '@/components/recommend/recommend'
import singer from '@/components/singer/singer'
import singerDetail from '@/components/singer-detail/singer-detail'
import rank from '@/components/rank/rank'
import topList from '@/components/top-list/top-list'
import search from '@/components/search/search'
import disc from '@/components/disc/disc'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      name: 'recommend',
      component: recommend,
      children: [
        {
          path: ':id',
          component: disc
        }
      ]
    },
    {
      path: '/singer',
      name: 'singer',
      component: singer,
      children: [
        {
          path: ':id',
          component: singerDetail
        }
      ]
    },
    {
      path: '/rank',
      name: 'rank',
      component: rank,
      children: [
        {
          path: ':id',
          component: topList
        }
      ]
    },
    {
      path: '/search',
      name: 'search',
      component: search,
      children: [
        {
          path: ':id',
          component: singerDetail
        }
      ]
    }
  ]
})
