import React, { Component } from 'react';
import { Button, Grid, Sidebar, Menu, Form, Checkbox, Dropdown, Card, Message, Input } from 'semantic-ui-react'
import './Consumer.css';
import axios from 'axios';
import ipfs from '../../ipfs'
import withDrizzleContext from '../../utils/withDrizzleContext'
import { connect } from 'react-redux';

let checkedAddresses = [];

class Consumer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      userJson: {
        consumerOffers: [],
        producerOffers: []
      },
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
      dropdownSource: '',
      address: '',
      producersOffersList: [],
      ammountkWh: '',
      energyPrice: 0.132,
      totalToPay: 0
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
    const {drizzle, drizzleState, user} = this.props;
    const web3 = drizzle.web3;
    const currentAccount = drizzleState.accounts[0];
    const rawOrgName = web3.utils.utf8ToHex(user.organization);
    const rawHash = await drizzle.contracts.User.methods.getIpfsHashByUsername(rawOrgName).call({from: currentAccount});
    const userIpfsHash = web3.utils.hexToUtf8(rawHash);
    const rawJson = await ipfs.cat(userIpfsHash);
    const userJson = JSON.parse(rawJson);
    this.setState({
      userJson
    })

    var newOffer = {
      date: Date.now(),
      firstName: userJson.organization.firstName,
      lastName: userJson.organization.lastName,
      country: userJson.organization.country,
      address: this.state.address,
      ammountkWh: this.state.ammountkWh,
      energyPrice: this.state.energyPrice,
      fiatAmount: this.state.totalToPay,
      source: this.state.dropdownSource,
      pendingOffer: true,
      ethAddress: currentAccount
    }

    console.log("New contract", newOffer);

    //Add the new contract to the profile

    userJson.consumerOffers.push(newOffer);
    console.log("Info to update: ", userJson);

    const contract = this.props.contract;
    const address = currentAccount;
    const url = 'https://min-api.cryptocompare.com/data/price?fsym=EUR&tsyms=ETH';

    const res = await this.props.ipfs.add([Buffer.from(JSON.stringify(userJson))]);

    const ipfsHash = res[0].hash;

    console.log("ipfs hash: ", ipfsHash);

    //Get the exact value in ethers
    let result = await axios.get(url);

    //Set the conversion from EUR to WEI
    let value = this.props.web3.toWei(result.data.ETH * newOffer.fiatAmount);
    value = Math.round(value);
    console.log("value: ", value);

    //Call the transaction
    const contractInstance = drizzle.contracts.User;

    const success = await contractInstance.methods.createBid(self.state.fiatAmount, ipfsHash).send({ gas: 400000, from: address, value: value });
    if (success) {
      console.log('Updated user ' + userJson.organization.name + ' on ethereum!, and bid correctly created');

    } else {
      console.log('error updating user on ethereum.');
    }

  }

  async getProducerOffers() {
    const {drizzle, drizzleState, user }= this.props;
    const web3 = drizzle.web3;
    const currentAccount = drizzleState.accounts[0];
    const shastaMarketInstance = drizzle.contracts.ShastaMarket;
    const userContractInstance = drizzle.contracts.User;
    

    // Offers
    let producersOffersList = [];
    const offersLength = await shastaMarketInstance.methods.getOffersLength().call({ from: currentAccount });
    console.log("Number of offers: ", Number.parseInt(offersLength))
    let auxArray = Array.from({ length: Number.parseInt(offersLength) }, (x, item) => item);

    auxArray.forEach(async (item, i) => {

      let userContract = await shastaMarketInstance.methods.getOfferFromIndex.call(i, { from: currentAccount });
      let userAddress = userContract[1];
      if (!checkedAddresses.includes(userAddress)) {

        checkedAddresses.push(userAddress);
        let ipfsHashRaw = await userContractInstance.methods.getIpfsHashByAddress.call(userAddress, { from: currentAccount });
        let ipfsHash = web3.hexToUtf8(ipfsHashRaw);
        console.log("ipfs rec: ", ipfsHash);

        let rawContent = await ipfs.cat(ipfsHash);
        let userData = JSON.parse(rawContent.toString("utf8"));

        for (let key in userData.producerOffers) {
          if (userData.producerOffers.hasOwnProperty(key)) {
            producersOffersList.push(userData.producerOffers[key])
          }
        }
        this.setState(({
          producersOffersList: producersOffersList.sort((a, b) => a.energyPrice < b.energyPrice)
        }));
      }
    })

  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
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
  handleChangeDropdownSource = (e) => {
    this.setState({
      dropdownSource: e.target.textContent
    })
  }

  render() {
    const {drizzleState} = this.props;
    const currentAccount = drizzleState.accounts[0];
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

    const consumerOffers = this.state.userJson.consumerOffers.map((contract) => {
      return (
        <Card fluid style={{ maxWidth: '800px' }} color='purple'>
          <Card.Content>
            <Card.Header>
              {contract.fiatAmount} Shas at {contract.energyPrice} Shas/kWh
            </Card.Header>
            <Card.Description>
              Ethereum account: {currentAccount}
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
      if (currentAccount == contract.ethAddress) {
        return '';
      }
      return (
        <Card fluid style={{ maxWidth: '800px' }} color='purple'>
          <Card.Content>
            <Card.Header>
              {contract.fiatAmount} Shas at {contract.energyPrice} Shas/kWh
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
                  <label style={{ float: 'left', padding: 5 }}> Energy Price: {this.state.energyPrice} (Shas/kWh)</label>
                  <Message icon>
                    <Message.Content>
                      The current price is decided every day through the governance system. Want to participate? Click here
                    </Message.Content>
                  </Message>
                </Form.Field>
                <Form.Field>
                  <label >Amount kWh you want to buy for a month:</label>
                  <Input placeholder='Amount'
                    name='ammountkWh'
                    value={this.state.ammountkWh}
                    label={{ basic: true, content: 'kWh/month' }}
                    labelPosition='right'
                    onChange={e => this.handleChangeAmmount(e)} />
                </Form.Field>
                <Form.Field>
                  <label>Source</label>
                  <Dropdown placeholder='Energy Source' name='dropdownValue' fluid selection options={sources} onChange={this.handleChangeDropdownSource} />
                </Form.Field>                <Message icon>
                  <Message.Content>
                    <p>1 Shas = 1$</p>
                    Total shas to pay: {this.state.totalToPay}
                  </Message.Content>
                </Message>
                <Form.Field>
                  <Checkbox label='I agree to the Terms and Conditions' />
                </Form.Field>
                <Button onClick={this.createConsumerOffer} type='submit'>Submit</Button>
              </Form>
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

function mapStateToProps(state, props) { return { user: state.userReducer } }

export default withDrizzleContext(
  connect(
    mapStateToProps,
  )(Consumer)
);