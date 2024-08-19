import { env, TokenType } from '@/dataType';
import local from '@/network/local';
import BigNumber from 'bignumber.js';
import copy from 'copy-to-clipboard';
import CryptoJS from 'crypto-js';
import md5 from 'crypto-js/md5';
import { v4 } from 'uuid';

const num = 8;
const time = num * 60 * 60;
export default {
  uuid() {
    return v4();
  },
  loadingInstance: '' as any,
  setCacheToken(key: string, token: string, expire = time) {
    const obj: TokenType = {
      token,
      time: Date.now() / 1000,
      expire
    };
    localStorage.setItem(key, JSON.stringify(obj));
  },
  getCacheToken(key: string) {
    const val = localStorage.getItem(key);
    if (!val) {
      return null;
    }
    const obj = JSON.parse(val!) as TokenType;
    if (obj.expire && Date.now() / 1000 - obj.time > obj.expire) {
      localStorage.removeItem(key);
      return null;
    }
    return obj.token;
  },
  removeCacheToken(key: string) {
    localStorage.removeItem(key);
  },
  setCache(name: string, data: any) {
    const md5Name = md5(name).toString();
    const type = typeof data;
    const info = { type, data };
    const string = encodeURIComponent(JSON.stringify(info));
    localStorage.setItem(md5Name, this.encryptAES(string, md5Name));
  },
  getCache(name: string) {
    // console.log(name);
    const md5Name = md5(name).toString();
    const strCache = localStorage.getItem(md5Name);
    if (strCache) {
      const strData = this.decryptAES(strCache, md5Name);
      try {
        const data = JSON.parse(decodeURIComponent(strData));
        // console.log(data);
        return data ? data.data : null;
      } catch (e) {
        console.log(e);
      }
    }
  },
  removeCache(name: string) {
    const md5Name = md5(name).toString();
    localStorage.removeItem(md5Name);
  },
  removeAll() {
    localStorage.clear();
  },
  copyToClipboard(textToCopy: string) {
    copy(textToCopy, {
      debug: true,
      message: 'Press #{key} to copy'
    });
  },
  currNetwork() {
    return local[import.meta.env.MODE as env];
  },
  logoHash(logoHash: string) {
    const currNetwork = this.currNetwork();
    console.log(`${currNetwork.api}/api/v1/binaries/${logoHash}`);
    if (currNetwork) {
      return `${currNetwork.api}/api/v1/binaries/${logoHash}`;
    } else {
      return null;
    }
  },
  cutZero(str: string) {
    let newstr = str.toString();
    //  console.log(num.indexOf('.') - 1);
    const leng = newstr.length - newstr.indexOf('.') - 1;
    if (newstr.indexOf('.') > -1) {
      for (let i = leng; i > 0; i -= 1) {
        if (newstr.lastIndexOf('0') > -1 && newstr.substring(newstr.length - 1) === String(0)) {
          const k = newstr.lastIndexOf('0');

          if (newstr.charAt(k - 1) === '.') {
            return newstr.substring(0, k - 1);
          }
          newstr = newstr.substring(0, k);
        } else {
          return newstr;
        }
      }
    }
    return str;
  },
  validateAddress(value: string) {
    if (value) {
      const regAddress = /^\d{4}-\d{4}-\d{4}-\d{4}-\d{4}$/;
      console.log(regAddress.test(value));
      return regAddress.test(value);
    }
  },
  encryptAES: (data: any, password: string) => {
    const key = CryptoJS.enc.Utf8.parse(password);
    const srcs = CryptoJS.enc.Utf8.parse(data);
    const encrypted = CryptoJS.AES.encrypt(srcs, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
  },
  decryptAES: (data: any, password: string) => {
    const key = CryptoJS.enc.Utf8.parse(password);
    const decrypt = CryptoJS.AES.decrypt(data, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    return decryptedStr.toString();
  },
  format(num: string | number) {
    const arr = String(num).split('.') || 0;
    const str = (arr[0] || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') + (arr[1] ? `.${arr[1]}` : '');
    return this.cutZero(str);
  },
  toFormat(num: string | number = '0') {
    const str = new BigNumber(num);
    return str.toFormat();
  },
  formatFixed(money: string | number = '0', digits = 12) {
    try {
      let balance = String(money) || '0';
      if (balance !== '0') {
        const BN = BigNumber.clone({ DECIMAL_PLACES: Math.abs(digits) });
        balance = BN(balance).shiftedBy(-digits).decimalPlaces(digits).toFormat();
        return balance;
      }
      return '0';
    } catch (e) {
      return '0';
      // console.log(e);
    }
  },
  formatUnits(money: string | number = '0', digits = 12) {
    console.log('🚀 ~ file: util.ts:139 ~ formatUnits ~ money:', money);
    try {
      let balance = String(money) || '0';
      if (balance !== '0') {
        const BN = BigNumber.clone({ DECIMAL_PLACES: Math.abs(digits) });
        balance = BN(balance).shiftedBy(-digits).decimalPlaces(digits).toString(10);
        return balance;
        // return this.cutZero(balance);
      }
      return '0';
    } catch (e) {
      // console.log(e);
      return '0';
    }
  },
  parseUnits(money: string | number = '0', digits = 12) {
    try {
      let balance = String(money) || '0';
      if (balance !== '0') {
        const BN = BigNumber.clone({ DECIMAL_PLACES: Math.abs(digits) });
        balance = BN(balance).shiftedBy(digits).decimalPlaces(digits).toString(10);
        return balance;
      }
      return '0';
    } catch (e) {
      // console.log(e);
      return '0';
    }
  },
  fromPuls(value: string | number, value1: string | number) {
    console.log('🚀 ~ file: util.ts:181 ~ fromPuls ~ value:', value);
    console.log('🚀 ~ file: util.ts:181 ~ fromPuls ~ value1:', value1);
    value = String(value) || '0';
    value1 = String(value1) || '0';
    return BigNumber(value).plus(value1).toString();
  },
  times(num: string | number, times: string | number) {
    return new BigNumber(num).times(times).toString();
  },
  formatDecimalPlaces(value: string | number = '0', digits: number) {
    try {
      const balance = String(value);
      const reg = new RegExp(`^\\d*(\\.?\\d{0,${digits}})`, 'g');
      const val = balance
        .replace(/[^\d^\\.?]+/g, '')
        .replace(/^0+(\d)/, '$1')
        .replace(/^\./, '0.');
      const arrMatch = val.match(reg);
      if (arrMatch?.length) {
        const value = arrMatch[0] || '';
        console.log('🚀 ~ file: util.ts:193 ~ formatDecimalPlaces ~ value:', value);
        return value;
      }
      if (balance === 'NaN') {
        return '';
      }
      return balance;
    } catch (e) {
      // console.log(e);
      return '0';
    }
  },
  comparedTo(value1: string | number, value2: string | number) {
    const first = new BigNumber(value1);
    const second = new BigNumber(value2);
    const value = first.comparedTo(second);
    // console.log('🚀 ~ file: util.ts:197 ~ comparedTo ~ value:', value);
    const boo = value === 1 ? true : value === 0 ? true : false;
    console.log('🚀 ~ file: util.ts:202 ~ comparedTo ~ boo:', boo);
    return boo;
  },
  greaterThanZero(value1: string | number, value2: string | number) {
    const first = new BigNumber(value1);
    const second = new BigNumber(value2);
    const value = first.comparedTo(second);
    //  console.log('🚀 ~ file: util.ts:197 ~ comparedTo ~ value:', value);
    const boo = value === 1 ? true : false;
    console.log('🚀 ~ file: util.ts:202 ~ comparedTo ~ boo:', boo);
    return boo;
  },
  getByteLength(str: string) {
    const encoder = new TextEncoder();
    const encoded = encoder.encode(str);
    return encoded.length;
  },
  handleReduce(arr: any, key: string = 'id') {
    const obj: { [key: string]: boolean } = {};
    const arrResult = arr.reduce((item: any[], next: { [x: string]: string | number }) => {
      if (!obj[next[key]]) {
        item.push(next);
        obj[next[key]] = true;
      }
      return item;
    }, []);
    return arrResult;
  },
  eventType: (num: number) => {
    let eventName = '';
    switch (num) {
      case 1:
        eventName = 'type.package';
        break;
      case 2:
        eventName = 'type.taxation';
        break;
      case 3:
        eventName = 'type.trade';
        break;
      case 4:
        eventName = 'type.create';
        break;
      case 5:
        eventName = 'type.iname';
        break;
      case 6:
        eventName = 'type.issue';
        break;
      case 7:
        eventName = 'type.coin';
        break;
      case 8:
        eventName = 'type.private';
        break;
      case 9:
        eventName = 'type.foundation';
        break;
      case 10:
        eventName = 'type.team';
        break;
      case 11:
        eventName = 'type.partner';
        break;
      case 12:
        eventName = 'type.nft';
        break;
      case 13:
        eventName = 'type.mining';
        break;
      case 14:
        eventName = 'type.pledge';
        break;
      case 15:
        eventName = 'type.exchange';
        break;
      case 16:
        eventName = 'type.burning';
        break;
      case 17:
        eventName = 'type.detele';
        break;
      case 18:
        eventName = 'type.paid';
        break;
      case 19:
        eventName = 'type.nodes';
        break;
      case 20:
        eventName = 'type.voting';
        break;
      case 21:
        eventName = 'type.deposit';
        break;
      case 22:
        eventName = 'type.withdrawal';
        break;
      case 23:
        eventName = 'type.textcoin';
        break;
      case 25:
        eventName = 'type.privateye';
        break;
      case 26:
        eventName = 'type.offering';
        break;
      case 27:
        eventName = 'type.num';
        break;
      case 28:
        eventName = 'type.child';
        break;
      case 29:
        eventName = 'type.issuance';
        break;
      case 30:
        eventName = 'type.twonum';
        break;
      case 31:
        eventName = 'type.remove';
        break;
      case 32:
        eventName = 'type.airsend';
        break;
      case 33:
        eventName = 'type.aristack';
        break;
      case 34:
        eventName = 'type.getair';
        break;
      case 35:
        eventName = 'type.getstack';
        break;
      case 36:
        eventName = 'type.locking';
        break;
      case 37:
        eventName = 'type.createiname';
        break;
      case 38:
        eventName = 'type.cross';
        break;
      case 39:
        eventName = 'type.crosslock';
        break;
      case 41:
        eventName = 'type.destruction';
        break;
      default:
        eventName = 'unknown';
        break;
    }
    return eventName;
  }
};
