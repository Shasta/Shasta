import React, { Component } from 'react';
import { Grid, Transition } from 'semantic-ui-react'
import Router from "../../routing.js";
import Requeriments from  './Requeriments';
import Registry from './Registry';

import './CreateUser.css';
import shasta from './shasta.png'
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

    console.log("Creating user " + this.state.organization.name);

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
    console.log("ipfs hash: ", ipfsHash);
    const contractInstance = await this.props.userContract.deployed();


    const success = await contractInstance.createUser(organizationName, ipfsHash, { gas: 400000, from: this.props.account });
    if (success) {
      console.log("self:", self)
      console.log('created user ' + organizationName + ' on ethereum!');
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
    console.log("val: ", val);
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
            <Grid.Row centered columns={2}>
              <Grid.Column mobile={12} tablet={6} computer={6}>
                <Requeriments />
              </Grid.Column>
              <Grid.Column  mobile={12} tablet={6} computer={6} style={{ marginTop: '5%' }}>
                <Registry />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div >
      );

    }
  }
}

export default CreateUser;
