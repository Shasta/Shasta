import React, { Component } from 'react';
import { Menu } from 'semantic-ui-react'

class Tab extends Component {

  render() {
    
    return (
      <div>
        <Menu size='massive'>
          <Menu.Menu position='right'></Menu.Menu>
        </Menu>
      </div>
    );
  }
}

export default Tab;
