import React, { Component } from 'react';
import { Grid, Transition, Image } from 'semantic-ui-react'
import withRawDrizzle from '../../utils/withRawDrizzle';
import _ from 'lodash';

// SignUp components
import Requeriments from  './Requeriments';
import Registry from './Registry';

// Requeriment Helpers components
import Install from './Helpers/Install';
import Login from './Helpers/Login';
import Claim from './Helpers/Claim';

class SignUp extends Component {
  state = {
    tokenBalancePointer: "",
    currentAddress: ""
  }

  async componentDidMount() {
    const { initialized, drizzleState, drizzle} = this.props;
    const { currentAddress, tokenBalancePointer } = this.state;
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
    return (
      <Grid>
        <Grid.Row centered columns={2}>
          <Grid.Column mobile={12} tablet={6} computer={6}>
            <Requeriments isInstalled={isInstalled} isLogged={isLogged} haveSha={haveSha} />
          </Grid.Column>
          <Grid.Column  mobile={12} tablet={6} computer={6}>
            {isInstalled === false && <Install /> }
            {isInstalled === true && isLogged === false && <Login />}
            {isInstalled === true && isLogged === true && haveSha === false && <Claim />}
            {isInstalled === true && isLogged === true && haveSha === true &&
              <Registry isInstalled={isInstalled} isLogged={isLogged} haveSha={haveSha} store={this.props.store}/>
            }
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default withRawDrizzle(SignUp);
