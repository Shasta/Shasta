import React from 'react';
import styled from 'styled-components';
import { Button } from 'semantic-ui-react';
import MintShaComponent from '../../Account/MintSha';
import withRawDrizzle from '../../../utils/withRawDrizzle';

const MintSha = withRawDrizzle(MintShaComponent);

const FlexDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 380px;
`
const ClaimButton = styled(Button)`
  margin: 20px 0px !important;
  max-width: 280px;
  width: 100%;
  box-shadow: 0 3px 4px 0 rgba(0, 0, 0, .14), 0 3px 3px -2px rgba(0, 0, 0, .2), 0 1px 8px 0 rgba(0, 0, 0, .12) !important;
  background: purple;
`
const HelperText = styled.div`
  width: 100%;
  max-width: 500px;
  text-align: center;
`
export default function () {
  return (
  <FlexDiv>
      <HelperText>You need Shasta tokens to be able to use the platform. Here are some for you.</HelperText>
      <MintSha>
        <ClaimButton inverted color="purple" >
          Claim your 100 Shasta tokens
        </ClaimButton>
      </MintSha>
    </FlexDiv>
  )
}