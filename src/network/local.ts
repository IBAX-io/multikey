const network = {
  production: {
    id: 1,
    name: 'IBAX-mainnet-hk1',
    rpc: 'https://mainnet-hk1.ibax.network:7079',
    networkId: 7,
    api: 'https://scan.ibax.network:8800',
    blockexplorer: 'https://scan.ibax.network',
    walletId: 'hkaocejmbpidmlollaolcogbookibddl'
  },
  testnet: {
    id: 10,
    name: 'IBAX-testnet-hk1',
    rpc: 'https://testnet-hk1.ibax.network:5079',
    networkId: 5,
    api: 'https://testscan.ibax.network:8800',
    blockexplorer: 'https://testscan.ibax.network',
    walletId: 'gcnfhkdkohkhnglefdjlobhnjfbgbech'
  },
  test: {
    id: 11,
    name: 'Test-1001',
    rpc: 'https://node1.ibax.io:3079',
    networkId: 1001,
    api: 'https://node3.ibax.io:8800',
    blockexplorer: 'https://node3.ibax.io:8810',
    walletId: 'gcnfhkdkohkhnglefdjlobhnjfbgbech'
  },
  development: {
    id: 12,
    name: 'Test-1001',
    rpc: 'https://node1.ibax.io:3079',
    networkId: 1001,
    api: 'https://node3.ibax.io:8800',
    blockexplorer: 'https://node3.ibax.io:8810',
    walletId: 'hkaocejmbpidmlollaolcogbookibddl'
  }
  /* development: {
    id: 12,
    name: 'Local-99',
    rpc: 'http://192.168.1.196:7079',
    networkId: 99,
    api: 'http://192.168.1.196:8800',
    blockexplorer: 'https://testscan.ibax.network',
    ecoId: 31
  } */
};

export default network;
