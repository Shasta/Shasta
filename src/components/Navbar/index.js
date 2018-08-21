import React, { Component } from 'react';
import { Menu, Button, Image, Grid, Label , Divider, Sidebar, Icon, Segment, Header, Card } from 'semantic-ui-react'


class Index extends Component {
  state = {}
  handleItemClick = (e, { name }) => this.setState({ activeItem: name })
  render() {
    const { activeItem } = this.state
    return (
      <div>
        <Menu>
          <Menu.Item name='Shasta' active={activeItem === 'Shasta'} onClick={this.handleItemClick} />
          <Menu.Menu position='right'>
            <Menu.Item>
              <span>1000 SNT == 2.1 ETH</span>
            </Menu.Item>
            <Menu.Item>
              <span>Hardware connected</span>
            </Menu.Item>
            <Menu.Item>
              <Image src='https://pbs.twimg.com/profile_images/962407427755986944/OyX-elqB_400x400.jpg' avatar />
              <span>Alex Sicart</span>
            </Menu.Item>
          </Menu.Menu>
        </Menu>
        <Grid>
          <Grid.Column width={4}>
            <Menu fluid vertical tabular>
              <Menu.Item name='Home' active={activeItem === 'bio'} onClick={this.handleItemClick} />
              <Menu.Item name='Finance' active={activeItem === 'pics'} onClick={this.handleItemClick} />
              <Menu.Item
                name='Market'
                active={activeItem === 'companies'}
                onClick={this.handleItemClick}
              />
              <Menu.Item
                name='Hardware'
                active={activeItem === 'links'}
                onClick={this.handleItemClick}
              />
              <Menu.Item
                name='Identity'
                active={activeItem === 'links'}
                onClick={this.handleItemClick}
              />
              <Menu.Item
                name='Settings'
                active={activeItem === 'links'}
                onClick={this.handleItemClick}
              />
            </Menu>
          </Grid.Column>

          <Grid.Column stretched width={12}>
            <Menu.Item>
              <h2><b>Market</b></h2>
            </Menu.Item>
            <Segment>
              <Card.Group>
                <Card>
                  <Card.Content>
                    <Card.Header>Sevilla</Card.Header>
                    <Card.Meta>100 SNT</Card.Meta>
                    <Card.Description>HolaLuz</Card.Description>
                  </Card.Content>
                </Card>

                <Card>
                  <Card.Content>
                    <Card.Header content='Catalonia' />
                    <Card.Meta content='200 SNT / kWh' />
                    <Card.Description content='HolaLuz' />
                  </Card.Content>
                </Card>

                <Card>
                  <Card.Content
                    header='Zurich'
                    meta='500 SNT / kWh'
                    description='HolaLuz'
                  />
                </Card>

                <Card
                  header='Torquay'
                  meta='400 SNT / kWh'
                  description='HolaLuz'
                />
              </Card.Group>
            </Segment>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default Index;
