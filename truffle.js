const homedir = require('homedir')
const path = require('path')

const HDWalletProvider = require('truffle-hdwallet-provider')

const DEFAULT_MNEMONIC = 'stumble story behind hurt patient ball whisper art swift tongue ice alien'

const defaultRPC = (network) =>
  `https://${network}.infura.io`

const configFilePath = (filename) =>
  path.join(homedir(), `.aragon/${filename}`)

const mnemonic = () => {
  try {
    return require(configFilePath('mnemonic.json').mnemonic)
  } catch (e) {
    return DEFAULT_MNEMONIC
  }
}

const settingsForNetwork = (network) => {
  try {
    return require(configFilePath(`${network}_key.json`))
  } catch (e) {
    return { }
  }
}

// Lazily loaded provider
const providerForNetwork = (network) => (
  () => {
    let { rpc, keys } = settingsForNetwork(network)

    rpc = rpc || defaultRPC(network)

    if (!keys || keys.length == 0) {
      return new HDWalletProvider(mnemonic(), rpc)
    }

    return new HDWalletProviderPrivkey(keys, rpc)
  }
)

const mochaGasSettings = {
  reporter: 'eth-gas-reporter',
  reporterOptions : {
    currency: 'USD',
    gasPrice: 3
  }
}

const mocha = process.env.GAS_REPORTER ? mochaGasSettings : {}

module.exports = {
  networks: {
    development: {
      host: "localhost",
      network_id: "5777",
      port: 8545,
      gas: 4000000
    },
    rinkeby: {
      network_id: 4,
      provider: providerForNetwork('rinkeby'),
      gas: 6.9e6,
      gasPrice: 15000000001
    },
    coverage: {
      host: "localhost",
      network_id: "*",
      port: 8555,
    }
  },
  compilers: {
    solc: {
      version: '0.4.24', // Version is managed in package.json as an NPM dependency.
    }
  },
  build: {},
  mocha,
}
