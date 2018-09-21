import React, { Component } from 'react';
import { Button, Dropdown, Card, Loader, Segment, Grid, Image } from 'semantic-ui-react'
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'

//import icons
import solarOffIcon from "./sourceIcons/solar-energy-off.png";
import solarOnIcon from "./sourceIcons/solar-energy-on.png";
import eolicOffIcon from "./sourceIcons/eolic-energy-off.png";
import eolicOnIcon from "./sourceIcons/eolic-energy-on.png";
import biomassOffIcon from "./sourceIcons/biomass-energy-off.png";
import biomassOnIcon from "./sourceIcons/biomass-energy-on.png";
import otherOffIcon from "./sourceIcons/other-energy-off.png";
import otherOnIcon from "./sourceIcons/other-energy-on.png";
import nuclearOffIcon from "./sourceIcons/nuclear-energy-off.png";
import nuclearOnIcon from "./sourceIcons/nuclear-energy-on.png";

import './Consumer.css';
import ipfs from '../../ipfs'
import withDrizzleContext from '../../utils/withDrizzleContext'
import { connect } from 'react-redux';
import { countryOptions } from './common'
import MyStep from './stepper/MyStep'
import styled from 'styled-components';

var _ = require('lodash');
//Styled components
const ShastaButton = styled(Button)`
  background-color: #423142 !important;
  border-radius: 8px !important;
  padding: 12px 25px !important;
  border:0 !important;
`;

const ShastaBuyButton = styled(Button)`
  background-color: white !important;
  border-radius: 8px !important;
  padding: 12px 25px !important;
  border-style: solid !important;
  border-color: gray !important;
  border-width: thin !important;
`;

const ShastaCard = styled(Card)`

  width: 80% !important;
  margin: 10px !important;
  border-radius: 0px 20px 20px 0px !important;
  border-left: 10px solid #f076b6 !important;
  box-shadow: 0px 1px 1px 1px #D4D4D5 !important;
`;

const ShastaGridRow = styled(Grid.Row)`
  border-left: 10px solid #f076b6 !important;
`;

let checkedAddresses = [];
const sources = [
  {
    key: 0,
    text: "Solar",
    value: "Solar",
    imgSrc: solarOffIcon,
    imgSrc2: solarOnIcon
  }, {
    key: 1,
    text: "Nuclear",
    value: "Nuclear",
    imgSrc: nuclearOffIcon,
    imgSrc2: nuclearOnIcon
  }, {
    key: 2,
    text: "Eolic",
    value: "Eolic",
    imgSrc: eolicOffIcon,
    imgSrc2: eolicOnIcon
  }, {
    key: 3,
    text: "Biomass",
    value: "Biomass",
    imgSrc: biomassOffIcon,
    imgSrc2: biomassOnIcon
  }, {
    key: 4,
    text: "Other",
    value: "Other",
    imgSrc: otherOffIcon,
    imgSrc2: otherOnIcon
  }
]

const pricesRanges = [
  {
    text: "100 kWh",
    value: 100
  },
  {
    text: "200 kWh",
    value: 200
  }, {
    text: "300 kWh",
    value: 300
  }, {
    text: "400 kWh",
    value: 400
  }, {
    text: "500 kWh",
    value: 500
  }, {
    text: "600 kWh",
    value: 600
  }
]

