import React, { Component } from 'react';
import { Segment } from 'semantic-ui-react';
import styled from 'styled-components';
import { capitalize } from '../../utils/stringHelpers';
import { upperFirst } from 'lodash';

const targetNetwork = upperFirst(process.env.TARGET_NETWORK);

const NetworkSegment = styled(Segment)`
  &&& {
    width: 150px;
    display: flex;
    justify-content: center;
    position: absolute;
    top: 80px;
    right: 20px;
  }
`

class NetworkStatus extends Component {
  state = {
    currentNetwork: 'Not connected'
  }

  async componentDidUpdate(nextProps, nextState) {
    const { drizzle } = nextProps;
    
    const web3 = drizzle.web3;
    if (web3 && web3.eth) {
      const rawNewNetwork = await web3.eth.net.getNetworkType();
      const newNetwork = capitalize(rawNewNetwork);
      if (newNetwork !== this.state.currentNetwork) {
        this.setState({
          currentNetwork: newNetwork
        });
      }
    }
  }

  render() {
    const { currentNetwork } = this.state;
    let segmentColor = 'red';

    if (currentNetwork === targetNetwork) {
      segmentColor = 'pink';
    }

    if (currentNetwork !== targetNetwork) {
      segmentColor = 'yellow';
    }
    
    if(currentNetwork == 'Not connected') {
      segmentColor = 'red';
    }

    return (
      <NetworkSegment inverted color={segmentColor}>
        {currentNetwork}
      </NetworkSegment>
    )
  }
};

export default NetworkStatus;