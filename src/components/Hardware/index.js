import React, { Component, Fragment } from "react";
import {
  Button,
  Grid,
  Sidebar,
  Menu,
  Form,
  Checkbox,
  Dropdown,
  Card,
  Message,
  Input
} from "semantic-ui-react";

import D3 from "./d3.js";

class Hardware extends Component {
  render() {
    return (
      <div>
        <div style={{ marginLeft: 400, marginTop: 20 }}>
          <Grid>
            <Grid.Row columns={2}>
              <Grid.Column>
                <h3>Hardware: </h3>
                <p>ID: 0x4b9db3633e4c583bf660cc32bf523d8e10cb78de</p>
                <p>Status: connected</p>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={2}>
              <Grid.Column>
                <Card.Group />
                <h3>Energy:</h3>
                <p>Consumed this month: 100KwH</p>
                <p>Total surplus energy month: 100 KwH</p>
                <p>Remaining surplus to sell: 100 KwH</p>
                <Card.Group />
              </Grid.Column>
              <Grid.Column>
                <h4>Your consumition: (KwH)</h4>
                <p>
                  <D3 />
                </p>
                <h4>Your surplus: (KwH)</h4>
                <p>
                  <D3 />
                </p>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      </div>
    );
  }
}

export default Hardware;
