import Vue from 'vue'
import VueRouter from 'vue-router';

import { user as ApiUser} from '@/apis'

Vue.use(VueRouter)
const TITLE_PRE = 'QA | '
let is_first_time = true
const router = new VueRouter({
  routes: [
    {
      path: "/",
      redirect: '/login'
    },
    {
      path: "/login",
      component: () => import(/* webpackChunkName: "UserLogin" */ '@/views/UserLogin.vue'),
      meta: {
        title: TITLE_PRE + '登录'
      }
    },
    {
      path: "/main",
      component: () => import(/* webpackChunkName: "Main" */ '@/views/Main.vue'),
      children: [
        {
          path: "",
          redirect: "list"
        },
        {
          path: "list",
          name: '语料管理',
          component: () => import(/* webpackChunkName: "List" */ '@/views/Main/List.vue'),
          meta: {
            title: TITLE_PRE + '查看问答',
            icon: 'ios-paper',
            auth: ['admin', 'normal']
          }
        },
        {
          path: "submission",
          name: '学生提交的问题查看',
          component: () => import(/* webpackChunkName: "Submission" */ '@/views/Main/Submission.vue'),
          meta: {
            title: TITLE_PRE + '发布问题',
            icon: 'md-create',
            auth: ['admin', 'normal']
          }
        },
        {
          path: "subject",
          name: '科目管理',
          component: () => import(/* webpackChunkName: "Subject" */ '../views/Main/Subject.vue'),
          meta: {
            title: TITLE_PRE + '科目管理',
            icon: 'ios-school',
            auth: ['admin']
          }
        },
        {
          path: 'user',
          name: '用户管理',
          component: () => import(/* webpackChunkName: "User" */ '../views/Main/User.vue'),
          meta: {
            title: TITLE_PRE + '用户管理',
            icon: 'ios-people',
            auth: ['admin']
          }
        }
      ]
    }
  ]
});

function login_check(next, to_path) {
  let store = router.app.$store
  const mySpin = new Vue({
    render: (h) => h('div', {
        attrs: {
          id: 'my-spin'
        },
        style: {
          position: 'absolute',
          top: '0%',
          left: '0%',
          width: '100%',
          height: '100%',
          color: '#2d8cf0',
          zIndex: 1001,
          textAlign: 'center',
        }
      }, [
        h('div', {
          style: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }
        }, [
          h('Icon', {
            style: {
              animation: 'ani-demo-spin 1s linear infinite'
            },
            props: {
              type: 'ios-loading',
              size: 50
            }
          }),
          h('div', '服务器数据读取...请勿操作')
        ])
      ]
    )
  }).$mount()
  document.body.appendChild(mySpin.$el)
  ApiUser.login_check().then(
    res => {
      // Vue.prototype.$Spin.hide()
      document.getElementById('my-spin').remove()
      mySpin.$destroy()
      switch (res.data.message) {
        case 'Logged': {
          store.commit('setSubjects', res.data.data.subjects)
          store.commit('login', res.data.data)
          if (to_path === '/login' || to_path === '/') return next('/main')
          break
        }
        case 'NotLogged': {
          store.commit('setSubjects', [])
          store.commit('logout')
          if (to_path === '/main') {
            router.app.$Message.error('登录状态已过期，请重新登录')
            return next('/login') // 进入未登录的异常处理
          }
        }
      }
      next()
      if (is_first_time) is_first_time = false
    },
    res => {
      Vue.prototype.$Message.error(`【错误】<br>Code:${res.status}<br>Message:${res.statusText}`)
    }
  )
}
// onReady
// router.onReady(
//   init
// )
router.beforeEach((to, from, next) => {
  // 登录判断并跳转
  let user_type = router.app.$store.state.user_type
  // let is_logged = Boolean(user_type);
  let to_path = to.path.match(/\/(\w+)/)[0]
  // 进入主页面进行权限判断
  if (to_path === '/main') {
    if (user_type && to.meta.auth.indexOf(user_type) < 0) {
      router.app.$Message.error('没有权限进入该模块')
      return next('/main')
    } 
  }

  let tmp = to.meta.title;
  if (tmp) {
    document.title = tmp;
  }

  // next()
  login_check(next, to_path)
})
export default router;