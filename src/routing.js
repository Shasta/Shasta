import React, { Component } from 'react';

import { Header, Icon, Image, Menu, Segment, Sidebar, Button } from 'semantic-ui-react'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";


import Tab from './components/Tab/index';
import Home from './components/Home/index';
import Market from './components/Market/index';
import Map from './components/Map/index';

import logo from './static/shasta-logo.png';


class App extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {
      web3,
      user,
      balance
    } = this.props;

    return (
      <div>
        <Router>
          <div>
            <Tab web3={web3} user={user} balance={balance}></Tab>
            <Sidebar as={Menu} animation='overlay'  icon='labeled' vertical visible width='wide'>
              <Menu.Item as='a'>
                <Image src={logo} size='small' style={{marginLeft: '80px'}}/>
              </Menu.Item>
              <Menu.Item as='a'>
                <i class="small home icon"></i>
                <Link to="/">Home</Link>
              </Menu.Item>
              <Menu.Item as='a'>
                <i name='user' />
                <Link to="/market">Market</Link>
              </Menu.Item>
              <Menu.Item as='a'>
                <i name='user' />
                <Link to="/map">Map</Link>
              </Menu.Item>
            </Sidebar>
            <div>
              <Route exact path="/" component={Home} />
              <Route path="/market" component={Market} />
              <Route path="/map" component={Map} />
            </div>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
