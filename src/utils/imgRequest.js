/* global window */
import axios from 'axios'
import {ApiNotification} from '@/utils/common'

// 设置网络超时
axios.defaults.timeout = 1000 * 20;
const fetch = (options) => {
  let {
    url,
    method = 'get',
    data,
    headers,
  } = options;

  switch (method.toLowerCase()) {
    case 'get':
      if (headers) {
        return axios.get(url, {params: data, headers: headers, timeout: 1000 * 20,responseType: 'blob'});
      } else {
        return axios.get(url, {params: data, timeout: 1000 * 20});
      }
    case 'delete':
      return axios.delete(url, {params: data, timeout: 1000 * 20});
    case 'post':
      if (headers) {
        return axios.post(url, data, {headers: headers, timeout: 1000 * 20});
      } else {
        return axios.post(url, data, {timeout: 1000 * 20});
      }
    case 'put':
      return axios.put(url, data, {timeout: 1000 * 20});
    default:
      return axios(options)
  }
};

function blobToDataURI(blob, callback) {
  let reader = new FileReader();
  reader.onload = function (e) {
    callback(e.target.result);
  };
  reader.readAsDataURL(blob);
}

export default function imgRequest(options) {
  return fetch(options).then((response) => {
    const {statusText, status} = response;
    let data = response.data;
    return Promise.resolve({
      success: true,
      message: statusText,
      statusCode: status,
      data: data,
    })
  }).catch((error) => {
    const {response} = error;
    let msg;
    let statusCode;
    if (response && response instanceof Object) {
      const {data, statusText} = response;
      statusCode = response.status;
      msg = data.message || statusText
    } else {
      statusCode = 600;
      msg = error.message || 'Network Error'
    }
    ApiNotification(statusCode, msg);
    /* eslint-disable */
    return Promise.resolve({success: false, statusCode, message: msg});
  })
}
