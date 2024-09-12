import { ISchema } from '@/plugins/lib/field/schema';
import { Int64BE } from 'int64-buffer';
export type env = 'test' | 'testnet' | 'production' | 'development';

export interface IswapData<T> {
  code: number;
  data: T;
  message: string;
}
export interface responseData<T> {
  id: number;
  jsonrpc: string;
  result: T;
}
export type InfoType = {
  path: number[];
  account?: string;
};
export type EcosystemType = {
  id: number;
  tokenSymbol: string;
  digits?: number;
  reserve?: string;
  logoHash: string;
  amount?: string;
  chainName: string;
  tokenAddress?: string;
  logoURI?: string;
  price?: string;
};

export interface AccountItem {
  account?: string;
  id: string;
  selectId: string;
  keyId?: string;
  index?: number;
  mnemonic?: string;
  name: string;
  networkId?: number;
  password: string;
  privateKey: string;
  publicKey: string;
  isShow: boolean;
  isLogin: boolean;
}
export type AccountList = AccountItem[];
export type UidData = {
  uid: string;
  token: string;
  network_id: string;
  cryptoer: string;
  hasher: string;
};
export type TokenType = {
  token: string;
  time: number;
  expire?: number;
};
export type LoginParams = {
  data: {
    signature: string;
    pubkey: string;
    ecosystem: number;
  };
  token: string;
};
export type LoginData = {
  token: string;
  ecosystem_id: string;
  key_id: string;
  account: string;
  notify_key: string;
  isnode: boolean;
  isowner: boolean;
  clb: boolean;
  timestamp: boolean;
};
export type MetaType = {
  title: string;
  index?: boolean;
  element?: React.ReactNode;
  path?: string;
  lazy?: () => void;
  meta: {
    key: string;
  };
  children?: MetaType[];
};
export type RouterType = {
  [index: number]: MetaType;
};
export interface ReactNodeChildren {
  children?: React.ReactNode;
}
export interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
export type LoginType = {
  name: string;
  password: string;
};
export type AccountType = {
  id: number;
  name: string;
  index: number;
  networkId?: number;
  mnemonic?: string;
  password: string;
  privateKey: string;
  publicKey: string;
  account?: string;
  keyId?: string;
  isShow: boolean;
};
export interface JsonrpcParams {
  jsonrpc: string;
  method: string;
  id: number;
}
export interface TeamParams extends JsonrpcParams {
  params: [
    {
      name: string;
      where: string;
      order: {
        id: number;
      };
      offset: number;
      limit: number;
    }
  ];
}

export interface TeamItem {
  created_at: string;
  creator: string;
  id: number;
  owner_quantity: string;
  owners: string;
  team_name: string;
  threshold: string;
  wallet: string;
  isSelect?: boolean;
}

export interface TeamList {
  count: number;
  list: TeamItem[];
}
export type HelperType = {
  text: string;
  boo: boolean;
};
export interface txType {
  [name: string]: {
    type: string;
    value: object;
  };
}
export interface hashType {
  [name: string]: string;
}
export interface IContractParam {
  type: string;
  value: object;
}
export interface IContractContext {
  id: number;
  schema: ISchema;
  ecosystem: number;
  networkId: number;
  Expedite?: string;
  digits?: number;
  fields: {
    [name: string]: IContractParam;
  };
}
export interface UTXOContext {
  Amount: string;
  toAddress?: string;
  Comment?: string;
  ecosystem: number;
  networkId?: number;
  type?: string;
  digits?: number;
  Expedite?: string;
}
export interface UTXOParams {
  Amount: string;
  toAddress?: string;
  Comment?: string;
  ecosystem: number;
  type?: string;
  networkId?: number;
  Expedite?: string;
  digits?: number;
}
export interface transferParams {
  amount: string;
  ecosystem: number;
  type: string;
}
export type THashInput =
  | Int8Array
  | Int16Array
  | Int32Array
  | Uint8Array
  | Uint16Array
  | Uint32Array
  | Uint8ClampedArray
  | Float32Array
  | Float64Array
  | DataView
  | ArrayBuffer
  | Float64Array
  | null;
export interface headerType {
  Header: {
    ID: number;
    Time: number;
    EcosystemID: number;
    KeyID: Int64BE;
    NetworkID: number;
    PublicKey: ArrayBuffer;
  };
  UTXO?: {
    Value: string;
    ToID: Int64BE;
    Expedite?: string;
    Comment?: string;
  };
  TransferSelf?: {
    Value: string;
    Source: string;
    Target: string;
  };
  Lang: string;
  Expedite?: string;
}
export interface paramsType {
  Header: {
    ID: number;
    Time: number;
    EcosystemID: number;
    KeyID: number;
    NetworkID: number;
    PublicKey: ArrayBuffer;
  };
  Params: any;
  Expedite?: string;
  Lang: string;
}
export interface EcoParams extends JsonrpcParams {
  params: string[];
}
export interface notificationsItem {
  role_id: string;
  count: number;
}
export interface EcoItem {
  ecosystem: string;
  name: string;
  digits: number;
  notifications: notificationsItem[];
}
export interface EcoList {
  result: string;
  key_id: string;
  ecosystems: EcoItem[];
}
export interface BalanceParams1 extends JsonrpcParams {
  params: (string | number)[];
}
export type BalanceParams = BalanceParams1[];
export interface BalanceType {
  amount: string;
  digits: number;
  total: string;
  utxo: string;
  token_symbol: string;
  assets?: string;
  token_name: string;
}

