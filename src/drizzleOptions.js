const targetNetwork = process.env.TARGET_NETWORK;
let contracts = [];

if (targetNetwork == "rinkeby") {
  const User = require('shasta-os/build/contracts/User.json');
  const ShastaMarket = require('shasta-os/build/contracts/ShastaMarket.json');
  const ShaLedger = require('shasta-os/build/contracts/ShaLedger.json');
  const ContractRegistry = require('shasta-os/build/contracts/ContractRegistry.json');
  const BillSystem = require('shasta-os/build/contracts/BillSystem.json');
  const HardwareContract = require('shasta-os/build/contracts/HardwareData.json');

  contracts = [User, ShastaMarket, ShaLedger, ContractRegistry, BillSystem, HardwareContract];
} else if (targetNetwork == "private") {
  const User = require('../build/contracts/User.json');
  const ShastaMarket = require('../build/contracts/ShastaMarket.json');
  const ShaLedger = require('../build/contracts/ShaLedger.json');
  const ContractRegistry = require('../build/contracts/ContractRegistry.json');
  const BillSystem = require('../build/contracts/BillSystem.json');
  const HardwareContract = require('shasta-os/build/contracts/HardwareData.json');

  contracts = [User, ShastaMarket, ShaLedger, ContractRegistry, BillSystem, HardwareContract];
}

const options = {
  contracts,
  polls: {
    accounts: 4000
  },
  events: {
    User: [
      {
        eventName: 'UpdatedUser',
        eventOptions: {
          from: 0
        }
      },
    ], 
    ShastaMarket: [
      {
        eventName: 'newOffer',
        eventOptions: {
          from: 0
        }
      }
    ]
  },
  web3: {
    fallback: false
  }
};

export default options;