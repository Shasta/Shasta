import React, { Component } from 'react';
import { Statistic, Feed } from 'semantic-ui-react'
import MainChart from './MainChart';
import withDrizzleContext from '../../utils/withDrizzleContext.js';
import { Line, Pie } from 'react-chartjs-2';

class Finance extends Component {

    constructor(props) {
        super(props);
        this.state = {
            totalSha: '',
            totalEth: '',
            tokenBalancePointer: ''
        }
    }

    async componentDidMount() {
        const { drizzleState, drizzle, accountIndex } = this.props;
        const { accounts, accountBalances } = drizzleState;
        const { web3 } = drizzle;

        const shaLedgerInstance = drizzle.contracts.ShaLedger;
        let totalEth = this.precisionRound(web3.utils.fromWei(accountBalances[accounts[0]]), 2);
        const tokenBalancePointer = shaLedgerInstance.methods.balanceOf.cacheCall(accounts[0]);

        this.setState({
            totalEth,
            tokenBalancePointer
        })
    }

    precisionRound(number, precision) {
        var factor = Math.pow(10, precision)
        return Math.round(number * factor) / factor
    }

    render() {

        const { drizzleState, drizzle } = this.props;
        const { tokenBalancePointer } = this.state;
        const { web3 } = drizzle;

        let totalSha = 0;
        const ShaLedgerState = drizzleState.contracts.ShaLedger;
        if (tokenBalancePointer in ShaLedgerState.balanceOf) {
            // ShaLedger have 18 decimals, like Ether, so we can reuse `fromWei` util function.
            totalSha = web3.utils.fromWei(ShaLedgerState.balanceOf[tokenBalancePointer].value, 'ether');
        }

        //Energy chart
        const data = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'Shas',
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: 'rgba(75,192,192,0.4)',
                    borderColor: 'rgba(75,192,192,1)',
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: 'rgba(75,192,192,1)',
                    pointBackgroundColor: '#fff',
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                    pointHoverBorderColor: 'rgba(220,220,220,1)',
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: [0.1325, 0.1298, 0.1301, 0.12845, 0.12902, 0.1302, 0.132]
                }
            ]
        };

        const pieData = {
            labels: [
                'Solar',
                'Eolic',
                'Nuclear'
            ],
            datasets: [{
                data: [300, 50, 100],
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56'
                ],
                hoverBackgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56'
                ]
            }]
        };

        return (
            <div style={{ marginLeft: '400px', marginTop: '20px' }}>
                <div style={{ float: 'left' }}>
                    <MainChart totalSha={totalSha}></MainChart>
                    <div style={{ width: 500, height: 300 }}>
                        <h2>Energy price</h2>
                        <Line data={data} />
                    </div>
                </div>
                <div style={{ padding: '50px', float: 'left' }}>
                    <div style={{ paddingBottom: 80 }}>
                        <p>Your balances: </p>
                        <Statistic.Group>
                            <Statistic color='pink'>
                                <Statistic.Value>{totalSha}</Statistic.Value>
                                <Statistic.Label>Sha</Statistic.Label>
                            </Statistic>
                            <Statistic color='green'>
                                <Statistic.Value>{this.state.totalEth}</Statistic.Value>
                                <Statistic.Label>Ether</Statistic.Label>
                            </Statistic>
                        </Statistic.Group>
                    </div>

                    <p>Your actions:</p>
                    <Feed>
                        <Feed.Event style={{ marginTop: 10 }}>
                            <Feed.Content date="today" summary="You bought 30kWh for 5 Shas" />
                        </Feed.Event>
                        <Feed.Event style={{ marginTop: 10 }}>
                            <Feed.Content date="yesterday" summary="You earned 10 shas with your energy" />
                        </Feed.Event>
                    </Feed>
                    <div style={{ width: 500, height: 300, paddingTop: 40}}>
                        <p>Source of energy sold:</p>
                        <Pie data={pieData} />
                    </div>
                </div>
            </div>
        );

    }
}

export default withDrizzleContext(Finance);