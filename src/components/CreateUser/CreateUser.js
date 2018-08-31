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
      isLoged: false
    }
    // This binding is necessary to make `this` work in the callback
    this.createUser = this.createUser.bind(this);
    this.updateInput = this.updateInput.bind(this);
    this.updateLoginStatus = this.updateLoginStatus.bind(this);
  }

  //It should save a json file to ipfs and save the hash to the smart contract
  createUser() {

    console.log("Creating user " + this.state.username);

    var username = this.state.username;
    var userJson = {
      username: username,
      contracts: []
    }

    var ipfsHash = '';
    var contract = this.props.userContract;
    var account = this.props.account;

    this.props.ipfs.add([Buffer.from(JSON.stringify(userJson))], function (err, res) {

      if (err) throw err;
      ipfsHash = res[0].hash;
      console.log("ipfs hash: ", ipfsHash);

      contract.deployed().then(function (contractInstance) {
        contractInstance.createUser(username, ipfsHash, { gas: 400000, from: account }).then(function (success) {
          if (success) {
            console.log('created user ' + username + ' on ethereum!');
            this.updateLoginStatus(true);
          } else {
            console.log('error creating user on ethereum. Maybe the user name already exists or you already have a user.');
          }
        }).catch(function (e) {
          console.log('error creating user:', username, ':', e);
        });

      });
    });

  }

  updateLoginStatus(isLoged) {
    this.setState({ isLoged: isLoged })
  }

  updateInput(event) {
    this.setState({ username: event.target.value })
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
                <Image src={shasta} />
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
                        <Input placeholder='Username' onChange={this.updateInput} />
                      </Form.Field>
                      <Button type='submit' onClick={this.createUser}>Create a new organization</Button>
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
