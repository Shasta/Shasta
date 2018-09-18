import React, { Component } from 'react';
import { Route, BrowserRouter, Redirect, Switch} from 'react-router-dom';
import _ from 'lodash';
import { publicRoutes, privateRoutes} from './routes';
import {connect} from 'react-redux';
import {UserActions} from './redux/UserActions';

import PublicLayout from './layouts/PublicLayout';
import PrivateLayout from './layouts/PrivateLayout';

const NotFound = () => (
  <div>Not found 404</div>
)

class App extends Component {
  constructor(props) {
    super(props);
    
    this.userActions = new UserActions(this.props.dispatch);
  }

  componentWillMount() {
    this.userActions.verify();
  }

  render() {
    const user = this.props.user ? this.props.user : { logged: false };
    return (
      <BrowserRouter>
        <Switch>
          { _.map(publicRoutes, (publicRoute, key) => {
            const { component, path } = publicRoute;
            return (
              <Route
                exact
                path={path}
                key={key}
                render={ (route) => 
                    <PublicLayout 
                      component={component}
                      route={route} 
                    /> 
                }
              />
            )
          })}
          
          { _.map(privateRoutes, (route, key) => {
            const { component, path } = route;
            return (
              <Route
                exact
                path={path}
                key={key}
                render={ () => 
                  user.logged ? (
                    <PrivateLayout 
                        component={component}  
                        route={route}
                    />
                  ) : (
                    <PublicLayout 
                        component={publicRoutes["SignUp"].component} 
                        route={route}
                    />
                  )
                }
              />
            )
          })}
          <Route component={ NotFound } />
        </Switch>
      </BrowserRouter>
    );
  }
}

function mapStateToProps(state, props) { return { user: state.userReducer } }
function mapDispatchToProps(dispatch) { return { dispatch }; }

export default  connect(
    mapStateToProps,
    mapDispatchToProps
)(App);