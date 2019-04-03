import api from './_base'
const url = {
  user: '/v1/user',
  get login() { return `${this.user}/login` },
  get login_check() { return `${this.user}/check` },
  get logout() { return `${this.user}/logout`},
  user_item(id) { return `${this.user}/${id}`}
}
export default {
  url,
  msg_login: {
    'NoAccount': {
      type: 'error',
      info: '该用户名尚未注册'
    },
    'FailAuth': {
      type: 'error',
      info: '用户密码输入错误'
    },
    'LoginSuccessfully': {
      type: 'success',
      info: '登录成功'
    },
    'NoInput': {
      type: 'error',
      info: '参数传递错误'
    }
  },
  login: data => api('post', url.login, data),
  signup: data => api('post', url.user, data),
  login_check: data => api('get', url.login_check, data),
  logout: data => api('post', url.logout, data),
  deleteItem: id => api('delete', url.user_item(id)),
  updateItem: data => api('put', url.user_item(data.id), data)
}