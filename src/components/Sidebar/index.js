import React from 'react'
import { Header, Icon, Image, Menu, Segment, Sidebar } from 'semantic-ui-react'

class Index extends React.Component {
  render() {
    return (
      <div>
          <Sidebar as={Menu} animation='overlay' style icon='labeled' vertical visible width='wide'>
            <Menu.Item as='a'>
              <Icon name='home' />
              Home
            </Menu.Item>
            <Menu.Item as='a'>
              <Icon name='gamepad' />
              Games
            </Menu.Item>
            <Menu.Item as='a'>
              <Icon name='camera' />
              Channels
            </Menu.Item>
          </Sidebar>
      </div>
    );
  }
}

export default Index
