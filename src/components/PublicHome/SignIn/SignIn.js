import React, { Component } from 'react';
import { Input } from 'semantic-ui-react';
import styled from 'styled-components';
import withRawDrizzle from '../../../utils/withRawDrizzle';

const Title = styled.h4`
  text-align: center;
`
class SignIn extends Component {
  render() {
    return (
      <div>
        <Title>Sign In</Title>
        <Input />
      </div>
    )
  }
}

export default withRawDrizzle(SignIn);