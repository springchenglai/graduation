import axios from 'axios';
import { Toast } from 'vant';

// axios实例
const service = axios.create({
  timeout: '10000',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json;charset=utf-8' }
});

// 请求被发出去前加一个token请求头
service.interceptors.request.use(config => {
  config.baseURL = '/api';
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = { ...config.headers, token };
  }
  return config;
}, error => Promise.reject(error));

// 响应拦截器（在响应被 then 或 catch 处理前拦截它们）
service.interceptors.response.use(response => response, error => {
  console.log('响应错误');
  if (error.response && (error.response.status === 401 || error.response.status === 301)) {
    const currentLocation = window.location.href;
    window.location.href = `/login?redirect=${currentLocation}`;
  }
  return Promise.reject(error);
});
// 发请请求
const request = config => {
  config.params = Object.assign(config.params || {}, { _t: new Date().getTime() });
  return new Promise((resolve, reject) => {
    service(config).then(response => {
      if (response.status === 200) {
        resolve(response);
      } else {
        Toast({
          duration: 2000,
          message: response.data.error
        });
      }
    }).catch(error => reject(error));
  });
};

export default request;

