import React from 'react';
import styled from 'styled-components';


const FlexDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 380px;
`

const HelperText = styled.div`
  width: 100%;
  max-width: 500px;
  text-align: center;
  font-size: 1.2rem;
  margin-bottom: 30px;
`

export default function () {
  return (
    <FlexDiv>
      <HelperText>Please login into Metamask to be able to interact with Shasta. Check the video below for a Metamask introduction.</HelperText>
      <iframe width="100%" height="435px" src="https://www.youtube.com/embed/6Gf_kRE4MJU" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
    </FlexDiv>
  )
}