import React, { Component } from 'react';
import { Feed, Sidebar, Menu } from 'semantic-ui-react'
import MainChart from './MainChart';
import withDrizzleContext from '../../utils/withDrizzleContext.js';
import { Line, Pie } from 'react-chartjs-2';
import "./Finance.less"

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
        const { drizzleState, drizzle } = this.props;
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
                    lineTension: 0.1,
                    backgroundColor: 'rgba(129,117,130,0.4)',
                    borderColor: 'rgba(129,117,130,1)',
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: 'rgba(129,117,130,1)',
                    pointBackgroundColor: '#fff',
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: 'rgba(129,117,130,1)',
                    pointHoverBorderColor: 'rgba(220,220,220,1)',
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    fill: true,
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
                    '#402d41',
                    '#ed77b9',
                    '#922c66'
                ],
                hoverBackgroundColor: [
                    '#402d41',
                    '#ed77b9',
                    '#922c66'
                ]
            }]
        };
        const pieOptions = {
            cutoutPercentage: 40,
            legend: {
                position: 'top',
                labels: {
                    usePointStyle: true
                }
            }
        }

        const chartOptions = {
            responsive: true,
            legend: {
                labels: {
                    boxWidth: 0
                }
            }
        }
        return (
            <div style={{ marginLeft: '400px'}}>
                <div style={{ float: 'left', width:"55%", height: "80%" }}>
                    <MainChart totalSha={totalSha}></MainChart>
                    <div className="chartsDiv">
                        <h2>Energy price</h2>
                        <Line data={data} options={chartOptions} height={100}/>
                    </div>
                </div>
                <Sidebar as={Menu}
                    animation='overlay'
                    icon='labeled'
                    vertical visible
                    direction='right'
                    style={{ display: "flex", alignItems: "center", paddingTop: 40, width:"30%" }}
                >
                    <div style={{ padding: '50px', float: 'left', width:"100%" }}>
                        <h3 className="titles">Your balances: </h3>
                        <div className="currencyDiv">
                            <div className="divBorderCurrencySha">
                                <div className="divTagCurrencySha"><p>SHA</p></div>
                                <h1 className="displaySha">{totalSha}</h1>
                            </div>
                            <div className="divBorderCurrencyEther">
                                <div className="divTagCurrencyEther">ETH</div>
                                <h1 className="displayEther">{this.state.totalEth}</h1>
                            </div>
                        </div>

                        <h3 className="titles">Your actions:</h3>
                        <Feed>
                            <Feed.Event className="feedTitle">
                                <Feed.Content date="● today" summary="You bought 30kWh for 5 Shas" />
                            </Feed.Event>
                            <Feed.Event className="feedTitle">
                                <Feed.Content date="● yesterday" summary="You earned 10 shas with your energy" />
                            </Feed.Event>
                        </Feed>
                        <div style={{ width: "100%", height: 300, paddingTop: 40 }}>
                        <h3 className="titles">Source of energy sold:</h3>
                            <Pie data={pieData} options={pieOptions} />
                        </div>
                    </div>
                </Sidebar>
            </div>
        );

    }
}

export default withDrizzleContext(Finance);