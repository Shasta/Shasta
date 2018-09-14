import React, { Component } from 'react'
import { Button,  Modal } from 'semantic-ui-react'
import withDrizzleContext from '../../utils/withDrizzleContext.js';
import parseDrizzleError from '../../utils/parseDrizzleError.js';
import stringHelpers from '../../utils/stringHelpers.js';

class MintSha extends Component {
  state = {
    shasToMint: "100",
    tx: -1,
    modalOpen: false
  }

  mintTokens = async () => {
    const { drizzle, drizzleState } = this.props;
    const { shasToMint } = this.state;
    const { web3, contracts} = drizzle;
    const { accounts } = drizzleState;

    const mint = contracts.ShaLedger.methods['mint'];
    if (accounts[0]) {
      const shas = web3.utils.toWei(shasToMint, 'ether');
      const params = [accounts[0], shas];
      const options = {
        from: accounts[0],
        gas: 100000
      }

      const cacheSendParams = [...params, ...[options]];
      const tx = mint.cacheSend(...params, options);

      console.log(tx)
      this.setState(() => ({
        tx
      }));

      this.props.afterClaim();
    }
  }

  handleOpen = () => this.setState({ modalOpen: true })

  handleClose = () => this.setState({ modalOpen: false })

  async componentDidMount() {
    const { drizzleState, drizzle, openAtStart} = this.props;
    const { accounts } = drizzleState; 
    const currentAddress = accounts[0];

    const shaLedgerInstance = drizzle.contracts.ShaLedger;

    const currentBalanceCall = await shaLedgerInstance.methods.balanceOf(currentAddress).call(currentAddress, {from: currentAddress});
    if (openAtStart && currentBalanceCall === "0") {
      this.setState({
        modalOpen: true
      })
    }
  }
  render() {
    let transactionStatus;
    let transactionMsg = "";
    const { drizzleState} = this.props;
    const { tx } = this.state;
    
    if (tx >= 0) {
      const txHash = drizzleState.transactionStack[tx];
      if (drizzleState.transactions[txHash]) {
        transactionStatus = stringHelpers.capitalize(drizzleState.transactions[txHash].status);
        transactionMsg = transactionStatus;
      }
      if (transactionStatus == "Error") {
        transactionMsg = parseDrizzleError(drizzleState.transactions[txHash].error.message);
      }
    }
    return(
      <Modal
        trigger={<div onClick={this.handleOpen}>{this.props.children}</div>}
        onClose={this.handleClose}
        open={this.state.modalOpen}
      >
        <Modal.Header>Claim your testnet Shasta tokens</Modal.Header>
        <Modal.Content>
          <p>
            Get your <u>100 Shasta</u> tokens to try the platform. Click in 'Claim your SHA' to initiate the transaction.
            Remember you need Test Ether to retrieve your Sha Token. If you dont have any test Ether, you can retrieve from this <a href="https://faucet.rinkeby.io/" target="blank">Rinkeby testnet faucet.</a>
          </p>
          {transactionMsg.length > 0 && (<p>Transaction status: {transactionMsg}</p>)}
        </Modal.Content>
        <Modal.Actions>
          <Button basic color='grey' onClick={this.handleClose} >
            Close
          </Button>
          <Button basic color='green' onClick={this.mintTokens}>
            Claim your 100 SHA
          </Button>
      </Modal.Actions>
      </Modal>
    )
  }
}

export default withDrizzleContext(MintSha);