import React, { Component } from 'react';

import { Header, Icon, Image, Menu, Segment, Sidebar, Button } from 'semantic-ui-react'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";


import Tab from './components/Tab/index';
import Home from './components/Home/index';
import Market from './components/Market/index';
import Map from './components/Map/index';


class App extends React.Component {
  constructor(props) {
    super(props)
  }
      heyWeb3 = () => {
        console.log('web3', this.props.web3)
        console.log(this.props.web3.eth);
      }

  render() {
    const {
      web3
    } = this.props;

    return (
      <div>
        <Router>
          <div>
            <Tab web3={web3}></Tab>
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
              <Menu.Item as='a'>
                <Icon name='user' />
                <Link to="/map">Map</Link>
              </Menu.Item>
              <Menu.Item as='a'>
                <Icon name='user' />
                <button onClick={this.heyWeb3}>Web3</button>
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
