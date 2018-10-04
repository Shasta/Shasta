import React, { Component } from 'react';
import { Input, Image, Button, Message } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import withRawDrizzle from '../../utils/withRawDrizzle';

import ShastaLogo from '../../static/logo-shasta.png';

const targetNetwork = process.env.TARGET_NETWORK;

const Title = styled.h4`
  margin: 20px 0px;
  text-align: center;
  font-size: 1.4em;
`
const ForgotButton = styled(Button)`
  &&&& {
    width: 100%;
    margin-top: 20px !important;
    background: #ea78bc;
    &:hover, &:focus, &:active {
      background: #f4b8df;;
    }
  }
`
const ForgotBox = styled.div`
  margin: 60px auto;
  padding: 20px;
  max-width: 430px;
  width: 100%;
  border-radius: 7px;
  background: white;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.16), 0 0 0 1px rgba(0, 0, 0, 0.08);

  .ui.message + ${ForgotButton} {
    margin-top: 0px !important;
  }
  @media only screen and (max-width: 450px) {
    max-width: 330px;
  }
  & a {
    color: #ea78bc;
    text-decoration: underline;
    text-decoration-color: #ea78bc;
  }
`
class ForgotOrganization extends Component {
  state = {
    orgName: "",
    msg: ""
  }

  reminderOrg = async () => {
    const {initialized, drizzle, drizzleState} = this.props;
    this.setState({
      orgName: "",
      msg: ""
    })
    if (initialized && drizzleState && !!drizzleState.accounts && !!drizzleState.accounts[0]) {
      try {
        const web3 = drizzle.web3;
        const currentAddress = drizzleState.accounts[0];
        const orgName = await drizzle.contracts.User.methods.getUsernameByAddress(currentAddress).call();
        if (!orgName) {
          throw 'org-not-found';
        }
        this.setState({
          orgName: web3.utils.hexToUtf8(orgName)
        })
        return;
      } catch (error) {
        if (error == 'org-not-found') {
          this.setState({
            msg: "Your Ethereum address is not registered in Shasta."
          });
          return;
        }
        this.setState({
          msg: "Your Ethereum address is not registered in Shasta."
        });
        return;
      }
    }
    this.setState({
      msg: "Sign in Metamask and unlock your Ethereum account."
    })
  }

  render() {
    const {initialized, drizzle, drizzleState} = this.props;
    const { orgName, msg } = this.state;

    let WarningMessage = null;
    let SuccessMessage = null;
    let currentAddress = (
        <span>Please unlock your account at Metamask</span>
    );
    
    if (!!msg.length) {
      WarningMessage = (
        <Message warning>
          {msg}
        </Message>
      );
    }
    if (!!orgName) {
      SuccessMessage = (
        <Message success>
          Your organization name is: <b>{orgName}</b>
        </Message>
      )
    }
    if (initialized && drizzleState && !!drizzleState.accounts && !!drizzleState.accounts[0]) {
      currentAddress = (
        <span>Current address <br/><span style={{background: "rgba(244, 184, 223, 0.44)"}}>{drizzleState.accounts[0]}</span></span>
      )
    }
    return (
      <ForgotBox>
        <Image centered src={ShastaLogo} size="small" />
        <Title>Forgot organization?</Title>
        <div style={{textAlign: 'center'}}>
          {currentAddress}
        </div>
        <Message>
          <p>You can know which organization belongs to the current selected Ethereum address by pressing the "Reminder" button.</p>
          <p>Remember you need to be connected to the <u>{targetNetwork}</u> network.</p>
        </Message>
        {WarningMessage}
        {SuccessMessage}
        <ForgotButton primary onClick={this.reminderOrg}>
          Reminder
        </ForgotButton>
        <div style={{marginTop: 10, display: 'flex', justifyContent: 'space-between'}}>
          <Link to="/sign-in">Sign in</Link>
          <Link to="/">Create your organization</Link>
        </div>
      </ForgotBox>
    )
  }
}

function mapStateToProps(state, props) { return { user: state.userReducer } }
function mapDispatchToProps(dispatch) { return { dispatch }; }

export default withRawDrizzle(
  ForgotOrganization
);