import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect} from 'react-router-dom';
import { UserActions } from '../redux/UserActions';

class Logout extends Component {
  constructor(props) {
    super(props);
    this.action = new UserActions(props.dispatch);
  }
  
  componentWillMount() {
    this.action.logout();
  }

  render() {
    return <Redirect to="/" />
  }
}


function mapStateToProps(state, props) { return { user: state } }
function mapDispatchToProps(dispatch) { return { dispatch }; }

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Logout);