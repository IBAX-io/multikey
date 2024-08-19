// Configuration of Axios
import util from '@/plugins/util';
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import axios from 'axios';
// Add request interceptor
const service = axios.create({
  timeout: 60000
});
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig | any) => {
    const currNetwork = util.currNetwork();
    config.baseURL = `${currNetwork.api}/api/v2`;
    config.headers['Content-Type'] = 'application/json; charset=utf-8';
    config.cache = 'no-cache';
    /*  const token = util.getCacheToken('token');
    if (token) {
      const bearer = token ? `Bearer ${token}` : '';
      config.headers.Authorization = bearer;
    } */
    return config;
  },
  (error) => {
    //  Response error handling
    return Promise.reject(error);
  }
);
// Add response interceptor
service.interceptors.response.use(
  (response: AxiosResponse) => {
    /*  const { code } = response.data;
    if (code === 401 || code === -402) {
      router.replace('/login');
      util.removeCookies('token');
    } */
    return response.status === 200 ? Promise.resolve(response.data) : Promise.reject(response);
  },
  (error) => {
    const response = error.response || {};
    if (response.status === 401 || response.status === 403) {
      // errorHandle(response.status, response.data.message);
      return Promise.reject(new Error(error.response));
    }
    console.log('The link has been broken');
  }
);
// console.log(service);
const http = {
  request: service,
  /**
   * methods: request
   * @param url request address
   * @param params request params
   */
  get(url: string, params?: any) {
    params = {
      ...params
    };
    const config = {
      method: 'get',
      url,
      params
    };
    if (params) {
      config.params = params;
    }
    return service(config);
  },
  fetch(url: string, params?: any) {
    params = {
      ...params
    };
    const config = {
      method: 'get',
      url,
      paramsData: params
    };
    return service(config);
  },
  post(url: string, params?: any) {
    const config: any = {
      url,
      method: 'post'
    };
    if (params) config.data = params;
    return service(config);
  }
};
// export
export default http;
