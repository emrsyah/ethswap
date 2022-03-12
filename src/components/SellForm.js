import React, { Component } from "react";
import "./App.css";
import tokenLogo from "../token-logo.png";
import ethLogo from "../eth-logo.png";

class SellForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      output: "0",
    };
  }

  render() {
    return (
      <form
        className="allForm"
        action=""
        onSubmit={(event) => {
          event.preventDefault();
          let tokenAmount;
          tokenAmount = this.input.value.toString();
          tokenAmount = window.web3.utils.toWei(tokenAmount, "Ether");
          this.props.sellTokens(tokenAmount);
        }}
      >
        <div className="groupForm">
          <div className="inputTxt">
            <h5>Input</h5>
            <p>
              Balance:{" "}
              {window.web3.utils.fromWei(this.props.tokenBalance, "Ether")}
            </p>
          </div>
          <div className="inputForm">
            <input
              type="text"
              name=""
              id=""
              placeholder="0"
              onChange={(ev) => {
                const tokenAmount = this.input.value.toString();
                this.setState({
                  output: tokenAmount / 100,
                });
              }}
              ref={(input) => {
                this.input = input;
              }}
            />
            <div className="inputFormTxt">
              <img src={tokenLogo} alt="" />
              <h5>Dapp</h5>
            </div>
          </div>
        </div>
        <div className="groupForm">
          <div className="inputTxt">
            <h5>Output</h5>
            <p>
              Balance:{" "}
              {window.web3.utils.fromWei(this.props.etherBalance, "Ether")}
            </p>
          </div>
          <div className="inputForm">
            <input
              type="text"
              name=""
              id=""
              disabled
              value={this.state.output}
            />
            <div className="inputFormTxt">
              <img src={ethLogo} alt="" />
              <h5>ETH</h5>
            </div>
          </div>
        </div>
        <div className="rateForm">
          <p>Exchange Rate</p>
          <p>100 Dapp = 1 Eth</p>
        </div>
        <button type="submit">SWAP</button>
      </form>
    );
  }
}

export default SellForm;
