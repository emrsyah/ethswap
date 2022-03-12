const { assert } = require("chai");

const EthSwap = artifacts.require("EthSwap");
const Token = artifacts.require("Token");

require("chai")
  .use(require("chai-as-promised"))
  .should();

function tokens(n) {
    // * untuk ubah si ether yg kita tulis ke dalam bentuk decimal 18.
  return web3.utils.toWei(n, "ether");
}
// deployer refer ke akun ke-1 di ganache (index ke 0) dan investor ke akun ke-2 di ganache alias index 1
contract("EthSwap", ([deployer, investor]) => {
  let token, ethSwap;

  before(async () => {
    token = await Token.new();
    ethSwap = await EthSwap.new(token.address);
    await token.transfer(ethSwap.address, tokens("1000000"));
  });

  describe("Contract deployment", async () => {
    it("token has a name", async () => {
      const name = await token.name();
      assert.equal(name, "DApp Token");
    });
  });

  describe("EthSwap deployment", async () => {
    it("contract has a name", async () => {
      const name = await ethSwap.name();
      assert.equal(name, "EthSwap Instant Exchange");
    });
    it("contract has a token", async () => {
      let balance = await token.balanceOf(ethSwap.address);
      assert.equal(balance.toString(), tokens("1000000"));
    });
  });

  describe("buy token", async()=>{
    let result
    before(async()=>{
      result = await ethSwap.buyTokens({from: investor, value: web3.utils.toWei("1", "ether")});
    })
    it("allow user to instantly purchase token in ethSwap for fixed price", async()=>{
      // Check investor balance after purchase
      let investorBalance = await token.balanceOf(investor);
      assert.equal(investorBalance.toString(), tokens('100'))

      // Check ethswap balance after purchases
      let ethswapbalance
      ethswapbalance = await token.balanceOf(ethSwap.address)
      assert.equal(ethswapbalance.toString(), tokens("999900"))
      ethswapbalance = await web3.eth.getBalance(ethSwap.address)
      assert.equal(ethswapbalance.toString(), web3.utils.toWei("1", "Ether"))

      // Cek data logs dari emit event
      const event = result.logs[0].args
      assert.equal(event.account, investor)
      assert.equal(event.token, token.address)
      assert.equal(event.amount.toString(), tokens("100").toString())
      assert.equal(event.rate.toString(), "100")
    })
  })

  describe("sell token", async()=>{
    let result

    before(async()=>{
      // Approve ini keknya mah kek konfirmasi
      await token.approve(ethSwap.address, tokens('100'), {from: investor })
      result = await ethSwap.sellTokens(tokens('100'), {from: investor })
    })
    it("allow user to instantly sell token to ethSwap for fixed price", async()=>{
      let investorBalance = await token.balanceOf(investor);
      assert.equal(investorBalance.toString(), tokens('0'))

      // Check ethswap balance after purchases
      let ethswapbalance
      // 1 cek jumlah token di ethSwap sekarang
      ethswapbalance = await token.balanceOf(ethSwap.address)
      assert.equal(ethswapbalance.toString(), tokens("1000000"))

      // 2 cek jumlah eth di ethSwap sekarang
      ethswapbalance = await web3.eth.getBalance(ethSwap.address)
      assert.equal(ethswapbalance.toString(), web3.utils.toWei("0", "Ether"))

      // Cek data logs dari emit event
      const event = result.logs[0].args
      assert.equal(event.account, investor)
      assert.equal(event.token, token.address)
      assert.equal(event.amount.toString(), tokens("100").toString())
      assert.equal(event.rate.toString(), "100")

      // FAILURE: investor gak bisa jual token lebih dari yang mereka punya
      await ethSwap.sellTokens(tokens('500'), {from: investor}).should.be.rejected;
    })
  })

});
