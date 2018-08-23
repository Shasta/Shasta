import React, { Component } from 'react';
import { Header, Icon, Image, Menu, Segment, Sidebar } from 'semantic-ui-react'

class Index extends Component {
  render() {
    return (
      <div>
          <Sidebar as={Menu} animation='overlay'  icon='labeled' vertical visible width='wide'>
            <Menu.Item as='a'>
              <h1>Shasta</h1>
            </Menu.Item>
            <Menu.Item as='a'>
              <Icon name='gamepad' />
              Games
            </Menu.Item>
            <Menu.Item as='a'>
              <Icon name='camera' />
              Channels
            </Menu.Item>
            <Menu.Item as='a'>
              <Icon name='camera' />
              Market
            </Menu.Item>
          </Sidebar>
      </div>
    );
  }
}

export default Index
