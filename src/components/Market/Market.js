import React, { Component } from 'react';
import { Button, Grid, Sidebar, Menu, Progress, Form, Checkbox } from 'semantic-ui-react'
import './Market.css';

class Market extends Component {
  constructor(props) {
    super(props)

    this.state = {
      visible: false,
      percent: 0,
      firstName: '',
      lastName: '',
      address:'',
      zipCode: ''
    }

    this.updateUser = this.updateUser.bind(this);

  }

  toggle = () => this.setState({ percent: this.state.percent === 0 ? 100 : 0 })

  handleButtonClick = () => this.setState({ visible: !this.state.visible })

  handleSidebarHide = () => this.setState({ visible: false })

  updateUser() {

    var userJson = {
      username: this.props.username,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      address: this.state.address,
      zipCode: this.state.zipCode,
      contracts: []
    }

    console.log("Info to update: ", userJson);

    var contract = this.props.contract;
    var address = this.props.address;
    
    this.props.ipfs.add([Buffer.from(JSON.stringify(userJson))], function (err, res) {

      if (err) throw err;

      var ipfsHash = res[0].hash;
      console.log("ipfs hash: ", ipfsHash);
      contract.deployed().then(function (contractInstance) {
        contractInstance.updateUser( ipfsHash, { gas: 400000, from: address }).then(function (success) {
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

  }

  handleChange = (e) => {
    this.setState({
        [e.target.name]: e.target.value
    })
  }

  render() {

    const { visible } = this.state
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
              <h3 style={{position: 'relative'}}>New Contract</h3>
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
                <Menu.Item>
                  <h4 style={{position: 'relative'}}>60€ / mes</h4>
                </Menu.Item>
                <Form.Field>
                  <Checkbox label='I agree to the Terms and Conditions' />
                </Form.Field>
                <Button onClick={this.updateUser} type='submit'>Submit</Button>
              </Form>
            </Menu.Item>
            <Menu.Item>
              <Progress percent={this.state.percent} color='violet' active></Progress>
            </Menu.Item>
            <h3>Powered by District0x</h3>
          </Sidebar>
        </div>
        <div style={{marginLeft: 400, marginTop:20}}>
          <Grid>
            <Grid.Row columns={3}>
              <Grid.Column></Grid.Column>
              <Grid.Column></Grid.Column>
              <Grid.Column>
                <Button onClick={this.handleButtonClick}>Start a Contract</Button>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      </div>
    );
  }
}

export default Market
