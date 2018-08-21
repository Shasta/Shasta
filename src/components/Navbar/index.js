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
            </Menu>
          </Grid.Column>

          <Grid.Column stretched width={12}>
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
                    <Card.Meta content='200 SNT' />
                    <Card.Description content='HolaLuz' />
                  </Card.Content>
                </Card>

                <Card>
                  <Card.Content
                    header='Elliot Baker'
                    meta='Friend'
                    description='Elliot is a music producer living in Chicago.'
                  />
                </Card>

                <Card
                  header='Jenny Hess'
                  meta='Friend'
                  description='Jenny is a student studying Media Management at the New School'
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