class Consumer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      userJson: {
        consumerOffers: [],
        producerOffers: [],
      },
      selectedContract: null,
      visible: false,
      percent: 0,
      ipfsHash: '',
      ipfsFirstName: '',
      ipfsAddress: '',
      address: '',
      producersOffersList: [],
      totalToPay: 0,
      filterSources: [],
      filterCountry: '',
      filterAmount: '',
      currentStep: 0,
      tx: null
    }

    this.handleSourceClick = this.handleSourceClick.bind(this);
  }

  async componentDidMount() {
    const { drizzle, drizzleState, user } = this.props;
    const currentAccount = drizzleState.accounts[0]

    const web3 = drizzle.web3;
    const rawOrgName = web3.utils.utf8ToHex(user.organization);
    const rawHash = await drizzle.contracts.User.methods.getIpfsHashByUsername(rawOrgName).call({ from: currentAccount });
    const ipfsHash = web3.utils.hexToUtf8(rawHash);
    const rawJson = await ipfs.cat(ipfsHash);
    this.setState({
      userJson: JSON.parse(rawJson)
    })
    this.getProducerOffers();
  }

  async getProducerOffers() {
    const { drizzle, drizzleState } = this.props;
    const web3 = drizzle.web3;
    const currentAccount = drizzleState.accounts[0];
    const shastaMarketInstance = drizzle.contracts.ShastaMarket;
    const userContractInstance = drizzle.contracts.User;


    // Offers
    let producersOffersList = [];
    const offersLength = await shastaMarketInstance.methods.getOffersLength().call({ from: currentAccount });
    let auxArray = Array.from({ length: Number.parseInt(offersLength) }, (x, item) => item);

    auxArray.forEach(async (item, i) => {

      let userContract = await shastaMarketInstance.methods.getOfferFromIndex(i).call({ from: currentAccount });
      let userAddress = userContract[1];
      if (!checkedAddresses.includes(userAddress)) {

        checkedAddresses.push(userAddress);
        let ipfsHashRaw = await userContractInstance.methods.getIpfsHashByAddress(userAddress).call({ from: userAddress });
        let ipfsHash = web3.utils.hexToUtf8(ipfsHashRaw);

        let rawContent = await ipfs.cat(ipfsHash);
        let userData = JSON.parse(rawContent.toString("utf8"));

        for (let key in userData.producerOffers) {
          if (userData.producerOffers.hasOwnProperty(key)) {
            producersOffersList.push(userData.producerOffers[key])
          }
        }
        this.setState(({
          producersOffersList: producersOffersList.sort((a, b) => a.energyPrice < b.energyPrice)
        }));
      }
    })
  }

  selectCountry = (e, val) => {
    this.setState({ filterCountry: val.value });
  }

  handleChangefilterAmount = (e, data) => {
    this.setState({
      filterAmount: data.value
    })
  }

  handleNextClick = () => {
    const current = this.state.currentStep;

    if (current < 2) {
      this.setState({
        currentStep: current + 1
      });
    }
  }

  handleSourceClick = (key) => {

    let sourcesArray = this.state.filterSources;
    if (sourcesArray.includes(key)) {
      sourcesArray.splice(sourcesArray.indexOf(key), 1);
    } else {
      sourcesArray.push(key);
    }
    this.setState({
      filterSources: sourcesArray
    })
  }

  handleBackClick = () => {
    const current = this.state.currentStep;

    if (current > 0) {
      this.setState({
        currentStep: current - 1
      });
    }
  }

  handleOfferSelection = (con) => {
    if (con && con.ethAddress) {
      console.log(con)
      this.setState({
        selectedContract: con,
        currentStep: 3
      });
    }
  }

  handleConfirmation = (con, avg, price, total) => {
    const ipfsContractMetadata = "";
    const ipfsBillMetadata = "";
    const { drizzle, drizzleState } = this.props;
    const web3 = drizzle.web3;
    const consumerAddress = drizzleState.accounts[0];
    const producerAddress = con.ethAddress;
    const tokenInstance = drizzle.contracts.ShaLedger;
    const billInstance = drizzle.contracts.BillSystem;
    const billInstanceWeb3 = new web3.eth.Contract(billInstance.abi, billInstance.address);
    const confirmContractAbi = billInstanceWeb3.methods.newPrepaidContract(
      tokenInstance.address,
      producerAddress,
      consumerAddress,
      price.toString(),
      avg.toString(),
      true,
      ipfsContractMetadata,
      ipfsBillMetadata
    ).encodeABI();
    const tx = tokenInstance.methods.approveAndCall.cacheSend(billInstance.address, total.toString(), confirmContractAbi, { from: consumerAddress });

    this.setState({
      tx
    });
  }

  getContent = (producerOffers) => {
    const contract = this.state.selectedContract;
    const averageConsumerEnergy = this.state.filterAmount;
    switch (this.state.currentStep) {
      case 0:
        const sourcesColumns = sources.map((source, i) => {

          let image = source.imgSrc;
          if (this.state.filterSources.includes(i)) {
            image = source.imgSrc2;
          }

          return (
            <Grid.Column key={i}>
              <Image style={{ padding: "10px 10px" }} src={image} onClick={() => this.handleSourceClick(i)} />
            </Grid.Column>
          );
        })


        return (
          <Grid>
            <Grid.Column style={{ width: "30%" }}>
              <div style={{ paddingBottom: 20 }}>
                <ShastaGridRow>
                  <div style={{ paddingLeft: 20 }}>
                    <h3>Amount of Energy:</h3>
                    <Dropdown
                      placeholder='Ammount of Energy'
                      fluid selection
                      options={pricesRanges}
                      onChange={this.handleChangefilterAmount}
                    />
                  </div>
                </ShastaGridRow>
              </div>
              <ShastaGridRow>
                <div style={{ paddingLeft: 20 }}>
                  <h3>Country:</h3>
                  <Dropdown
                    placeholder='Select Country'
                    fluid search selection
                    onChange={this.selectCountry}
                    options={countryOptions}
                  />
                </div>
              </ShastaGridRow>
            </Grid.Column>
            <Grid.Column style={{ width: "50%" }}>
              <ShastaGridRow style={{ paddingBottom: 20 }}>
                <div style={{ paddingLeft: 20 }}>
                  <h3>Source of energy:</h3>
                  <div style={{ display: "flex" }}>
                    {sourcesColumns}
                  </div>
                </div>
              </ShastaGridRow>
              <Grid.Row style={{ paddingTop: 20 }}>
                <ShastaButton
                  style={{ float: 'right' }}
                  primary onClick={this.handleNextClick}
                >
                  Next
              </ShastaButton>
              </Grid.Row>
            </Grid.Column>
            <Grid.Row>
              <h3 style={{ width: "100%" }}>Best offer found: </h3>
              {producerOffers[0]}
            </Grid.Row>
          </Grid>
        )
      case 1:
        return (
          <div>
            <h3>Offers: </h3>
            <Card.Group>
              {producerOffers}
            </Card.Group>
          </div>
        );
      case 2:
        const { tx } = this.state;
        const { drizzle, drizzleState } = this.props;
        const web3 = drizzle.web3;
        const energyPrice = contract.energyPrice;
        const priceRaw = web3.utils.toBN(web3.utils.toWei(energyPrice.toString(), 'ether'));
        const avgRaw = web3.utils.toBN(averageConsumerEnergy);
        const totalRaw = priceRaw.mul(avgRaw)
        const totalPrice = web3.utils.fromWei(totalRaw, 'ether');

        let txStatus = "";
        if (drizzleState.transactionStack[tx]) {
          const txHash = drizzleState.transactionStack[tx];
          if (txHash && txHash in drizzleState.transactions) {
            const transaction = drizzleState.transactions[txHash];
            txStatus = transaction.status;
            if (txStatus == "error") {
              console.error(transaction.error);
            }
          }
        }
        console.log("tx status", txStatus)
        return (
          <div>
            <h3>Confirm contract</h3>
            <div>
              <p>Can provide up to {contract.amountkWh} kWh at {contract.energyPrice} Sha per kWh.</p>
              <p>Energy source: {contract.providerSource}</p>
              <p>Total monthly cost with your average energy usage: {totalPrice} Sha for {averageConsumerEnergy} kWh</p>
              <p>Confirm below to accept the energy contract with Shasta, paying the first month beforehand in Sha token.</p>
            </div>
            <div style={{ paddingTop: 20, display: 'flex' }}>
              <Button onClick={this.handleBackClick}>
                Back
              </Button>
              <Button primary disabled={txStatus !== ""} onClick={() => this.handleConfirmation(contract, avgRaw, priceRaw, totalRaw)}>
                Confirm contract
              </Button>
              {txStatus === 'pending' && (
                <Loader active={true} >Pending transaction</Loader>
              )}
              {txStatus === 'success' && (
                <Segment color='green' style={{ margin: 0, padding: 5, width: 140, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon icon='check' color='green' size='lg' style={{ marginRight: 10 }} />
                  Success
                </Segment>
              )}
              {txStatus === 'error' && (
                <Segment color='red' style={{ width: 140 }}>
                  Some error ocurred while making the transaction. Please contact with Shasta team if you consider that is a bug, via email at  hello@shasta.world
                </Segment>
              )}
            </div>
          </div>
        );
    }
  }

  render() {
    const { drizzleState } = this.props;
    const currentAccount = drizzleState.accounts[0];

    let producerOffers = this.state.producersOffersList.map((contract) => {

      console.log(contract)
      //filter your offers
      if (currentAccount === contract.ethAddress) {
        return '';
      }

      const sourceJson = sources.find(x => x.value === contract.providerSource);
      //filter source
      if (this.state.filterSources.length > 0) {
        if (!this.state.filterSources.includes(sourceJson.key)) {
          return '';
        }
      }
      //Filter by amount
      if (this.state.filterAmount !== '') {
        if (Number(contract.amountkWh) < this.state.filterAmount) {
          return '';
        }
      }
      return (
        <ShastaCard fluid color='purple'>
          <Card.Content>
            <Card.Header>
              {contract.amountkWh} kWh at {contract.energyPrice} Shas/kWh
            </Card.Header>
            <Card.Description>
              Ethereum account: {contract.ethAddress}
            </Card.Description>
            <Card.Description>
              Address: {contract.address}
            </Card.Description>
          </Card.Content>
          <Card.Content extra>
            <p>Source: {contract.providerSource}</p>
            <p>Total Price: {contract.fiatAmount} Sha</p>
            <ShastaBuyButton onClick={() => this.handleOfferSelection(contract)}>
              Buy Energy
            </ShastaBuyButton>
          </Card.Content>
        </ShastaCard>
      );
    });

    //remove empty items
    producerOffers = producerOffers.filter(Boolean);

    return (
      <div style={{ marginLeft: '25%', marginTop: 20 }}>
        <MyStep step={this.state.currentStep} />
        {this.getContent(producerOffers)}
      </div>
    );
  }
}

function mapStateToProps(state, props) { return { user: state.userReducer } }

export default withDrizzleContext(
  connect(
    mapStateToProps,
  )(Consumer)
);