import React, { Component } from 'react';
import { Menu, Button } from 'semantic-ui-react'

class Index extends Component {
  render() {
    return (
      // Menu with Bulma-React.
      <div>
        <Menu size='small'>
          <Menu.Item>
            <span>Shasta</span>
          </Menu.Item>
          <Menu.Menu position='right'>
            <Menu.Item>
              <p>Private Network: QmUNLLsPACCz1vLxQVkXqqLX5R1X345qqfHbsf67hvA3Nn</p>
            </Menu.Item>
            <Menu.Item>
              <Button primary>Sign Up</Button>
            </Menu.Item>
          </Menu.Menu>
        </Menu>
      </div>
    );
  }
}

export default Index;
