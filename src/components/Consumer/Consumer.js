import React, { Component } from 'react';
import { Button, Grid, Sidebar, Menu, Progress, Form, Checkbox, Dropdown, Card, Message } from 'semantic-ui-react'
import './Consumer.css';
import axios from 'axios';


const marketers = [
  {
    key: 0,
    text: 'HolaLuz',
    value: 0,
    price: 0.123,
    description: "0.123 €/kWh",        
  }, {
    key: 1,
    text: 'SomEnergia',
    value: 1,
    price: 0.127,
    description: "0.127 €/kWh"
  }, {
    key: 2,
    text: 'Gas Natural',
    value: 2,
    price: 0.141,
    description: "0.141 €/kWh"
  },{
    key: 3,
    text: 'Respira',
    value: 3,
    price: 0.132,
    description: "0.132 €/kWh"
  }
]

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
      dropdownMarketer: '',
      dropdownSource: '',
      description: '',
      address: ''
    }

    this.createConsumerContract = this.createConsumerContract.bind(this);
  }

  toggle = () => this.setState({ percent: this.state.percent === 0 ? 100 : 0 })

  handleButtonClick = () => this.setState({ visible: !this.state.visible })

  handleSidebarHide = () => this.setState({ visible: false })


  async createConsumerContract() {

    var userJson = this.props.userJson;

    console.log("marketer", this.state.dropdownMarketer);
    var newContract = {
      value: this.state.dropdownMarketer.price,
      date: Date.now(),
      firstName: userJson.organization.firstName,
      lastName: userJson.organization.lastName,
      country: userJson.organization.country,
      address: this.state.address,
      marketer: this.state.dropdownMarketer.text,
      source: this.state.dropdownSource,
      description: this.state.description
    }
    console.log("New contract", newContract);

    //Add the new contract to the profile

    userJson.consumerContracts.push(newContract);
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
    var value = this.props.web3.toWei(result.data.ETH * newContract.value);
    value = Math.round(value);
    console.log("value: ", value);
    var self = this;

    //Call the transaction
    const contractInstance = await contract.deployed();
  
    let success = await contractInstance.createBid(self.state.dropdownValue, ipfsHash, { gas: 400000, from: address, value: value });
    if (success) {
      console.log('Updated user ' + userJson.organization.name + ' on ethereum!, and bid correctly created');

    } else {
      console.log('error updating user on ethereum.');
    }

  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleChangeDropdown = (e) => {
    this.setState({
      dropdownValue: e.target.textContent.slice(0, -1)
    })
  }

  handleChangeDropdownMarketer = (e, data) => {   
    this.setState({
      dropdownMarketer: marketers[data.value]
    })
    console.log("state", this.state);
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
    console.log("consumerContracts", this.props.userJson.consumerContracts);
    const consumerContracts = this.props.userJson.consumerContracts.map((contract) => {
      return (
        <Card fluid style={{ maxWidth: '800px' }} color='purple'>
          <Card.Content>
            <Card.Header>
              {contract.marketer}
            </Card.Header>
            <Card.Description>
              Ethereum account: {this.props.address}
            </Card.Description>
            <Card.Description>
              Country: {contract.country}
            </Card.Description>
          </Card.Content>
          <Card.Content extra>
            <h3 style={{color: 'black'}}>Consumer:</h3>
            <p>Name: {contract.firstName} {contract.lastName}</p>
            <p>{contract.country}</p>
            <p>Address: {contract.address}</p>
            <h3>{contract.value} €/kWh</h3>
            <Button basic color='purple'>
              Cancel contract
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
                <div style={{ padding: '20' }}>
                  <Dropdown placeholder='Energy Source' name='dropdownValue' fluid selection options={sources} onChange={this.handleChangeDropdownSource} />
                </div>
                <div style={{ padding: '20' }}>
                  <Dropdown placeholder='Choose marketer' name='dropdownMarketer' fluid selection options={marketers} onChange={this.handleChangeDropdownMarketer} />
                </div>
                <Message icon>
                  <Message.Content>
                    {this.props.address}
                  </Message.Content>
                </Message>
                <Form.Field>
                  <Checkbox label='I agree to the Terms and Conditions' />
                </Form.Field>
                <Button onClick={this.createConsumerContract} type='submit'>Submit</Button>
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
              <Grid.Column><h3>Your contract: </h3></Grid.Column>
              <Grid.Column></Grid.Column>
              <Grid.Column>
                <Button onClick={this.handleButtonClick}>Start a Contract</Button>
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <Card.Group>
            {consumerContracts}
          </Card.Group>
        </div>
      </div>
    );
  }
}
export default Consumer
