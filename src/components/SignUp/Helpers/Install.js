import React from 'react';
import styled from 'styled-components';

import Logo from '../../../static/logo-shasta-02.png';

const FlexDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  height: 380px;
  position: relative;
`

const BackgroundImage = styled.img`
  max-width: 330px;
  width: 100%;
  opacity: 0.4;
  filter: alpha(opacity=40);
  margin: auto;
  position: absolute;
  top: 0; left: 0; bottom: 0; right: 0;
  margin:auto;
  z-index: 5;
`

export default function () {
  return (
    <FlexDiv>
      <BackgroundImage src={Logo} />
    </FlexDiv>
  )
}