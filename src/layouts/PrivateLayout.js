import React from "react";
import { privateRoutes } from "../routes";
import { Image, Menu, Sidebar, MenuItem } from "semantic-ui-react";
import { NavLink } from "react-router-dom";
import _ from "lodash";
import Tab from "../components/Tab/Tab";
import logo from "../static/logo-shasta-02.png";
import withDrizzleContext from "../utils/withDrizzleContext";
import { connect } from "react-redux";
import "./PrivateLayout.less";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

  }

  render() {
    const { web3, account, balance } = this.props;
    const Component = this.props.component;

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
          <Component {...this.props} />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return { user: state.userReducer };
}

export default withDrizzleContext(connect(mapStateToProps)(Dashboard));
