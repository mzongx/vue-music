import Vue from 'vue'
import 'babel-polyfill'
import App from './App'
import router from './router'
import fastClick from 'fastclick'
import VueLazyload from 'vue-lazyload'
import './common/stylus/index.styl'

Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: './common/images/default.png',
  loading: './common/images/default.png',
  attempt: 1
})

Vue.config.productionTip = false

fastClick.attach(document.body)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