export interface BalanceItem {
  assets: string;
  jsonrpc: string;
  id: number;
  result: BalanceType;
}
export type BalanceList = BalanceItem[];
export interface BalParams {
  name: string;
  where: string;
  columns: string;
}
export interface BinaryParams extends JsonrpcParams {
  params: BalParams[];
}
export interface BinaryItem {
  hash: string;
  id: string;
}

export interface BinaryList {
  count: number;
  list: BinaryItem[];
}
export type EcoInfoItem = {
  ecosystem: number;
  name: string;
  digits: number;
  amount: string;
  total: string;
  utxo: string;
  tokenSymbol: string;
  logo: string;
  hash?: string;
  keyId?: string;
};
export type EcoInfoList = EcoInfoItem[];
export type EcoType = {
  id: number;
  tokenSymbol: string;
  digits?: number;
  amount?: string;
  logoURI?: string;
  price?: string;
  assets?: string;
};
export type EcoTypeList = EcoType[];
export interface RecordItem {
  amount: string;
  block_id: string;
  comment: string;
  created_at: string;
  ecosystem: string;
  id: string;
  recipient_balance: string;
  recipient_id: string;
  sender_balance: string;
  sender_id: string;
  status: string;
  txhash: string;
  type: string;
  value_detail: string;
}
export interface RecordList {
  count: number;
  list: RecordItem[];
}
export interface RecordParams extends JsonrpcParams {
  params: [
    {
      name: string;
      where: string;
      order: {
        id: number;
      };
      offset: number;
      limit: number;
    }
  ];
}
export interface CouParams {
  name: '@1multi_sign_proposals';
  where: string;
  limit: number;
  columns: 'id';
}
export interface CountParams extends JsonrpcParams {
  params: CouParams[];
}
export interface CountItem {
  id: string;
}
export interface CountList {
  count: number;
  list: CountItem[];
}
export interface MessParams {
  name: '@1multi_sign_proposals';
  where: string;
  offset: number;
  limit: number;
  order?: { id: number };
}
export interface MessageParams extends JsonrpcParams {
  params: MessParams[];
}
export interface MessageItem {
  amount: string;
  created_at: string;
  creator: string;
  ecosystem: string;
  id: string;
  proposal: string;
  status: string;
  to: string;
  updated_at: string;
  wallet: string;
}
export interface MessageList {
  count: number;
  list: MessageItem[];
}
export interface AffParams {
  name: '@1multi_sign_confirmations';
  where: string;
  order: { id: number };
  offset: number;
}
export interface AffirmParams extends JsonrpcParams {
  params: AffParams[];
}
export interface EcoInfo {
  name: string;
  where: string;
}
export interface EcoInfoParams extends JsonrpcParams {
  params: EcoInfo[];
}
export interface DetailsItem {
  created_at: string;
  creator: string;
  id: string;
  proposal_id: string;
  status: 'approved' | 'rejected';
}
export interface DetailsList {
  count: number;
  list: DetailsItem[];
}
export interface EcomInfoItem {
  control_mode: string;
  digits: string;
  emission_amount: string;
  fee_mode_info: string;
  id: string;
  info: string;
  is_valued: string;
  name: string;
  token_name: string;
  token_symbol: string;
  type_emission: string;
  type_withdraw: string;
}
export interface EcomInfoList {
  count: number;
  list: EcomInfoItem[];
}
export interface EcoOpenParams extends JsonrpcParams {
  params: number[];
}
export interface EcomOpenItem {
  ecosystem: number;
  info: {
    id: number;
    name: string;
    digits: number;
    token_symbol: string;
    token_name: string;
    total_amount: string;
    is_withdraw: false;
    withdraw: string;
    is_emission: false;
    emission: string;
    introduction: string;
    logo: number;
    logoURL?: string;
    creator: string;
  };
}
export interface EcomOpenList {
  count: number;
  list: EcomOpenItem[];
}
export interface EcoOtherParams {
  ecosystems: string;
}
export interface EcoPriceItem {
  ecosystem: number;
  price_in_usd: string;
}

export type EcoPriceList = EcoPriceItem[];
export interface EcoLogoItem {
  ecosystem: number;
  logoURI: string;
}
export type EcoLogoList = EcoLogoItem[];
