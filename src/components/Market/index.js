import React, { Component } from 'react';
import { Image, Card, Button, Divider, Grid, Sidebar, Icon, Menu, Segment, Header, Progress, Form, Checkbox, Loader } from 'semantic-ui-react'
import './index.css';

var faker = require('faker');

class Index extends Component {
  constructor(props) {
    super(props)

    this.state = {
      visible: false,
      percent: 0
    }
  }

  toggle = () => this.setState({ percent: this.state.percent === 0 ? 100 : 0 })

  handleButtonClick = () => this.setState({ visible: !this.state.visible })

  handleSidebarHide = () => this.setState({ visible: false })

  render() {
    const {
      balance,
      user
    } = this.props;
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
                  <input placeholder='First Name' />
                </Form.Field>
                <Form.Field>
                  <label>Last Name</label>
                  <input placeholder='Last Name' />
                </Form.Field>
                <Form.Field>
                  <label>Address</label>
                  <input placeholder='Address' />
                </Form.Field>
                <Form.Field>
                  <label>zip code</label>
                  <input placeholder='zip code' />
                </Form.Field>
                <Menu.Item>
                  <h4 style={{position: 'relative'}}>60€ / mes</h4>
                </Menu.Item>
                <Form.Field>
                  <Checkbox label='I agree to the Terms and Conditions' />
                </Form.Field>
                <Button onClick={this.toggle} type='submit'>Submit</Button>
              </Form>
            </Menu.Item>
            <Menu.Item>
              <Progress percent={this.state.percent} color='violet' active></Progress>
            </Menu.Item>
            <h3>Powered by District0x</h3>
          </Sidebar>
        </div>
        <div style={{marginLeft: 400, marginTop:20}}>
          <Loader active inline='centered' />          <Grid>
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

export default Index
