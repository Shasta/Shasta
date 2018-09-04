import React, { Component } from 'react';
import { Button, Segment, Divider, Card } from 'semantic-ui-react'
var checkedAddresses = [];

class Marketer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            bids: [],
            asks: []
        }

        this.checkMarket = this.checkMarket.bind(this);
        this.checkMarket();
    }

    checkMarket() {

        var self = this;
        console.log("address", self.props.username)
        var bids = [];

        try {
            this.props.shastaMarketContract.deployed().then(function (shastaMarketInstance) {
                shastaMarketInstance.getBidsIndexesFromAddress.call({ from: self.props.address }).then((result) => {

                    if (result.toString()) {
                        var array = result.toString().split(',');

                        for (var key in array) {
                            shastaMarketInstance.getBidFromIndex.call(parseInt(array[key]), { from: self.props.address }).then((result) => {

                                if (!checkedAddresses.includes(result[1])) {
                                    checkedAddresses.push(result[1]);

                                    self.props.userContract.deployed().then(function (userContractInstance) {
                                        userContractInstance.getIpfsHashByAddress.call(result[1], { from: result[1] }).then((result) => {

                                            var ipfsHash = self.hex2a(result);

                                            self.props.ipfs.cat(ipfsHash, (err, aux) => {
                                                aux = JSON.parse(aux.toString('utf8'))
                                                for (var key in aux.contracts) {
                                                    bids.push(aux.contracts[key]);
                                                    self.updateBids(bids);
                                                    console.log("bids", bids);
                                                }
                                            })

                                        });
                                    });
                                }
                            });
                            // self.getAsks(self);
                        }
                    }
                });

            })
        } catch (error) {
            console.log(error);
        }
    }

    hex2a(hexx) {
        var hex = hexx.toString();//force conversion
        var str = '';
        for (var i = 2; (i < hex.length && hex.substr(i, 2) !== '00'); i += 2)
            str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        return str;
    }

    getAsks(self) {
        this.props.shastaMarketContract.deployed().then(function (shastaMarketInstance) {
            shastaMarketInstance.getOfferIndexesFromAddress.call({ from: self.props.address }).then((result) => {
                if (result.toString()) {
                    var array = result.toString().split(',');
                    var asks = [];
                    console.log(array);

                    for (var key in array) {
                        shastaMarketInstance.getOfferFromIndex.call(parseInt(array[key]), { from: self.props.address }).then((result) => {
                            console.log("result 2", result.toNumber());
                            var json = {
                                value: result.toNumber()
                            }
                            asks.push(json);
                        });
                    }
                }
            });
        });
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

        const asks = {

        }

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
                </Segment>
            </div >
        )

    }

}

export default Marketer;