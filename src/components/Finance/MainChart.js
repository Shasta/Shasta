import React, {Component} from 'react';
import { Line } from 'react-chartjs-2';

class MainChart extends Component {

    render() {
        const data = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'Amount of shas',
                    lineTension: 0.1,
                    backgroundColor: 'rgba(243,166,210,0.4)',
                    borderColor: 'rgba(243,166,210,1)',
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: 'rgba(243,166,210,1)',
                    pointBackgroundColor: '#fad',
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: 'rgba(243,166,210,1)',
                    pointHoverBorderColor: 'rgba(243,166,210,1)',
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    fill: true,
                    data: [65, 59, 80, 81, 56, 55, this.props.totalSha]
                }
            ]
        };
        
        const options = {
            responsive: true,
            legend: {
                labels:{
                    boxWidth: 0,
                }
            }
        }
        return (
            <div>
                <h2>Sha historic</h2>
                <Line data={data} options={options} height={100}/>
            </div>
        )
    }
}


export default MainChart;