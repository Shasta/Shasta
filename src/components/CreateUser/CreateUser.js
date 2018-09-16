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
  }

  toggleVisibility = () => this.setState({ formVisible: !this.state.formVisible })

  
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
                <Registry ipfs={this.props.ipfs} />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div >
      );

    }
  }
}

export default CreateUser;
