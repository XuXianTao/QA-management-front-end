import axios from 'axios'
const is_dev = process.env.NODE_ENV === 'development'

const BASE_URL = is_dev? 'http://bs.dev.local': '/qa/api'
const getAnswer = (msg) => {
  const url = `${BASE_URL}/v1/nlp/getanswer`
  const params = {
    msg
  }
  return axios.post(url, params)
}

export { getAnswer }