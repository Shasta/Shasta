import React, { Component } from 'react'
import { Button } from 'semantic-ui-react'
import withDrizzleContext from '../../utils/withDrizzleContext.js';
import MintShaModal from './MintSha';
import styled, { css } from 'styled-components';

const EthAccount = styled.div`
  display: flex;
  align-items: center;
  & > * {
    font-size: 1rem;
    margin-left: 20px !important;
  }
`;

class AccountData extends Component {
  constructor(props, context) {
    super(props);

    this.state = {
      menu: null,
      asked: false,
      tokenBalancePointer: "",
      currentAddress: null
    }
  }

  precisionRound(number, precision) {
    var factor = Math.pow(10, precision)
    return Math.round(number * factor) / factor
  }

  componentWillReceiveProps(nextProps) {
    console.log("fired!")
    const {drizzle, drizzleState} = nextProps;
    const { accounts } = drizzleState;
    const { currentAddress } = this.state;
    const newAddress = accounts[0];
    if (newAddress !== currentAddress) {
      const shaLedgerInstance = drizzle.contracts.ShaLedger;
      const tokenBalancePointer = shaLedgerInstance.methods.balanceOf.cacheCall(newAddress);

      this.setState({
        tokenBalancePointer,
        currentAddress: newAddress
      });
    }
  }

  async componentDidMount() {
    const { drizzleState, drizzle, accountIndex} = this.props;
    const { accounts } = drizzleState; 
    const currentAddress = accounts[accountIndex];

    const shaLedgerInstance = drizzle.contracts.ShaLedger;
    const tokenBalancePointer = shaLedgerInstance.methods.balanceOf.cacheCall(currentAddress);

    this.setState({
      tokenBalancePointer,
      currentAddress
    })
  }

  render() {
    const { drizzleState, drizzle} = this.props;
    const { tokenBalancePointer, asked } = this.state;
    const { accounts, accountBalances } = drizzleState;
    const { web3 } = drizzle;

    let tokenBalance = 0;
    const ShaLedgerState = drizzleState.contracts.ShaLedger;
    if (tokenBalancePointer in ShaLedgerState.balanceOf) {
      // ShaLedger have 18 decimals, like Ether, so we can reuse `fromWei` util function.
      tokenBalance = web3.utils.fromWei(ShaLedgerState.balanceOf[tokenBalancePointer].value, 'ether');
    }

    // No accounts found.
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
      <EthAccount>
          <div>{balance} {units}</div>
          <div>{tokenBalance} Sha</div>
          <MintShaModal>
            <Button color="purple">Get Sha</Button>
          </MintShaModal>
      </EthAccount>
    )
  }
}

export default withDrizzleContext(AccountData);