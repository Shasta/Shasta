import React, { Component } from 'react';
import { Button, Grid, Sidebar, Menu, Progress, Form, Checkbox, Dropdown, Card, Message, Feed } from 'semantic-ui-react'
import './Market.css';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


class Market extends Component {
  constructor(props) {
    super(props)

    this.state = {
      visible: false,
      percent: 0,
      firstName: '',
      lastName: '',
      address: '',
      zipCode: '',
      dropdownValue: '',
      ipfsHash: '',
      ipfsFirstName: '',
      ipfsAddress: '',
      dropdownMarketer: ''
    }

    this.updateUser = this.updateUser.bind(this);
  }


  toggle = () => this.setState({ percent: this.state.percent === 0 ? 100 : 0 })

  handleButtonClick = () => this.setState({ visible: !this.state.visible })

  handleSidebarHide = () => this.setState({ visible: false })


  updateUser() {

    var userJson = {
      username: this.props.username,
      contracts: this.props.userJson.contracts
    }

    var newContract = {
      value: this.state.dropdownValue,
      date: Date.now(),
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      address: this.state.address,
      zipCode: this.state.zipCode,
      marketer: this.state.dropdownMarketer
    }
    console.log("New contract", newContract);

    //Add the new contract to the profile

    userJson.contracts.push(newContract);
    console.log("Info to update: ", userJson);

    var contract = this.props.contract;
    var address = this.props.address;
    var url = 'https://min-api.cryptocompare.com/data/price?fsym=EUR&tsyms=ETH';

    this.props.ipfs.add([Buffer.from(JSON.stringify(userJson))], (err, res) => {

      if (err) throw err;

      var ipfsHash = res[0].hash;

      console.log("ipfs hash: ", ipfsHash);

      //Get the exact value in ethers
      axios.get(url).then(res => {

        //Set te conversion from EUR to WEI
        console.log("ETH", res.data.ETH);
        console.log("toPay", newContract.value);

        var value = this.props.web3.toWei(res.data.ETH * newContract.value);

        //Call the transaction
        contract.deployed().then(function (contractInstance) {
          contractInstance.updateUser.sendTransaction(ipfsHash, { gas: 400000, from: address, value: value }).then(function (success) {
            if (success) {
              console.log('Updated user ' + userJson.username + ' on ethereum!');

            } else {
              console.log('error updateing user on ethereum.');
            }
          }).catch(function (e) {
            console.log('error creating user:', userJson.username, ':', e);
          });

        });
      });
    });

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

  handleChangeDropdownMarketer = (e) => {
    this.setState({
      dropdownMarketer: e.target.textContent
    })
  }
  render() {

    const { visible } = this.state

    const prices = [
      {
        text: '20$',
        value: '20',
      },
      {
        text: '40$',
        value: '40',
      },
      {
        text: '60$',
        value: '60',
      }
    ]

    const marketers = [
      {
        text:'HolaLuz',
        value:'HolaLuz'
      },{
        text: 'SomEnergia',
        value: 'SomEnergia'
      },{
        text:'Gas Natural',
        value: 'Gas Natural'
      }
    ]
    const contracts = this.props.userJson.contracts.map((contract) => {
      return (
        <Card fluid style={{ maxWidth: '500px' }} color='purple'>
          <Card.Content>
            <Card.Header>
              {contract.marketer}
            </Card.Header>
            <Card.Description>
              {this.props.address}
            </Card.Description>
            <Feed>
              <Feed.Event>
                <Feed.Label><FontAwesomeIcon icon="home"></FontAwesomeIcon></Feed.Label>
                  <Feed.Content>
                    <Feed.Date content='Street address' />
                    <Feed.Summary>
                      {this.props.ipfsAddress}
                    </Feed.Summary>
                  </Feed.Content>
                </Feed.Event>
              </Feed>
            </Card.Content>
            <Card.Content extra>
              <h3>{contract.value} €</h3>
              <Button basic color='purple'>
                More Info
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
                    <label>First Name</label>
                    <input placeholder='First Name'
                      name='firstName'
                      value={this.state.firstName}
                      onChange={e => this.handleChange(e)} />
                  </Form.Field>
                  <Form.Field>
                    <label>Last Name</label>
                    <input placeholder='Last Name'
                      name='lastName'
                      value={this.state.lastName}
                      onChange={e => this.handleChange(e)} />
                  </Form.Field>
                  <Form.Field>
                    <label>Address</label>
                    <input placeholder='Address'
                      name='address'
                      value={this.state.address}
                      onChange={e => this.handleChange(e)} />
                  </Form.Field>
                  <Form.Field>
                    <label>zip code</label>
                    <input placeholder='zip code'
                      name='zipCode'
                      value={this.state.zipCode}
                      onChange={e => this.handleChange(e)} />
                  </Form.Field>
                  <div style={{ padding: '20' }}>
                    <Dropdown placeholder='Choose price' name='dropdownValue' fluid selection options={prices} onChange={e => this.handleChangeDropdown(e)} />
                  </div>
                  <div style={{ padding: '20' }}>
                    <Dropdown placeholder='Choose provider' name='dropdownProvider' fluid selection options={marketers} onChange={e => this.handleChangeDropdownMarketer(e)} />
                  </div>
                  <Message icon>
                    <Message.Content>
                      {this.props.address}
                    </Message.Content>
                  </Message>
                  <Form.Field>
                    <Checkbox label='I agree to the Terms and Conditions' />
                  </Form.Field>
                  <Button onClick={this.updateUser} type='submit'>Submit</Button>
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
                <Grid.Column></Grid.Column>
                <Grid.Column></Grid.Column>
                <Grid.Column>
                  <Button onClick={this.handleButtonClick}>Start a Contract</Button>
                </Grid.Column>
              </Grid.Row>
            </Grid>
            <Card.Group>
              {contracts}
            </Card.Group>
          </div>
        </div>
      );
    }
  }

  export default Market
