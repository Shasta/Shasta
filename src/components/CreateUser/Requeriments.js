import React, { Component } from 'react';
import styled, { css} from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import withRawDrizzle from '../../utils/withRawDrizzle';
import MintSha from '../Account/MintSha';
import { Button } from 'semantic-ui-react'
import _ from 'lodash';

const RequerimentsBox = styled.div`
  margin-top: 60px;
  border-radius: 10px;
  background: #8460f1;
  padding: 30px;
`

const MakeSureText = styled.p`
  color: #d1d3ff;
  text-align: center;
  font-size: 1em;
`

const Icon = styled(FontAwesomeIcon)`
  ${props => props.color && css`
    color: ${props.color}
  `}
`

const Steps = styled.div`
  margin-top: 10px;
`

const Step = styled.div`
  display: flex;
  align-items: center;
  & > div {
    margin-left: 10px;
  }
  & > p {
    margin-left: 10px;
  }
`
const StepDescription = styled.p`
  color: white;
`

const determineIcon = (boolean) => boolean == true ? 'check' : 'times';

const StepIcon = function(props) {
  const icon = determineIcon(props.fulfilled);

  return (
    <Icon icon={icon} size="2x" color="white" />
  )
}
class Requeriments extends Component {
  state = {
    tokenBalancePointer: "",
    currentAddress: ""
  }

  async componentDidMount() {
    const { initialized, drizzleState, drizzle} = this.props;
    const { currentAddress, tokenBalancePointer } = this.state;
    const newAddress = _.get(drizzleState, ['accounts', 0], "").toLowerCase();
    console.log("mount")
    if (initialized && drizzleState && drizzleState.accounts && newAddress !== currentAddress && newAddress && newAddress.length > 0) {
      console.log("setting at mount", newAddress)
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
    console.log("props", newAddress)
    if (initialized && drizzleState && drizzleState.accounts && newAddress !== currentAddress && newAddress && newAddress.length > 0) {
      const shaLedgerInstance = drizzle.contracts.ShaLedger;
      console.log("setting at props", newAddress)
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
        console.log(drizzle)
        console.log(drizzleState)
        console.log('bal', web3.utils.fromWei(tokenBalance, 'ether'));
        haveSha = tokenBalance.gt(zeroBN);
      }
    }
    return (
      <div>
        <RequerimentsBox>
          <h3 style={{textAlign: "center", color: "white"}}>Welcome to Shasta</h3>
          <MakeSureText>Make sure to complete all the steps below to be able to sign up.</MakeSureText>
          <Steps>
            <Step>
              <StepIcon  fulfilled={isInstalled} />
              <StepDescription>Install <a href="https://metamask.io/">Metamask</a> on your browser</StepDescription>
            </Step>
            <Step>
              <StepIcon  fulfilled={isLogged} />
              <StepDescription>Sign in and unlock your Metamask</StepDescription>
            </Step>
            <Step>
              <StepIcon fulfilled={haveSha} />
              <MintSha>
                <StepDescription>Claim your 100 Shasta tokens!</StepDescription>
              </MintSha>
            </Step>
          </Steps>
        </RequerimentsBox> 
      </div>
    )
  }
}

export default withRawDrizzle(Requeriments);




/*
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


*/