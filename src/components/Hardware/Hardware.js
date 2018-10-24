import React, { Component } from "react";
import axios from "axios";
import HardwareCharts from "./HardwareCharts";
import { Grid, Transition, Button, Input } from "semantic-ui-react";
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

const ShastaButton = styled.button`
  background-color: #402d41;
  text-align: center;
  color: white;
  border-radius: 8px;
  width: 110px;
  height: 35px;
  border: 0;
  cursor: pointer;
`;

class Hardware extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accountInfo: {},
      hasHardware: true,
      inputHardwareId: '',
      hardwareId: '',
      historyConsumedEnergy: [],
      historySurplusEnergy: [],
      tx: null
    };
    this.getAccountInfo = this.getAccountInfo.bind(this);
    this.getHistoryConsumedEnergy = this.getHistoryConsumedEnergy.bind(this);
    this.getHistorySurplusEnergy = this.getHistorySurplusEnergy.bind(this);
    this.handleHardwareInput = this.handleHardwareInput.bind(this);
    this.addHardwareId = this.addHardwareId.bind(this);
  }

  async componentDidMount() {

    const { drizzle, drizzleState } = this.props;
    const hardwareId = await drizzle.contracts.HardwareData.methods.getHardwareIdFromSender().call({ from: drizzleState.accounts[0] });
    console.log("hw: ", hardwareId);
    const utfHardwareId = drizzle.web3.utils.hexToUtf8(hardwareId);
    if (hardwareId) {
      this.setState({
        hasHardware: true,
        hardwareId: utfHardwareId
      });

      this.getAccountInfo();
      this.getHistoryConsumedEnergy();
      this.getHistorySurplusEnergy();
    }

  }

  async getAccountInfo() {
    let result = await axios.get("/api/accountInfo.json");
    this.setState({
      accountInfo: result.data
    });
  }

  async getHistoryConsumedEnergy() {
    let result = await axios.get("/api/metrics/getConsumption", {
      params: {
        hardware_id: this.props.hardware_id
      }
    });
    this.setState({
      historyConsumedEnergy: result.data.data
    });


  }

  async addHardwareId() {

    const { drizzle, drizzleState } = this.props;
    
    const hexHardwareId = drizzle.web3.utils.utf8ToHex(this.state.inputHardwareId)
    const hardwareGas = await drizzle.contracts.HardwareData.methods
    .addNewHardwareId(hexHardwareId)
    .estimateGas({ from: drizzleState.accounts[0] });

    const tx = await drizzle.contracts.HardwareData.methods
    .addNewHardwareId
    .cacheSend(hexHardwareId, { from: drizzleState.accounts[0], gas: hardwareGas });

  }

  async getHistorySurplusEnergy() {
    let result = await axios.get("/api/historySurplusEnergy.json");
    this.setState({
      historySurplusEnergy: result.data.data
    });
  }

  handleHardwareInput(event) {
    this.setState({ inputHardwareId: event.target.value })
  }

  render() {
    return (
      <div>
        <div>
          <Transition visible={!this.state.hasHardware} animation='scale' duration={500}>
            <div >
              <h2>
                <ShastaIcon src={img.iconHardware} />
                Hardware:
                </h2>
              <div className="pinkBorder">
                <li>
                  You don't have any registered hardware for this organization. Add a new hardware writing its id:
                </li>
                <div className="inputDiv">
                  <Input placeholder='Hardware identifier' className="hardwareIdInput" onChange={this.handleHardwareInput} />
                  <ShastaButton type='submit' className="addHardwareIdBtn" onClick={this.addHardwareId}>Add Hardware</ShastaButton>
                </div>
              </div>
            </div>
          </Transition>
          <Transition visible={this.state.hasHardware} animation='scale' duration={500}>
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
                        {this.state.hardwareId}
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
          </Transition>
        </div>
      </div>
    );
  }
}

export default Hardware;
