
import config from '../config';

class Api {

  constructor(base) {
    this.base = base;
  }

  methodGet(url, headers) {
    let _headers = Object.assign({
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    }, headers);

    if (config.api_log_requests) {
      console.log("API GET: ", this.base + url, _headers);
    }
    return fetch(this.base + url, _headers);
  }

  methodPost(url, data, headers) {
    let _headers = Object.assign({
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }, headers);

    if (config.api_log_requests) {
      console.log("API POST: ", this.base + url, _headers);
    }
    return fetch(this.base + url, _headers);
  }

}

// Create an instance of the API
const api = new Api(config.api_host);

export default api;
