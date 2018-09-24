import React, { Component } from 'react';
import styled, { css} from 'styled-components';
import { Image } from 'semantic-ui-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import withRawDrizzle from '../../utils/withRawDrizzle';
import MintShaComponent from '../Account/MintSha';
import _ from 'lodash';

const MintSha = withRawDrizzle(MintShaComponent);

const BoxesBackgroundColor = '#f4b8df';
const BoxesFontColor = '#3d293f';

const WelcomeBox = styled.div`
  width: 100%;
  margin: 0 auto;
  background: ${BoxesBackgroundColor};
  border-radius: 10px;
  padding: 30px 40px 40px;
  color: ${BoxesFontColor};
  font-size: 1.55rem;
  text-decoration-color: ${BoxesFontColor};
  & > h1 {
    margin-top: 30px;
    font-size: 2.2rem;
  }
  @media only screen and (min-width: 1920px) {
    max-width: 600px;
  }
  @media only screen and (min-width: 1200px) and (max-width: 1919px) {
    max-width: 480px;
  }
  @media only screen and (min-width: 992px) and (max-width: 1199px) {
    max-width: 440px;
  }
  @media only screen and (min-width: 768px) and (max-width: 991px) {
    max-width: 340px;
    & > h1 {
      font-size: 1.6rem;
    }
  }
  @media only screen and (max-width: 767px) {
    padding: 30px 20px 40px;
    & > h1 {
      font-size: 1.6rem;
    }
  }
  
`

const WelcomeAnimation = styled.div`
&&& {
  margin: 0 auto;
  width: 111px;
  height: 111px;
  background-color: white;
  border-radius: 100%;
}
`

const MakeSureText = styled.p`
  font-size: 0.8em;
`

const Icon = styled(FontAwesomeIcon)`
  ${props => props.color && css`
    color: ${props.color}
  `}
`

const HyperLink = styled.a`
&&& {
  color: ${BoxesFontColor};
  text-decoration: underline;
  text-decoration-color: ${BoxesFontColor};
}
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
  color: ${BoxesFontColor};
  font-size: 1.2rem
`
const Steps = styled.div`
 & > ${Step}:not(:first-child) {
  margin-top: 15px;
 }
`

const determineIcon = (boolean) => boolean === true ? 'check' : 'times';

const StepIcon = function(props) {
  const icon = determineIcon(props.fulfilled);

  return (
    <Icon icon={icon} size="lg" color="white" />
  )
}
class Requeriments extends Component {
  render() {
    const {isInstalled, isLogged, haveSha} = this.props;
    return (
      <div>
        <WelcomeBox>
          <WelcomeAnimation centered />
          <h1>Welcome to Shasta</h1>
          <MakeSureText>Make sure to complete <u>all the steps</u> below to be able to sign up.</MakeSureText>
          <Steps>
            <Step>
              <StepIcon  fulfilled={isInstalled} />
              <StepDescription>Install <HyperLink href="https://metamask.io/">METAMASK</HyperLink> on your browser</StepDescription>
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
        </WelcomeBox> 
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