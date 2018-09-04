import React from 'react';

import { Image, Menu, Sidebar } from 'semantic-ui-react'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";


import Tab from './components/Tab/Tab';
import Home from './components/Home/Home';
import Market from './components/Market/Market';
import Map from './components/Map/Map';
import Marketer from './components/Marketer/Marketer'
import logo from './static/shasta-logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


class App extends React.Component {

  render() {
    const {
      web3,
      account,
      balance,
      ipfsHash
    } = this.props;

    return (
      <div>
        <Router>
          <div>
            <Tab web3={web3} account={account} balance={balance}></Tab>
            <Sidebar as={Menu} animation='overlay'  icon='labeled' vertical visible width='wide'>
              <Link to="/">
              <Menu.Item as='a'>
                <Image src={logo} size='small' style={{marginLeft: '85px'}}/>
              </Menu.Item>
            </Link>
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
              <Link to="/marketer">
                <Menu.Item as='a'>
                  <FontAwesomeIcon icon="users"></FontAwesomeIcon><h4>Marketer</h4>
                </Menu.Item>
              </Link>
              <Link to="/map">
                <Menu.Item as='a'>
                  <FontAwesomeIcon icon="map"></FontAwesomeIcon><h4>Map</h4>
                </Menu.Item>
              </Link>
              <Link to="/hardware">
                <Menu.Item as='a'>
                  <FontAwesomeIcon icon="digital-tachograph"></FontAwesomeIcon><h4>Hardware</h4>
                </Menu.Item>
              </Link>
              <Link to="/settings">
                <Menu.Item as='a'>
                  <FontAwesomeIcon icon="cog"></FontAwesomeIcon><h4>Settings</h4>
                </Menu.Item>
              </Link>
            </Sidebar>
            <div>
              <Route exact path="/" render={(props) => <Home username={this.props.username} />} />
              <Route exact path="/marketer" render={(props) => <Marketer 
              username={this.props.username}
              address={this.props.address}
              shastaMarketContract={this.props.shastaMarketContract} />} />
              <Route path="/market" render={(props) => <Market
                  username={this.props.username}
                  ipfs={this.props.ipfs}
                  contract={this.props.contract}
                  address={this.props.address}
                  web3={this.props.web3}
                  ipfsHash={this.props.ipfsHash}
                  ipfsFirstName={this.props.ipfsFirstName}
                  ipfsAddress={this.props.ipfsAddress}
                  ipfsValue={this.props.ipfsValue}
                  shastaMarketContract={this.props.shastaMarketContract}
                  />} />
              <Route path="/map" render={(props) => <Map
                  ipfs={this.props.ipfs}
                  address={this.props.address}
                  web3={this.props.web3}
                  sharedMapContract={this.props.sharedMapContract}
              />} />
            </div>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
