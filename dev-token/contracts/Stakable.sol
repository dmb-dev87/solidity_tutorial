// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Stakeable {

  constructor() {
    stakeholders.push();
  }

  struct Stake {
    address user;
    uint256 amount;
    uint256 since;
  }

  struct Stakeholder {
    address user;
    Stake[] address_stakes;
  }

  Stakeholder[] internal stakeholders;

  mapping(address => uint256) internal stakes;

  event Staked(address indexed user, uint256 amount, uint256 index, uint256 timestamp);

  function _addStakeholder(address staker) internal returns (uint256) {
    stakeholders.push();
    uint256 userIndex = stakeholders.length - 1;
    stakeholders[userIndex].user = staker;
    stakes[staker] = userIndex;
    return userIndex;
  }

  function _stake(uint256 _amount) internal {
    require(_amount > 0, "Cannot stake nothing");

    uint256 index = stakes[msg.sender];
    uint256 timestamp = block.timestamp;

    if (index == 0) {
      index = _addStakeholder(msg.sender);
    }

    stakeholders[index].address_stakes.push(Stake(msg.sender, _amount, timestamp));
    emit Staked(msg.sender, _amount, index, timestamp);
  }
}