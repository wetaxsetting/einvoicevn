'use strict';

const axios = use('axios');
axios.interceptors.request.use(request => {
  request.maxContentLength = Infinity;
  request.maxBodyLength = Infinity;
  return request;
});
class Request {
  get(url, config) {
    return axios.get(url, config);
  }

  post(url, data, config) {
    return axios.post(url, data, config);
  }

  patch(url, data, config) {
    return axios.patch(url, data, config);
  }

  delete(url, config) {
    return axios.delete(url, config);
  }

  all(...functions) {
    return Promise.all([...functions]);
  }
}

module.exports = Request;
