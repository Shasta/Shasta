import React, { Component } from 'react';
import { Feed } from 'semantic-ui-react'

import D3 from './d3.js';

class Home extends Component {

  constructor(props) {
    super(props);

    this.state = {
      notificationsCount: this.props.userJson.contracts.length
    }
  }

  formatDate(millis) {

    var date = new Date(millis);
    var monthNames = [
      "January", "February", "March",
      "April", "May", "June", "July",
      "August", "September", "October",
      "November", "December"
    ];

    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    return day + ' ' + monthNames[monthIndex] + ' ' + year;
  }


  render() {

    const notifications = this.props.userJson.contracts.map((contract) => {

      return (
        <Feed.Event>
          <Feed.Content date={this.formatDate(contract.date)} summary={'New contract with ' + contract.marketer + ' for ' + contract.value + "€"} />
        </Feed.Event>
      );
    })

    return (
      // Menu with Bulma-React.
      <div style={{ marginLeft: '375px' }}>
        <h2 style={{ marginLeft: '30px', marginTop: '20px' }}>Welcome <a href='https://rinkeby.etherscan.io/address/{this.props.account}'>{this.props.username}</a>,</h2>
        <h5 style={{ marginLeft: '30px', marginTop: '10px' }}>You have {this.state.notificationsCount} notifications.</h5>
        <D3></D3>
        <Feed style={{ marginLeft: '40px', marginTop: '30px' }}>
          {notifications}
        </Feed>
      </div>
    );
  }
}

export default Home;
