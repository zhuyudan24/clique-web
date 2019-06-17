import Vue from 'vue';
import qs from 'qs';
import { Message } from 'element-ui';

// Vue.axios.defaults.timeout = 30000;
var local = window.location.origin;
if (local.indexOf('localhost') != -1) {
  local = 'http://gicdev.demogic.com';
}
Vue.axios.interceptors.request.use(
  config => {
    return config;
  },
  err => {
    Message.error({ message: '请求超时!' });
    return Promise.resolve(err);
  }
);
Vue.axios.interceptors.response.use(
  data => {
    if (data.status && data.status == 200 && data.data.status == 'error') {
      Message.error({ message: data.data.msg });
      return;
    }
    return data;
  },
  err => {
    if (err.response.status == 504 || err.response.status == 404) {
      // window.location.href= local + "/gic-web/#/"
      // Message.error({message: '服务异常⊙﹏⊙∥'});
    } else if (err.response.status == 403) {
      // window.location.href= local + "/gic-web/#/"
      // Message.error({message: '权限不足,请联系管理员!'});
    } else {
      // window.location.href= local + "/gic-web/#/"
      // Message.error({message: '未知错误!'});
    }
    return Promise.resolve(err);
  }
);

// var localhost = window.location.protocol +'//'+ window.location.host
// log(localhost)

// let base = local + '/gicweb/cloudweb/';
// const timeout = 15000;
// eslint-disable-next-line
let token = ''; //sessionStorage.getItem('user');

/*
 *
 * 统一 get 请求方法
 * @url: 请求的 url
 * @params: 请求带的参数
 * @header: 带 token
 *
 */

export const getRequest = (url, params) => {
  params.requestProject = 'gic-clique';
  return Vue.axios({
    method: 'get',
    url: `${local}${url}`,
    data: {},
    params: params,
    headers: { 'content-type': 'application/x-www-form-urlencoded' } // "token": token
  });
};

/*
 *
 * 统一 post 请求方法
 * url: 请求的 url
 * @params: 请求带的参数
 * @header: 带 token
 *
 */

export const postRequest = (url, params) => {
  params.requestProject = 'gic-clique';
  return Vue.axios({
    method: 'post',
    url: `${local}${url}`,
    data: qs.stringify(params),
    // params: params,
    // paramsSerializer: function(params) {
    //   return QS.stringify(params, {arrayFormat: 'brackets'})
    // },
    // transformRequest: [function (data) {
    //   // Do whatever you want to transform the data
    //   log(data)
    //   data = JSON.stringify(data)
    //   return data;
    // }],
    // transformRequest: [
    //   function (data) { // 解决传递数组变成对象的问题
    //     Object.keys(data).forEach((key) => {
    //       if ((typeof data[key]) === 'object') {
    //         data[key] = JSON.stringify(data[key]) // 这里必须使用内置JSON对象转换
    //       }
    //     })
    //     data = qs.stringify(data) // 这里必须使用qs库进行转换
    //     return data
    //   }
    // ],
    headers: { 'content-type': 'application/x-www-form-urlencoded' } //multipart/form-data{"token": token}
  });
};

export const postJsonRequest = (url, params) => {
  params.requestProject = 'gic-clique';
  return Vue.axios({
    method: 'post',
    url: `${local}${url}`,
    data: '{}',
    params: params,
    // paramsSerializer: function(params) {
    //   return QS.stringify(params, {arrayFormat: 'brackets'})
    // },
    // transformRequest: [function (data) {
    //   // Do whatever you want to transform the data
    //   log(data)
    //   data = JSON.stringify(data)
    //   return data;
    // }],
    // transformRequest: [
    //   function (data) { // 解决传递数组变成对象的问题
    //     Object.keys(data).forEach((key) => {
    //       if ((typeof data[key]) === 'object') {
    //         data[key] = JSON.stringify(data[key]) // 这里必须使用内置JSON对象转换
    //       }
    //     })
    //     data = qs.stringify(data) // 这里必须使用qs库进行转换
    //     return data
    //   }
    // ],
    // withCredentials: true,
    // credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' } //multipart/form-data{"token": token}
  });
};

/*
 * method: 'post'
 * 'Content-Type': 'application/json;charset=UTF-8'
 * @data: params
 * @requestProject: 'gic-clique'
 *
 */

export const postJson = (url, params) => {
  // params.requestProject = "gic-clique";
  return Vue.axios({
    method: 'post',
    url: `${local}${url}`,
    data: params,
    params: { requestProject: 'gic-clique' },
    // withCredentials: true,
    // credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' } //multipart/form-data{"token": token}
  });
};

/*
 * method: 'post'
 *  data: params
 *
 */
export const postForm = (url, params) => {
  params.requestProject = 'gic-clique';
  return Vue.axios({
    method: 'post',
    url: `${local}${url}`,
    data: params,
    // params: params,
    // paramsSerializer: function(params) {
    //   return QS.stringify(params, {arrayFormat: 'brackets'})
    // },
    // transformRequest: [function (data) {
    //   // Do whatever you want to transform the data
    //   log(data)
    //   data = JSON.stringify(data)
    //   return data;
    // }],
    // transformRequest: [
    //   function (data) { // 解决传递数组变成对象的问题
    //     Object.keys(data).forEach((key) => {
    //       if ((typeof data[key]) === 'object') {
    //         data[key] = JSON.stringify(data[key]) // 这里必须使用内置JSON对象转换
    //       }
    //     })
    //     data = qs.stringify(data) // 这里必须使用qs库进行转换
    //     return data
    //   }
    // ],
    headers: {} //'content-type': 'application/x-www-form-urlencoded'multipart/form-data{"token": token}
  });
};
