import 'babel-polyfill'
import Vue from 'vue'
import App from './App.vue'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import VueResource from 'vue-resource'
import Vuex from 'vuex'
import MD5 from 'md5'

import MyStore from './store/index.js'
import MyRouter from "./router/app.js"

const is_dev = process.env.NODE_ENV === 'development'

Vue.config.productionTip = is_dev
Vue.use(iView, {
  transfer: true,
  size: 'large'
})

Vue.use(VueResource)
Vue.use(Vuex)

Vue.prototype.md5 = MD5

new Vue({
  router: MyRouter,
  store: MyStore,
  render(h) {
    /** fix IE下的vue-router跳转 */
    // if ('-ms-scroll-limit' in document.documentElement.style 
    // && '-ms-ime-align' in document.documentElement.style) {
    if (/Trident/i.test(window.navigator.userAgent)) {
      window.addEventListener('hashchange', () => {
        var currentPath = window.location.hash.slice(1)
        if (this.$router.path !== currentPath) {
          this.$router.push(currentPath)
        }
      }, false)
    }

    return h(App)
  }
}).$mount('#app')
