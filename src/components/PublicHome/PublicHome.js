import React, { Component } from 'react';
import { Grid, Transition, Menu, Image, Button, Responsive, Sidebar } from 'semantic-ui-react'
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import styled from 'styled-components';
import _ from 'lodash';

import ShastaLogo from '../../static/logo-shasta-02.png';

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
// Routes
import SignUp from  './SignUp/SignUp';
import SignIn from './SignIn/SignIn';

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
    const {visible} = this.state;

    return (
      <Router>
        <div>
          {/* The top menu */}
          <Menu>
            <AppLogo as={Link} to="/">
              <img src={ShastaLogo} />
              <h2>Shasta Platform</h2>
            </AppLogo>
            <Responsive as={Menu.Menu} position='right' minWidth="1024">
              <Menu.Item as={Link} to="/sign-in">
                Sign In
              </Menu.Item>
              <Menu.Item as={Link} to="/">
                Sign Up
              </Menu.Item>
            </Responsive>
            <Responsive as={Menu.Menu} position='right' maxWidth="1024">
              <ResponsiveMenu as={Button} onClick={this.handleSidebarShow}>
                <Icon icon="bars" />
              </ResponsiveMenu>
            </Responsive>
          </Menu>

          {/* Public Routes */}
          <Route exact path="/" component={SignUp} />
          <Route exact path="/sign-in" component={SignIn} />

          {/* The lateral sidebar for responsive menu*/}
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
        </div>
      </Router>
    );
  }
}

export default PublicHome;
