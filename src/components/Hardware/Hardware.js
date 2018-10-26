import React, { Component } from "react";
import axios from "axios";
import HardwareCharts from "./HardwareCharts";
import { Grid, Transition, Button, Input } from "semantic-ui-react";
import ConsumptionChart from "./ConsumptionChart";
import ProductionChart from "./ConsumptionChart";
import { toKwH } from '../../utils/energyUnits';
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

const ShastaButton = styled(Button)`
  background-color: #402d41 !important;
  text-align: center !important;
  color: white !important;
  border-radius: 8px !important;
  width: 110px !important;
  height: 35px !important;
  border: 0 !important;
  cursor: pointer !important;
`;

class Hardware extends Component {
  state = {
    consumptionMetrics: [],
    accountInfo: {},
    historyConsumedEnergy: [],
    historySurplusEnergy: [],
    currentMetrics: {
      watts_consumed: 0,
      watts_produced: 0,
      watts_surplus: 0
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      accountInfo: {},
      hasHardware: true,
      inputHardwareId: '',
      hardwareId: '',
      historyConsumedEnergy: [],
      historySurplusEnergy: [],
      txAdd: null,
      txDel: null
    };
    this.getAccountInfo = this.getAccountInfo.bind(this);
    this.getHistoryConsumedEnergy = this.getHistoryConsumedEnergy.bind(this);
    this.getHistorySurplusEnergy = this.getHistorySurplusEnergy.bind(this);
    this.handleHardwareInput = this.handleHardwareInput.bind(this);
    this.addHardwareId = this.addHardwareId.bind(this);
    this.removeHardwareId = this.removeHardwareId.bind(this);
  }

  async componentDidMount() {

    const { drizzle, drizzleState } = this.props;
    const hardwareId = await drizzle.contracts.HardwareData.methods.getHardwareIdFromSender().call({ from: drizzleState.accounts[0] });
    console.log("hw: ", hardwareId);
    if (!!hardwareId) {
      const utfHardwareId = drizzle.web3.utils.hexToUtf8(hardwareId);
      this.setState({
        hasHardware: true,
        hardwareId: utfHardwareId
      });

      this.getAccountInfo();
      this.getHistoryConsumedEnergy();
      this.getHistorySurplusEnergy();
    } else {
      this.setState({
        hasHardware: false
      });
    }

    return Promise.all([this.getMetricsHistory('month'), this.getCurrentMetrics()])
  }

  async getAccountInfo() {
    let result = await axios.get("/api/accountInfo.json");
    this.setState({
      accountInfo: result.data
    });
  }

  async getHistoryConsumedEnergy() {
    let result = await axios.get("/api/historyConsumedEnergy.json");
    console.log('whats inside', result.data.data)
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

    const txAdd = await drizzle.contracts.HardwareData.methods
      .addNewHardwareId
      .cacheSend(hexHardwareId, { from: drizzleState.accounts[0], gas: hardwareGas });
      this.setState({
        txAdd
      });
  }

  async removeHardwareId() {

    const { drizzle, drizzleState } = this.props;

    console.log( drizzle.contracts.HardwareData.methods)
    const hardwareGas = await drizzle.contracts.HardwareData.methods
      .removeHadwareId()
      .estimateGas({ from: drizzleState.accounts[0] });

    const txDel = await drizzle.contracts.HardwareData.methods
      .removeHadwareId
      .cacheSend({ from: drizzleState.accounts[0], gas: hardwareGas });
      this.setState({
        txDel
      });
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

  getMetricsHistory = async (unitOfTime) => {
    const result = await axios.get('http://localhost:5050/api/metrics/by-unit-time', { params: { hardware_id: '1b1b44ab-67f8-4820-b344-5f333fc2f5a8', by: unitOfTime } })
    this.setState({
      consumptionMetrics: result.data.history_by_unit.map(metric => ({
        date: metric.timestamp,
        value: toKwH(metric.watts_consumed),
      }))
    });
  }

  getCurrentMetrics = async () => {
    const result = await axios.get('http://localhost:5050/api/metrics/current-month', { params: { hardware_id: '1b1b44ab-67f8-4820-b344-5f333fc2f5a8' } })
    console.log('current', result)
    this.setState({
      currentMetrics: {
        kwh_consumed: toKwH(result.data.metrics.watts_consumed),
        kwh_produced: toKwH(result.data.metrics.watts_produced),
        kwh_surplus: toKwH(result.data.metrics.watts_surplus),
      }
    });
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
                <div>
                  <ConsumptionChart
                    color={"rgba(243,166,210,1)"}
                    color2={"rgba(243,166,210,0.4)"}
                    data={this.state.consumptionMetrics}
                  />
                </div>
                <div>
                  <ProductionChart
                    color={"rgba(243,166,210,1)"}
                    color2={"rgba(243,166,210,0.4)"}
                    data={this.state.consumptionMetrics}
                  />
                </div>
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
                      {this.state.currentMetrics.kwh_consumed} KwH
                    </ShastaValue>
                  </li>
                  <li>
                    Produced this month:
                    <ShastaValue>
                      {this.state.currentMetrics.kwh_produced} KwH
                    </ShastaValue>
                  </li>
                  <li>
                    Total surplus energy month:{" "}
                    <ShastaValue>
                      {this.state.currentMetrics.kwh_surplus} KwH
                    </ShastaValue>
                  </li>
                  {/*
                  <li>
                    Remaining surplus to sell:{" "}
                    <ShastaValue>
                      {this.state.accountInfo.remainingSurplusEnergy} KwH
                    </ShastaValue>
                  </li>
                  */}
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