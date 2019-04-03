import api, {baseurl} from './_base' 
const url = {
  collection: '/v1/collection',
  collection_item(id) { return `${this.collection}/${id}`},
  get import() { return `${baseurl}${this.collection}/import` },
  get output() { return `${baseurl}${this.collection}/output` }
}
export default {
  url,
  createItem: data => api('post', url.collection, data),
  updateItem: data => api('put', url.collection_item(data.id), data),
  deleteItem: data => api('delete', url.collection_item(data.id)),
  search: data => api('get', url.collection_search, data)
}