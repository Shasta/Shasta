import React, { Component } from 'react';
import { Button, Segment, Divider, Card } from 'semantic-ui-react'
import Promise from 'bluebird'
var checkedAddresses = [];

const toCapital = (string) => {
    return string && string.length > 0 ? string.charAt(0).toUpperCase() + string.slice(1) : "";
}
class Marketer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            bids: [],
            asks: []
        }

        this.checkMarket = this.checkMarket.bind(this);
    }

    componentDidMount() {
        this.checkMarket();
    }
    async checkMarket() {

        var self = this;
        console.log("address", self.props.address)

        try {
            const shastaMarketInstance = await this.props.shastaMarketContract.deployed();
            const shastaMapInstance = await this.props.sharedMapContract.deployed();
            const userContractInstance = await this.props.userContract.deployed();

            // Bids
            let bidsJsonData = [];
            //const bidIndexes = await shastaMarketInstance.getBidsIndexesFromAddress.call({ from: self.props.address });
            const bidsLength = await shastaMarketInstance.getBidsLength.call({ from: self.props.address });
            console.log("len :", bidsLength.toNumber());

            let auxArray = Array.from({length: bidsLength.toNumber()}, (x, item)=> item);
    
            auxArray.forEach(async (item, i) => {
                
                let userContract = await shastaMarketInstance.getBidFromIndex.call(i, { from: self.props.address });
                let userAddress = userContract[1];
                console.log("bid from index: ", userContract);

                if (!checkedAddresses.includes(userAddress)) {

                    checkedAddresses.push(userAddress);
                    let ipfsHashRaw = await userContractInstance.getIpfsHashByAddress.call(userAddress, { from: self.props.address });
                    let ipfsHash = this.props.web3.toAscii(ipfsHashRaw);
                    console.log("ipfs rec: ", ipfsHash);
                    
                    let rawContent = await this.props.ipfs.cat(ipfsHash);
                    let userData = JSON.parse(rawContent.toString("utf8"));

                    for (let key in userData.consumerContracts) {
                        bidsJsonData.push(userData.consumerContracts[key])
                    }
                    this.setState(({
                        bids: bidsJsonData,
                        asks: asksJsonData
                    }));
                }
            })
            
            // Asks
            const asksLength = await shastaMarketInstance.getOffersLength.call({ from: this.props.address });

            let auxArray2 = Array.from({length: asksLength.toNumber()}, (x, item)=> item);

            const askData = await Promise.map(auxArray2, indexBn =>
                shastaMarketInstance.getOfferFromIndex.call(indexBn, { from: this.props.address })
            )
            const asksJsonData = await Promise.map(askData, async (ask) => {
                const ipfsHash = await shastaMapInstance.locationsIpfsHashes.call(ask[2]);
                const ipfsRawContent = await this.props.ipfs.cat(ipfsHash);
                const providerData = JSON.parse(ipfsRawContent.toString("utf8"));
                return providerData;
            });
            this.setState(({
                bids: bidsJsonData,
                asks: asksJsonData
            }));
        } catch (error) {
            console.log(error);
        }
    }

    updateBids(bids) {
        this.setState({
            bids: bids
        });
    }

    updateAsks(asks) {
        this.setState({
            asks: asks
        })
    }
    render() {
        const bids = this.state.bids.map((bid) => {
            return (
                <Card>
                    <Card.Content>
                        <Card.Header>{bid.firstName} {bid.lastName}, at {bid.value}€/kWh</Card.Header>
                        <Card.Meta>{bid.source} Energy</Card.Meta>
                        <Card.Meta>{bid.country}</Card.Meta>
                        <Card.Meta>Provider: {bid.marketer}</Card.Meta>
                        <Card.Description>
                            {bid.description}
                        </Card.Description>
                    </Card.Content>
                </Card>
            )
        });

        const asks = this.state.asks.map((ask) => {
            return (
                <Card>
                    <Card.Content>
                        <Card.Header>{ask.marketerName} bought energy from {ask.chargerName}, at {ask.marketerPrice}€/kWh</Card.Header>
                        <Card.Meta>{toCapital(ask.providerSource)} Energy</Card.Meta>
                        <Card.Meta>{ask.address}</Card.Meta>
                        <Card.Description>
                            {ask.description}
                        </Card.Description>
                    </Card.Content>
                </Card>
            )
        });

        return (
            <div style={{ marginLeft: 400, marginTop: 20 }}>
                <Segment padded>
                    <Button primary fluid>
                        Sales history
                    </Button>
                    <Card.Group>
                        {bids}
                    </Card.Group>
                    <Divider horizontal></Divider>
                    <Button secondary fluid>
                        Buys history
                     </Button>
                    <Card.Group>
                        {asks}
                    </Card.Group>
                </Segment>
            </div >
        )

    }

}

export default Marketer;