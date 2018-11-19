import React, { Component, Fragment } from "react";
import { Feed, Sidebar, Responsive, Segment, Grid } from "semantic-ui-react";
import MainChart from "./MainChart";
import withRawDrizzle from "../../utils/withRawDrizzle.js";
import { Line, Pie } from "react-chartjs-2";
import "./Finance.less";
import styled from "styled-components";

import iconEnergyPrice from "../../static/energy-price.png";

const ShastaSidebar = styled(Sidebar)`
  -webkit-box-shadow: none !important;
  -moz-box-shadow: none !important;
  box-shadow: none !important;
`;

const ShastaIcon = styled.img`
  vertical-align: middle;
  width: 40px;
  height: 40px;
  margin-right: 20px;
`;

class Finance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalSha: "",
      totalEth: "",
      tokenBalancePointer: ""
    };
    
  }

  async componentDidMount() {
    const { drizzleState, drizzle } = this.props;
    const { accounts, accountBalances } = drizzleState;
    const { web3 } = drizzle;

    const shaLedgerInstance = drizzle.contracts.ShaLedger;
    let totalEth = this.precisionRound(
      web3.utils.fromWei(accountBalances[accounts[0]]),
      2
    );
    const tokenBalancePointer = shaLedgerInstance.methods.balanceOf.cacheCall(
      accounts[0]
    );

    this.setState({
      totalEth,
      tokenBalancePointer
    });
  }

  precisionRound(number, precision) {
    var factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
  }

  render() {
    const { drizzleState, drizzle } = this.props;
    const { tokenBalancePointer } = this.state;
    const { web3 } = drizzle;

    let totalSha = 0;
    const ShaLedgerState = drizzleState.contracts.ShaLedger;
    if (tokenBalancePointer in ShaLedgerState.balanceOf) {
      // ShaLedger have 18 decimals, like Ether, so we can reuse `fromWei` util function.
      totalSha = web3.utils.fromWei(
        ShaLedgerState.balanceOf[tokenBalancePointer].value,
        "ether"
      );
    }

    //Energy chart
    const data = {
      labels: ["January", "February", "March", "April", "May", "June", "July"],
      datasets: [
        {
          label: "Shas",
          lineTension: 0.1,
          backgroundColor: "rgba(129,117,130,0.4)",
          borderColor: "rgba(129,117,130,1)",
          borderCapStyle: "butt",
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: "miter",
          pointBorderColor: "rgba(129,117,130,1)",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(129,117,130,1)",
          pointHoverBorderColor: "rgba(220,220,220,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          fill: true,
          data: [0.1325, 0.1298, 0.1301, 0.12845, 0.12902, 0.1302, 0.132]
        }
      ]
    };

    const pieData = {
      labels: ["Solar", "Eolic", "Nuclear"],
      datasets: [
        {
          data: [300, 50, 100],
          backgroundColor: ["#402d41", "#ed77b9", "#922c66"],
          hoverBackgroundColor: ["#402d41", "#ed77b9", "#922c66"]
        }
      ]
    };
    const pieOptions = {
      cutoutPercentage: 40,
      legend: {
        position: "top",
        labels: {
          usePointStyle: true
        }
      }
    };

    const chartOptions = {
      responsive: true,
      legend: {
        labels: {
          boxWidth: 0
        }
      }
    };
    return (
      <Fragment>
        <Responsive minWidth="1200">
          <Grid stackable>
            <Grid.Column width={10}>
              <Grid.Row>
                <MainChart totalSha={totalSha} />
              </Grid.Row>
              <Grid.Row>
                <h2>
                  {" "}
                  <ShastaIcon src={iconEnergyPrice} />
                  Energy price
                </h2>
                <Line data={data} options={chartOptions} height={100} />
              </Grid.Row>
            </Grid.Column>
            <Grid.Column width={6} style={{ paddingLeft: "5%" }}>
              <h3 className="titles">Your balances: </h3>
              <div className="currencyDiv">
                <div className="divBorderCurrencySha">
                  <div className="divTagCurrencySha">
                    <p>SHA</p>
                  </div>
                  <h1 className="displaySha">{totalSha}</h1>
                </div>
                <div className="divBorderCurrencyEther">
                  <div className="divTagCurrencyEther">ETH</div>
                  <h1 className="displayEther">{this.state.totalEth}</h1>
                </div>
              </div>

              <h3 className="titles">Your actions:</h3>
              <Feed>
                <Feed.Event className="feedTitle">
                  <Feed.Content
                    date="● today"
                    summary="You bought 30kWh for 5 Shas"
                  />
                </Feed.Event>
                <Feed.Event className="feedTitle">
                  <Feed.Content
                    date="● yesterday"
                    summary="You earned 10 shas with your energy"
                  />
                </Feed.Event>
              </Feed>
              <div style={{ width: "100%", height: 300, paddingTop: 40 }}>
                <h3 className="titles">Source of energy sold:</h3>
                <Pie data={pieData} options={pieOptions} />
              </div>
            </Grid.Column>
          </Grid>
        </Responsive>
        <Responsive maxWidth="1200">
          <Grid stackable>
            <Grid.Row>
              <MainChart totalSha={totalSha} />
            </Grid.Row>
            <Grid.Row>
              <h2>Energy price</h2>
              <Line data={data} options={chartOptions} height={100} />
            </Grid.Row>
            <Grid.Row style={{ paddingLeft: "20%", paddingRight: "20%" }}>
              <h3 className="titles">Your balances: </h3>
            </Grid.Row>
            <Grid.Row style={{ padding: "0% 20%" }}>
              <div className="currencyDiv" style={{ width: "100%" }}>
                <div className="divBorderCurrencySha">
                  <div className="divTagCurrencySha">
                    <p>SHA</p>
                  </div>
                  <h1 className="displaySha">{totalSha}</h1>
                </div>
                <div className="divBorderCurrencyEther">
                  <div className="divTagCurrencyEther">ETH</div>
                  <h1 className="displayEther">{this.state.totalEth}</h1>
                </div>
              </div>
            </Grid.Row>
            <Grid.Row style={{ padding: "0% 20%" }}>
              <h3 className="titles">Your actions:</h3>
            </Grid.Row>
            <Grid.Row style={{ padding: "0% 20%" }}>
              <Feed>
                <Feed.Event className="feedTitle">
                  <Feed.Content
                    date="● today"
                    summary="You bought 30kWh for 5 Shas"
                  />
                </Feed.Event>
                <Feed.Event className="feedTitle">
                  <Feed.Content
                    date="● yesterday"
                    summary="You earned 10 shas with your energy"
                  />
                </Feed.Event>
              </Feed>
              <div style={{ width: "100%", height: 300, paddingTop: 40 }}>
                <h3 className="titles">Source of energy sold:</h3>
                <Pie data={pieData} options={pieOptions} />
              </div>
            </Grid.Row>
          </Grid>
        </Responsive>
      </Fragment>
    );
  }
}

export default withRawDrizzle(Finance);
