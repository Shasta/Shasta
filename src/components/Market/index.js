import React, { Component } from 'react';
import { Image, Card, Button, Divider } from 'semantic-ui-react'
var faker = require('faker');

class Index extends Component {
  render() {
    return (
      <div style={{marginLeft: 400, marginTop:20}}>
        <h1> Buy energy: </h1>
        <Button basic color='blue'>
          Start a Contract
        </Button>
        <h2>Open Contracts</h2>
        <Card.Group>
          <Card>
            <Card.Content>
              <Card.Header>Contract with HolaLuz</Card.Header>
              <Card.Meta style={{width: ''}}>Created by x</Card.Meta>
              <Card.Description></Card.Description>
            </Card.Content>
          </Card>
        </Card.Group>
        <Divider style={{marginTop:200}}/>
        <h1>Shasta Providers</h1>
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
    );
  }
}

export default Index
