import React, { Component } from "react";
import axios from "axios";
import HardwareCharts from "./HardwareCharts";
import { Grid } from "semantic-ui-react";
import "./Hardware.less";

import styled from "styled-components";
import * as img from "./images";

const ShastaIcon = styled.img`
  vertical-align: middle;
  width: 40px;
  height: 40px;
  margin-right: 20px;
`;

const ShastaValue = styled.span`
  padding-top: 20px;
  background-color: #817582;
  color: white;
  padding: 4px;
  display: block;
  width: 300px;
`;

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
    let result = await axios.get("/api/accountInfo.json");
    this.setState({
      accountInfo: result.data
    });
  }

  async getHistoryConsumedEnergy() {
    let result = await axios.get("/api/historyConsumedEnergy.json");
    this.setState({
      historyConsumedEnergy: result.data.data
    });
  }

  async getHistorySurplusEnergy() {
    let result = await axios.get("/api/historySurplusEnergy.json");
    this.setState({
      historySurplusEnergy: result.data.data
    });
  }

  render() {
    return (
      <div>
        <div style={{ marginLeft: "25%", marginTop: 50 }}>
          <Grid style={{ width: "90%" }}>
            <Grid.Row>
              <Grid.Column style={{ width: "50%" }}>
                <h2>
                  <ShastaIcon src={img.iconHardware} />
                  Hardware:
                </h2>

                <div className="pinkBorder">
                  <li>
                    ID:
                    <ShastaValue style={{ display: "inline", padding: "8px" }}>
                      {this.state.accountInfo.hardware_id}
                    </ShastaValue>
                  </li>
                  <li>
                    Status:
                    <span style={{ backgroundColor: "green", padding: "6px" }}>
                      {this.state.accountInfo.status}
                    </span>
                  </li>
                </div>
              </Grid.Column>
              <Grid.Column style={{ width: "50%" }}>
                <h2>
                  <ShastaIcon src={img.iconConsumition} />
                  your consumption: (KwH)
                </h2>
                <p>
                  <HardwareCharts
                    color={"rgba(243,166,210,1)"}
                    color2={"rgba(243,166,210,0.4)"}
                    data={this.state.historyConsumedEnergy}
                  />
                </p>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column style={{ width: "50%" }}>
                <h2>
                  <ShastaIcon src={img.iconEnergy} />
                  Energy:
                </h2>
                <div className="pinkBorder">
                  <li>
                    Consumed this month:
                    <ShastaValue>
                      {this.state.accountInfo.consumedEnergy}
                      KwH
                    </ShastaValue>
                  </li>
                  <li>
                    Total surplus energy month:{" "}
                    <ShastaValue>
                      {this.state.accountInfo.surplusEnergy} KwH
                    </ShastaValue>
                  </li>
                  <li>
                    Remaining surplus to sell:{" "}
                    <ShastaValue>
                      {this.state.accountInfo.remainingSurplusEnergy} KwH
                    </ShastaValue>
                  </li>
                </div>
              </Grid.Column>

              <Grid.Column style={{ width: "50%" }}>
                <h2>
                  <ShastaIcon src={img.iconSurplus} />
                  Your surplus: (KwH)
                </h2>
                <p>
                  <HardwareCharts
                    color={"rgba(129,117,130,1)"}
                    color2={"rgba(129,117,130,0.4)"}
                    data={this.state.historySurplusEnergy}
                  />
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
