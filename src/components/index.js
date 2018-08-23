import React, { Component } from 'react';

import { Header, Icon, Image, Menu, Segment, Sidebar } from 'semantic-ui-react'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";


import Tab from './Tab/index';
import Home from './Home/index';
import Market from './Market/index';


class App extends React.Component {
  render() {
    return (
      <Router>
        <div>
          <Tab></Tab>
          <Sidebar as={Menu} animation='overlay'  icon='labeled' vertical visible width='wide'>
            <Menu.Item as='a'>
              <h2>Shasta</h2>
            </Menu.Item>
            <Menu.Item as='a'>
              <Icon name='user' />
              <Link to="/">Home</Link>
            </Menu.Item>
            <Menu.Item as='a'>
              <Icon name='user' />
              <Link to="/market">Market</Link>
            </Menu.Item>
          </Sidebar>
          <div>
            <Route exact path="/" component={Home} />
            <Route path="/market" component={Market} />
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
