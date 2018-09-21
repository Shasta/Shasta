import React, { Component } from "react";
import { Line } from "react-chartjs-2";

class HardwareCharts extends Component {
  render() {
    let data = {
      labels: [],
      datasets: [
        {
          label: "Amount of shas",
          lineTension: 0.1,
          backgroundColor: this.props.color2,
          borderColor: this.props.color,
          borderCapStyle: "butt",
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: "miter",
          pointBorderColor: this.props.color,
          pointBackgroundColor: "#fad",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: this.props.color,
          pointHoverBorderColor: this.props.color,
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          fill: true,
          data: []
        }
      ]
    };

    const rData = this.props.data;
    if (rData.length > 0) {
      for (var i = rData.length - 1; i > 0; i--) {
        var date = new Date(rData[i].date);

        var display =
          date.getDate() +
          "-" +
          (date.getMonth() + 1) +
          "-" +
          date.getFullYear();
        data.labels.push(display);
        data.datasets[0].data.push(rData[i].value);
      }
    }
    const options = {
      responsive: true,
      legend: {
        labels: {
          boxWidth: 0
        }
      }
    };
    return (
      <div>
        <Line data={data} options={options} height={100} />
      </div>
    );
  }
}

export default HardwareCharts;
