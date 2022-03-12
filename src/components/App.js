import React, { Component } from "react";
import "./App.css";
import Web3 from "web3";
import Token from "../abis/Token.json";
import EthSwap from "../abis/EthSwap.json";
import Navbar from "./Navbar";
import Main from "./Main";

class App extends Component {
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadBlockchainData() {
    const web3 = window.web3;

    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });

    const ethBalance = await web3.eth.getBalance(this.state.account);
    this.setState({ ethBalance });

    // * Connect ke smart contract token
    // Ini bakal return 5777 yaitu network id nya si ganache.
    // pake ini biar dinamik jadi sesuai ama network id si user
    // Kontrak cuma bisa dipake di ganache karena kita waktu migrate kan pake ganache, jadi tahap development lah
    // kalo yang di buildspace jg kan kita ada 2 mainnet ama rinkeby
    const networkId = await web3.eth.net.getId();
    const tokenData = Token.networks[networkId];
    // Pake if disini biar gak error waktu ganti network, misal di mainnet padahal kan ke deploy nya di si ganache
    if (tokenData) {
      const token = new web3.eth.Contract(Token.abi, tokenData.address);
      this.setState({ token });
      // Fetching balance token Dapps user kita
      let tokenBalance = await token.methods
        .balanceOf(this.state.account)
        .call();
      this.setState({ tokenBalance: tokenBalance.toString() });
    } else {
      //
      window.alert("Token Contract Not Deployed to detected network.");
    }

    // * Konek Smart Contract ethSwap
    const ethSwapData = EthSwap.networks[networkId];
    // Pake if disini biar gak error waktu ganti network, misal di mainnet padahal kan ke deploy nya di si ganache
    if (ethSwapData) {
      const ethSwap = new web3.eth.Contract(EthSwap.abi, ethSwapData.address);
      this.setState({ ethSwap });
    } else {
      window.alert("EthSwap Contract Not Deployed to detected network.");
    }

    this.setState({ loading: false });
  }

  async loadWeb3() {
    // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      try {
        // Request account access if needed
        await window.ethereum.enable();
        // Acccounts now exposed
        window.eb3.eth.sendTransaction({
          /* ... */
        });
      } catch (error) {
        // User denied account access...
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
      // Acccounts always exposed
      // window.web3.eth.sendTransaction({/* ... */});
    }
    // Non-dapp browsers...
    else {
      console.log(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  }

  buyTokens = async (etherAmount) => {
    console.log(etherAmount)
    this.setState({ loading: true });
    this.state.ethSwap.methods
      .buyTokens()
      .send({ value: etherAmount, from: this.state.account })
      .on("transactionHash", (hash) => {
        this.setState({ loading: false });
      });
  };

  sellTokens = async (tokenAmount) => {
    // this.setState({ loading: true })
    // this.state.token.methods.approve(this.state.ethSwap.address, tokenAmount).send({ from: this.state.account }).on('transactionHash', (hash) => {
    //   this.state.ethSwap.methods.sellTokens(tokenAmount).send({ from: this.state.account }).on('transactionHash', (hash) => {
    //     this.setState({ loading: false })
    //   })
    // })
    console.log(tokenAmount)
    this.setState({ loading: true });
  console.log('ap')
  await this.state.token.methods
    .approve(this.state.ethSwap.address, tokenAmount)
    .send({ from: this.state.account });
    console.log('apd')
  await this.state.ethSwap.methods
    .sellTokens(tokenAmount)
    .send({ from: this.state.account });
    console.log('ok')
  this.setState({ loading: false });
  }

  constructor(props) {
    super(props);
    this.state = {
      account: "",
      token: {},
      ethBalance: 0,
      tokenBalance: 0,
      ethSwap: "",
      loading: true,
    };
  }

  render() {
    let content;
    let loading = this.state.loading;
    if (loading) {
      content = <p>Loading....</p>;
    } else {
      content = (
        <Main
          etherBalance={this.state.ethBalance}
          tokenBalance={this.state.tokenBalance}
          buyTokens={this.buyTokens}
          sellTokens = {this.sellTokens}
        />
      );
    }
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <a
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                ></a>
                {content}
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
