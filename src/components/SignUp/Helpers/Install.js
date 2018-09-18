import React from 'react';
import styled from 'styled-components';
import { Image } from 'semantic-ui-react';
import InstallSrc from '../../../static/install.png';

const FlexDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 380px;
`

export default function () {
  return (
    <FlexDiv>
      <a href="https://metamask.io">
        <Image src={InstallSrc} centered size="large" />
      </a>
    </FlexDiv>
  )
}