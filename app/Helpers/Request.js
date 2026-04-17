'use strict'

const axios = use('axios')

const DEFAULT_TIMEOUT = 30000

class Request {
  get (url, config) {
    return axios.get(url, {timeout: DEFAULT_TIMEOUT, ...config})
  }

  post (url, data, config) {
    return axios.post(url, data, {timeout: DEFAULT_TIMEOUT, ...config})
  }

  patch (url, data, config) {
    return axios.patch(url, data, {timeout: DEFAULT_TIMEOUT, ...config})
  }

  all (...functions) {
    return Promise.all([...functions])
  }
}

module.exports = Request
