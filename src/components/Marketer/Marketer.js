import React, { Component } from 'react';
import { Button, Segment, Divider, Card } from 'semantic-ui-react'

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

            })
        } catch (error) {
            console.log(error);
        }
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

    const asks = {

    }

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
    </Segment>
            </div >
        )

    }

}

export default Marketer;