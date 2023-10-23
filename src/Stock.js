import React from "react";
import Plot from "react-plotly.js";

class Stock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tickerSymbol: "AMZN",
      stockWaveXValues: [],
      stockWaveYValues: [],
    };

    this.fetchStock = this.fetchStock.bind(this);
  }

  componentDidMount() {
    this.fetchStock();
  }

  handleInputChange = (event) => {
    this.setState({ tickerSymbol: event.target.value });
  };

  fetchStock() {
    const API_KEY = "FBNKWJXO6VT8FNOE";
    const API_Call = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${this.state.tickerSymbol}&outputsize=compact&apikey=${API_KEY}`;
    let stockWaveXValuesFunction = [];
    let stockWaveYValuesFunction = [];

    fetch(API_Call)
      .then(function (response) {
        return response.json();
      })
      .then(
        function (data) {
          for (var date in data["Time Series (Daily)"]) {
            stockWaveXValuesFunction.push(date);
            stockWaveYValuesFunction.push(
              data["Time Series (Daily)"][date]["1. open"]
            );
          }

          this.setState({
            stockWaveXValues: stockWaveXValuesFunction,
            stockWaveYValues: stockWaveYValuesFunction,
          });
        }.bind(this)
      );
  }

  render() {
    return (
      <div className="container">
        <h1>StockWave</h1>
        <div className="input-container">
          <label htmlFor="tickerSymbol">Enter Ticker Symbol:</label>
          <input
            type="text"
            id="tickerSymbol"
            name="tickerSymbol"
            value={this.state.tickerSymbol}
            onChange={this.handleInputChange}
          />
          <button onClick={this.fetchStock}>Search</button>
        </div>
        <div className="plot">
          <Plot
            data={[
              {
                x: this.state.stockWaveXValues,
                y: this.state.stockWaveYValues,
                type: "scatter",
                mode: "lines+markers",
                marker: { color: "red" },
              },
            ]}
            layout={{
              width: 800,
              height: 500,
              title: this.state.tickerSymbol + " Stock Prices Last 100 days",
            }}
          />
        </div>
      </div>
    );
  }
}

export default Stock;
