import React, { Component } from 'react'
import withDrizzleContext from '../../utils/withDrizzleContext.js';

class AccountData extends Component {
  constructor(props, context) {
    super(props);

    this.state = {
      tokenBalancePointer: "",
      selectedAddress: "",
      menu: null,
      loading: false,
      badges: []
    }
  }

  precisionRound(number, precision) {
    var factor = Math.pow(10, precision)
    return Math.round(number * factor) / factor
  }

  componentWillReceiveProps(nextProps) {
    const {selectedAddress} = this.state; 
    const {drizzle, accountIndex, drizzleState} = nextProps
    const { accounts } = drizzleState; 
    const newAddress = accounts[nextProps.accountIndex]
    if (newAddress && selectedAddress != newAddress) {
      const tokenBalancePointer = drizzle.contracts.BadgesLedger.methods.balanceOf.cacheCall(newAddress);
      this.setState({
        selectedAddress: newAddress,
        tokenBalancePointer: tokenBalancePointer
      })
    }
  }

  componentDidMount() {
    const { drizzleState, drizzle, accountIndex} = this.props;
    const { accounts } = drizzleState; 
    const currentAddress = accounts[accountIndex];

    this.setState({
      currentAddress: currentAddress
    })
  }

  render() {
    const { drizzleState, drizzle} = this.props;
    const { accounts, accountBalances } = drizzleState;
    const { web3 } = drizzle;

    // No accounts found.
    console.log(drizzleState, accountBalances)
    if(Object.keys(accounts).length === 0) {
      return (
        <span>Initializing...</span>
      )
    }

    // Get account address and balance.
    const address = accounts[this.props.accountIndex]
    let balance = accountBalances[address];
    const units = this.props.units ? this.props.units.charAt(0).toUpperCase() + this.props.units.slice(1) : 'Wei'
    if (!balance) {
      return (
        <span>Initializing...</span>
      )
    }
    // Convert to given units.
    if (this.props.units) {
      balance = web3.utils.fromWei(balance, this.props.units)
    }

    // Adjust to given precision.
    if (this.props.precision) {
      balance = this.precisionRound(balance, this.props.precision)
    }
    return(
      <div className="eth-account">
          <div>{balance} {units}</div>
      </div>
    )
  }
}

export default withDrizzleContext(AccountData);