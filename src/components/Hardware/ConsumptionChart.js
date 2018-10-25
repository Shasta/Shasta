import React, { Component } from "react";
import { Line } from "react-chartjs-2";

export default class ConsumptionChart extends Component {
  render() {
    let data = {
      labels: [],
      datasets: [
        {
          label: "KwH consumption over time",
          backgroundColor: this.props.color,
					borderColor: this.props.color2,
					fill: false,
          data: []
        }
      ]
    };

    const rData = this.props.data;
    if (rData.length > 0) {
      data.labels = this.props.data.map(m =>
         new Date(m.date)
       );
      data.datasets[0].data = this.props.data.map(m =>
         m.value
       );
    }
    const options = {
      responsive: true,
      legend: {
        labels: {
          boxWidth: 0
        }
      },
      scales: {
        xAxes: [{
          type: 'time',
          display: true,
          time: {
            unit: 'month'
          },
          ticks: {
            major: {
              fontStyle: 'bold',
            }
          }
        }],
      }
    };
    return (
      <div>
        <Line data={data} options={options} height={100} />
      </div>
    );
  }
}

