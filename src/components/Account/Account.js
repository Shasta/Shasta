import React, { Component } from "react";
import { Button } from "semantic-ui-react";
import withDrizzleContext from "../../utils/withDrizzleContext.js";
import MintSha from "./MintSha";
import styled from "styled-components";
import { connect } from "react-redux";
import { UserActions } from "../../redux/UserActions";
import { Redirect } from "react-router-dom";
import "./Account.less";

const MintShaModal = withDrizzleContext(MintSha);

const EthAccount = styled.div`
  display: flex;
  align-items: center;
  & > * {
    font-size: 1rem;
    margin-left: 20px !important;
  }
`;

const ShastaButton = styled(Button)`
  border-radius: 8px !important;
  padding: 8px 25px !important;
  border: 0 !important;
`;

class AccountData extends Component {
  constructor(props, context) {
    super(props);

    this.state = {
      menu: null,
      asked: false,
      tokenBalancePointer: "",
      currentAddress: null
    };

    this.action = new UserActions(this.props.dispatch);
  }

  precisionRound(number, precision) {
    var factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
  }

  componentWillReceiveProps(nextProps) {
    const { drizzleState } = nextProps;
    const { accounts } = drizzleState;
    const { currentAddress } = this.state;
    const newAddress = accounts[0];
    if (newAddress !== currentAddress && !!currentAddress) {
      this.action.logout();
    }
  }

  async componentDidMount() {
    const { drizzleState, drizzle, accountIndex } = this.props;
    const { accounts } = drizzleState;
    const currentAddress = accounts[accountIndex];

    const shaLedgerInstance = drizzle.contracts.ShaLedger;
    const tokenBalancePointer = shaLedgerInstance.methods.balanceOf.cacheCall(
      currentAddress
    );

    this.setState({
      tokenBalancePointer,
      currentAddress
    });
  }

  render() {
    const { drizzleState, drizzle } = this.props;
    const { tokenBalancePointer } = this.state;
    const { accounts, accountBalances } = drizzleState;
    const { web3 } = drizzle;

    if (!this.props.user.logged) {
      return <Redirect to="/" />;
    }
    let tokenBalance = 0;
    const ShaLedgerState = drizzleState.contracts.ShaLedger;
    if (tokenBalancePointer in ShaLedgerState.balanceOf) {
      // ShaLedger have 18 decimals, like Ether, so we can reuse `fromWei` util function.
      tokenBalance = web3.utils.fromWei(
        ShaLedgerState.balanceOf[tokenBalancePointer].value,
        "ether"
      );
    }

    // No accounts found.
    if (Object.keys(accounts).length === 0) {
      return <span>Initializing...</span>;
    }

    // Get account address and balance.
    const address = accounts[this.props.accountIndex];
    let balance = accountBalances[address];
    const units = this.props.units
      ? this.props.units.charAt(0).toUpperCase() + this.props.units.slice(1)
      : "Wei";
    if (!balance) {
      return <span>Initializing...</span>;
    }
    // Convert to given units.
    if (this.props.units) {
      balance = web3.utils.fromWei(balance, this.props.units);
    }

    // Adjust to given precision.
    if (this.props.precision) {
      balance = this.precisionRound(balance, this.props.precision);
    }
    return (
      <EthAccount>
        <div className="indicatorEth">
          {balance} {units}
        </div>
        <div className="indicatorSha">{tokenBalance} Sha</div>
        <MintShaModal>
          <ShastaButton color="purple">Get Sha</ShastaButton>
        </MintShaModal>
      </EthAccount>
    );
  }
}

function mapStateToProps(state, props) {
  return { user: state.userReducer };
}
function mapDispatchToProps(dispatch) {
  return { dispatch };
}

export default withDrizzleContext(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(AccountData)
);
