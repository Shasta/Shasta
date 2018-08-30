import React from 'react';

import axios from 'axios';

import Router from "./routing.js";
import CreateUser from "./components/CreateUser/CreateUser.js";
import getWeb3 from './getWeb3.js'
import { default as contract } from 'truffle-contract'
import user_artifacts from '../build/contracts/User.json'
var userContract = contract(user_artifacts);
const ipfsAPI = require('ipfs-api');
const ipfs = ipfsAPI('ipfs.infura.io', '5001', { protocol: 'https' });

class App extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      web3: null,
      ipfs: null,
      address: '',
      balance: '',
      username: '',
      ipfsHash: '',
      status: 'Not Connected!'
    }
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.
    getWeb3
      .then(results => {
        this.setState({
          web3: results.web3
        })

        // set the provider for the User abstraction
        userContract.setProvider(results.web3.currentProvider);

        // Instantiate contract
        this.instantiateContract();

      })
      .catch(() => {
        console.log('Error finding web3.')
      })
  }

  instantiateContract() {
    // Get accounts and start IPFS
    this.state.web3.eth.getAccounts((error, accounts) => {

      //init ipfs client
      ipfs.id(function (err, res) {
        if (err) throw err
        console.log('Connected to IPFS node!', res.id, res.agentVersion, res.protocolVersion);
       
      });
      this.setState({
        ipfs: ipfs
      })

      this.state.web3.eth.getBalance(accounts[0], (error, balance) => {
        this.setState({
          address: accounts[0],
          balance: this.state.web3.fromWei(balance.toString(), 'ether'),
          status: 'Connected!'
        })
        //Authenticate the address from metamask
        this.checkAuthentication(accounts[0], this);
      })
      // set the provider for the User abstraction 
      userContract.setProvider(this.state.web3.currentProvider);

    })
  }

  checkAuthentication(account, context) {
    //Check if address has user
    console.log("Validating with: ", account);
    userContract.deployed().then(function (contractInstance) {
      contractInstance.getIpfsHashByAddress.call(account, { from: account }).then(function (result) {

        console.log("Stored ipfs hash: ", context.hex2a(result));

        if (context.hex2a(result)) {

          var ipfsHash = context.hex2a(result);

          var url = 'https://ipfs.io/ipfs/' + ipfsHash;
          console.log('getting user info from ', url);

          //Get request
          axios.get(url)
            .then(res => {

              console.log("ipfs response: ", res);

              context.setState({
                username: res.data.username,
                ipfsHash: ipfsHash
              })
            })
        }
      }).catch(function (e) {
        console.log(e);
      });

    });
  }

  hex2a(hexx) {
    var hex = hexx.toString();//force conversion
    var str = '';
    for (var i = 2; (i < hex.length && hex.substr(i, 2) !== '00'); i += 2)
      str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
  }

  render() {
    const {
      web3,
      address,
      status,
      balance,
      username,
      ipfs
    } = this.state
    console.log("username: ", this.state.username);
    console.log("address: ", this.state.address);

    if (this.state.username) {
      return (
        <div>
          <Router
            web3={web3}
            address={address}
            balance={balance}
            username={username}
            ipfs={this.state.ipfs}
            contract = {userContract}
          >
          </Router>
        </div>
      );
    } else {
      return (
        <div><CreateUser web3={web3} userContract={userContract} account={address} status={status} balance={balance} ipfs={ipfs}></CreateUser></div>
      );
    }
  }
}

export default App;
