import React, { Component } from "react";
import axios from "axios";
import HardwareCharts from "./HardwareCharts";
import { Grid, Transition, Button, Input } from "semantic-ui-react";
import ConsumptionChart from "./ConsumptionChart";
import ProductionChart from "./ProductionChart";
import SurplusChart from "./SurplusChart";
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

  constructor(props) {
    super(props);
    this.state = {
      accountInfo: {},
      hasHardware: false,
      inputHardwareId: '',
      hardwareId: '',
      historyConsumedEnergy: [],
      historySurplusEnergy: [],
      consumptionMetrics: [],
      productionMetrics: [],
      surplusMetrics: [],
      currentMetrics: {
        kwh_consumed: 0,
        kwh_produced: 0,
        kwh_surplus: 0
      },
      txAdd: null,
      txDel: null,
      txi: null,
      lock: false
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
    const txi = drizzle.contracts.HardwareData.methods.getHardwareIdFromSender.cacheCall({ from: drizzleState.accounts[0] });
    this.setState({
      txi
    });
  }

  async componentDidUpdate() {

    const { drizzle, drizzleState } = this.props;
    const { txi, txDel, txAdd, lock } = this.state;

    if (drizzleState && !lock && drizzleState.contracts.HardwareData && txi in drizzleState.contracts.HardwareData.getHardwareIdFromSender) {
      const hardwareId = drizzleState.contracts.HardwareData.getHardwareIdFromSender[txi].value;
      if (hardwareId) {
        const utfHardwareId = drizzle.web3.utils.hexToUtf8(hardwareId);
        this.setState({
          hasHardware: true,
          hardwareId: utfHardwareId,
          lock: true
        });

        this.getAccountInfo();
        this.getHistoryConsumedEnergy();
        this.getHistorySurplusEnergy();
        return Promise.all([this.getMetricsHistory('month', utfHardwareId), this.getCurrentMetrics(utfHardwareId)])
      }
    }

    if (txDel >= 0) {
      const txHash = drizzleState.transactionStack[txDel];
      if (drizzleState.transactions[txHash]) {
        const transactionStatus = drizzleState.transactions[txHash].status;        
        if (transactionStatus == "success") {
          this.setState({
            hasHardware: false,
            txDel: null,
            lock: false,
            txi: null,
            utfHardwareId: null
          });
        }
      }
    }

    if (txAdd >= 0) {
      const txHash = drizzleState.transactionStack[txAdd];
      if (drizzleState.transactions[txHash]) {
        const transactionStatus = drizzleState.transactions[txHash].status;
        console.log(transactionStatus)   
        if (transactionStatus == "success") {
          const tx = drizzle.contracts.HardwareData.methods.getHardwareIdFromSender.cacheCall({ from: drizzleState.accounts[0] });
          this.setState({
            txAdd: null,
            lock: false,
            txi: tx
          });
        }
      }
    }
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

    const hardwareGas = await drizzle.contracts.HardwareData.methods
      .removeHadwareId()
      .estimateGas({ from: drizzleState.accounts[0] });

    const txDel = drizzle.contracts.HardwareData.methods
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

  getMetricsHistory = async (unitOfTime, hardwareId) => {
    const result = await axios.get('http://localhost:5050/api/metrics/by-unit-time', { params: { hardware_id: hardwareId, by: unitOfTime } })
    console.log("res: ", result)
    this.setState({
      consumptionMetrics: result.data.history_by_unit.map(metric => ({
        date: metric.timestamp_iso,
        value: toKwH(metric.watts_consumed),
      })),
      productionMetrics: result.data.history_by_unit.map(metric => ({
        date: metric.timestamp_iso,
        value: toKwH(metric.watts_produced),
      })),
      surplusMetrics: result.data.history_by_unit.map(metric => ({
        date: metric.timestamp_iso,
        value: toKwH(metric.watts_surplus),
      }))
    });
  }

  getCurrentMetrics = async (hardwareId) => {
    const result = await axios.get('http://localhost:5050/api/metrics/current-month', { params: { hardware_id: hardwareId } })
    console.log('current', result)
    if (result) {
      this.setState({
        currentMetrics: {
          kwh_consumed: toKwH(result.data.metrics.watts_consumed),
          kwh_produced: toKwH(result.data.metrics.watts_produced),
          kwh_surplus: toKwH(result.data.metrics.watts_surplus),
        }
      });
    }
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
                  <ShastaButton type='submit' className="removeHardwareIdBtn" onClick={this.removeHardwareId}>Remove Hardware</ShastaButton>
                </Grid.Column>
                <Grid.Column style={{ width: "50%" }}>
                  <h2>
                    <ShastaIcon src={img.iconConsumition} />
                    Your consumption: (KwH)
                  </h2>
                  <div>
                    <ConsumptionChart
                      color2={"rgba(243,166,210,1)"}
                      color={"rgba(243,166,210,0.4)"}
                      data={this.state.consumptionMetrics}
                    />
                  </div>
                  <div>
                    <ProductionChart
                      color2={"rgba(243,166,210,1)"}
                      color={"rgba(243,166,210,0.4)"}
                      data={this.state.productionMetrics}
                    />
                  </div>
                  <h2>
                    <ShastaIcon src={img.iconSurplus} />
                    Your surplus: (KwH)
                  </h2>
                  <p>
                    <SurplusChart
                      color2={"rgba(129,117,130,1)"}
                      color={"rgba(129,117,130,0.4)"}
                      data={this.state.surplusMetrics}
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