import api from './_base'
const url = {
  submission: '/v1/submission',
  submission_item(id) { return `${this.submission}/${id}`},
  get submission_to_data() { return `${this.submission}/add_to_data`}
}
export default {
  url,
  getAll: data => api('get', url.submission, data),
  getItem: data => api('get', url.submission_item(data.id)),
  deleteItem: data => api('delete', url.submission_item(data.id), data),
  addToData: data => api('post', url.submission_to_data, data),
  updateItem: data => api('put', url.submission_item(data.id), data)
}