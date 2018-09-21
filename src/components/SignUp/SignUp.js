import React, { Component } from 'react';
import { Grid, Transition } from 'semantic-ui-react'
import { Link } from 'react-router-dom';
import withRawDrizzle from '../../utils/withRawDrizzle';
import _ from 'lodash';
import styled from 'styled-components';

// SignUp components
import Requeriments from  './Requeriments';
import Registry from './Registry';

// Requeriment Helpers components
import Install from './Helpers/Install';
import Login from './Helpers/Login';
import Claim from './Helpers/Claim';

const Header = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: 0 auto;
  & > * {
    color: #3d293f;
    font-size: 2rem;
  }
  &&&&&& > h1 {
    margin-top: 75px;
    margin-bottom: 0px;
    font-size: 4.3rem;
  }
`
const HyperLink = styled(Link)`
  color: #ea78bc;
  text-decoration: underline;
  text-decoration-color: #ea78bc;
`

class SignUp extends Component {
  state = {
    tokenBalancePointer: "",
    currentAddress: ""
  }

  async componentDidMount() {
    const { initialized, drizzleState, drizzle} = this.props;
    const { currentAddress } = this.state;
    const newAddress = _.get(drizzleState, ['accounts', 0], "").toLowerCase();
    if (initialized && drizzleState && drizzleState.accounts && newAddress !== currentAddress && newAddress && newAddress.length > 0) {
      const shaLedgerInstance = drizzle.contracts.ShaLedger;
      const tokenBalancePointer = shaLedgerInstance.methods.balanceOf.cacheCall(newAddress, {from: newAddress});

      this.setState({
        tokenBalancePointer,
        currentAddress: newAddress
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    const {initialized, drizzle, drizzleState} = nextProps;
    const { currentAddress } = this.state;
    const newAddress = _.get(drizzleState, ['accounts', 0], "").toLowerCase();;
    if (initialized && drizzleState && drizzleState.accounts && newAddress !== currentAddress && newAddress && newAddress.length > 0) {
      const shaLedgerInstance = drizzle.contracts.ShaLedger;
      const tokenBalancePointer = shaLedgerInstance.methods.balanceOf.cacheCall(newAddress, {from: newAddress});

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
        const rawBalance = drizzleState.contracts.ShaLedger.balanceOf[tokenBalancePointer].value;
        const tokenBalance = web3.utils.toBN(rawBalance);
        haveSha = tokenBalance.gt(zeroBN);
      }
    }

    let rightComponent = <Install />

    if (isInstalled === true && isLogged === false) {
      rightComponent = <Login />
    }
    if (isInstalled === true && isLogged === true && haveSha === false) {
      rightComponent = <Claim />
    }
    if (isInstalled === true && isLogged === true && haveSha === true) {
      rightComponent = <Registry isInstalled={isInstalled} isLogged={isLogged} haveSha={haveSha} store={this.props.store}/>
    }
    return (
      <Grid>
        <Header>
          <h1>Sign Up</h1>
          <p style={{marginBottom: 0}}>Already have an account? <HyperLink to="/sign-in">Sign in instead</HyperLink></p>
        </Header>
        <Grid.Row centered columns={2} style={{marginTop: 75}}>
          <Grid.Column mobile={12} tablet={12} computer={6}>
            <Requeriments isInstalled={isInstalled} isLogged={isLogged} haveSha={haveSha} />
          </Grid.Column>
          <Grid.Column  mobile={12} tablet={12} computer={6}>
            <Transition.Group
              animation='bounce'
              duration={2000}
            >
              {rightComponent}
            </Transition.Group>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default withRawDrizzle(SignUp);
