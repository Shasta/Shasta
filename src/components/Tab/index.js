import React, { Component } from 'react';
import { Menu, Button } from 'semantic-ui-react'
import getWeb3 from './utils/getWeb3'

class Index extends Component {
  constructor(props) {
    super(props)

    this.state = {
      web3: null,
      user: '',
      balance: ''
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

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      this.state.web3.eth.getBalance(accounts[0], (error, balance) => {
        this.setState({
          user: accounts[0],
          balance: this.state.web3.fromWei(balance.toString(), 'ether')
        })
      })
    })

  }


  render() {
    return (
      // Menu with Bulma-React.
      <div>
        <Menu size='massive'>
          <Menu.Menu position='right'>
            <Menu.Item>
              <h4>Wallet: {this.state.balance} ETH</h4>
            </Menu.Item>
            <Menu.Item>
              <p>{this.state.user}</p>
            </Menu.Item>
          </Menu.Menu>
        </Menu>
      </div>
    );
  }
}

export default Index;
