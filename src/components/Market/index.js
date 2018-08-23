import React, { Component } from 'react';
import { Image, Card, Button } from 'semantic-ui-react'
var faker = require('faker');

class Index extends Component {
    render() {
      return (
        <div style={{marginLeft: 400, marginTop:20}}>
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
                <Card.Content extra>
                    <div className='ui two buttons'>
                    <Button basic color='green'>
                        Buy
                    </Button>
                    <Button basic color='red'>
                        Decline
                    </Button>
                    </div>
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
                <Card.Content extra>
                    <div className='ui two buttons'>
                    <Button basic color='green'>
                        Buy
                    </Button>
                    <Button basic color='red'>
                        Decline
                    </Button>
                    </div>
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
                <Card.Content extra>
                    <div className='ui two buttons'>
                    <Button basic color='green'>
                        Buy
                    </Button>
                    <Button basic color='red'>
                        Decline
                    </Button>
                    </div>
                </Card.Content>
                </Card>
            </Card.Group>
            
        </div>
        );
    }
}

export default Index