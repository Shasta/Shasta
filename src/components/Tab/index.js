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
          <Menu.Menu position='right'>
            <Menu.Item>
              <h4>{this.props.balance} ETH</h4>
            </Menu.Item>
            <Menu.Item>
              <a href=''><p>{this.props.user}</p></a>
            </Menu.Item>
          </Menu.Menu>
        </Menu>
      </div>
    );
  }
}

export default Index;
