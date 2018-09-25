import React, { Component } from 'react';
import { Progress } from 'semantic-ui-react';
import styled from 'styled-components';

const ProgressTop = styled(Progress)`
  &&&&&&& {
    position: fixed;
    z-index: 2000;
    overflow: overflow;
    top: 0;
    left: 0;
    width: 100%;
  }
  &&&&& .bar {
    background-color: #f4b8df !important;
  }
`
function LoadingTop() {
  return (
    <ProgressTop percent={100} indicating color="pink" size="tiny" />
  );
}

export default LoadingTop;
