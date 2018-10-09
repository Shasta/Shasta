import React, { Component } from 'react';
import styled from 'styled-components';
import { CountryDropdown } from 'react-country-region-selector';
import { Button, Form, Input, Checkbox, Message } from 'semantic-ui-react'
import { Redirect } from 'react-router-dom';
import withRawDrizzle from '../../utils/withRawDrizzle';
import ipfs from '../../ipfs';
import _ from 'lodash';

import { connect } from 'react-redux';
import { UserActions } from '../../redux/UserActions';

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
    toDashboard: false,
    tx: -1,
    organizationNameTaken: false,
    addressHaveOrg: false
  }

  constructor(props) {
    super(props);

    this.action = new UserActions(this.props.dispatch);
  }

  componentDidMount() {
    const { drizzleState, drizzle, initialized } = this.props;
    const { tokenBalancePointer } = this.state;

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
    const { drizzle, drizzleState } = this.props;
    const { accounts } = drizzleState;
    const currentAddress = accounts[0];
    const shaLedgerInstance = drizzle.contracts.ShaLedger;
    const tokenBalancePointer = shaLedgerInstance.methods.balanceOf.cacheCall(currentAddress);

    this.setState({
      tokenBalancePointer,
    })
  }

  createUser = async () => {
    const { initialized, drizzle, drizzleState } = this.props;
    const { organizationName, firstName, lastName, country } = this.state;
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

      //Check this address already has an organization
      const addressHaveOrg = await contractInstance.methods.hasUser(mainAccount).call();
      console.log("hasOrg: ", addressHaveOrg)
      if (!addressHaveOrg) {
        //Check username is taken
        const organizationNameTaken = await contractInstance.methods.usernameTaken(rawOrgName).call();
        if (!organizationNameTaken) {
          //Create the user
          const estimatedGas = await contractInstance.methods.createUser(rawOrgName, ipfsHash).estimateGas({ from: mainAccount })
          const tx = contractInstance.methods.createUser.cacheSend(rawOrgName, ipfsHash, { gas: estimatedGas, from: mainAccount });
          this.setState({
            tx
          })
        } else {
          this.setState({
            organizationNameTaken: true
          })
        }
      } else {
        this.setState({
          addressHaveOrg: true
        })
      }
    }
  }

  componentDidUpdate(nextProps, nextState) {
    const { drizzle, drizzleState, initialized } = nextProps;
    const { tx, organizationName } = nextState;

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

    if (drizzleState && drizzleState.transactionStack && drizzleState.transactionStack[tx] && !!drizzleState.transactionStack[tx].length ) {
      const txHash = drizzleState.transactionStack[tx];
      const transaction = drizzleState.transactions[txHash];
      if (transaction && transaction.status && transaction.status == "success") {
        this.action.login(organizationName);
        this.setState({
          toDashboard: true
        })
      }
    }
  }

  handleInputChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
      organizationNameTaken: false
    })
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
    const { drizzleState } = this.props;
    const { organizationName, firstName, lastName, country, toDashboard, use, privacy, tx } = this.state;
    let transactionStatus = "";

    const notValid = !use || !privacy || !organizationName || !firstName || !lastName || !country;

    if (toDashboard === true) {
      return <Redirect to="/home" />
    }
    if (drizzleState && drizzleState.transactionStack && drizzleState.transactionStack[tx]) {
      const txHash = drizzleState.transactionStack[tx];
      const transaction = drizzleState.transactions[txHash];
      if (transaction && transaction.status) {
        transactionStatus = _.upperFirst(transaction.status);
      }
    }

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
          <Terms style={{ marginTop: 30 }}>
            <span>I agree to Shasta <a href="https://shasta.world/terms.pdf">Terms of Use</a>.</span>
            <Checkbox checked={this.state.user} onChange={this.toggleUseTerms} />
          </Terms>
          <Terms>
            <span>I agree to Shasta <a href="https://shasta.world/privacy.pdf">Politic Privacy</a>.</span>
            <Checkbox checked={this.state.privacy} onChange={this.togglePrivacyTerms} />
          </Terms>
        </Form.Field>
        <SubmitButton disabled={notValid} type='submit' id="createOrgBtn" onClick={this.createUser}>Create a new organization</SubmitButton>
        <Message color='red' hidden={!this.state.organizationNameTaken}>The organization name {this.state.organizationName} is already in use. Choose a diferent one please.</Message>
        <Message color='red' hidden={!this.state.addressHaveOrg}>You already created an organization with this account</Message>
        <Message warning={!(transactionStatus.length > 0)}>Tx status: {transactionStatus}</Message>
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