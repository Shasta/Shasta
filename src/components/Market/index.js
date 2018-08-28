import React, { Component } from 'react';
import { Image, Card, Button, Divider, Grid, Sidebar, Icon, Menu, Segment, Header } from 'semantic-ui-react'
var faker = require('faker');

class Index extends Component {
  constructor(props) {
    super(props)

    this.state = { visible: false }
  }

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
          <h2>Open Contracts</h2>
          <Card.Group>
            <Card>
              <Card.Content>
                <Card.Header>xxxxxxx</Card.Header>
                <Card.Meta style={{width: ''}}>Created by x</Card.Meta>
                <Card.Description></Card.Description>
              </Card.Content>
              <Card.Content>
                <Card.Header>xxxxxxx</Card.Header>
                <Card.Meta style={{width: ''}}>Created by x</Card.Meta>
                <Card.Description></Card.Description>
              </Card.Content>
              <Card.Content>
                <Card.Header>xxxxxxx</Card.Header>
                <Card.Meta style={{width: ''}}>Created by x</Card.Meta>
                <Card.Description></Card.Description>
              </Card.Content>
            </Card>
          </Card.Group>
          <Divider style={{marginTop:100}}/>
          <h1>Providers</h1>
          <Card.Group>
            <Card>
              <Card.Content>
                <Image floated='right' size='mini' src={faker.image.avatar()} />
                <Card.Header>{faker.name.findName()}</Card.Header>
                <Card.Description>
                  <strong><p>1 $/kWh</p></strong>
                  <p>Toledo</p>
                  <p>HolaLuz</p>
                </Card.Description>
              </Card.Content>
            </Card>
            <Card>
              <Card.Content>
                <Image floated='right' size='mini' src={faker.image.avatar()} />
                <Card.Header>{faker.name.findName()}</Card.Header>
                <Card.Description>
                  <strong><p>1.8 $/kWh</p></strong>
                  <p>Sevilla</p>
                  <p>Crypto Energy</p>
                </Card.Description>
              </Card.Content>
            </Card>
            <Card>
              <Card.Content>
                <Image floated='right' size='mini' src={faker.image.avatar()} />
                <Card.Header>{faker.name.findName()}</Card.Header>
                <Card.Description>
                  <strong><p>1.3 $/kWh</p></strong>
                  <p>Barcelona</p>
                  <p>Som Energia</p>
                </Card.Description>
              </Card.Content>
            </Card>
          </Card.Group>
        </div>
      </div>
    );
  }
}

export default Index
