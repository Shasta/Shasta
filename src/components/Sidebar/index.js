import React, { Component } from 'react';

import { Menu, Button, Image, Grid, Label , Divider, Sidebar, Icon, Segment, Header } from 'semantic-ui-react'

import './style.css';


class Index extends Component {
  render() {
    return (
      <div>
        <Sidebar as={Menu} className="sidebar" animation='overlay' icon='labeled'  vertical visible width='wide'>
          <Menu.Item as='a'>
            <Icon name='home' />
            Shasta
          </Menu.Item>
          <Menu.Item as='a'>
            <Icon name='male' />
            Market
          </Menu.Item>
          <Menu.Item as='a'>
            <Icon name='dollar sign' />
            Finance
          </Menu.Item>
          <Menu.Item as='a'>
            <Icon name='hdd' />
            Hardware
          </Menu.Item>
        </Sidebar>
      </div>
    );
  }
}

export default Index;
