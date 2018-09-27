import User from '../build/contracts/User.json';
import ShastaMarket from '../build/contracts/ShastaMarket.json';
import ShaLedger from '../build/contracts/ShaLedger.json';
import ContractRegistry from '../build/contracts/ContractRegistry.json';
import BillSystem from '../build/contracts/BillSystem.json';

const options = {
  contracts: [
    User,
    ShastaMarket,
    ShaLedger,
    ContractRegistry,
    BillSystem
  ],
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