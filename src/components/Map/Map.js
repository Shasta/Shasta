import React, { Component } from 'react';

import D3 from './d3.js';

class Map extends Component {
  render() {
    return (
      <div style={{marginLeft: '375px', marginTop: '50px'}}>
        <D3></D3>
      </div>
    );
  }
}

export default Map;