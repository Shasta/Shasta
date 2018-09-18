import React, { Component } from 'react';
import { Button, Dropdown, Card } from 'semantic-ui-react'
import './Consumer.css';
import ipfs from '../../ipfs'
import withDrizzleContext from '../../utils/withDrizzleContext'
import { connect } from 'react-redux';
import { countryOptions } from './common'
import MyStep from './stepper/MyStep'

let checkedAddresses = [];
const sources = [
  {
    text: "Solar",
    value: "Solar"
  }, {
    text: "Nuclear",
    value: "Nuclear"
  }, {
    text: "Eolic",
    value: "Eolic"
  }, {
    text: "Biomass",
    value: "Biomass"
  }, {
    text: "Other",
    value: "Other"
  }, {
    text: "No filter",
    value: "No filter"
  }
]

const pricesRanges = [
  {
    text: "10-20 kWh",
    value: 10
  }, {
    text: "20-30 kWh",
    value: 20
  }, {
    text: "30-40 kWh",
    value: 30
  }, {
    text: "40-50 kWh",
    value: 40
  }, {
    text: "50-60 kWh",
    value: 50
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
      visible: false,
      percent: 0,
      ipfsHash: '',
      ipfsFirstName: '',
      ipfsAddress: '',
      address: '',
      producersOffersList: [],
      totalToPay: 0,
      filterSource: '',
      filterCountry: '',
      filterAmount: '',
      currentStep: 0
    }

    this.handleNextClick = this.handleNextClick.bind(this);
    this.selectCountry = this.selectCountry.bind(this);
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

  selectCountry(e, val) {

    this.setState({ filterCountry: val.value });
  }

  handleChangeSource = (e, data) => {
    this.setState({
      filterSource: data.value
    })
  }

  handleChangefilterAmount = (e, data) => {
    this.setState({
      filterAmount: data.value
    })
  }

  handleNextClick() {
    let next = this.state.currentStep + 1;
    this.setState({
      currentStep: next
    })
  }

  getContent(producerOffers) {
    switch (this.state.currentStep) {
      case 0:
        return (
          <div style={{ width: "35%" }}>
            <p>Ammount of Energy:</p>
            <Dropdown
              placeholder='Ammount of Energy'
              fluid selection
              options={pricesRanges}
              onChange={this.handleChangefilterAmount} />
            <div style={{ paddingTop: 20 }}>
              <Button
                color="purple"
                onClick={this.handleNextClick}
              >Choose filters</Button>
            </div>
          </div>
        )
      case 1:
        return (
          <div>
            <div style={{ width: "35%", paddingBottom: 20 }}>
              <p>Source of energy:</p>
              <Dropdown
                placeholder='Source of energy'
                fluid selection
                options={sources}
                onChange={this.handleChangeSource} />
            </div>
            <div style={{ width: "35%" }}>
              <p>Country:</p>
              <Dropdown
                placeholder='Select Country'
                fluid search selection
                onChange={this.selectCountry}
                options={countryOptions} />
            </div>
            <div style={{ paddingTop: 20 }}>
              <Button
                color="purple"
                onClick={this.handleNextClick}
              >Choose offers</Button>
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <h3>Offers: </h3>
            <Card.Group>
              {producerOffers}
            </Card.Group>
          </div>
        );
    }
  }

  render() {
    const { drizzleState } = this.props;
    const currentAccount = drizzleState.accounts[0];

    const producerOffers = this.state.producersOffersList.map((contract) => {
      if (currentAccount === contract.ethAddress) {
        return '';
      }
      if (this.state.filterSource !== "No filter" && this.state.filterSource !== '') {
        if (this.state.filterSource !== contract.providerSource) {
          return '';
        }
      }
      if (this.state.filterAmount !== '') {
        if (this.state.filterAmount + 10 < Number(contract.amountkWh) || this.state.filterAmount >= Number(contract.amountkWh) + 10) {
          return '';
        }
      }
      return (
        <Card fluid style={{ maxWidth: '800px' }} color='purple'>
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
            <p>Total Price: {contract.fiatAmount} Shas</p>
            <Button basic color='purple'>
              Buy Energy
              </Button>
          </Card.Content>
        </Card>
      );
    });
    return (

      <div style={{ marginLeft: 400, marginTop: 20 }}>
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