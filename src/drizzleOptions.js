import { Drizzle, generateStore } from 'drizzle'

import SharedMapPrice from 'shasta-os/build/contracts/SharedMapPrice.json';
import User from 'shasta-os/build/contracts/User.json';
import ShastaMarket from 'shasta-os/build/contracts/ShastaMarket.json';
import ShaLedger from 'shasta-os/build/contracts/ShaLedger.json';
import ContractRegistry from 'shasta-os/build/contracts/ContractRegistry.json';
import BillSystem from 'shasta-os/build/contracts/BillSystem.json';

const options = {
  contracts: [
    SharedMapPrice,
    User,
    ShastaMarket,
    ShaLedger,
    ContractRegistry,
    BillSystem
  ]
};

const drizzleStore = generateStore(options);
const drizzle = new Drizzle(options, drizzleStore);

export default drizzle;