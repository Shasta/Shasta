import React, { Component } from 'react';
import { Feed } from 'semantic-ui-react'
import _ from 'lodash';

import D3 from './d3.js';


class Home extends Component {

  constructor(props) {
    super(props);

    this.state = {
      notifications: [],
      lastestConsumerOfferIndex: -1,
      lastestProducerOfferIndex: -1,
    }
  }

  async componentDidMount() {
    const web3 = this.props.web3;
    const shastaUserInstance = await this.props.userContract.deployed();
    const shastaMarketInstance = await this.props.shastaMarketContract.deployed();
    const shastaMapInstance = await this.props.sharedMapContract.deployed();

    // Watch for NewLocation events, since this current block
    shastaMarketInstance.newOffer(null, {fromBlock: 0}, (err, result) => {
      if (err) {
        console.error("Could not watch newOffer event.", err)
        return;
      }
      web3.eth.getBlock(result.blockNumber, false, async (err, blockInfo) => {
        const timestamp = new Date(blockInfo.timestamp * 1000);
        const { value, locationIndex} = result.args
        const providerHash = await shastaMapInstance.locationsIpfsHashes.call(locationIndex);
        const rawProvider = await this.props.ipfs.cat(providerHash);
        const provider = JSON.parse(rawProvider.toString("utf8"));
        const notification = {
          type: 'newProvider',
          timestamp: timestamp,
          price: value,
          provider
        }
        this.setState( prevState => ({
          notifications: _([...prevState.notifications, ...[notification]])
            .orderBy('timestamp', 'desc')
            .slice(0, 5)
            .value()
        }))
      })
    });
    
    // Watch for new UpdatedUser notifications
    shastaUserInstance.UpdatedUser({owner: this.props.address}, {fromBlock: 0}, async (err, result) => {
      if (err) {
        console.error("Could not watch UpdatedUser event.", err)
        return;
      }
      const rawIpfsHash = result.args.ipfsHash;

      const userHash = this.props.web3.toAscii(rawIpfsHash);

      const rawUser = await this.props.ipfs.cat(userHash);
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
    const notifications = this.state.notifications.map((notification, index) => {
      if (notification.type === "contract") {
        var name = (notification.ethAddress === this.props.address) ? "You" : `${notification.firstName} ${notification.lastName}`;
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
        <h2 style={{ marginLeft: '30px', marginTop: '20px' }}>Welcome <a href='https://rinkeby.etherscan.io/address/{this.props.account}'>{this.props.userJson.organization.firstName}</a>,</h2>
        <h5 style={{ marginLeft: '30px', marginTop: '10px' }}>You have {this.state.notifications.length} notifications.</h5>
        <D3></D3>
        <Feed style={{ marginLeft: '40px', marginTop: '30px' }}>
          {notifications}
        </Feed>
      </div>
    );
  }
}

export default Home;
