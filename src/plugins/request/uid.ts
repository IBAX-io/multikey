// Configuration of Axios
import axios from 'axios';
import local from '@/network/local';
import { env } from '@/dataType';

// Add request interceptor
const service = axios.create({
  timeout: 60000
});
service.interceptors.request.use(
  (config: any) => {
    const currNetwork = local[import.meta.env.MODE as env];
    config.baseURL = `${currNetwork.rpc}/api/v2`;
    config.headers['Content-Type'] = 'application/json; charset=utf-8';
    config.headers.Authorization = '';
    if (config.method === 'post') {
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8;';
      if (config.paramsData) {
        const { data, token } = config.paramsData;
        const bearer = token ? `Bearer ${token}` : '';
        config.headers.Authorization = bearer;
        config.data = data;
      }
    }
    return config;
  },
  (error) => {
    //  Response error handling
    console.log(error);
    return Promise.reject(error);
  }
);
service.interceptors.response.use(
  (response) => {
    return response.status === 200 ? Promise.resolve(response.data) : Promise.reject(response);
  },
  (error) => {
    const { response } = error;
    // return Promise.resolve(response.data);
    if (response) {
      // errorHandle(response.status, response.data.message);
      return Promise.reject(response.data);
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
      _t: Date.parse(String(new Date())) / 1000,
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
  post(url: string, params?: any) {
    const config: any = {
      method: 'post',
      url,
      paramsData: params
    };
    return service(config);
  }
};
// export
export default http;
