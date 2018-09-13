import React, { Component } from 'react';
import { Button, Grid, Sidebar, Menu, Progress, Form, Checkbox, Dropdown, Card, Message } from 'semantic-ui-react'
import './Consumer.css';
import axios from 'axios';
let checkedAddresses = [];

class Consumer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      visible: false,
      percent: 0,
      firstName: '',
      lastName: '',
      country: '',
      dropdownValue: '',
      ipfsHash: '',
      ipfsFirstName: '',
      ipfsAddress: '',
      fiatAmount: '',
      energyPrice: '',
      dropdownSource: '',
      description: '',
      address: '',
      producersOffersList: []
    }

    this.createConsumerOffer = this.createConsumerOffer.bind(this);
  }

  async componentDidMount() {
    this.getProducerOffers();
  }
  toggle = () => this.setState({ percent: this.state.percent === 0 ? 100 : 0 })

  handleButtonClick = () => this.setState({ visible: !this.state.visible })

  handleSidebarHide = () => this.setState({ visible: false })


  async createConsumerOffer() {

    var userJson = this.props.userJson;

    console.log("marketer", this.state.dropdownMarketer);
    var newOffer = {
      date: Date.now(),
      firstName: userJson.organization.firstName,
      lastName: userJson.organization.lastName,
      country: userJson.organization.country,
      address: this.state.address,
      energyPrice: this.state.energyPrice,
      fiatAmount: this.state.fiatAmount,
      source: this.state.dropdownSource,
      description: this.state.description,
      pendingOffer: true,
      ethAddress: this.props.address
    }

    console.log("New contract", newOffer);

    //Add the new contract to the profile

    userJson.consumerOffers.push(newOffer);
    console.log("Info to update: ", userJson);

    var contract = this.props.contract;
    var address = this.props.address;
    var url = 'https://min-api.cryptocompare.com/data/price?fsym=EUR&tsyms=ETH';

    let res = await this.props.ipfs.add([Buffer.from(JSON.stringify(userJson))]);

    var ipfsHash = res[0].hash;

    console.log("ipfs hash: ", ipfsHash);

    //Get the exact value in ethers
    let result = await axios.get(url);

    //Set the conversion from EUR to WEI
    var value = this.props.web3.toWei(result.data.ETH * newOffer.fiatAmount);
    value = Math.round(value);
    console.log("value: ", value);
    var self = this;

    //Call the transaction
    const contractInstance = await contract.deployed();

    let success = await contractInstance.createBid(self.state.fiatAmount, ipfsHash, { gas: 400000, from: address, value: value });
    if (success) {
      console.log('Updated user ' + userJson.organization.name + ' on ethereum!, and bid correctly created');

    } else {
      console.log('error updating user on ethereum.');
    }

  }

  async getProducerOffers() {

    const shastaMarketInstance = await this.props.shastaMarketContract.deployed();
    const userContractInstance = await this.props.userContract.deployed();

    // Offers
    let producersOffersList = [];
    const offersLength = await shastaMarketInstance.getOffersLength.call({ from:this.props.address });
    console.log("Number of offers: ", offersLength.toNumber())
    let auxArray = Array.from({ length: offersLength.toNumber() }, (x, item) => item);

    auxArray.forEach(async (item, i) => {

      let userContract = await shastaMarketInstance.getOfferFromIndex.call(i, { from: this.props.address });
      let userAddress = userContract[1];
      if (!checkedAddresses.includes(userAddress)) {

        checkedAddresses.push(userAddress);
        let ipfsHashRaw = await userContractInstance.getIpfsHashByAddress.call(userAddress, { from: this.props.address });
        let ipfsHash = this.props.web3.toAscii(ipfsHashRaw);
        console.log("ipfs rec: ", ipfsHash);

        let rawContent = await this.props.ipfs.cat(ipfsHash);
        let userData = JSON.parse(rawContent.toString("utf8"));
        
        for (let key in userData.producerOffers) {
          producersOffersList.push(userData.producerOffers[key])
        }
        this.setState(({
          producersOffersList: producersOffersList.sort((a, b) => a.energyPrice < b.energyPrice)
        }));      }
    })

  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleChangeDropdownSource = (e) => {
    this.setState({
      dropdownSource: e.target.textContent
    })
  }

  render() {

    const { visible } = this.state

    const sources = [
      {
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
      }
    ]

    const consumerOffers = this.props.userJson.consumerOffers.map((contract) => {
      return (
        <Card fluid style={{ maxWidth: '800px' }} color='purple'>
          <Card.Content>
            <Card.Header>
              {contract.fiatAmount}€ at {contract.energyPrice}€/kWh
            </Card.Header>
            <Card.Description>
              Ethereum account: {this.props.address}
            </Card.Description>
            <Card.Description>
              Country: {contract.country}
            </Card.Description>
            <Card.Description>
              Address: {contract.address}
            </Card.Description>            
          </Card.Content>
          <Card.Content extra>
          <p>Source: {contract.source}</p>
            <Button basic color='purple'>
              Cancel Offer
              </Button>
          </Card.Content>
        </Card>
      );
    });

    const producerOffers = this.state.producersOffersList.map((contract) => {
      if (this.props.address == contract.ethAddress) {
        return '';
      }
      return (
        <Card fluid style={{ maxWidth: '800px' }} color='purple'>
          <Card.Content>
            <Card.Header>
              {contract.fiatAmount}€ at {contract.energyPrice}€/kWh
            </Card.Header>
            <Card.Description>
              Ethereum account: {contract.ethAddress}
            </Card.Description>
            <Card.Description>
              Address: {contract.address}
            </Card.Description>            
          </Card.Content>
          <Card.Content extra>
          <p>Source: {contract.providerSource}</p>
            <Button basic color='purple'>
              Buy Energy
              </Button>
          </Card.Content>
        </Card>
      );
    });
    return (
      <div>
        <div>
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
              <h3 style={{ position: 'relative' }}>New Contract</h3>
            </Menu.Item>
            <Menu.Item>
              <Form>
                <Form.Field>
                  <label>Address</label>
                  <input placeholder='Address'
                    name='address'
                    value={this.state.Address}
                    onChange={e => this.handleChange(e)} />
                </Form.Field>
                <Form.Field>
                  <label>Description</label>
                  <input placeholder='description'
                    name='description'
                    value={this.state.description}
                    onChange={e => this.handleChange(e)} />
                </Form.Field>
                <Form.Field>
                  <label> Energy Price (€/kWh)</label>
                  <input placeholder='The price of the energy to buy'
                    name='energyPrice'
                    value={this.state.energyPrice}
                    onChange={e => this.handleChange(e)} />
                </Form.Field>
                <Form.Field>
                  <label>Amount (€)</label>
                  <input placeholder='Currency amount to buy'
                    name='fiatAmount'
                    value={this.state.fiatAmount}
                    onChange={e => this.handleChange(e)} />
                </Form.Field>
                <div style={{ padding: '20' }}>
                  <label>Source</label>
                  <Dropdown placeholder='Energy Source' name='dropdownValue' fluid selection options={sources} onChange={this.handleChangeDropdownSource} />
                </div>
                <Message icon>
                  <Message.Content>
                    {this.props.address}
                  </Message.Content>
                </Message>
                <Form.Field>
                  <Checkbox label='I agree to the Terms and Conditions' />
                </Form.Field>
                <Button onClick={this.createConsumerOffer} type='submit'>Submit</Button>
              </Form>
            </Menu.Item>
            <Menu.Item>
              <Progress percent={this.state.percent} color='violet' active></Progress>
            </Menu.Item>
            <h3>Powered by <a href='https://district0x.io/'>District0x</a></h3>
          </Sidebar>
        </div>
        <div style={{ marginLeft: 400, marginTop: 20 }}>
          <Grid>
            <Grid.Row columns={3}>
              <Grid.Column><h3>Your Buy Offers: </h3></Grid.Column>
              <Grid.Column></Grid.Column>
              <Grid.Column>
                <Button onClick={this.handleButtonClick}>Start a Contract</Button>
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <Card.Group>
            {consumerOffers}
          </Card.Group>
          <h3>Buy energy:</h3>
          <Card.Group>
            {producerOffers}
          </Card.Group>
        </div>
      </div>
    );
  }
}
export default Consumer
