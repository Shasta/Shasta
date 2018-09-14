import React, { Component } from 'react';
import styled, { css} from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { CountryDropdown } from 'react-country-region-selector';
import withRawDrizzle from '../../utils/withRawDrizzle';
import { Button, Form, Grid, Image, Input, Transition } from 'semantic-ui-react'

class RegistryForm extends Component {
  state = {
    shaBalancePointer: "",
    currentAddress: ""
  }

  componentDidMount() {
    const { drizzleState, drizzle, initialized} = this.props;
    const {tokenBalancePointer} = this.state;

    if (initialized && !!drizzleState && tokenBalancePointer !== "") {
      const { accounts } = drizzleState; 
      const currentAddress = accounts[0];
      const shaLedgerInstance = drizzle.contracts.ShaLedger;
      const tokenBalancePointer = shaLedgerInstance.methods.balanceOf.cacheCall(currentAddress);

      this.setState({
        tokenBalancePointer,
        currentAddress
      })
    }
  }

  refreshTokenBalance = () => {
    const {drizzle, drizzleState} = this.props;
    const { accounts } = drizzleState; 
    const currentAddress = accounts[0];
    const shaLedgerInstance = drizzle.contracts.ShaLedger;
    const tokenBalancePointer = shaLedgerInstance.methods.balanceOf.cacheCall(currentAddress);

    this.setState({
      tokenBalancePointer,
    })
  }

  componentWillReceiveProps(nextProps) {
    console.log("fired!")
    const {drizzle, drizzleState, initialized} = nextProps;
    if (!initialized || !drizzleState || Object.keys(drizzleState.accounts).length == 0) {
      return;
    }

    const { currentAddress } = this.state;
    const newAddress = drizzleState.accounts[0];

    if (newAddress !== currentAddress) {
      const shaLedgerInstance = drizzle.contracts.ShaLedger;
      const tokenBalancePointer = shaLedgerInstance.methods.balanceOf.cacheCall(newAddress);

      this.setState({
        tokenBalancePointer,
        currentAddress: newAddress
      });
    }
  }

  render() {
    const { drizzle, drizzleState, initialized } = this.props;
    const { tokenBalancePointer } = this.state;
    const web3 = drizzle.web3;

    let isInstalled, isLogged, haveSha = false;

    isInstalled = drizzle.web3.status !== 'failed';
    isLogged = isInstalled && initialized && drizzleState && Object.keys(drizzleState.accounts).length > 0;
    
    if (initialized) {
      if (tokenBalancePointer in drizzleState.contracts.ShaLedger.balanceOf) {
        const zeroBN = web3.utils.toBN("0");
        // ShaLedger have 18 decimals, like Ether, so we can reuse `fromWei` util function.
        const tokenBalance = web3.utils.toBN(drizzleState.contracts.ShaLedger.balanceOf[tokenBalancePointer].value);
        haveSha = tokenBalance.gt(zeroBN);
      }
    }
    return (
      <Form>
        <Form.Field>
          <label>Organization Name</label>
          <Input placeholder='Organization Name' onChange={this.handleOrgNameChange} />
          <label>First Name</label>
          <Input placeholder='First Name' onChange={this.handleFNameChange} />
          <label>Last Name</label>
          <Input placeholder='Last Name' onChange={this.handleLNameChange} />
          <label>Country</label>
          <CountryDropdown
            value={this.state.country}
            onChange={(val) => this.selectCountry(val)} />
        </Form.Field>
        <Button type='submit' id="createOrgBtn" onClick={this.createUser}>Create a new organization</Button>
      </Form>
    )
  }
}

export default withRawDrizzle(RegistryForm);