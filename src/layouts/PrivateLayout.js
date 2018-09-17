import React from 'react';

import { Image, Menu, Sidebar, Button } from 'semantic-ui-react'
import { Route, Switch, Link } from "react-router-dom";

import Tab from '../components/Tab/Tab';
import logo from '../static/logo-shasta-02.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class Dashboard extends React.Component {
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
      balance,
    } = this.props;
    const Component = this.props.component;

    return (
      <div>
        <Tab web3={web3} account={account} balance={balance}></Tab>
        <Sidebar as={Menu} animation='overlay' icon='labeled' vertical visible width='wide'>
          <Menu.Item as={Link} to="/dashboard">
            <Image src={logo} size='small' style={{ marginLeft: '85px' }}></Image>
          </Menu.Item>
          <Menu.Item as={Link} to="/dashboard">
            <FontAwesomeIcon icon="home"></FontAwesomeIcon><h4>Home</h4>
          </Menu.Item>
          <Menu.Item as={Link} to="/dashboard/consumer">
            <FontAwesomeIcon icon="users"></FontAwesomeIcon><h4>Consumer</h4>
          </Menu.Item>
          <Menu.Item as={Link} to="/dashboard/map">
            <FontAwesomeIcon icon="map"></FontAwesomeIcon><h4>Providers</h4>
          </Menu.Item>
          <Menu.Item as={Link} to="/dashboard/hardware">
            <FontAwesomeIcon icon="digital-tachograph"></FontAwesomeIcon><h4>Hardware</h4>
          </Menu.Item>
          <Menu.Item as={Link} to="/dashboard/settings">
            <FontAwesomeIcon icon="cog"></FontAwesomeIcon><h4>Settings</h4>
          </Menu.Item>
          <Menu.Item as={Link} to="/logout">
            <FontAwesomeIcon></FontAwesomeIcon><h4>Logout</h4>
          </Menu.Item>
          <Button onClick={this.createDemo}>Create Demo</Button>
        </Sidebar>

        {/* Render component */}
        <Component {...this.props} />
      </div>
    );
  }
}

export default Dashboard;
