import Axios from 'axios'
import Vue from 'vue';

const is_dev = process.env.NODE_ENV === 'development';
//:'http://gptp.dev.xuxiantao.xin'
// 根据webpack环境决定请求的目标地址
const baseurl = is_dev? 'http://bs.dev.local': '/qa/api'
// 为请求结果添加拦截器
Axios.interceptors.response.use(
  // 请求成功时候正常返回response内容
  res => {
    return res
  },
  // 请求失败则通过iView的Message组件统一弹窗提示错误，避免代码冗余
  err => {
    const res = err.response? err.response: {
      status: 0,
      statusText: err.message
    }
    const msg = err.response? err.response.data.message : err.message
    const have_mes = msg
    Vue.prototype.$Message.error(`【错误】<br>Code:${res.status}<br>Message:${have_mes ? msg : res.statusText}`)
    return Promise.reject(err)
  }
)
// 二次封装axio减少参数量
const api = (request_type, request_url, request_data) => {
  const is_get = request_type.toLowerCase() === 'get'
  const axios = Axios({
    method: request_type,
    url: request_url,
    baseURL: baseurl,
    data: is_get ? null : request_data,
    params: is_get ? request_data : null,
    withCredentials: true
  })
  return axios
}
export {baseurl}
export default api