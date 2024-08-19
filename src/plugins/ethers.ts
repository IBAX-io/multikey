import { utils, Wallet } from 'ethers';
import * as bip39 from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';

export default {
  generateMnemonic: (count: number = 128) => {
    const mnemonic = bip39.generateMnemonic(wordlist, count);
    return mnemonic;
  },
  verifyMnemonic(words: string) {
    return bip39.validateMnemonic(words, wordlist);
  },
  wallet: (words: string, num = 0) => {
    const seed = utils.mnemonicToSeed(words);
    const hd = utils.HDNode.fromSeed(seed);
    const standardEthereum = hd.derivePath(`m/44'/60'/0'/0/${num}`);
    const privateKey = standardEthereum.privateKey.replace('0x', '');
    const publicKey = standardEthereum.publicKey.replace('0x', '');
    return { privateKey, publicKey };
  },
  publicKey: (privateKey: string) => {
    try {
      const wallet = new Wallet(privateKey);
      const { publicKey } = wallet;
      return publicKey.replace('0x', '');
    } catch (error) {
      return false;
    }
  },
  isAddress(address: string) {
    return utils.isAddress(address);
  },
  parseUnits(num: string, decimals: string | number = 18) {
    return utils.parseUnits(num, decimals);
  },
  formatUnits(num: any, decimals: string | number = 18) {
    return utils.formatUnits(num, decimals);
  },
  async exportWallet(privateKey: string, pwd: string) {
    const wallet = new Wallet(privateKey);
    const { address } = wallet;
    const keyStore = await wallet.encrypt(pwd);
    return { keyStore, address };
  },
  async importWallet(json: any, pwd: string) {
    const wallet = await Wallet.fromEncryptedJson(json, pwd);
    const privateKey = wallet.privateKey.replace('0x', '');
    const { address } = wallet;
    return { address, privateKey };
  }
};
