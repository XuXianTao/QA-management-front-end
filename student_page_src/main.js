import Vue from 'vue'
import App from './App.vue'
import '@stu/stylus/common.styl'
const is_dev = process.env.NODE_ENV === 'development'

Vue.config.productionTip = is_dev
new Vue({
  render(h) {
    return h(App)
  }
}).$mount('#app')