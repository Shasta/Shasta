import React, { Component } from 'react';
import { Menu, Button, Divider, Feed } from 'semantic-ui-react'

import D3 from './d3.js';

class Index extends Component {
  render() {
    return (
      <div style={{marginLeft: '375px', marginTop: '50px'}}>
        <D3></D3>
      </div>
    );
  }
}

export default Index;
