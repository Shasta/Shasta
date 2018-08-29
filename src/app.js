import React, { Component } from 'react';

import Router from "./routing.js";
import CreateUser from "./components/CreateUser/index";
import getWeb3 from './getWeb3.js'
import { default as contract } from 'truffle-contract'
import user_artifacts from '../build/contracts/User.json'
var User = contract(user_artifacts);

import Ipfs from 'ipfs'

class App extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      web3: null,
      user: '',
      balance: '',
      node: new Ipfs({
        repo: String(Math.random() + Date.now())
      }),
      username: ''
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
      User.setProvider(results.web3.currentProvider);

      // Instantiate contract once web3 provided.
      this.instantiateContract()

    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  instantiateContract() {
    // Get accounts and start IPFS
    this.state.web3.eth.getAccounts((error, accounts) => {
      this.state.node.on('ready', () => {
        console.log('IPFS ready to use!');
      })
      this.state.web3.eth.getBalance(accounts[0], (error, balance) => {
        this.setState({
          user: accounts[0],
          balance: this.state.web3.fromWei(balance.toString(), 'ether')
        })

        //Authenticate the address from metamask
        this.checkAuthentication(accounts[0], this);
      })
      // set the provider for the User abstraction 
      User.setProvider(this.state.web3.currentProvider);

    })
  }

  //Make checks as eth testnet or if account has user
  checkAuthentication(account, context) {
    //Check if address has user
    console.log("Validating with: ", account);
    User.deployed().then(function(contractInstance) {
      contractInstance.getUsernameByAddress.call(account, {from: account}).then(function(result) {
      
        context.setState({
          username: context.hex2a(result)
        })

      }).catch(function(e) {
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
      user,
      balance,
      username
    } = this.state

    if (this.state.username) {
      return (
        <div>
          <Router
            web3={web3}
            user={user}
            balance={balance}
            username={username}
            >
          </Router>
        </div>
      );
    } else {
      return (
        <div><CreateUser web3={web3} user={User} account={user} balance={balance}></CreateUser></div>
      );
    }
  }
}

export default App;
