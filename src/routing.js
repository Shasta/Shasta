import React from 'react';

import { Image, Menu, Sidebar, Button } from 'semantic-ui-react'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import Tab from './components/Tab/Tab';
import Home from './components/Home/Home';
import Consumer from './components/Consumer/Consumer';
import Map from './components/Map/Map';
import Marketer from './components/Marketer/Marketer'
import logo from './static/shasta-logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Settings from './components/Settings/Settings';


class App extends React.Component {
  constructor(props) {
    super(props);

    this.createDemo = this.createDemo.bind(this);

  }

  async createDemo() {

    var faker = require('faker');

    const consumerOffer = {
      fiatAmount: 40,
      date: Date.now(),
      firstName: "Vitalik",
      lastName: "Buterin",
      country: "Russia",
      source: "Nuclear",
      energyPrice: "0.15",
      fiatAmount: "24",
      description: "Real energy directly from mother Russia",
      pendingOffer: true,
      ethAddress: this.props.address,
      address: faker.address.streetAddress(),
    }


    this.props.userJson.consumerOffers.push(consumerOffer);

    const res = await this.props.ipfs.add([Buffer.from(JSON.stringify(this.props.userJson))]);

    let ipfsH = res[0].hash;
    let contractInstance = await this.props.contract.deployed();

    await contractInstance.createBid(consumerOffer.fiatAmount, ipfsH, { gas: 400000, from: this.props.address, value: consumerOffer.fiatAmount })

    const consumerOffer2 = {
      fiatAmount: 20,
      date: Date.now(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      country: faker.address.country(),
      source: "Solar",
      energyPrice: "0.15",
      description: "Lorem Ipsum",
      pendingOffer: true,
      ethAddress: this.props.address,
      address: faker.address.streetAddress(),
    }
    this.props.userJson.consumerOffers.push(consumerOffer2);
    const res2 = await this.props.ipfs.add([Buffer.from(JSON.stringify(this.props.userJson))]);

    ipfsH = res2[0].hash;

    await contractInstance.createBid(consumerOffer2.fiatAmount, ipfsH, { gas: 400000, from: this.props.address, value: consumerOffer2.fiatAmount })

    // Get the SharedMap.sol instance
    const sharedMapInstance = await this.props.sharedMapContract.deployed();

    // Generate the location object, will be saved later in JSON.
    const producerOffer = {
      chargerName: "charger-" + faker.random.number(),
      latitude: "36.70",
      longitude: "-4.457",
      providerSource: "Solar",
      address: faker.address.streetAddress(),
      energyPrice: "0.12",
      fiatAmount: "13",
      date: Date.now(),
      pendingOffer: true,
      ethAddress: this.props.address
    }
    this.props.userJson.producerOffers.push(producerOffer);


    // Upload to IPFS and receive response
    const ipfsResponse = await this.props.ipfs.add(Buffer.from(JSON.stringify(this.props.userJson)));
    const ipfsHash = ipfsResponse[0].hash;
    const estimatedGas = await contractInstance.createOffer.estimateGas(producerOffer.energyPrice, ipfsHash, { from: this.props.address });
    await contractInstance.createOffer(producerOffer.energyPrice, ipfsHash, { gas: estimatedGas, from: this.props.address })

  }

  render() {
    const {
      web3,
      account,
      balance
    } = this.props;

    return (
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
            <Link to="/consumer">
              <Menu.Item as='a'>
                <FontAwesomeIcon icon="users"></FontAwesomeIcon><h4>Consumer</h4>
              </Menu.Item>
            </Link>
            {/* <Link to="/marketer">
                <Menu.Item as='a'>
                  <FontAwesomeIcon icon="users"></FontAwesomeIcon><h4>Marketer</h4>
                </Menu.Item>
              </Link> */}
            <Link to="/map">
              <Menu.Item as='a'>
                <FontAwesomeIcon icon="map"></FontAwesomeIcon><h4>Providers</h4>
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
              organizationName={this.props.organizationName}
              userJson={this.props.userJson}
              userContract={this.props.contract}
              shastaMarketContract={this.props.shastaMarketContract}
              ipfs={this.props.ipfs}
              web3={this.props.web3}
              sharedMapContract={this.props.sharedMapContract}
              address={this.props.address}
            />} />
            {/* <Route exact path="/marketer" render={(props) => <Marketer
                organizationName={this.props.organizationName}
                address={this.props.address}
                shastaMarketContract={this.props.shastaMarketContract}
                userContract={this.props.contract}
                web3={this.props.web3}
                sharedMapContract={this.props.sharedMapContract}
                ipfs={this.props.ipfs} />} /> */}
            <Route path="/consumer" render={(props) => <Consumer
              organizationName={this.props.organizationName}
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
              userContract={this.props.contract}
            />} />
            <Route path="/map" render={(props) => <Map
              ipfs={this.props.ipfs}
              address={this.props.address}
              web3={this.props.web3}
              userContract={this.props.contract}
              userJson={this.props.userJson}
              sharedMapContract={this.props.sharedMapContract}
              shastaMarketContract={this.props.shastaMarketContract}
            />} />
            <Route path="/settings" render={(props) => <Settings
              userJson={this.props.userJson}
              ipfs={this.props.ipfs}
              userContract={this.props.contract}
              address={this.props.address}

            />} />
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
