import React, { Component } from 'react';

import Router from "./routing.js";

import getWeb3 from './getWeb3'

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      web3: null
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
  render() {
    const {
      web3
    } = this.state
    return (
      <div>
        <Router
          web3={web3}
          >
        </Router>
      </div>
    );
  }
}

export default App;
