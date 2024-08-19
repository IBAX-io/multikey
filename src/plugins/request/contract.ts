// Configuration of Axios
import axios from 'axios';
import util from '../util';

const errorHandle = (status: number, other: any) => {
  console.log(status);
  console.log(other);
  if (status !== 200) {
    // window.location.href = '/login';
    //  util.removeCacheToken('token');
  }
};
// Add request interceptor
const service = axios.create({
  timeout: 60000
});
service.interceptors.request.use(
  (config: any) => {
    const currNetwork = util.currNetwork();
    config.baseURL = `${currNetwork.rpc}/api/v2`;
    config.headers['Content-Type'] = 'application/json; charset=utf-8';
    const token = util.getCacheToken('token')!;
    config.headers.Authorization = `Bearer ${token}`;
    if (config.method === 'post') {
      if (config.paramsData) {
        const params = config.paramsData;
        let payload = '';
        const boundaryKey = `----WebKitFormBoundary${Math.random().toString().replace('.', '')}`;
        // console.log(JSON.stringify(params));
        for (const key in params) {
          console.log(key);
          console.log(params[key]);
          payload += `\r\n--${boundaryKey}\r\n`;
          payload += `Content-Disposition:form-data; name="${key}"\r\n\r\n`;
          payload += `${params[key]}`;
        }
        payload += `\r\n--${boundaryKey}--\r\n`;
        const contentType = `multipart/form-data; boundary=${boundaryKey}`;
        config.headers['Content-Type'] = contentType;
        config.data = payload;
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
    const { code } = response.data;
    console.log(code);
    if (code === 401 || code === -402) {
      window.location.href = '/login';
      util.removeCacheToken('token');
    }
    return response.status === 200 ? Promise.resolve(response.data) : Promise.reject(response);
  },
  (error) => {
    const { response } = error;
    // return Promise.resolve(response.data);
    if (response) {
      errorHandle(response.status, response.data.message);
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
  },
  put(params?: any) {
    const config: any = {
      method: 'post'
    };
    if (params) config.data = params;
    return service(config);
  }
};
// export
export default http;
