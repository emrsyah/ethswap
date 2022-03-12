pragma solidity <=8;

import './Token.sol';

contract EthSwap{
    string public name = "EthSwap Instant Exchange";
    // Inisiasi variabel dengan data type Token biar nanti bisa panggil function dari smart contrafctnya Token
    // Ini cuma import codenya, kalo untuk interak ama blockchainnya kita gak bisa
    Token public token;
    uint public rate = 100;

    // Event buat history
    event TokensPurchased(address account, address token, uint amount, uint rate);
    event TokensSold(address account, address token, uint amount, uint rate);

    // penamaan dengan underscore itu buat ngehindarin yang namanya kesamaan, jadi yang underscore itu buat parameter
    // Untuk masukin address tokennya kita lakuin waktu migrasi, karena di migrasi kan kita masukin smart contractnya ke blockchain.
   constructor(Token _token) public{
        token = _token;
    }

    function buyTokens() public payable {
        uint tokenAmount = msg.value * rate;

        // Cek apakah exchange kita punya token yang cukup
        require(token.balanceOf(address(this)) >= tokenAmount);

        // Transfer token
        token.transfer(msg.sender, tokenAmount);

        // Emit Event
        emit TokensPurchased(msg.sender, address(token) , tokenAmount, rate);
    }

    function sellTokens(uint _amount) public{
        // User gak boleh jual lebih banyak dari yang mereka punya
        // Sebenernya ini udh di handle ama ERC20 token kita, tapi kita kasih eksplisit aja biar lebih aman.
        require(token.balanceOf(msg.sender)>=_amount);

        // Calculate banyak ether yang bakal dikasih
        uint etherAmount = _amount/rate;

        // Cek apakah exchange kita punya token yang cukup
        require(address(this).balance >= etherAmount); 

        // Perform Penjualan
        // 1. Transfer dari user ke kita
        token.transferFrom(msg.sender, address(this), _amount);

        // 2. Transfer dari kita ke user
        msg.sender.transfer(etherAmount);
        emit TokensSold(msg.sender, address(token) , _amount, rate);

    }
}