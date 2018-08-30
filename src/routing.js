import React from 'react';

import { Image, Menu, Sidebar } from 'semantic-ui-react'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";


import Tab from './components/Tab/index';
import Home from './components/Home/index';
import Market from './components/Market/index';
import Map from './components/Map/index';

import logo from './static/shasta-logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


class App extends React.Component {

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
              <Link to="/">
                <Menu.Item as='a'>
                  <FontAwesomeIcon icon="home"></FontAwesomeIcon><h4>Home</h4>
                </Menu.Item>
              </Link>
              <Link to="/market">
                <Menu.Item as='a'>
                  <FontAwesomeIcon icon="users"></FontAwesomeIcon><h4>Market</h4>
                </Menu.Item>
              </Link>
              <Link to="/map">
                <Menu.Item as='a'>
                  <FontAwesomeIcon icon="map"></FontAwesomeIcon><h4>Map</h4>
                </Menu.Item>
              </Link>
            </Sidebar>
            <div>
              <Route exact path="/" render={(props) => <Home username={this.props.username} />} />
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
