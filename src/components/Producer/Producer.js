import React, { Component } from 'react';
import { Button, Form, Sidebar, Menu, Dropdown, Message, List, Segment, Input } from 'semantic-ui-react';
import SharedMap from './SharedMap';
import withDrizzleContext from '../../utils/withDrizzleContext';
import { connect } from 'react-redux';
import _ from 'lodash';

let checkedAddresses = [];
import ipfs from '../../ipfs';

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
    consumerOffersList: [],
    energyPrice: 0.112,
    fiatAmount: '',
    totalToPay: 0,
    ammountkWh: 0,
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
    const rawHash = await drizzle.contracts.User.methods.getIpfsHashByUsername(rawOrgName).call({from: currentAccount});
    const ipfsHash = web3.utils.hexToUtf8(rawHash);
    const rawJson = await ipfs.cat(ipfsHash);
    const userJson = JSON.parse(rawJson);


    // Get the SharedMap.sol instance
    try {
      this.setState({
        userJson,
        chargers: userJson.producerOffers
      });
      this.getConsumerOffers();
    } catch (err) {
      console.log(err);
    }

  }

  async getConsumerOffers() {
    const { userJson } = this.state;
    const { drizzle, drizzleState } = this.props;
    const web3 = drizzle.web3;
    const currentAddress = drizzleState.accounts[0];
    const drizzleShastaMarket = drizzle.contracts.ShastaMarket;
    const drizzleUser = drizzle.contracts.User;

    const shastaMarketInstance = window.web3.eth.contract(drizzleShastaMarket.abi).at(drizzleShastaMarket.address);
    const userContractInstance = window.web3.eth.contract(drizzleUser.abi).at(drizzleUser.address);

    // Bids
    let consumerOffersList = [];
    //const bidIndexes = await shastaMarketInstance.getBidsIndexesFromAddress.call({ from: self.props.address });
    const bidsLength = await shastaMarketInstance.getBidsLength.call({ from: currentAddress });

    let auxArray = Array.from({ length: bidsLength.toNumber() }, (x, item) => item);

    auxArray.forEach(async (item, i) => {

      let userContract = await shastaMarketInstance.getBidFromIndex.call(i, { from: currentAddress });
      let userAddress = userContract[1];

      if (!checkedAddresses.includes(userAddress)) {

        checkedAddresses.push(userAddress);
        let ipfsHashRaw = await userContractInstance.getIpfsHashByAddress.call(userAddress, { from: currentAddress });
        let ipfsHash = web3.hexToUtf(ipfsHashRaw);

        let rawContent = await ipfs.cat(ipfsHash);
        let userData = JSON.parse(rawContent.toString("utf8"));

        for (let key in userData.consumerOffers) {
          if (userData.producerOffers.hasOwnProperty(key)) {
            consumerOffersList.push(userData.consumerOffers[key])
          }
        }
        this.setState(({
          consumerOffersList: consumerOffersList.sort((a, b) => a.energyPrice < b.energyPrice)
        }));
      }
    })

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

  addLocation = async () => {
    // Get the SharedMap.sol instance
    const { drizzle, drizzleState } = this.props;
    const userJson = _.cloneDeep(this.state.userJson);
    const web3 = drizzle.web3;
    const currentAddress = drizzleState.accounts[0];
    const drizzleUser = drizzle.contracts.User;
    const userContract = window.web3.eth.contract(drizzleUser.abi).at(drizzleUser.address);


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
      ammountkWh: this.state.ammountkWh
    }
    userJson.producerOffers.push(newProducerOffer);
    try {
      // Show loader spinner
      this.setState({ loader: true })
      // Upload to IPFS and receive response
      const ipfsResponse = await ipfs.add([Buffer.from(JSON.stringify(userJson))]);
      const ipfsHash = ipfsResponse[0].hash;
      console.log("ipfsHash: ", ipfsHash);
      console.log("props: ", userContract)

      console.log('gas params', newProducerOffer.energyPrice, ipfsHash, currentAddress);
      console.log(userContract)
      const rawEnergyPrice = web3.utils.toWei(newProducerOffer.energyPrice.toString(), 'ether');
      const rawIpfsHash = web3.utils.utf8ToHex(ipfsHash)
      const estimatedGas = await drizzleUser.methods.createOffer(rawEnergyPrice, rawIpfsHash).estimateGas({ from: currentAddress });
      console.log('estima', estimatedGas)
      await drizzleUser.methods.createOffer(rawEnergyPrice, rawIpfsHash).send({ gas: estimatedGas, from: currentAddress });

      this.setState({ chargers: userJson.producerOffers, userJson, chargerLatitude: "", chargerLongitude: "", chargerName: "", chargerStatus: "open", visible: false, energyPrice: 0 })
    } catch (err) {
      console.error(err)
    }
  }

  handleChangeAmmount = (e) => {
    let isNumeric = Number.isInteger(Number(e.target.value));
    let totalToPay = (isNumeric) ? Number(e.target.value) * this.state.energyPrice : 0;
    //Format number
    totalToPay = Math.round(totalToPay * 100) / 100;
    this.setState({
      [e.target.name]: e.target.value,
      totalToPay: totalToPay
    })
    console.log("state:", this.state)
  }

  render() {
    const { visible, providerAddress, providerSource, chargerLatitude, chargerLongitude, chargers, userJson } = this.state;
    const { drizzleState} = this.props;
    const currentAddress = drizzleState.accounts[0];
    let fieldErrors = []
    const providerSources = [{
      text: 'Solar',
      value: 'solar',
    },
    {
      text: 'Wind',
      value: 'wind',
    },
    {
      text: 'Gas',
      value: 'gas',
    },
    {
      text: 'Carbon',
      value: 'carbon',
    }]
    const consumerOffers = this.state.consumerOffersList.map((offer, index) => {
      if (offer.ethAddress === currentAddress) {
        return ''
      }
      return (
        <List.Item key={index}>
          <List.Content>
            <List.Header>
              <div style={{ float: 'left' }}>
                <div>{offer.firstName} {offer.lastName}</div>
                <div>Is buying {offer.fiatAmount} Shas at <b>{offer.energyPrice} Shas/kWh</b></div>
                <div style={{ color: "grey" }}>Source: {offer.source}</div>
              </div>

              <Button basic color='green' value={index} style={{ backgroundColor: 'white', float: 'right' }}>
                Sell your energy
              </Button>
            </List.Header>

          </List.Content>
        </List.Item>
      )
    });

    const producerOffers = userJson.producerOffers.map((offer, index) => {
      return (
        <List.Item key={index}>
          <List.Content>
            <List.Header>
              <div style={{ float: 'left' }}>
                <div>{offer.firstName} {offer.lastName}</div>
                <div>You are selling {offer.ammountkWh} kWh at <b>{offer.energyPrice} Shas/kWh</b></div>
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
          <Menu.Item>
            <h3 style={{ position: 'relative' }}>New provider location</h3>
          </Menu.Item>
          <Menu.Item>
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
                  name='ammountkWh'
                  value={this.state.ammountkWh}
                  label={{ basic: true, content: 'kWh/month' }}
                  labelPosition='right'
                  onChange={e => this.handleChangeAmmount(e)} />
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
              <Button disabled={!!fieldErrors.length} onClick={this.addLocation} type='submit'>Submit</Button>
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
        <div style={{ padding: 15 }}> <h3>Sell energy: </h3></div>
        <Segment style={{ width: '65%' }}>
          <List divided relaxed>
            {consumerOffers}
          </List>
        </Segment>
        <p></p>
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