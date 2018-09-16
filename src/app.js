import React, { Component } from 'react';
import PrivateDashboard from './routing';
import PublicHome from './components/PublicHome/PublicHome.js'
import { Route } from 'react-router-dom';

class App extends Component {
  constructor(props) {
    super(props);

    const username = localStorage.getItem("username");

    this.state = {
      username,
      isLogged: false
    }
  }

  saveUsernameToLocal = () => {
    const { username } = this.state;
    localStorage.setItem("username", username);
  }

  loginViaUsername = async (username) => {
    const {initialized, drizzle, drizzleState, ipfs} = this.props;
    if (initialized && drizzleState && !!drizzleState.accounts && !!drizzleState.accounts[0]) {
      try {
        const web3 = drizzle.web3;
        const currentAccount = drizzleState.accounts[0];
        const rawNickname = web3.utils.utf8ToHex(username);
        const rawIpfsHash = await drizzle.contracts.User.methods.getIpfsHashByUsername.call(username);
        const ipfsHash = web3.utils.hexToUtf8(rawIpfsHash);
        const rawUserJson = await ipfs.cat(ipfsHash);
        const userJson = JSON.parse(rawUserJson.toString("utf8"));
        this.setState({
          isLogged: true,
          username
        }, this.saveUsernameToLocal);
      } catch (error) {
        this.setState({
          isLogged: false,
        })
      }
    }
  }

  async componentDidMount() {
    await this.loginViaUsername(this.state.username);
  }

  render() {
    const { isLogged } = this.state;

    if (isLogged === true) {
      return <PrivateDashboard />
    }
    return <PublicHome checkAuth={this.loginViaUsername} />
  }
}

export default App;