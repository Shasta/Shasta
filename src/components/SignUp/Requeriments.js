import React, { Component } from 'react';
import styled, { css} from 'styled-components';
import { Image } from 'semantic-ui-react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import withRawDrizzle from '../../utils/withRawDrizzle';
import MintShaComponent from '../Account/MintSha';
import _ from 'lodash';

const MintSha = withRawDrizzle(MintShaComponent);

const targetNetwork = _.upperFirst(process.env.TARGET_NETWORK);

const BoxesBackgroundColor = '#f4b8df';
const BoxesFontColor = '#3d293f';

const WelcomeBox = styled.div`
  width: 100%;
  margin: 0 auto;
  background: ${BoxesBackgroundColor};
  border-radius: 10px;
  padding: 30px 40px 20px;
  color: ${BoxesFontColor};
  font-size: 1rem;
  text-decoration-color: ${BoxesFontColor};
  & > h1 {
    margin-top: 20px;
    font-size: 2.2rem;
  }
  @media only screen and (min-width: 1920px) {
    font-size: 1.2rem;
    max-width: 520px;
  }
  @media only screen and (min-width: 1200px) and (max-width: 1919px) {
    padding: 30px 20px 20px;
    font-size: 1.1rem;
    max-width: 400px;
    & > h1 {
      font-size: 1.8rem;
    }
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
    padding: 30px 20px 20px;
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
`
const Steps = styled.div`
 & > ${Step}:not(:first-child) {
  margin-top: 8px;
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
    const {isInstalled, isLogged, haveSha, isRinkeby} = this.props;
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
              <StepIcon  fulfilled={isRinkeby} />
              <StepDescription>Change the network to {targetNetwork}</StepDescription>
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