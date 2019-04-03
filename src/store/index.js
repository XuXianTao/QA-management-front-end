import Vue from 'vue'
import Vuex from 'vuex'
import { user as ApiUser} from '@/apis'

Vue.use(Vuex)
let store = new Vuex.Store({
  state: {
    subjects: [],
    user_type: null,
    account: null,
    uid: null,
    subject_selected: {
      id: null,
      name: null
    }
  },
  mutations: {
    refreshSubjects () {
      ApiUser.login_check().then(
        res => {
          // Vue.prototype.$Spin.hide()
          switch (res.data.message) {
            case 'Logged': {
              store.commit('setSubjects', res.data.data.subjects)
              store.commit('login', res.data.data)
              break
            }
            case 'NotLogged': {
              store.commit('setSubjects', [])
              store.commit('logout')
            }
          }
        },
        res => {
          Vue.prototype.$Message.error(`【错误】<br>Code:${res.status}<br>Message:${res.statusText}`)
        }
      )
    },
    setSubjects (state, subjects) {
      state.subjects = subjects
      if (!this.state.subject_selected.id) this.commit('setSubjectSelected', subjects[0])
    },
    setSubjectSelected (state, subject) {
      Object.assign(state.subject_selected, subject)
    },
    login(state, data) {
      state.user_type = data.type
      state.account = data.account
      state.uid = data.uid
    },
    logout (state) {
      state.user_type = null
    }
  }
})
export default store;