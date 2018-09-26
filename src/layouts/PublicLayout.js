import React, { PureComponent } from 'react';
import { Menu, Button, Responsive, Sidebar } from 'semantic-ui-react'
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import _ from 'lodash';
import { connect } from 'react-redux';
import ShastaLogo from '../static/logo-nav.png';
import withRawDrizzle from '../utils/withRawDrizzle';
import RawNetworkStatus from '../components/NetworkStatus/NetworkStatus';
import LoadingCenter from '../components/LoadingCenter';
import { LoadingActions } from '../redux/LoadingActions';

const TopMenu = styled(Menu)`
& {
  height: 75px;
  @media only screen and (min-width: 1920px) {
    padding: 0px 80px;
  }
}
`
const ResponsiveMenu = styled(Menu.Item)`
&:before {
  display: none;
}
`
const AppLogo = styled(Menu.Item)`
  display: flex;
  align-items: center;
  &:before {
    display: none;
  }
  & > img {
    width: 200px !important;
  }
`

const NetworkStatus = withRawDrizzle(RawNetworkStatus)

class PublicHome extends PureComponent {
  constructor(props) {
    super(props);
    this.loaderAction = new LoadingActions(this.props.dispatch);
  }
  state = {
    visible: false
  }

  handleSidebarHide = () => {
    this.setState({
      visible: false
    })
  }

  handleSidebarShow = () => {
    this.setState({
      visible: true
    })
  }

  componentDidUpdate(newProps, newState) {
    const { drizzleState } = newProps;
    if (drizzleState && drizzleState.transactionStack) {
      const latestTx = drizzleState.transactionStack.length -1;
      const txHash = drizzleState.transactionStack[latestTx];
      const transaction = drizzleState.transactions[txHash];
      if (transaction && transaction.status) {
        const transactionStatus = transaction.status;
        if (transactionStatus === "pending" && newProps.isAppLoading == false) {
          this.loaderAction.show(); 
        } 
        if (transactionStatus !== "pending" && newProps.isAppLoading == true) {
          this.loaderAction.hide();
        }
      }
    }
  }

  componentWillUnmount() {
    this.loaderAction.hide();
  }

  render() {
    const Component = this.props.component;
    const isAppLoading = this.props.isAppLoading;
    const {visible} = this.state;
    //console.log("is loading", isAppLoading);
    return (
      <div>
        {/* The top menu */}
        <TopMenu>
          <AppLogo as={Link} to="/">
            <img src={ShastaLogo} style={{width: 295}}/>
          </AppLogo>
          <Responsive as={Menu.Menu} position='right' maxWidth="1024">
            <ResponsiveMenu as={Button} onClick={this.handleSidebarShow}>
              <Icon icon="bars" />
            </ResponsiveMenu>
          </Responsive>
        </TopMenu>

        {/* The lateral right sidebar for responsive menu*/}
        <Sidebar
          as={Menu}
          animation='overlay'
          icon='labeled'
          onHide={this.handleSidebarHide}
          vertical
          visible={visible}
          width='thin'
          direction='right'
        >
          <Menu.Item as={Link} to="/">
            Sign Up
          </Menu.Item>
          <Menu.Item as={Link} to="/sign-in">
            Sign In
          </Menu.Item>
        </Sidebar>
      
        <NetworkStatus />
        {/* The rendered component */}
        <Component  {...this.props} /> 
        {isAppLoading && <LoadingCenter />}
      </div>
    );
  }
}

function mapStateToProps(state, props) { return { isAppLoading: state.isAppLoading } };
function mapDispatchToProps(dispatch) { return { dispatch }; }

export default withRawDrizzle(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(PublicHome)
);
