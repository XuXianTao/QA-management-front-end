import api from './_base'

const url = {
  datatrain: '/v1/nlp/datatrain'
}

export default {
  datatrain: (data) => api('post', url.datatrain, data)
}
