//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract CrowdFunding {
  address public manager;
  uint public MinimumContribution;
  address[] public approvals;

  struct Request {
    string description;
    uint value;
    address recipiant;
    bool complete;
  }

  function campaign(uint minimum) public {
    manager = msg.sender;
    MinimumContribution = minimum;
  }

  function contribute() public payable {
    require(msg.value > MinimumContribution);
    approvals.push(msg.sender);
  }
}