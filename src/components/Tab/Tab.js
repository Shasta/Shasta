import React, { Component } from 'react';
import { Menu, Button } from 'semantic-ui-react'
import Account from '../Account/Account';

class Tab extends Component {

  render() {

    return (
      <div>
        <Menu size='massive'>
          <Menu.Menu position='right'>
            <Account accountIndex={0} unit="ether" precision="3"/>
          </Menu.Menu>
        </Menu>
      </div>
    );
  }
}

export default Tab;
