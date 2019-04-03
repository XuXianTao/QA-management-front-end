import api from './_base'
const url = {
  question: '/v1/question',
  question_item(id) { return `${this.question}/${id}`},
}
export default {
  url,
  updateItem: data => api('put', url.question_item(data.id), data),
  createItem: data => api('post', url.question, data),
  deleteItem: data => api('delete', url.question_item(data.id)),
  search: data => api('get', url.question, data)
}