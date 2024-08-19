import http from '@/plugins/request/contract';
import util from '../util';
import defaultSchema from './defaultSchema';
import Contract from './contract';
import { txType, hashType } from '@/dataType';

let num = 9;
let timer: any = null;
export default {
  ecosystem: 1,
  async tokensSend(params: any, callback: any) {
    console.log(params.ecosystem);
    if (params.ecosystem) {
      this.ecosystem = params.ecosystem;
    }
    console.log(this.ecosystem);
    const res = await http.get(`/contract/${params.contractName}`);
    try {
      if (res) {
        this.generateBinary(res, params, callback);
      }
    } catch (error) {
      if (typeof callback === 'function') {
        callback(error, 'error');
      }
    }
  },
  async tokensSendOther(params: any, callback: any) {
    console.log(params.ecosystem);
    if (params.ecosystem) {
      this.ecosystem = params.ecosystem;
    }
    console.log(this.ecosystem);
    const res = await http.get(`/contract/${params.contractName}`);
    try {
      if (res) {
        this.generateBinaryOther(res, params, callback);
      }
    } catch (error) {
      if (typeof callback === 'function') {
        callback(error, 'error');
      }
    }
  },
  currentAccount() {
    const current = util.getCache('current');
    console.log(current);
    return current;
  },
  async generateBinaryOther(data: any, params: any, callback: any) {
    const { privateKey, networkId } = this.currentAccount();
    const txParams: txType = {};
    const objHash: hashType = {};
    console.log(JSON.stringify(data));
    const { Expedite, digits, ecosystem } = params;
    console.log(ecosystem);
    data.fields.forEach((field: any) => {
      (txParams as any)[field.name] = {
        type: field.type,
        value: params[field.name]
      };
    });
    const contract = new Contract({
      id: data.id,
      networkId,
      schema: defaultSchema,
      ecosystem: ecosystem || 1,
      fields: txParams,
      Expedite,
      digits
    });
    const hashData = contract.sign(privateKey);
    const contractData = {
      ...hashData,
      name: data.name,
      params: txParams
    };
    console.log(contractData.data);
    const string = Array.prototype.map
      .call(new Uint8Array(contractData.data), (x) => `00${x.toString(16)}`.slice(-2))
      .join('');
    // objHash[contractData.hash] = new Blob([contractData.data]);
    objHash[contractData.hash] = string;
    this.sendTx(objHash, callback);
  },
  async generateBinary(data: any, params: any, callback: any) {
    const { privateKey, networkId } = this.currentAccount();
    const txParams: txType = {};
    const objHash: hashType = {};
    console.log(JSON.stringify(data));
    const { Expedite, digits, ecosystem } = params;
    data.fields.forEach((field: any) => {
      (txParams as any)[field.name] = {
        type: field.type,
        value: params[field.name]
      };
    });
    console.log(JSON.stringify(params));
    // console.log(this.ecosystem);
    console.log(ecosystem);
    const contract = new Contract({
      id: data.id,
      networkId,
      schema: defaultSchema,
      ecosystem: ecosystem || 1,
      fields: txParams,
      Expedite,
      digits
    });
    const hashData = contract.sign(privateKey);
    const contractData = {
      ...hashData,
      name: data.name,
      params: txParams
    };
    console.log(contractData.data);
    const string = Array.prototype.map
      .call(new Uint8Array(contractData.data), (x) => `00${x.toString(16)}`.slice(-2))
      .join('');
    // objHash[contractData.hash] = new Blob([contractData.data]);
    objHash[contractData.hash] = string;
    this.sendTx(objHash, callback);
  },
  async sendTx(objHash: any, callback: any) {
    console.log(objHash);
    try {
      const res = await http.post(`/sendTx`, objHash);
      console.log(res);
      if (res) {
        this.txstatus(objHash, callback);
      }
    } catch (error) {
      if (typeof callback === 'function') {
        callback(error, 'error');
      }
    }
  },
  async txstatus(objHash: any, callback: any) {
    // const self = this;
    const arrKey = Object.keys(objHash);
    const hashes = {
      hashes: arrKey
    };
    const params = {
      data: JSON.stringify(hashes)
    };
    const res: any = await http.post(`/txstatus`, params);
    try {
      if (res) {
        const keyArr = Object.keys(res.results);
        const result = res.results[keyArr[0]] as any;
        const { results } = res;
        const boo = keyArr.some((key: string) => {
          return results[key].blockid === '';
        });
        if (num <= 0) {
          clearTimeout(timer);
          num = 9;
          return callback(0, 'loading');
        }
        if (result.errmsg) {
          clearTimeout(timer);
          num = 9;
          return callback(result, 'error');
        }
        if (boo) {
          timer = setTimeout(() => {
            this.txstatus(objHash, callback);
            num -= 1;
          }, 5000);
        } else {
          clearTimeout(timer);
          num = 9;
          console.log(result);
          if (result.blockid) {
            const [item] = keyArr;
            result.txHash = item;
          }
          return callback(result, 'success');
        }
      }
    } catch (error) {
      if (typeof callback === 'function') {
        callback(error, 'error');
      }
    }
  }
};
