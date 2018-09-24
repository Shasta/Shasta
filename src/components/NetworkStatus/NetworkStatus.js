import React, { Component } from 'react';
import { Segment } from 'semantic-ui-react';
import styled from 'styled-components';



class NetworkStatus extends Component {
  render() {
    const { drizzle } = this.props;

    const web3 = drizzle.web3;
    const currentNetwork = web3.eth.net.getNetworkType();
    let segmentColor = 'red';

    if (currentNetwork == 'main') {
      segmentColor = 'green';
    }

    if (currentNetwork == 'main') {
      segmentColor = 'yellow';
    }

    return (
      <Segment inverted color={segmentColor}>
        {currentNetwork}
      </Segment>
    )
  }
};

export default NetworkStatus;