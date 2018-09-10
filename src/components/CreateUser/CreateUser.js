import React, { Component } from 'react';
import { Button, Form, Grid, Image, Input } from 'semantic-ui-react'
import Router from "../../routing.js";

import './CreateUser.css';
import shasta from './shasta.png'


class CreateUser extends Component {

  constructor(props) {
    super(props);

    this.state = {
      username: '',
      isLoged: false,
      userJson: ''
    }
    // This binding is necessary to make `this` work in the callback
    this.createUser = this.createUser.bind(this);
    this.updateInput = this.updateInput.bind(this);
  }

  //It should save a json file to ipfs and save the hash to the smart contract
  async createUser() {

    console.log("Creating user " + this.state.username);

    var username = this.state.username;
    var userJson = {
      username: username,
      consumerContracts: [],
      producerContracts: [],
      userInfo: {}
    }
    this.setState = ({ userJson });
    var ipfsHash = '';

    const res = await this.props.ipfs.add([Buffer.from(JSON.stringify(userJson))]);

    ipfsHash = res[0].hash;
    console.log("ipfs hash: ", ipfsHash);
    const contractInstance = await this.props.userContract.deployed();


    const success = await contractInstance.createUser(username, ipfsHash, { gas: 400000, from: this.props.account });
    if (success) {
      console.log("self:", self)
      console.log('created user ' + username + ' on ethereum!');
      //this.setState({ isLoged: true })
    } else {
      console.log('error creating user on ethereum. Maybe the user name already exists or you already have a user.');
    }
  }

  updateInput(event) {
    this.setState({ username: event.target.value })
  }

  render() {
    console.log("logged: ", this.state.isLoged)
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
                    <Form>
                      <Form.Field style={{ marginRight: '450px' }}>
                        <label>Username</label>
                        <Input id="usernameInput" placeholder='Username' onChange={this.updateInput} />
                      </Form.Field>
                      <Button type='submit' id="createOrgBtn" onClick={this.createUser}>Create a new organization</Button>
                    </Form>
                  </Grid.Column>
                  <Grid.Column style={{ marginTop: '100px' }}>
                    <h2>{this.props.status}</h2>
                  </Grid.Column>
                  <Grid.Column></Grid.Column>
                </Grid.Row>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      );

    }
  }
}

export default CreateUser;
