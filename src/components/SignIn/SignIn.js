import React, { Component } from 'react';
import { Input, Image, Button } from 'semantic-ui-react';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';
import withRawDrizzle from '../../utils/withRawDrizzle';
import ipfs from '../../ipfs';

import { connect} from 'react-redux';
import {UserActions } from '../../redux/UserActions';

import ShastaLogo from '../../static/logo-shasta-02.png';

const Title = styled.h4`
  margin: 20px 0px;
  text-align: center;
  font-size: 1.4em;
`
const LoginInput = styled(Input)`
  margin: 0 auto;
  width: 100%;
`
const LoginBox = styled.div`
  margin: 60px auto;
  padding: 20px;
  max-width: 330px;
  width: 100%;
  heigh: 300px;
  border-radius: 7px;
  background: white;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.16), 0 0 0 1px rgba(0, 0, 0, 0.08);
`

const LoginButton = styled(Button)`
  margin-top: 20px !important;
  width: 100%;
`

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.action = new UserActions(this.props.dispatch);
  }
  state = {
    organization: "",
    toDashboard: false
  }

  loginIn = async () => {
    const {initialized, drizzle, drizzleState} = this.props;
    const username = this.state.organization;
    if (initialized && drizzleState && !!drizzleState.accounts && !!drizzleState.accounts[0]) {
      try {
        const web3 = drizzle.web3;
        const currentAccount = drizzleState.accounts[0];
        const rawNickname = web3.utils.utf8ToHex(username);
        const rawIpfsHash = await drizzle.contracts.User.methods.getIpfsHashByUsername(rawNickname).call();
        const ipfsHash = web3.utils.hexToUtf8(rawIpfsHash);
        const rawUserJson = await ipfs.cat(ipfsHash);
        const userJson = JSON.parse(rawUserJson.toString("utf8"));
        this.action.login(username)
        this.setState({
          toDashboard: true
        })
      } catch (error) {
        console.log(error)
      }
    }
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }
  render() {
    const { organization, toDashboard } = this.state;
    if (toDashboard == true) {
      return <Redirect to="/dashboard" />
    }
    return (
      <div>
        <LoginBox>
          <Image centered src={ShastaLogo} size="small" />
          <Title>Welcome to Shasta</Title>
          <LoginInput value={organization} name="organization" placeholder="Your organization name" onChange={this.handleChange}/>
          <LoginButton onClick={this.loginIn}>
            Sign in
          </LoginButton>
        </LoginBox>
      </div>
    )
  }
}

function mapStateToProps(state, props) { return { user: state } }
function mapDispatchToProps(dispatch) { return { dispatch }; }

export default withRawDrizzle(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SignIn)
);