import React, { Component } from "react";
import axios from "axios";

import {
  Grid,
  Card
} from "semantic-ui-react";

import D3 from "./d3.js";

class Hardware extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accountInfo: {},
      historyConsumedEnergy: [],
      historySurplusEnergy: []
    };
    this.getAccountInfo = this.getAccountInfo.bind(this);
    this.getHistoryConsumedEnergy = this.getHistoryConsumedEnergy.bind(this);
    this.getHistorySurplusEnergy = this.getHistorySurplusEnergy.bind(this);
  }

  async componentDidMount() {
    this.getAccountInfo();
    this.getHistoryConsumedEnergy();
    this.getHistorySurplusEnergy();
  }

  async getAccountInfo() {
    let result = await axios.get("/accountInfo");
    this.setState({
      accountInfo: result.data
    });
  }

  async getHistoryConsumedEnergy() {
    let result = await axios.get("/historyConsumedEnergy");
    this.setState({
      historyConsumedEnergy: result.data.data
    });
  }

  async getHistorySurplusEnergy() {
    let result = await axios.get("/historySurplusEnergy");
    this.setState({
      historySurplusEnergy: result.data.data
    });
  }

  render() {
    return (
      <div>
        <div style={{ marginLeft: 400, marginTop: 20 }}>
          <Grid>
            <Grid.Row columns={2}>
              <Grid.Column>
                <h3>Hardware: </h3>
                <p>ID: {this.state.accountInfo.hardware_id}</p>
                <p>
                  Status:{" "}
                  <span style={{ backgroundColor: "green", padding: "4px" }}>
                    {this.state.accountInfo.status}
                  </span>
                </p>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={2}>
              <Grid.Column>
                <Card.Group />
                <h3>Energy:</h3>
                <p>
                  Consumed this month: {this.state.accountInfo.consumedEnergy}
                  KwH
                </p>
                <p>
                  Total surplus energy month:{" "}
                  {this.state.accountInfo.surplusEnergy} KwH
                </p>
                <p>
                  Remaining surplus to sell:{" "}
                  {this.state.accountInfo.remainingSurplusEnergy} KwH
                </p>
                <Card.Group />
              </Grid.Column>
              <Grid.Column>
                <h4>Your consumition: (KwH)</h4>
                <p>
                  <D3 data={this.state.historyConsumedEnergy} />
                </p>
                <h4>Your surplus: (KwH)</h4>
                <p>
                  <D3 data={this.state.historySurplusEnergy} />
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
