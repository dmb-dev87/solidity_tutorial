pragma solidity ^0.8.3;

contract HelloWorld{
   string public greeting="Hello!";
   
   function greetfrom() public view returns (address) {
      return msg.sender;
   }
}