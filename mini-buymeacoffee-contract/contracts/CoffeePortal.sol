// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract CoffeePortal {
  uint256 totalCoffee;

  address payable public owner;

  event NewCoffee(address indexed from, uint256 timestamp, string message, string name);

  constructor() payable {
    console.log("Yo! Smart Contract");

    owner = payable(msg.sender);
  }

  struct Coffee {
    address giver;
    string message;
    string name;
    uint256 timestamp;
  }

  Coffee[] coffee;

  function getAllCoffee() public view returns (Coffee[] memory) {
    return coffee;
  }

  function getTotalCoffee() public view returns (uint256) {
    console.log("We have %d total coffee recieved", totalCoffee);
    return totalCoffee;
  }

  function buyCoffee(string memory _message, string memory _name, uint256 _payAmount) public payable {
    uint256 cost = 0.001 ether;
    require(_payAmount <= cost, "Insufficient Ether provided");

    totalCoffee += 1;
    console.log("%s has just sent a coffee!", msg.sender);

    coffee.push(Coffee(msg.sender, _message, _name, block.timestamp));

    (bool success, ) = owner.call{value: _payAmount}("");
    require(success, "Failed to send money");

    emit NewCoffee(msg.sender, block.timestamp, _message, _name);
  }

  function withdraw() public payable {
    require(owner == msg.sender, "This is not owner.");

    uint balance = address(this).balance;
    require(balance > 0, "No ether left to withdraw");

    (bool success, ) = (msg.sender).call{value: balance}("");
    require(success, "Transfer failed.");
  }
}