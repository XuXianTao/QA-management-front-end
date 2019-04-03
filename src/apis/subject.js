import api from './_base'
const url = {
  subject: '/v1/subject',
  subject_item(id) { return `${this.subject}/${id}`},
  get subject_user() { return `${this.subject}/for_user`}
}
export default {
  url,
  getAll: () => api('get', url.subject, null),
  getAll_User: () => api('get', url.subject_user, null),
  deleteItem: data => api('delete', url.subject_item(data.id), data),
  createItem: data => api('post', url.subject, data)
}