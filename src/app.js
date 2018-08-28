import React, { Component } from 'react';

import Router from "./routing.js";

import getWeb3 from './getWeb3.js'

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
      })
    })
  }

  render() {
    const {
      web3,
      user,
      balance
    } = this.state
    return (
      <div>
        <Router
          web3={web3}
          user={user}
          balance={balance}
          >
        </Router>
      </div>
    );
  }
}

export default App;
