import React, { Component } from "react";
import axios from "axios";
import HardwareCharts from "./HardwareCharts";
import {Grid} from "semantic-ui-react";
import "./Hardware.less";

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
          <Grid style={{width:"90%"}}>
              <Grid.Column style={{width:"50%"}}>
                <h3>Hardware: </h3>
                <div className="pinkBorder">
                <p>ID: {this.state.accountInfo.hardware_id}</p>
                <p>
                  Status:{" "}
                  <span style={{ backgroundColor: "green", padding: "4px" }}>
                    {this.state.accountInfo.status}
                  </span>
                </p>
                </div>
                <h3>Energy:</h3>
                <div className="pinkBorder">
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
                </div>
              </Grid.Column>
              <Grid.Column style={{width:"50%"}}>
                <h4>your consumption: (KwH)</h4>
                <p>
                  <HardwareCharts color={"rgba(129,117,130,1)"} color2={"rgba(129,117,130,0.4)"} data={this.state.historyConsumedEnergy} />
                </p>
                <h4>Your surplus: (KwH)</h4>
                <p>
                  <HardwareCharts color={"rgba(243,166,210,1)"} color2={"rgba(243,166,210,0.4)"} data={this.state.historySurplusEnergy} />
                </p>
              </Grid.Column>
          </Grid>
        </div>
      </div>
    );
  }
}

export default Hardware;
