import React, { Component } from 'react';
import { Button, Form, Sidebar, Menu, Dropdown, Message, List, Segment, Input } from 'semantic-ui-react';
import SharedMap from './SharedMap';
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
    organizationData: this.props.userJson,
    consumerOffersList: [],
    energyPrice: 0.112,
    fiatAmount: '',
    totalToPay: 0,
    ammountkWh: 0
  }

  // Add Web3 event watchers at ComponentDidMount lifecycle,
  // and load the current charger locations
  async componentDidMount() {
    // Get the SharedMap.sol instance
    try {

      this.setState({
        chargers: this.props.userJson.producerOffers
      });
      this.getConsumerOffers();
    } catch (err) {
      console.log(err);
    }

  }

  async getConsumerOffers() {

    const shastaMarketInstance = await this.props.shastaMarketContract.deployed();
    const userContractInstance = await this.props.userContract.deployed();

    // Bids
    let consumerOffersList = [];
    //const bidIndexes = await shastaMarketInstance.getBidsIndexesFromAddress.call({ from: self.props.address });
    const bidsLength = await shastaMarketInstance.getBidsLength.call({ from: this.props.address });

    let auxArray = Array.from({ length: bidsLength.toNumber() }, (x, item) => item);

    auxArray.forEach(async (item, i) => {

      let userContract = await shastaMarketInstance.getBidFromIndex.call(i, { from: this.props.address });
      let userAddress = userContract[1];

      if (!checkedAddresses.includes(userAddress)) {

        checkedAddresses.push(userAddress);
        let ipfsHashRaw = await userContractInstance.getIpfsHashByAddress.call(userAddress, { from: this.props.address });
        let ipfsHash = this.props.web3.toAscii(ipfsHashRaw);
        console.log("ipfs rec: ", ipfsHash);

        let rawContent = await this.props.ipfs.cat(ipfsHash);
        let userData = JSON.parse(rawContent.toString("utf8"));

        for (let key in userData.consumerOffers) {
          consumerOffersList.push(userData.consumerOffers[key])
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
    const userContract = await this.props.userContract.deployed();
    const currentAddress = this.props.address;
    // Generate the location object, will be saved later in JSON.
    const newProducerOffer = {
      chargerName: this.state.organizationData.organization.name,
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
    this.props.userJson.producerOffers.push(newProducerOffer);
    try {
      // Show loader spinner
      this.setState({ loader: true })
      // Upload to IPFS and receive response
      const ipfsResponse = await this.props.ipfs.add([Buffer.from(JSON.stringify(this.props.userJson))]);
      const ipfsHash = ipfsResponse[0].hash;
      console.log("ipfsHash: ", ipfsHash);
      console.log("props: ", userContract)

      const estimatedGas = await userContract.createOffer.estimateGas(newProducerOffer.energyPrice, ipfsHash, { from: currentAddress });
      await userContract.createOffer(newProducerOffer.energyPrice, ipfsHash, { gas: estimatedGas, from: currentAddress })

      this.setState({ chargerLatitude: "", chargerLongitude: "", chargerName: "", chargerStatus: "open", visible: false, energyPrice: 0 })
    } catch (err) {
      console.error(err)
    }
  }

  handleChangeAmmount = (e) => {
    let isNumeric = Number.isInteger(parseInt(e.target.value));
    let totalToPay = (isNumeric) ? parseInt(e.target.value) * this.state.energyPrice : 0;
    //Format number
    totalToPay = Math.round(totalToPay * 100)/100;
    this.setState({
      [e.target.name]: e.target.value,
      totalToPay: totalToPay
    })
    console.log("state:", this.state)
  }

  render() {
    const { visible, energyPrice, providerAddress, providerSource, fiatAmount, chargerLatitude, chargerLongitude, chargers } = this.state;
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
      if (offer.ethAddress == this.props.address) {
        return ''
      }
      return (
        <List.Item key={index}>
          <List.Content>
            <List.Header>
              <div style={{ float: 'left' }}>
                <div>{offer.firstName} {offer.lastName}</div>
                <div>Is buying {offer.fiatAmount}€ at <b>{offer.energyPrice} €/kWh</b></div>
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

    const producerOffers = this.props.userJson.producerOffers.map((offer, index) => {
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
    if (this.state.totalToPay == 0) {
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

export default Producer;
