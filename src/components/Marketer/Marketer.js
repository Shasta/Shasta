import React, { Component } from 'react';
import { Button, Segment, Divider, Card } from 'semantic-ui-react'
import Promise from 'bluebird'
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
            // Bids
            await shastaMarketInstance.getBidsIndexesFromAddress.call({ from: self.props.address }).then((result) => {
                if (result.toString()) {
                    const array = result.toString().split(',');
                    for (let key in array) {
                        shastaMarketInstance.getBidFromIndex.call(parseInt(array[key]), { from: self.props.address }).then((result) => {
                            var json = {
                                value: result.toNumber()
                            }
                            bids.push(json);
                            self.updateBids(bids);
                        });
                    }
                    self.getAsks(self);
                }
            });
        // Asks
        const indexes = await shastaMarketInstance.getOfferIndexesFromAddress.call({ from: this.props.address });
        const prices = await Promise.map(indexes, indexBn => 
            shastaMarketInstance.getOfferFromIndex.call(indexBn, { from: this.props.address })
        )
        const jsonPrices = prices.map(priceBN => ({
            value: priceBN.toString()
        }));
        this.updateAsks(jsonPrices)
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
                <Card.Header>Ignasi, Buys energy for {bid.value}€</Card.Header>
                <Card.Meta>Energy from solar panels</Card.Meta>
                <Card.Description>
                Energy obtained from particular solar panels in Málaga
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

    const asks = this.state.asks.map((ask) => (
        <Card>
        <Card.Content>
            <Card.Header>HolaLuz, Offers energy for {ask.value}€</Card.Header>
            <Card.Meta>Energy from solar panels</Card.Meta>
            <Card.Description>
            Energy obtained from particular solar panels in Málaga
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
    ))

    return(
            <div style = {{ marginLeft: 400, marginTop: 20 }}>
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