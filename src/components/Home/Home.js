import React, { Component } from "react";
import { connect } from "react-redux";
import withDrizzleContext from "../../utils/withDrizzleContext";
import ipfs from "../../ipfs";
import { Feed, Grid } from "semantic-ui-react";
import _ from "lodash";
import { Line } from "react-chartjs-2";
import styled from "styled-components";
import iconWelcomeUser from "../../static/welcome-user.png";

const ShastaFeedDate = styled(Feed.Date)`
  color: #f076b6 !important;
  font-size: 1vw !important;
`;

const ShastaFeedSummary = styled(Feed.Summary)`
  font-size: 0.8vw !important;
  font-weight: normal !important;
  margin-left: 15px !important;
`;

const ShastaIcon = styled.img`
  vertical-align: middle;
  width: 40px;
  height: 40px;
  margin-right: 20px;
`;

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userJson: {
        organization: {
          firstName: ""
        }
      },
      notifications: [],
      lastestConsumerOfferIndex: -1,
      lastestProducerOfferIndex: -1,
      tokenBalancePointer: ""
    };
  }

  async componentDidMount() {
    const { drizzle, drizzleState, user } = this.props;
    const currentAccount = drizzleState.accounts[0];
    const drizzleUser = drizzle.contracts.User;

    const web3 = drizzle.web3;
    const rawOrgName = web3.utils.utf8ToHex(user.organization);
    const rawHash = await drizzle.contracts.User.methods
      .getIpfsHashByUsername(rawOrgName)
      .call({ from: currentAccount });
    const ipfsHash = web3.utils.hexToUtf8(rawHash);
    const rawJson = await ipfs.cat(ipfsHash);

    const shaLedgerInstance = drizzle.contracts.ShaLedger;
    const tokenBalancePointer = shaLedgerInstance.methods.balanceOf.cacheCall(
      currentAccount
    );

    this.setState({
      userJson: JSON.parse(rawJson),
      tokenBalancePointer
    });

    const shastaUserInstance = window.web3.eth
      .contract(drizzleUser.abi)
      .at(drizzleUser.address);

    shastaUserInstance.UpdatedUser(
      { owner: this.props.address },
      { fromBlock: 0 },
      async (err, result) => {
        if (err) {
          console.error("Could not watch UpdatedUser event.", err);
          return;
        }
        const rawIpfsHash = result.args.ipfsHash;

        const userHash = web3.utils.hexToUtf8(rawIpfsHash);

        const rawUser = await ipfs.cat(userHash);
        const user = JSON.parse(rawUser.toString("utf8"));
        const currentLatestOfferIndex = user.consumerOffers.length - 1;
        const currentLatestPOfferIndex = user.producerOffers.length - 1;
        const latestOffer = user.consumerOffers[currentLatestOfferIndex];
        const latestPOffer = user.producerOffers[currentLatestPOfferIndex];
        if (currentLatestOfferIndex > this.state.lastestConsumerOfferIndex) {
          const consumerNotification = _.merge(latestOffer, {
            type: "contract",
            timestamp: new Date(latestOffer.date)
          });

          this.setState(prevState => ({
            notifications: _([
              ...prevState.notifications,
              ...[consumerNotification]
            ])
              .orderBy("timestamp", "desc")
              .slice(0, 5)
              .value(),
            lastestConsumerOfferIndex: currentLatestOfferIndex
          }));
        }
        if (currentLatestPOfferIndex > this.state.lastestProducerOfferIndex) {
          const producerNotification = _.merge(latestPOffer, {
            type: "newProvider",
            timestamp: new Date(latestPOffer.date)
          });

          this.setState(prevState => ({
            notifications: _([
              ...prevState.notifications,
              ...[producerNotification]
            ])
              .orderBy("timestamp", "desc")
              .slice(0, 5)
              .value(),
            lastestProducerOfferIndex: currentLatestPOfferIndex
          }));
        }
      }
    );
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

    //Chart fake data
    const data = {
      labels: ["January", "February", "March", "April", "May", "June", "July"],
      datasets: [
        {
          label: "Amount of shas",
          lineTension: 0.1,
          backgroundColor: "rgba(66,49,66,0.4)",
          borderColor: "rgba(66,49,66,1)",
          borderCapStyle: "butt",
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: "miter",
          pointBorderColor: "rgba(66,49,66,1)",
          pointBackgroundColor: "#fad",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(66,49,66,1)",
          pointHoverBorderColor: "rgba(66,49,66,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          fill: true,
          data: [65, 59, 80, 81, 56, 55, totalSha]
        }
      ]
    };

    const options = {
      responsive: true,
      legend: {
        labels: {
          boxWidth: 0
        }
      }
    };

    const { userJson } = this.state;
    const organization = userJson.organization;
    const currentAccount = drizzleState.accounts[0];
    const notifications = this.state.notifications.map(
      (notification, index) => {
        if (notification.type === "newProvider") {
          return (
            <Feed.Event key={index} style={{ marginTop: 10 }}>
              <Feed.Content>
                <ShastaFeedDate>
                  • {notification.timestamp.toLocaleString()}
                </ShastaFeedDate>
                <ShastaFeedSummary>
                  Provider {notification.chargerName} offers energy at $
                  {notification.energyPrice} kWh/€ from{" "}
                  {notification.providerSource} energy source.
                </ShastaFeedSummary>
              </Feed.Content>
            </Feed.Event>
          );
        }
        return "";
      }
    );

    return (
      <Grid>
        <Grid.Row>
          <Grid.Column width={16}>
            <h2>
              <ShastaIcon src={iconWelcomeUser} />
              Welcome,{" "}
              <a
                style={{ color: "#f6a6d1" }}
                href={`https://rinkeby.etherscan.io/address/${currentAccount}`}
              >
                {organization.firstName}
              </a>
              
            </h2>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column width={16}>
            <h5>You have {this.state.notifications.length} notifications.</h5>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={10}>
            <Line data={data} options={options} />
          </Grid.Column>
          <Grid.Column width={6} />
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={16}>
            <Feed>{notifications}</Feed>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

function mapStateToProps(state, props) {
  return { user: state.userReducer };
}

export default withDrizzleContext(connect(mapStateToProps)(Home));
