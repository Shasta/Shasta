import React, { Component } from "react";
import { Route, BrowserRouter, Switch, Redirect } from "react-router-dom";
import { withRouter } from "react-router";
import _ from "lodash";
import { publicRoutes, privateRoutes } from "./routes";
import { connect } from "react-redux";
import { UserActions } from "./redux/UserActions";

import Logout from "./components/Logout";
import PublicLayout from "./layouts/PublicLayout";
import PrivateLayout from "./layouts/PrivateLayout";

import Error404 from "./components/404/Error404";
var Web3 = require('web3');

class App extends Component {
  constructor(props) {
    super(props);

    this.userActions = new UserActions(this.props.dispatch);

    this.props.history.listen((location, action) => {
      this.userActions.verify();
    });
  }

  componentWillMount() {
    this.userActions.verify();
  }

  render() {
    const user = this.props.user ? this.props.user : { logged: false };
    return (
      <Switch>
        {_.map(publicRoutes, (publicRoute, key) => {
          const { component, path } = publicRoute;
          return (
            <Route
              exact
              path={path}
              key={key}
              render={route =>
                user.logged ? (
                  <Redirect to="/home" />
                ) : (
                  <PublicLayout component={component} route={route} />
                )
              }
            />
          );
        })}

        {_.map(privateRoutes, (route, key) => {
          const { component, path } = route;
          return (
            <Route
              exact
              path={path}
              key={key}
              render={() =>
                user.logged ? (
                  <PrivateLayout component={component} route={route} />
                ) : (
                  <Redirect to="/" />
                )
              }
            />
          );
        })}
        <Route path="/logout" component={Logout} />
        <Route component={Error404} />
      </Switch>
    );
  }
}

function mapStateToProps(state, props) {
  return { user: state.userReducer };
}
function mapDispatchToProps(dispatch) {
  return { dispatch };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
);
