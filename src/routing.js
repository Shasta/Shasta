import React from 'react';

import { Image, Menu, Sidebar, Button } from 'semantic-ui-react'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import Tab from './components/Tab/Tab';
import Home from './components/Home/Home';
import Market from './components/Market/Market';
import Map from './components/Map/Map';
import Marketer from './components/Marketer/Marketer'
import logo from './static/shasta-logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


class App extends React.Component {
  constructor(props) {
    super(props);

    this.createDemo = this.createDemo.bind(this);

  }

  async createDemo() {

    var faker = require('faker');

    const bid = {
      value: 40,
      date: Date.now(),
      firstName: "Vitalik",
      lastName: "Buterin",
      country: "Russia",
      marketer: "The Marketer",
      source: "Nuclear"
    }


    this.props.userJson.contracts.push(bid);

    const res = await this.props.ipfs.add([Buffer.from(JSON.stringify(this.props.userJson))]);

    let ipfsH = res[0].hash;
    let contractInstance = await this.props.contract.deployed();

    await contractInstance.createBid(bid.value, ipfsH, { gas: 400000, from: this.props.address, value: bid.value })

    const bid2 = {
      value: 20,
      date: Date.now(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      country: faker.address.country(),
      marketer: "The Marketer",
      source: "Solar"
    }
    this.props.userJson.contracts.push(bid2);
    const res2 = await this.props.ipfs.add([Buffer.from(JSON.stringify(this.props.userJson))]);

    ipfsH = res2[0].hash;

    await contractInstance.createBid(bid2.value, ipfsH, { gas: 400000, from: this.props.address, value: bid2.value })

    // Get the SharedMap.sol instance
    const sharedMapInstance = await this.props.sharedMapContract.deployed();

    // Generate the location object, will be saved later in JSON.
    const locationObject = {
      chargerName: "charger-" + faker.random.number(),
      chargerStatus: "open",
      latitude: "36.70",
      longitude: "-4.457",
      providerSource: "Solar",
      address: faker.address.streetAddress(),
    }
    const priceBG = "3";

    // Upload to IPFS and receive response
    const ipfsResponse = await this.props.ipfs.add(Buffer.from(JSON.stringify(locationObject)));
    const ipfsHash = ipfsResponse[0].hash;
    // Estimate gas
    const estimatedGas = await sharedMapInstance.addLocation.estimateGas(priceBG, ipfsHash, { from: this.props.address });
    // Send a transaction to addLocation method.
    await sharedMapInstance.addLocation(priceBG, ipfsHash, { gas: estimatedGas, from: this.props.address })  //Call the transaction

  }

  render() {
    const {
      web3,
      account,
      balance
    } = this.props;

    return (
      <div>
        <Router>
          <div>
            <Tab web3={web3} account={account} balance={balance}></Tab>
            <Sidebar as={Menu} animation='overlay' icon='labeled' vertical visible width='wide'>
              <Link to="/">
                <Menu.Item as='a'>
                  <Image src={logo} size='small' style={{ marginLeft: '85px' }}></Image>
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
              <Button onClick={this.createDemo}>Create Demo</Button>
            </Sidebar>
            <div>
              <Route exact path="/" render={(props) => <Home
                username={this.props.username}
                userJson={this.props.userJson}
              />} />
              <Route exact path="/marketer" render={(props) => <Marketer
                username={this.props.username}
                address={this.props.address}
                shastaMarketContract={this.props.shastaMarketContract}
                userContract={this.props.contract}
                web3={this.props.web3}
                sharedMapContract={this.props.sharedMapContract}
                ipfs={this.props.ipfs} />} />
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
                userJson={this.props.userJson}
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
