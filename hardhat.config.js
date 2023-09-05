require('@matterlabs/hardhat-zksync-deploy')
require('@matterlabs/hardhat-zksync-solc')

require('@matterlabs/hardhat-zksync-verify')

//require('@nomicfoundation/hardhat-toolbox')
require('hardhat-deploy')
require('dotenv').config()

const privateKey = process.env.PRIVATE_KEY

if (!privateKey) {
  throw new Error('PRIVATE_KEY not set')
}

module.exports = {
  zksolc: {
    version: '1.3.13',
    compilerSource: 'binary',
    settings: {},
  },
  defaultNetwork: 'zksync',
  networks: {
    zksync: {
      url: "https://testnet.era.zksync.dev",
      ethNetwork: 'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
      zksync: true,
      verifyURL: 'https://zksync2-testnet-explorer.zksync.dev/contract_verification',
      accounts: [privateKey]
    },
    goerli: {
      url: 'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
      zksync: false,
      accounts: [privateKey]
    },
  },
  solidity: {
    version: '0.8.17',
  },
  etherscan: {
    apiKey:'2524J3M7YSB7H78CQN1D5VP6CP67KPQJ2J'
  }
};
