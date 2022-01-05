// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Bank {
   mapping (address => uint) private balances;

   function deposit() public payable returns (uint){
      balances[msg.sender] += msg.value;
      return balances[msg.sender];
   }
   
   function withdraw(uint withdrawAmount) public returns (uint remainingBal) {
      if (withdrawAmount <= balances[msg.sender]) {
         balances[msg.sender] -= withdrawAmount;
         payable(msg.sender).transfer(withdrawAmount);
      }
      return balances[msg.sender];
   }
   
   function balance() public view returns (uint) {
      return balances[msg.sender];
   }
}