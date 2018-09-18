import React from 'react';
import { privateRoutes } from '../routes';
import { Image, Menu, Sidebar, Button } from 'semantic-ui-react'
import { Link } from "react-router-dom";
import _ from 'lodash';
import Tab from '../components/Tab/Tab';
import logo from '../static/logo-shasta-02.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import withDrizzleContext from '../utils/withDrizzleContext';
import ipfs from '../ipfs';
import { connect } from 'react-redux';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.createDemo = this.createDemo.bind(this);
  }

  async createDemo() {
    const { drizzle, drizzleState } = this.props;
    const { organization } = this.props.user;
    const currentAccount = drizzleState.accounts[0];

    const web3 = drizzle.web3;
    const rawOrgName = web3.utils.utf8ToHex(organization);
    const rawHash = await drizzle.contracts.User.methods.getIpfsHashByUsername(rawOrgName).call({ from: currentAccount });
    const ipfsHash = web3.utils.hexToUtf8(rawHash);
    const rawJson = await ipfs.cat(ipfsHash);
    const userJson = JSON.parse(rawJson);
    let contractInstance = drizzle.contracts.User;
    var faker = require('faker');

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
      ethAddress: currentAccount
    }
    userJson.producerOffers.push(producerOffer);

    // Upload to IPFS and receive response
    const ipfsResponse = await ipfs.add(Buffer.from(JSON.stringify(userJson)));
    const thirdIpfsHash = web3.utils.utf8ToHex(ipfsResponse[0].hash);
    const thirdPrice = web3.utils.toWei(producerOffer.fiatAmount, 'ether');
    const estimatedGas = await contractInstance.methods.createOffer(thirdPrice, thirdIpfsHash).estimateGas({ from: currentAccount });
    await contractInstance.methods.createOffer(thirdPrice, thirdIpfsHash).send({ gas: estimatedGas, from: currentAccount })
  }

  render() {
    const {
      web3,
      account,
      balance,
    } = this.props;
    const Component = this.props.component;

    const Links = _.map(privateRoutes, (privRoute, key) =>
      (
        <Menu.Item as={Link} to={privRoute.path}>
          <FontAwesomeIcon icon={privRoute.icon}></FontAwesomeIcon><h4>{privRoute.title}</h4>
        </Menu.Item>
      )
    )
    return (
      <div>
        <Tab web3={web3} account={account} balance={balance}></Tab>
        <Sidebar as={Menu} animation='overlay' icon='labeled' vertical visible width='wide'>
          <Menu.Item as={Link} to="/home">
            <Image src={logo} size='small' style={{ marginLeft: '85px' }}></Image>
          </Menu.Item>
          {Links}
          <Menu.Item as={Link} to="/logout">
            <h4>Logout</h4>
          </Menu.Item>
          <Button onClick={this.createDemo}>Create Demo</Button>
        </Sidebar>

        {/* Render component */}
        <Component {...this.props} />
      <div style={{ width: "100%", height: "10%", backgroundColor: "#402d41", bottom: 0 }}>
      </div>
      </div >
    );
  }
}

function mapStateToProps(state, props) { return { user: state.userReducer } }

export default withDrizzleContext(
  connect(
    mapStateToProps,
  )(Dashboard)
);