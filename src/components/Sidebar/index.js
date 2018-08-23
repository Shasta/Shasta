import React, { Component } from 'react';
import { Header, Icon, Image, Menu, Segment, Sidebar } from 'semantic-ui-react'

class Index extends Component {
  render() {
    return (
      <div>
          <Sidebar as={Menu} animation='overlay'  icon='labeled' vertical visible width='wide'>
            <Menu.Item as='a'>
              <h2>Shasta</h2>
            </Menu.Item>
            <Menu.Item as='a'>
              <Icon name='home' />
              Home
            </Menu.Item>
            <Menu.Item as='a'>
              <Icon name='user' />
              Market
            </Menu.Item>
            <Menu.Item as='a'>
              <Icon name='user' />
              Network
            </Menu.Item>
          </Sidebar>
      </div>
    );
  }
}

export default Index
