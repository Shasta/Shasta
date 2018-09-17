import React, { Component } from 'react';
import styled, { css} from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import withRawDrizzle from '../../utils/withRawDrizzle';
import ShastaLogo from '../../static/logo-shasta-02.png';
import MintSha from '../Account/MintSha';
import { Button, Image } from 'semantic-ui-react'
import _ from 'lodash';

const RequerimentsBox = styled.div`
  margin-top: 60px;
  border-radius: 10px;
  background: linear-gradient(to bottom right, #5d1053, #ff68fb);
  padding: 30px;
`

const MakeSureText = styled.p`
  color: #f4ffd1;
  text-align: center;
  font-size: 1.16em;
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
  render() {
    const {isInstalled, isLogged, haveSha} = this.props;
    return (
      <div>
        <RequerimentsBox>
          <h2 style={{textAlign: "center", color: "white"}}>Welcome to Shasta Alpha</h2>
          <MakeSureText>Make sure to complete <u>all the steps</u> below to be able to sign up.</MakeSureText>
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