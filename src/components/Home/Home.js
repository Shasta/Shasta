import React, { Component } from 'react';
import { Feed } from 'semantic-ui-react'
import _ from 'lodash';

import D3 from './d3.js';


class Home extends Component {

  constructor(props) {
    super(props);

    this.state = {
      notifications: [],
      latestContractIndex: -1,
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
        let currentNotifications = this.state.notifications;
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
      let currentNotifications = this.state.notifications;
      const rawIpfsHash = result.args.ipfsHash;

      const userHash = this.props.web3.toAscii(rawIpfsHash);

      const rawUser = await this.props.ipfs.cat(userHash);
      const user = JSON.parse(rawUser.toString("utf8"));
      const currentLatestContractIndex = user.contracts.length - 1;
      const latestContract = user.contracts[currentLatestContractIndex];
      if (currentLatestContractIndex > this.state.latestContractIndex) {
        const notification = _.merge(latestContract, {
          type: 'contract',
          timestamp: new Date(latestContract.date)
        })

        this.setState( prevState => ({
          notifications: _([...prevState.notifications, ...[notification]])
          .orderBy('timestamp', 'desc')
          .slice(0, 5)
          .value(),
          latestContractIndex: currentLatestContractIndex
        }))
      }
    });
  }

  render() {
      console.log(this.state.notifications)
    const notifications = this.state.notifications.map((notification, index) => {
      if (notification.type == "contract") {
        return (
          <Feed.Event key={index}>
            <Feed.Content date={notification.timestamp.toLocaleString()} summary={`New contract with ${notification.marketer} for ${notification.value} €`} />
          </Feed.Event>
        );
      }
      if (notification.type == "newProvider") {
        return (
          <Feed.Event key={index}>
            <Feed.Content date={notification.timestamp.toLocaleString()} summary={`New provider ${notification.provider.chargerName} offers ${notification.price} kWh/€ from ${notification.provider.providerSource} energy source.`} />
          </Feed.Event>
        );
      }
      return "";
    })

    return (
      // Menu with Bulma-React.
      <div style={{ marginLeft: '375px' }}>
        <h2 style={{ marginLeft: '30px', marginTop: '20px' }}>Welcome <a href='https://rinkeby.etherscan.io/address/{this.props.account}'>{this.props.username}</a>,</h2>
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
