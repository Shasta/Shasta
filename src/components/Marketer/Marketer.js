import React, { Component } from 'react';
import { Button, Segment, Divider, Card } from 'semantic-ui-react'
import Promise from 'bluebird'

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
        console.log("address", self.props.username)
        const bids = [];
        const asks = [];

        try {
            const shastaMarketInstance = await this.props.shastaMarketContract.deployed();
            const shastaMapInstance = await this.props.sharedMapContract.deployed();
            const userContractInstance = await this.props.userContract.deployed();

            // Bids
            const bidIndexes = await shastaMarketInstance.getBidsIndexesFromAddress.call({ from: self.props.address });
            console.log("indexes", bidIndexes)
            const ipfsHashRaw = await userContractInstance.getIpfsHashByAddress.call(self.props.address, {from: self.props.address});
            const ipfsHash = this.props.web3.toAscii(ipfsHashRaw);
            console.log("ipfs", ipfsHash)
            const rawContent = await this.props.ipfs.cat(ipfsHash);
            const userData = JSON.parse(rawContent.toString("utf8"));
            const bidsJsonData = bidIndexes.map(indexBN => {
                const index = indexBN.toNumber();
                return userData.contracts[index];
            })
            
            console.log("bidsdata", bidsJsonData)
            // Asks
            const indexes = await shastaMarketInstance.getOfferIndexesFromAddress.call({ from: this.props.address });
            const askData = await Promise.map(indexes, indexBn => 
                shastaMarketInstance.getOfferFromIndex.call(indexBn, { from: this.props.address })
            )
            const asksJsonData = await Promise.map(askData, async (ask) => {
                const price = {
                    value: ask[0].toString(),
                };
                const ipfsHash = await shastaMapInstance.locationsIpfsHashes.call(ask[2]);
                const ipfsRawContent = await this.props.ipfs.cat(ipfsHash);
                console.log(ipfsRawContent)
                const providerData = JSON.parse(ipfsRawContent.toString("utf8"));
                console.log(providerData)
                return Object.assign(price, providerData);
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
                        <Card.Header>{bid.firstName} {bid.lastName}, Buys energy for {bid.value}€</Card.Header>
                        <Card.Meta>{bid.source} Energy</Card.Meta>
                        <Card.Meta>{bid.country}</Card.Meta>
                        <Card.Meta>Provider: {bid.marketer}</Card.Meta>
                        <Card.Description>
                            {bid.description}
                  </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                        <div className='ui two buttons'>
                            <Button basic color='green'>
                                Sell you energy
                    </Button>
                        </div>
                    </Card.Content>
                </Card>
            )
        });

        const asks = this.state.asks.map((ask) => {
            return (
                <Card>
                    <Card.Content>
                        <Card.Header>{ask.chargerName}, sells energy for {ask.value}€</Card.Header>
                        <Card.Meta>{toCapital(ask.providerSource)} Energy</Card.Meta>
                        <Card.Meta>{ask.address}</Card.Meta>
                        <Card.Description>
                            {ask.description}
                        </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                        <div className='ui two buttons'>
                            <Button basic color='green'>
                                Buy energy
                    </Button>
                        </div>
                    </Card.Content>
                </Card>
            )
        });

        return (
            <div style={{ marginLeft: 400, marginTop: 20 }}>
                <Segment padded>
                    <Button primary fluid>
                        Purchase offers
                    </Button>
                    <Card.Group>
                        {bids}
                    </Card.Group>
                    <Divider horizontal></Divider>
                    <Button secondary fluid>
                        Sales offers
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