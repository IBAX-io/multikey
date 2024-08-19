import msgpack from 'msgpack-lite';
import { Int64BE } from 'int64-buffer';
import keyring from '../keyring';
import IField from './field/field';
import { encodeLengthPlusData, concatBuffer, toArrayBuffer } from '../keyring/convert';
import { IContractContext, paramsType } from '@/dataType';
import util from '../util';
// const hasher = util.getCache('hasher');

class Contract {
  private _fields: {
    [name: string]: IField;
  } = {};

  private _context: IContractContext;

  private _expedite = '';

  private _time = 0;

  private _publicKey!: ArrayBuffer;

  private _keyID!: any;

  // private digits = 12;

  constructor(context: IContractContext) {
    console.log(context);
    this._context = context;
    console.log(context);
    this._expedite = context.Expedite || '';
    //  this.digits = context.digits!;
    this._time = Math.floor(new Date().getTime() / 1000);
    Object.keys(context.fields).forEach((name) => {
      console.log(name);
      const param = context.fields[name];
      console.log('🚀 ~ file: contract.ts:37 ~ Contract ~ Object.keys ~ param:', param);
      const Field = this._context.schema.fields[param.type];
      const field = new Field();
      console.log(field);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      field.set(param.value, context.digits);
      this._fields[name] = field;
    });
    console.log(this._fields);
  }
  public sign(privateKey: string) {
    console.log(privateKey);
    const hasher = util.getCache('hasher');
    const objKeyring = keyring.getKeyring(hasher);
    const publicKey = objKeyring.generatePublicKey(privateKey);
    this._publicKey = toArrayBuffer(publicKey) as any;
    this._keyID = new Int64BE(objKeyring.publicToID(publicKey));
    const data = this.serialize();
    const hexHash = objKeyring.hexHash(data);
    const sigHex = objKeyring.signContract(hexHash, privateKey);
    const signature = toArrayBuffer(sigHex) as any;
    console.log(this._context);
    const hashData = {
      hash: hexHash,
      data: concatBuffer(
        this._context.schema.header,
        concatBuffer(encodeLengthPlusData(data), encodeLengthPlusData(signature))
      )
    };
    console.log(hashData);
    return hashData;
  }

  private serialize() {
    const params: any = {};
    const lang = localStorage.getItem('lang');
    console.log(lang);
    let strLang = 'en';
    if (lang) {
      if (lang === 'zh-cn') {
        strLang = 'zh';
      }
    }
    const Expedite = this._expedite.toString() || '';
    const codec = msgpack.createCodec({
      binarraybuffer: true,
      preset: true
    });

    Object.keys(this._fields).forEach((name) => {
      params[name] = this._fields[name].get();
    });
    console.log(params);
    const objParams: paramsType = {
      Header: {
        ID: this._context.id,
        Time: this._time,
        EcosystemID: this._context.ecosystem || 1,
        KeyID: this._keyID,
        NetworkID: this._context.networkId || 1,
        PublicKey: this._publicKey
      },
      Params: params,
      Lang: strLang || 'en'
    };
    if (Expedite) {
      console.log('Input data', params);
      console.log('Expedite', Expedite);
      objParams.Expedite = Expedite;
    }
    const txBuffer = msgpack.encode(objParams, {
      codec
    });
    return txBuffer;
  }
}
export default Contract;
