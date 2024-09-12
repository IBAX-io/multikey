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
    config.baseURL = `${currNetwork.rpc}`;
    config.headers['Content-Type'] = 'application/json; charset=utf-8';
    config.cache = 'no-cache';
    //config.headers['Cache-Control'] = 'max-age=3600';
    const token = util.getCacheToken('token');
    if (token) {
      const bearer = token ? `Bearer ${token}` : '';
      config.headers.Authorization = bearer;
    }
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
    return response.status === 200 ? Promise.resolve(response.data) : Promise.reject(response);
  },
  (error) => {
    console.log('🚀 ~ file: http.ts:34 ~ error:', error);
    console.log(error.code === 'ERR_NETWORK');
    if (error.response) {
      const status = error.response.status;
      if (status === 401 || status === 403) {
        window.location.href = '/login';
        util.removeCacheToken('token');
      } else if (status === 500) {
        console.error('Internal server error, please try again later...');
      } else {
        console.error(`Error: ${status}, ${error.response.data.message}`);
      }
    } else if (error.code === 'ERR_NETWORK') {
      //  window.location.href = '/error';
      //  util.removeCacheToken('token');
    }
    return Promise.reject(error);
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
  get(params?: any) {
    params = {
      ...params
    };
    const config = {
      method: 'get',
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
  post(params?: any) {
    const config: any = {
      method: 'post'
    };
    if (params) config.data = params;
    return service(config);
  }
};
// export
export default http;
