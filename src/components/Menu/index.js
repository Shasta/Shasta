import React, { Component } from 'react';
import { Menu, Button } from 'semantic-ui-react'

class Index extends Component {
  render() {
    return (
      // Menu with Bulma-React.
      <div>
        <Menu size='massive'>
          <Menu.Menu position='right'>
            <Menu.Item>
              <p>username</p>
            </Menu.Item>
          </Menu.Menu>
        </Menu>
      </div>
    );
  }
}

export default Index;
