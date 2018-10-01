import React, { Component } from 'react';
import { Input, Image, Button, Message } from 'semantic-ui-react';
import { Redirect, Link } from 'react-router-dom';
import styled from 'styled-components';
import withRawDrizzle from '../../utils/withRawDrizzle';

import { connect} from 'react-redux';
import { UserActions } from '../../redux/UserActions';
import { LoadingActions } from '../../redux/LoadingActions';

import ShastaLogo from '../../static/logo-shasta.png';

const Title = styled.h4`
  margin: 20px 0px;
  text-align: center;
  font-size: 1.4em;
`
const LoginInput = styled(Input)`
  margin: 0 auto;
  width: 100%;
`
const LoginButton = styled(Button)`
  &&&& {
    width: 100%;
    margin-top: 20px !important;
  }
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

  .ui.warning.message + ${LoginButton} {
    margin-top: 0px !important;
  }
`
const MessageHeader = styled(Message.Header)`
  &&&&&&& {
    font-size: 1rem;
  }
`

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.action = new UserActions(this.props.dispatch);
    this.loadAction = new LoadingActions(this.props.dispatch);
  }
  state = {
    organization: "",
    notFound: false
  }

  loginIn = async () => {
    const {initialized, drizzle, drizzleState} = this.props;
    this.setState({
      notFound: false,
      notSameUser: false
    });
    const username = this.state.organization;
    if (initialized && drizzleState && !!drizzleState.accounts && !!drizzleState.accounts[0]) {
      try {
        this.loadAction.show();
        const web3 = drizzle.web3;
        const rawNickname = web3.utils.utf8ToHex(username);
        const currentAddress = drizzleState.accounts[0];
        const orgAddress = await drizzle.contracts.User.methods.getAddressByUsername(rawNickname).call();
        const doesExist = await drizzle.contracts.User.methods.usernameTaken(rawNickname).call();
        if (!doesExist) {
          throw 'org-not-found';
        }
        if (orgAddress !== currentAddress) {
          throw 'org-not-same-address';
        }
        // Org exists and current user is org owner
        this.action.login(username);
        this.loadAction.hide();
      } catch (error) {
        this.loadAction.hide();
        if (error == 'org-not-same-address') {
          this.setState({
            notSameUser: true
          });
          return;
        }
        this.setState({
          notFound: true
        });
        return;
      }
    }
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }
  render() {
    const { organization, notFound, notSameUser } = this.state;
    const { user } = this.props;

    if (user.logged === true) {
      return <Redirect to="/home" />
    }

    let WarningMessage = null;

    if (notSameUser === true) {
      WarningMessage = (
        <Message warning>
          <MessageHeader>You don't have access to this existing organization.</MessageHeader>
          <span>Do you want to create a<Link to="/"> new organization?</Link></span>
        </Message>
      );
    }
    if (notFound === true) {
      WarningMessage = (
        <Message warning>
          <MessageHeader>Organization not found</MessageHeader>
          <span>Do you want to create a<Link to="/"> new organization?</Link></span>
        </Message>
      )
    }
    return (
      <div>
        <LoginBox>
          <Image centered src={ShastaLogo} size="small" />
          <Title>Welcome to Shasta</Title>
          <LoginInput value={organization} name="organization" placeholder="Your organization name" onChange={this.handleChange}/>
          {WarningMessage}
          <LoginButton onClick={this.loginIn}>
            Sign in
          </LoginButton>
        </LoginBox>
      </div>
    )
  }
}

function mapStateToProps(state, props) { return { user: state.userReducer } }
function mapDispatchToProps(dispatch) { return { dispatch }; }

export default withRawDrizzle(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SignIn)
);