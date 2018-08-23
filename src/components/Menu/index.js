import React, { Component } from 'react';
import { Menu, Button } from 'semantic-ui-react'
var faker = require('faker');

class Index extends Component {
  render() {
    return (
      // Menu with Bulma-React.
      <div>
        <Menu size='massive'>
          <Menu.Menu position='right'>
            <Menu.Item>
              <p>{faker.name.findName()}</p>
            </Menu.Item>
          </Menu.Menu>
        </Menu>
      </div>
    );
  }
}

export default Index;
