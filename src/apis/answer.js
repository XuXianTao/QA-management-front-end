import api from './_base'
const url = {
  answer: '/v1/answer',
  answer_item: id => `/v1/answer/${id}`
}
export default {
  url,
  getAll: data => api('get', url.answer, data),
  getItem: data => api('get', url.answer_item(data.id)),
  createItem: data => api('post', url.answer, data)
}