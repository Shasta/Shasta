import React, { Component } from 'react';
import { Button, Form, Sidebar, Menu, Dropdown, Message, List, Segment, Input } from 'semantic-ui-react';
import SharedMap from './SharedMap';
import withDrizzleContext from '../../utils/withDrizzleContext';
import { connect } from 'react-redux';
import _ from 'lodash';

import ipfs from '../../ipfs';
let checkedAddresses = [];

class Producer extends Component {
  state = {
    visible: false,
    chargerName: "",
    chargerStatus: "open",
    chargerAddress: "",
    providerSource: "solar",
    providerAddress: "",
    chargerLatitude: "",
    chargerLongitude: "",
    marketerIndex: 0,
    chargers: [],
    energyPrice: 0.112,
    fiatAmount: '',
    totalToPay: 0,
    amountkWh: 0,
    userJson: {
      producerOffers: [],
      consumerOffers: []
    }
  }

  // Add Web3 event watchers at ComponentDidMount lifecycle,
  // and load the current charger locations
  async componentDidMount() {
    const { drizzle, drizzleState } = this.props;
    const { organization } = this.props.user;
    const currentAccount = drizzleState.accounts[0];

    const web3 = drizzle.web3;
    const rawOrgName = web3.utils.utf8ToHex(organization);
    const rawHash = await drizzle.contracts.User.methods.getIpfsHashByUsername(rawOrgName).call({ from: currentAccount });
    const ipfsHash = web3.utils.hexToUtf8(rawHash);
    const rawJson = await ipfs.cat(ipfsHash);
    const userJson = JSON.parse(rawJson);


    // Get the SharedMap.sol instance
    try {
      this.setState({
        userJson,
        chargers: userJson.producerOffers
      });
    } catch (err) {
      console.log(err);
    }

  }

  locationSelected = (lat, lng) => {
    this.setState({
      chargerLatitude: lat,
      chargerLongitude: lng
    })
  }

  openForm = (e) => {
    e.preventDefault();

    this.setState({ visible: true })
  }

  closeForm = (e) => {
    e.preventDefault();

    this.setState({ visible: false })
  }

  handleChangeSource = (e, data) => {
    this.setState({
      providerSource: data.value
    })
  }

  handleChange = (e, value) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  addProducer = async () => {
    // Get the SharedMap.sol instance
    const { drizzle, drizzleState } = this.props;
    const userJson = _.cloneDeep(this.state.userJson);
    const web3 = drizzle.web3;
    const currentAddress = drizzleState.accounts[0];
    const drizzleUser = drizzle.contracts.User;

    const newProducerOffer = {
      chargerName: this.state.userJson.organization.name,
      latitude: this.state.chargerLatitude,
      longitude: this.state.chargerLongitude,
      providerSource: this.state.providerSource,
      address: this.state.providerAddress,
      energyPrice: this.state.energyPrice,
      fiatAmount: this.state.totalToPay,
      date: Date.now(),
      pendingOffer: true,
      ethAddress: currentAddress,
      amountkWh: this.state.amountkWh
    }
    userJson.producerOffers.push(newProducerOffer);
    try {
      // Show loader spinner
      this.setState({ loader: true })
      // Upload to IPFS and receive response
      const ipfsResponse = await ipfs.add([Buffer.from(JSON.stringify(userJson))]);
      const ipfsHash = ipfsResponse[0].hash;
      console.log("ipfsHash: ", ipfsHash);

      const rawEnergyPrice = web3.utils.toWei(newProducerOffer.energyPrice.toString(), 'ether');
      const rawIpfsHash = web3.utils.utf8ToHex(ipfsHash)
      console.log("price", rawEnergyPrice)
      console.log("raw", rawIpfsHash)
      console.log("account", currentAddress)
      const estimatedGas = await drizzleUser.methods.createOffer(rawEnergyPrice, rawIpfsHash).estimateGas({ from: currentAddress });
      await drizzleUser.methods.createOffer(rawEnergyPrice, rawIpfsHash).send({ gas: estimatedGas, from: currentAddress });

      this.setState({ chargers: userJson.producerOffers, userJson, chargerLatitude: "", chargerLongitude: "", chargerName: "", chargerStatus: "open", visible: false, energyPrice: 0 })
    } catch (err) {
      console.error(err)
    }
  }

  handleChangeAmount = (e) => {
    let isNumeric = Number.isInteger(Number(e.target.value));
    let totalToPay = (isNumeric) ? Number(e.target.value) * this.state.energyPrice : 0;
    //Format number
    totalToPay = Math.round(totalToPay * 100) / 100;
    this.setState({
      amountkWh: e.target.value,
      totalToPay: totalToPay
    })
  }

