import React, { Component } from 'react';
import { Button, Form, Grid, Image, Input, Transition } from 'semantic-ui-react'
import Router from "../../routing.js";
import { CountryDropdown } from 'react-country-region-selector';

import './CreateUser.css';
import shasta from './logo-shasta-02.png'
var organizationData = {}

class CreateUser extends Component {

  constructor(props) {
    super(props);

    this.state = {
      organization: {},
      isLoged: false,
      userJson: '',
      formVisible: false
    }
    // This binding is necessary to make `this` work in the callback
    this.createUser = this.createUser.bind(this);
    this.handleOrgNameChange = this.handleOrgNameChange.bind(this);
    this.handleFNameChange = this.handleFNameChange.bind(this);
    this.handleLNameChange = this.handleLNameChange.bind(this);
  }

  //It should save a json file to ipfs and save the hash to the smart contract
  async createUser() {

    var userJson = {
      organization: this.state.organization,
      consumerOffers: [],
      producerOffers: []
    }

    //Set address
    userJson.organization.address = this.props.account;
    var organizationName = userJson.organization.name;

    var ipfsHash = '';

    const res = await this.props.ipfs.add([Buffer.from(JSON.stringify(userJson))]);

    ipfsHash = res[0].hash;
    const contractInstance = await this.props.userContract.deployed();


    const success = await contractInstance.createUser(organizationName, ipfsHash, { gas: 400000, from: this.props.account });
    if (success) {
      //this.setState({ isLoged: true })
    } else {
      console.log('error creating user on ethereum. Maybe the user name already exists or you already have a user.');
    }
  }

  toggleVisibility = () => this.setState({ formVisible: !this.state.formVisible })

  handleOrgNameChange(event) {
    organizationData.name = event.target.value;
    this.setState({ organization: organizationData })
  }
  handleFNameChange(event) {
    organizationData.firstName = event.target.value;
    this.setState({ organization: organizationData })
  }
  handleLNameChange(event) {
    organizationData.lastName = event.target.value;
    this.setState({ organization: organizationData })
  }
  selectCountry(val) {
    organizationData.country = val;
    this.setState({ country: val });
  }
  render() {

    if (this.state.isLoged) {

      return (
        <div>
          <Router
            web3={this.props.web3}
            address={this.props.account}
            balance={this.props.balance}
            username={this.state.username}
            ipfs={this.state.ipfs}
            contract={this.props.userContract}
            userJson={this.state.userJson}
          >
          </Router>
        </div>
      )
    } else {

      return (
        <div>
          <Grid>
            <Grid.Row columns={2}>
              <Grid.Column>
                <Image className='logo-image' src={shasta} />
              </Grid.Column>
              <Grid.Column style={{ marginTop: '10%' }}>
                <Grid.Row>
                  <Grid.Column>
                    <h1> Welcome to Shasta </h1>
                  </Grid.Column>
                  <Grid.Column style={{ marginTop: '20px' }}>
                    <Transition visible={!this.state.formVisible} animation='scale' duration={500}>
                      <Button type='submit' id="createOrgBtn" onClick={this.toggleVisibility}>Create a new organization</Button>
                    </Transition>
                    <Transition visible={this.state.formVisible} animation='scale' duration={500}>
                      <Form>
                        <Form.Field style={{ marginRight: '450px' }}>
                          <label>Organization Name</label>
                          <Input placeholder='Organization Name' onChange={this.handleOrgNameChange} />
                          <label>First Name</label>
                          <Input placeholder='First Name' onChange={this.handleFNameChange} />
                          <label>Last Name</label>
                          <Input placeholder='Last Name' onChange={this.handleLNameChange} />
                          <label>Country</label>
                          <CountryDropdown
                            value={this.state.country}
                            onChange={(val) => this.selectCountry(val)} />
                        </Form.Field>
                        <Button type='submit' id="createOrgBtn" onClick={this.createUser}>Create a new organization</Button>
                      </Form>
                    </Transition>
                  </Grid.Column>
                  <Grid.Column style={{ marginTop: '100px' }}>
                    <h2>{this.props.status}</h2>
                  </Grid.Column>
                  <Grid.Column></Grid.Column>
                </Grid.Row>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div >
      );

    }
  }
}

export default CreateUser;
