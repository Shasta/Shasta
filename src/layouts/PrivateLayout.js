import React from "react";
import { privateRoutes } from "../routes";
import { Image, Menu, Sidebar, MenuItem } from "semantic-ui-react";
import { NavLink, Redirect } from "react-router-dom";
import _ from "lodash";
import Tab from "../components/Tab/Tab";
import logo from "../static/logo-shasta.png";
import withRawDrizzle from "../utils/withRawDrizzle";
import { connect } from "react-redux";
import "./PrivateLayout.less";
import LoadingTop from '../components/LoadingTop';
import LoadingCenter from '../components/LoadingCenter';
import { LoadingActions }  from '../redux/LoadingActions';
import { UserActions }  from '../redux/UserActions';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.loaderAction = new LoadingActions(this.props.dispatch);
    this.userActions = new UserActions(this.props.dispatch);
  }

  componentDidUpdate(newProps, newState) {
    const { drizzleState, initialized, isAppLoading } = newProps;

    if (drizzleState && drizzleState.transactionStack) {
      const latestTx = drizzleState.transactionStack.length -1;
      const txHash = drizzleState.transactionStack[latestTx];
      const transaction = drizzleState.transactions[txHash];
      if (transaction && transaction.status) {
        const transactionStatus = transaction.status;
        if (transactionStatus === "pending" && newProps.isAppLoading == false) {
          console.log("show");
          this.loaderAction.show(); 
        } 
        if (transactionStatus !== "pending" && newProps.isAppLoading == true) {
          console.log("hide");
          this.loaderAction.hide();
        }
      }
    }
  }
  
  componentWillUnmount() {
    this.loaderAction.hide();
  }
  
  render() {
    const { web3, account, balance, isAppLoading, initialized, drizzleState, user } = this.props;
    const Component = this.props.component;
    const drizzleInit = initialized && drizzleState;
    const drizzleUnlocked = initialized && drizzleState && !!Object.keys(drizzleState.accounts).length;
    if (drizzleInit && !drizzleUnlocked) {
      return <Redirect to="/logout" />
    }
    const Links = _.map(privateRoutes, (privRoute, key) => {
      if (!privRoute.hiddenOnSideBar) {
        return (
          <MenuItem
            className="menuItem"
            as={NavLink}
            to={privRoute.path}
            activeClassName="nav-active-link"
            key={key}
          >
            <div className="itemDiv">
              <Image
                className="iconOff"
                style={{ width: 35, height: 30 }}
                src={privRoute.iconOff}
              />
              <Image
                className="iconOn"
                style={{ width: 35, height: 30 }}
                src={privRoute.iconOn}
              />
              <div className="itemNameDiv">
                <span>{privRoute.title}</span>
              </div>
            </div>
          </MenuItem>
        );
      }
    });

    return (
      <div>
        <Tab web3={web3} account={account} balance={balance} />
        <Sidebar
          as={Menu}
          animation="overlay"
          icon="labeled"
          vertical
          visible
          style={{
            display: "flex",
            alignItems: "center",
            paddingTop: 40,
            width: "20%"
          }}
        >
          <Image
            className="logo"
            src={logo}
            size="small"
            style={{ paddingBottom: 20 }}
          />
          {Links}
        </Sidebar>

        {/* Render component */}

        <div
          style={{
            // backgroundColor: "red",
            marginLeft: "20%",
            // border: "4px dotted blue",
            padding: "60px"
          }}
        >
          { drizzleInit && !drizzleUnlocked && <div>You Ethereum account should be unlocked. </div>}
          { drizzleUnlocked && <Component {...this.props} /> }
        </div>
        {isAppLoading == true && <LoadingTop />}
        {!drizzleInit && <LoadingCenter />}
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    user: state.userReducer,
    isAppLoading: state.isAppLoading
  };
}

function mapDispatchToProps(dispatch) { return { dispatch }; }

export default withRawDrizzle(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Dashboard)
);