  render() {

    const { visible, providerAddress, providerSource, chargerLatitude, chargerLongitude, chargers, userJson } = this.state;
    let fieldErrors = []
    const providerSources = [{
      text: "Solar",
      value: "Solar"
    }, {
      text: "Nuclear",
      value: "Nuclear"
    }, {
      text: "Eolic",
      value: "Eolic"
    }, {
      text: "Biomass",
      value: "Biomass"
    }, {
      text: "Other",
      value: "Other"
    }]

    const producerOffers = userJson.producerOffers.map((offer, index) => {
      return (
        <List.Item key={index}>
          <List.Content>
            <List.Header>
              <div style={{ float: 'left' }}>
                <div>{offer.firstName} {offer.lastName}</div>
                <div>You are selling {offer.amountkWh} kWh at <b>{offer.energyPrice} Shas/kWh</b></div>
                <div style={{ color: "grey" }}>Source: {offer.providerSource}</div>
              </div>

              <Button basic color='red' value={index} style={{ backgroundColor: 'white', float: 'right' }}>
                Cancel Offer
              </Button>
            </List.Header>

          </List.Content>
        </List.Item>
      )
    });

    if (providerAddress.length === 0) {
      fieldErrors.push("Provider address must be filled.")
    }
    if (providerSource.length === 0) {
      fieldErrors.push("Provider source must be selected.")
    }
    if (chargerLatitude.length === 0 || chargerLatitude === 0) {
      fieldErrors.push("You must click in the map to select a location.")
    }
    if (this.state.totalToPay === 0) {
      fieldErrors.push("You must set an amount of money to sell");
    }

    return (
      <div style={{ marginLeft: '375px', marginTop: '50px' }}>
        <Sidebar
          as={Menu}
          animation='overlay'
          icon='labeled'
          onHide={this.handleSidebarHide}
          vertical
          direction='right'
          visible={visible}
          width='very wide'

        >
          <Menu.Item style={{width:"80%"}}>
            <h3 style={{ position: 'relative' }}>New provider location</h3>
          </Menu.Item>
          <Menu.Item style={{width:"80%"}}>
            <Form warning={!!fieldErrors.length}>
              <Form.Field>
                <p style={{ textAlign: "start" }}>You can click in the map to select the charger location. Add your address, your energy source and select the marketer that you want to sell your energy. Once the form is complete, click on Submit button.</p>
              </Form.Field>
              <Form.Field>
                <label>Address</label>
                <input type="text" placeholder='Av la paloma, 16, 29003'
                  name='providerAddress'
                  value={providerAddress}
                  onChange={e => this.handleChange(e)} />
              </Form.Field>
              <Form.Field>
                <label>Source of energy</label>
                <Dropdown placeholder='Source of energy' value={providerSource} name='dropdownValue' fluid selection options={providerSources} onChange={this.handleChangeSource} />
              </Form.Field>
              <Form.Field>
                <label style={{ float: 'left', padding: 5 }}> Energy Price: {this.state.energyPrice} (Shas/kWh)</label>
                <Message icon>
                  <Message.Content>
                    The current price is decided every day through the governance system. Want to participate? Click here
                    </Message.Content>
                </Message>
              </Form.Field>
              <Form.Field>
                <label >Amount kWh you want to Sell for a month:</label>
                <Input placeholder='Amount'
                  name='amountkWh'
                  value={this.state.amountkWh}
                  label={{ basic: true, content: 'kWh/month' }}
                  labelPosition='right'
                  onChange={e => this.handleChangeAmount(e)} />
              </Form.Field>
              <Form.Field>
                <label>Latitude</label>
                <input type="text" placeholder='36.718368'
                  name='chargerLatitude'
                  disabled
                  value={chargerLatitude}
                  onChange={e => this.handleChange(e)}
                />
              </Form.Field>
              <Form.Field>
                <label>Longitude</label>
                <input type="text" placeholder='-4.420235'
                  name='chargerLongitude'
                  disabled
                  value={chargerLongitude}
                  onChange={e => this.handleChange(e)} />
              </Form.Field>
              <Message>
                <Message.Content>
                  <p>1 Shas = 1$</p>
                  Total shas earned: {this.state.totalToPay}
                </Message.Content>
              </Message>
              <Message warning header='Check the next fields' list={fieldErrors} />
              <Button onClick={this.closeForm} style={{ marginRight: 30 }}>Close</Button>
              <Button disabled={!!fieldErrors.length} onClick={this.addProducer} type='submit'>Submit</Button>
            </Form>
          </Menu.Item>
        </Sidebar>
        <span style={{ fontSize: '1.71428571rem', marginRight: 40 }}>Current providers</span>
        <Button onClick={this.openForm}>Sell your energy</Button>
        <SharedMap newLocation={{ chargerLatitude, chargerLongitude }} chargers={chargers} emitLocation={this.locationSelected} />
        <div style={{ padding: 15 }}> <h3>Your sell offers: </h3></div>
        <Segment style={{ width: '65%' }}>
          <List divided relaxed>
            {producerOffers}
          </List>
        </Segment>
      </div>
    );
  }
}

function mapStateToProps(state, props) { return { user: state.userReducer } }


export default withDrizzleContext(
  connect(
    mapStateToProps,
  )(Producer)
);