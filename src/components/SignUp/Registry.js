import React, { Component } from 'react';
import styled from 'styled-components';
import { CountryDropdown } from 'react-country-region-selector';
import { Button, Form, Input } from 'semantic-ui-react'
import { Redirect } from 'react-router-dom';
import withRawDrizzle from '../../utils/withRawDrizzle';
import ipfs from '../../ipfs';
import _  from 'lodash';

import { connect} from 'react-redux';
import {UserActions } from '../../redux/UserActions';

const RegistryBox = styled.div`
  margin: 20px 0px;
  padding: 20px;
  border-radius: 6px;
  box-shadow: 0 3px 4px 0 rgba(0, 0, 0, .14), 0 3px 3px -2px rgba(0, 0, 0, .2), 0 1px 8px 0 rgba(0, 0, 0, .12);
  max-width: 400px !important;
`
class RegistryForm extends Component {
  state = {
    shaBalancePointer: "",
    currentAddress: "",
    organizationName: "",
    firstName: "",
    lastName: "",
    country: "",
    toDashboard: false
  }

  constructor(props) {
    super(props);

    this.action = new UserActions(this.props.dispatch);
  }

  componentDidMount() {
    const { drizzleState, drizzle, initialized} = this.props;
    const {tokenBalancePointer} = this.state;

    if (initialized && !!drizzleState && tokenBalancePointer !== "") {
      const { accounts } = drizzleState; 
      const currentAddress = accounts[0];
      if (currentAddress) {
        const shaLedgerInstance = drizzle.contracts.ShaLedger;
        const tokenBalancePointer = shaLedgerInstance.methods.balanceOf.cacheCall(currentAddress);
  
        this.setState({
          tokenBalancePointer,
          currentAddress
        })
      }
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

  createUser = async () => {
    const {initialized, drizzle, drizzleState} = this.props;
    const {organizationName, firstName, lastName, country} = this.state;
    const mainAccount = drizzleState && drizzleState.accounts && !!Object.keys(drizzleState.accounts).length ? drizzleState.accounts[0] : ""; 
    if (initialized === true && mainAccount !== "") {
      const contractInstance = drizzle.contracts.User;
      const userJson = {
        organization: {
          name: organizationName,
          address: mainAccount,
          firstName,
          lastName,
          country,
        },
        consumerOffers: [],
        producerOffers: []
      }
      const ipfsResponse = await ipfs.add([Buffer.from(JSON.stringify(userJson))]);

      const rawOrgName = drizzle.web3.utils.utf8ToHex(organizationName);
      const ipfsHash = drizzle.web3.utils.utf8ToHex(ipfsResponse[0].hash);

      const estimatedGas = await contractInstance.methods.createUser(rawOrgName, ipfsHash).estimateGas({from: mainAccount})
      const userCreationResponse = await contractInstance.methods.createUser(rawOrgName, ipfsHash).send({ gas: estimatedGas, from: mainAccount });

      if (!userCreationResponse) {
        console.log('error creating user on ethereum. Maybe the user name already exists or you already have a user.');
      }

      if (userCreationResponse) {
        this.action.login(organizationName)
        this.setState({
          toDashboard: true
        })
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const {drizzle, drizzleState, initialized} = nextProps;
    if (!initialized || !drizzleState || Object.keys(drizzleState.accounts).length === 0) {
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

  handleInputChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  selectCountry = (value) => {
    this.setState({ country: value });
  }

  render() {
    const { organizationName, firstName, lastName, country, toDashboard } = this.state;
    
    if (toDashboard === true) {
      return <Redirect to="/home" />
    }
    
    return (
      <Form as={RegistryBox}>
        <h3 style={{textAlign: "center"}}>Sign up</h3>
        <Form.Field>
          <label>Organization Name</label>
          <Input placeholder='Organization Name' value={organizationName} name="organizationName" onChange={this.handleInputChange} />
          <label>First Name</label>
          <Input placeholder='First Name' value={firstName} name="firstName" onChange={this.handleInputChange} />
          <label>Last Name</label>
          <Input placeholder='Last Name' value={lastName} name="lastName" onChange={this.handleInputChange} />
          <label>Country</label>
          <CountryDropdown
            value={country}
            onChange={(val) => this.selectCountry(val)} />
        </Form.Field>
        <Button type='submit' id="createOrgBtn" onClick={this.createUser}>Create a new organization</Button>
      </Form>
    )
  }
}

function mapStateToProps(state, props) { return { user: state.user } }
function mapDispatchToProps(dispatch) { return { dispatch }; }

export default withRawDrizzle(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(RegistryForm)
);