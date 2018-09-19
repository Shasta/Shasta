import React, { Component } from 'react';
import { Grid, Transition, Menu, Image, Button, Responsive, Sidebar } from 'semantic-ui-react'
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import {Route, Link, Switch} from "react-router-dom";
import styled from 'styled-components';
import _ from 'lodash';

import ShastaLogo from '../static/logo-shasta-02.png';

const ResponsiveMenu = styled(Menu.Item)`
&:before {
  display: none;
}
`
const AppLogo = styled(Menu.Item)`
  display: flex;
  align-items: center;
  &:before {
    display: none;
  }
  & > h2 {
    margin: 0;
    margin-left: 10px;
  }
  & > img {
    width: 55px !important;
  }
`
class PublicHome extends Component {
  state = {
    visible: false
  }

  handleSidebarHide = () => {
    this.setState({
      visible: false
    })
  }

  handleSidebarShow = () => {
    this.setState({
      visible: true
    })
  }

  render() {
    const Component = this.props.component;
    const {visible} = this.state;

    return (
      <div>
        {/* The top menu */}
        <Menu>
          <AppLogo as={Link} to="/">
            <img src={ShastaLogo} />
            <h2>Shasta</h2>
          </AppLogo>
          <Responsive as={Menu.Menu} position='right' minWidth="1024">
            <Menu.Item as={Link} to="/sign-in">
             <Button color="purple">Sign In</Button>
            </Menu.Item>
            <Menu.Item as={Link} to="/">
              <Button color="purple">Sign Up</Button>
            </Menu.Item>
          </Responsive>
          <Responsive as={Menu.Menu} position='right' maxWidth="1024">
            <ResponsiveMenu as={Button} onClick={this.handleSidebarShow}>
              <Icon icon="bars" />
            </ResponsiveMenu>
          </Responsive>
        </Menu>

        {/* The lateral right sidebar for responsive menu*/}
        <Sidebar
          as={Menu}
          animation='overlay'
          icon='labeled'
          onHide={this.handleSidebarHide}
          vertical
          visible={visible}
          width='thin'
          direction='right'
        >
          <Menu.Item as={Link} to="/">
            Sign Up
          </Menu.Item>
          <Menu.Item as={Link} to="/sign-in">
            Sign In
          </Menu.Item>
        </Sidebar>

        {/* The rendered component */}
        <Component  {...this.props} />

        <Button primary >Botonaco </Button>
      </div>
    );
  }
}

export default PublicHome;
