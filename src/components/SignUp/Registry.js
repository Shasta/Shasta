import React, { Component } from 'react';
import styled from 'styled-components';
import { CountryDropdown } from 'react-country-region-selector';
import { Button, Form, Input, Checkbox } from 'semantic-ui-react'
import { Redirect } from 'react-router-dom';
import withRawDrizzle from '../../utils/withRawDrizzle';
import ipfs from '../../ipfs';
import _  from 'lodash';

import { connect} from 'react-redux';
import {UserActions } from '../../redux/UserActions';

const RegistryBox = styled.div`
&&&& {
  border-radius: 6px;
  max-width: 330px;
  width: 100%;
  @media only screen and (min-width: 1920px) {
    max-width: 520px;
  }
  @media only screen and (min-width: 1200px) and (max-width: 1919px) {
    max-width: 400px;
  }
  @media only screen and (min-width: 768px) and (max-width: 991px) {
  }
  @media only screen and (min-width: 992px) and (max-width: 1199px) {
  }
  @media only screen and (max-width: 767px) {
  }
}
  
&&&& label {
  font-weight: normal;
  font-size: 1.1rem !important;
}
&&&& .ui.input > input {
  margin-bottom: 8px;
  border-radius: 0px;
  border: 1px solid #777;
  padding: 0.4rem 0.6rem;
}
&&&& select {
  border-radius: 0px;
  border: 1px solid #777;
}


`
const Terms = styled.div`
  background: #fceef7;
  padding: 10px;
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  margin: 5px 0px;
  font-size: 1.1rem;
  &&&&& a {
    color: black;
    text-decoration: underline;
  }
`

const SubmitButton = styled(Button)`
&&&& {
  background-color: #3e2a40;
  border-radius: 10px;
  font-size: 1.18rem;
  color: white;
  padding: 15px 39px;
  font-weight: normal;
}
`
class RegistryForm extends Component {
  state = {
    shaBalancePointer: "",
    currentAddress: "",
    organizationName: "",
    firstName: "",
    lastName: "",
    country: "",
    use: false,
    privacy: false,
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

  togglePrivacyTerms = () => {
    this.setState((prevState) => ({
      privacy: !prevState.privacy
    }));
  }

  toggleUseTerms = () => {
    this.setState((prevState) => ({
      use: !prevState.use
    }));
  }
  render() {
    const { organizationName, firstName, lastName, country, toDashboard, use, privacy } = this.state;
    
    if (toDashboard === true) {
      return <Redirect to="/home" />
    }
    
    console.log(this.state);
    const notValid = !use || !privacy || !organizationName || !firstName || !lastName || !country;

    return (
      <Form as={RegistryBox}>
        <Form.Field>
          <label>Organization Name</label>
          <Input placeholder='' value={organizationName} name="organizationName" onChange={this.handleInputChange} />
          <label>First Name</label>
          <Input placeholder='' value={firstName} name="firstName" onChange={this.handleInputChange} />
          <label>Last Name</label>
          <Input placeholder='' value={lastName} name="lastName" onChange={this.handleInputChange} />
          <label>Country</label>
          <CountryDropdown
            value={country}
            onChange={(val) => this.selectCountry(val)} />
          <Terms style={{ marginTop: 30}}>
            <span>I agree to Shasta <a href="#">Terms of Use</a>.</span>
            <Checkbox checked={this.state.user} onChange={this.toggleUseTerms}/>
          </Terms>
          <Terms>
            <span>I agree to Shasta <a href="#">Politic Privacy</a>.</span>
            <Checkbox checked={this.state.privacy} onChange={this.togglePrivacyTerms}/>
          </Terms>
        </Form.Field>
        <SubmitButton disabled={notValid} type='submit' id="createOrgBtn" onClick={this.createUser}>Create a new organization</SubmitButton>
      </Form>
    )
  }
}

function mapStateToProps(state, props) { return { user: state.userReducer } }
function mapDispatchToProps(dispatch) { return { dispatch }; }

export default withRawDrizzle(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(RegistryForm)
);