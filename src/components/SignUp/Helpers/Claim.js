import React from 'react';
import styled from 'styled-components';
import { Button, Image } from 'semantic-ui-react';
import MintShaComponent from '../../Account/MintSha';
import withRawDrizzle from '../../../utils/withRawDrizzle';
import ShastaCoin from '../../../static/coin-gold-shasta.png';

const MintSha = withRawDrizzle(MintShaComponent);

const FlexDiv = styled.div`
  max-width: 340px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin: 0 auto;
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
    max-width: 316px;
  }
  @media only screen and (max-width: 767px) {
    padding: 30px 0px 40px;
  }
`
const ClaimButton = styled(Button)`
&&& {
  max-width: 420px;
  width: 100%;
  box-shadow: 0 3px 4px 0 rgba(0, 0, 0, .14), 0 3px 3px -2px rgba(0, 0, 0, .2), 0 1px 8px 0 rgba(0, 0, 0, .12) !important;
  background-color: #ea78bc;
  padding: 17px 35px;
  font-size: 1.3rem;
  font-weight: normal;
  color: white;
  border-radius: 10px;
}
&&&:active, &&&:hover {
  background-color: #f4b8df;
}
`
const HelperText = styled.p`
  width: 100%;
  max-width: 660px;
  text-align: center;
  margin-top: 35px;
  font-size: 1.2rem;
  color: black;
`

export default function () {
  return (
  <FlexDiv>
      <Image centered src={ShastaCoin} style={{width: 150}}/>
      <HelperText>You need Shasta tokens to be able to use the platform. Here are some for you.</HelperText>
      <MintSha>
        <ClaimButton >
          Claim your 100 Shasta tokens
        </ClaimButton>
      </MintSha>
    </FlexDiv>
  )
}