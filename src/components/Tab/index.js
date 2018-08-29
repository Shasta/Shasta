import React, { Component } from 'react';
import { Menu, Button } from 'semantic-ui-react'

class Index extends Component {
  constructor(props) {
    super(props)

  }

  render() {
    const {
      user,
      balance
    } = this.props;
    
    return (
      <div>
        <Menu size='massive'>
          <Menu.Menu position='right'></Menu.Menu>
        </Menu>
      </div>
    );
  }
}

export default Index;
