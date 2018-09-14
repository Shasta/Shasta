import React, { Component } from 'react';
import styled, { css} from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import withRawDrizzle from '../../utils/withRawDrizzle';
import MintSha from '../Account/MintSha';
import { Button } from 'semantic-ui-react'

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
    console.log("refresh!")
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
        console.log(drizzleState)
        console.log(tokenBalance)
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
              <MintSha afterClaim={this.refreshTokenBalance}>
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