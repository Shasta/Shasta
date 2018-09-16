import { Drizzle, generateStore } from 'drizzle'

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
};

const drizzleStore = generateStore(options);
const drizzle = new Drizzle(options, drizzleStore);

export default drizzle;