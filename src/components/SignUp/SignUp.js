import React, { Component } from 'react';
import { Grid, Container, Transition } from 'semantic-ui-react'
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

const targetNetwork = process.env.TARGET_NETWORK;

const GridRow = styled(Grid.Row)`
  margin-top: 20px;
  @media only screen and (min-width: 1920px) {
    margin-top: 80px;
  }
  @media only screen and (min-width: 1200px) and (max-width: 1919px) {
    margin-top: 60px;
  }
  @media only screen and (min-width: 768px) and (max-width: 991px) {
    margin-top: 40px;
  }
  @media only screen and (min-width: 992px) and (max-width: 1199px) {
  }
  @media only screen and (max-width: 767px) {
  }
`
const Header = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: 0 auto;
  & > * {
    color: #3d293f;
    font-size: 1.4rem;
  }
  &&&&&& > h1 {
    margin-top: 45px;
    margin-bottom: 0px;
    font-size: 2.8rem;
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
      console.log("cachecall")
      const tokenBalancePointer = shaLedgerInstance.methods.balanceOf.cacheCall(newAddress, {from: newAddress});

      this.setState({
        tokenBalancePointer,
        currentAddress: newAddress
      })
    }
  }

  async componentDidUpdate(nextProps) {
    const {initialized, drizzle, drizzleState} = nextProps;
    const { currentAddress } = this.state;
    const newAddress = _.get(drizzleState, ['accounts', 0], "").toLowerCase();
    if (initialized && drizzleState && drizzleState.accounts && newAddress !== currentAddress && newAddress && newAddress.length > 0) {
      const shaLedgerInstance = drizzle.contracts.ShaLedger;
      console.log("cachecall")
      const tokenBalancePointer = shaLedgerInstance.methods.balanceOf.cacheCall(newAddress, {from: newAddress});

      this.setState({
        tokenBalancePointer,
        currentAddress: newAddress
      });
    }

    const web3 = drizzle.web3;
    if (web3 && web3.eth) {
      const newNetwork = await web3.eth.net.getNetworkType();
      if (newNetwork !== this.state.currentNetwork) {
        this.setState({
          currentNetwork: newNetwork
        });
      }
    }
  }

  render() {
    const { drizzle, drizzleState, initialized } = this.props;
    const { tokenBalancePointer, currentNetwork } = this.state;
    const web3 = drizzle.web3;

    let isInstalled, isLogged, haveSha = false;
    isInstalled = _.get(drizzleState, 'web3.status', 'failed') !== 'failed';
    isLogged = isInstalled && initialized && drizzleState && Object.keys(drizzleState.accounts).length > 0;

    const isRinkeby = isLogged && currentNetwork == targetNetwork;

    if (initialized) {
      if (tokenBalancePointer in drizzleState.contracts.ShaLedger.balanceOf) {
        const zeroBN = web3.utils.toBN("0");
        // ShaLedger have 18 decimals, like Ether, so we can reuse `fromWei` util function.
        const rawBalance = drizzleState.contracts.ShaLedger.balanceOf[tokenBalancePointer].value;
        if (!!rawBalance) {
          const tokenBalance = web3.utils.toBN(rawBalance);
          haveSha = tokenBalance.gt(zeroBN);
        }
        
      }
    }

    let rightComponent = <Install />

    if (isInstalled === true && isLogged === true && isRinkeby == true) {
      rightComponent = <Claim />
    }
    if (isInstalled === true && isLogged === true && isRinkeby == true && haveSha === true) {
      rightComponent = <Registry isInstalled={isInstalled} isLogged={isLogged} haveSha={haveSha} store={this.props.store}/>
    }
    return (
      <div>
        <Header>
            <h1>Sign Up</h1>
            <p style={{ textAlign: 'center'}}>Already have an account? <HyperLink to="/sign-in">Sign in instead</HyperLink></p>
          </Header>
        <Grid columns={2}>
          <GridRow centered columns={2} verticalAlign="middle">
            <Grid.Column mobile={16} tablet={8} computer={8} largeScreen={6} widescreen={6}>
              <Requeriments isInstalled={isInstalled} isLogged={isLogged} haveSha={haveSha} isRinkeby={isRinkeby}/>
            </Grid.Column>
            <Grid.Column  mobile={16} tablet={8} computer={8} largeScreen={6} widescreen={6}>
              <Transition.Group
                animation='bounce'
                duration={2000}
              >
                {rightComponent}
              </Transition.Group>
            </Grid.Column>
          </GridRow>
        </Grid>
      </div>
    );
  }
}

export default withRawDrizzle(SignUp);
