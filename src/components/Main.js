import React, { Component } from "react";
import "./App.css";
import BuyForm from "./BuyForm";
import SellForm from "./SellForm";

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentForm: "buy",
    };
  }

  render() {
      let content
      if(this.state.currentForm === "buy"){
        content = <BuyForm
        etherBalance={this.props.etherBalance}
        tokenBalance={this.props.tokenBalance}
        buyTokens={this.props.buyTokens}
      />
      }else{
        content = <SellForm
        etherBalance={this.props.etherBalance}
        tokenBalance={this.props.tokenBalance}
        sellTokens={this.props.sellTokens}
      />
      }
    return (
      <div>
        <div className="changeForm">
            <button onClick={(ev)=>this.setState({currentForm: 'buy'})}>Buy</button>
            <button onClick={(ev)=>this.setState({currentForm: 'sell'})}>Sell</button>
        </div>
        {content}
      </div>
    );
  }
}

export default Main;
