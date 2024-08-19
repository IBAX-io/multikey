import {
  responseData,
  UidData,
  LoginParams,
  LoginData,
  TeamList,
  TeamParams,
  EcoParams,
  EcoList,
  BalanceParams,
  BalanceList,
  BinaryParams,
  BinaryList,
  RecordList,
  RecordParams,
  IswapData,
  CountParams,
  CountList,
  MessageList,
  MessageParams,
  AffirmParams,
  DetailsList,
  EcoInfoParams,
  EcomInfoList,
  EcoOpenParams,
  EcomOpenList,
  EcoOtherParams,
  EcoPriceList,
  EcoLogoList
} from '@/dataType';
import uid from './uid';
import http from './http';
import iswap from './iswap';

export const handleGetuid = async () => {
  const res = (await uid.get('/getuid')) as unknown as UidData;
  if (res.token) {
    const data = res;
    return data;
  } else {
    return null;
  }
};
export const handlePostLogin = async (params: LoginParams) => {
  const res = (await uid.post('/login', params)) as unknown as LoginData;
  if (res.token) {
    const data = res;
    return data;
  } else {
    return null;
  }
};
export const handleTokenPrice = async (url: string, params: EcoOtherParams) => {
  try {
    const res = (await iswap.get(url, params)) as unknown as IswapData<EcoPriceList>;
    if (res.code === 0) {
      const data = res.data;
      return data;
    } else {
      return null;
    }
  } catch (error) {
    return '0';
  }
};
export const handleEcosystemLogo = async (url: string, params: EcoOtherParams) => {
  const res = (await iswap.get(url, params)) as unknown as IswapData<EcoLogoList>;
  if (res.code === 0) {
    const data = res.data;
    return data;
  } else {
    return null;
  }
};
export const handleTeamList = async (params: TeamParams) => {
  const res = (await http.post(params)) as unknown as responseData<TeamList>;
  if (res.result) {
    const data = res.result;
    return data;
  } else {
    return null;
  }
};
export const handleEcoList = async (params: EcoParams) => {
  const res = (await http.post(params)) as unknown as responseData<EcoList>;
  if (res.result) {
    const data = res.result;
    return data;
  } else {
    return null;
  }
};
export const handleEcoBalance = async (params: BalanceParams) => {
  const res = (await http.post(params)) as unknown as BalanceList;
  if (res.length) {
    const data = res;
    return data;
  } else {
    return null;
  }
};
export const handleBinaryHash = async (params: BinaryParams) => {
  const res = (await http.post(params)) as unknown as responseData<BinaryList>;
  if (res.result) {
    const data = res.result;
    return data;
  } else {
    return null;
  }
};
export const handleBatchRequests = async (params: any) => {
  const res = (await http.post(params)) as any;
  if (res.length) {
    const data = res;
    return data;
  } else {
    return null;
  }
};
export const handleRecordRequests = async (params: RecordParams) => {
  const res = (await http.post(params)) as unknown as responseData<RecordList>;
  if (res.result) {
    const data = res.result;
    return data;
  } else {
    return null;
  }
};
export const handleMessageCount = async (params: CountParams) => {
  const res = (await http.post(params)) as unknown as responseData<CountList>;
  if (res.result) {
    const data = res.result;
    return data;
  } else {
    return null;
  }
};
export const handleMessageList = async (params: MessageParams) => {
  const res = (await http.post(params)) as unknown as responseData<MessageList>;
  if (res.result) {
    const data = res.result;
    return data;
  } else {
    return null;
  }
};
export const handleMessageDetails = async (params: AffirmParams) => {
  const res = (await http.post(params)) as unknown as responseData<DetailsList>;
  if (res.result) {
    const data = res.result;
    return data;
  } else {
    return null;
  }
};
export const handleEcoInfo = async (params: EcoInfoParams) => {
  console.log('🚀 ~ file: api.ts:154 ~ handleEcoInfo ~ params:', params);
  const res = (await http.post(params)) as unknown as responseData<EcomInfoList>;
  if (res.result) {
    const data = res.result;
    return data;
  } else {
    return null;
  }
};
export const handleOpenEcosystem = async (params: EcoOpenParams) => {
  console.log('🚀 ~ file: api.ts:154 ~ handleEcoInfo ~ params:', params);
  const res = (await http.post(params)) as unknown as responseData<EcomOpenList>;
  if (res.result) {
    const data = res.result;
    return data;
  } else {
    return null;
  }
};
