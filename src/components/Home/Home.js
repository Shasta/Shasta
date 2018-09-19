import React, { Component } from 'react';
import { connect } from 'react-redux';
import withDrizzleContext from '../../utils/withDrizzleContext';
import ipfs from '../../ipfs';
import { Feed } from 'semantic-ui-react'
import _ from 'lodash';
import D3 from './d3.js';

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
    }
  }

  async componentDidMount() {
    const {drizzle, drizzleState,user} = this.props;
    const currentAccount = drizzleState.accounts[0]
    const drizzleMarket = drizzle.contracts.ShastaMarket;
    const drizzleMap = drizzle.contracts.SharedMapPrice;
    const drizzleUser = drizzle.contracts.User;

    const web3 = drizzle.web3;
    const rawOrgName = web3.utils.utf8ToHex(user.organization);
    const rawHash = await drizzle.contracts.User.methods.getIpfsHashByUsername(rawOrgName).call({from: currentAccount});
    const ipfsHash = web3.utils.hexToUtf8(rawHash);
    const rawJson = await ipfs.cat(ipfsHash);

    this.setState({
      userJson: JSON.parse(rawJson)
    })

    const shastaUserInstance = window.web3.eth.contract(drizzleUser.abi).at(drizzleUser.address);

    shastaUserInstance.UpdatedUser({owner: this.props.address}, {fromBlock: 0}, async (err, result) => {
      if (err) {
        console.error("Could not watch UpdatedUser event.", err)
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
          type: 'contract',
          timestamp: new Date(latestOffer.date)
        })

        this.setState( prevState => ({
          notifications: _([...prevState.notifications, ...[consumerNotification]])
          .orderBy('timestamp', 'desc')
          .slice(0, 5)
          .value(),
          lastestConsumerOfferIndex: currentLatestOfferIndex
        }))
      }
      if (currentLatestPOfferIndex > this.state.lastestProducerOfferIndex) {
        const producerNotification = _.merge(latestPOffer, {
          type: 'newProvider',
          timestamp: new Date(latestPOffer.date)
        })

        this.setState( prevState => ({
          notifications: _([...prevState.notifications, ...[producerNotification]])
          .orderBy('timestamp', 'desc')
          .slice(0, 5)
          .value(),
          lastestProducerOfferIndex: currentLatestPOfferIndex
        }))
      }
    });
  }

  render() {
    const {drizzleState} = this.props;
    const {userJson} = this.state;
    const organization = userJson.organization;
    const currentAccount = drizzleState.accounts[0];
    const notifications = this.state.notifications.map((notification, index) => {
      if (notification.type === "contract") {
        const name = (notification.ethAddress === this.props.address) ? "You" : `${notification.firstName} ${notification.lastName}`;
        return (
          <Feed.Event key={index} style={{marginTop: 10}}>
            <Feed.Content date={notification.timestamp.toLocaleString()} summary={`${name} posted new offer to buy ${notification.fiatAmount}€ at ${notification.energyPrice} €/kWh`} />
          </Feed.Event>
        );
      }
      if (notification.type === "newProvider") {
        return (
          <Feed.Event key={index} style={{marginTop: 10}}>
            <Feed.Content date={notification.timestamp.toLocaleString()} summary={`Provider ${notification.chargerName} offers energy at ${notification.energyPrice} kWh/€ from ${notification.providerSource} energy source.`} />
          </Feed.Event>
        );
      }
      return "";
    })

    return (
      // Menu with Bulma-React.
      <div style={{ marginLeft: '375px' }}>
        <h2 style={{ marginLeft: '30px', marginTop: '20px' }}>Welcome <a href={`https://rinkeby.etherscan.io/address/${currentAccount}`}>{organization.firstName}</a>,</h2>
        <h5 style={{ marginLeft: '30px', marginTop: '10px' }}>You have {this.state.notifications.length} notifications.</h5>
        <D3></D3>
        <Feed style={{ marginLeft: '40px', marginTop: '30px' }}>
          {notifications}
        </Feed>
      </div>
    );
  }
}

function mapStateToProps(state, props) { return { user: state.userReducer } }

export default withDrizzleContext(
  connect(
    mapStateToProps,
  )(Home)
);