import SharedMapPrice from '../build/contracts/SharedMapPrice.json';
import User from '../build/contracts/User.json';
import ShastaMarket from '../build/contracts/ShastaMarket.json';
import ShaLedger from '../build/contracts/ShaLedger.json';
import ContractRegistry from '../build/contracts/ContractRegistry.json';
import BillSystem from '../build/contracts/BillSystem.json';

const options = {
  contracts: [
    SharedMapPrice,
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
  }
};

export default options;