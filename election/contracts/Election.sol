// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;

contract Election {
  string public candidate;

  struct Candidate {
    uint id;
    string name;
    uint voteCount;
  }

  mapping(uint => Candidate) public candidates;
  mapping(address => bool) public voters;

  uint public candidatesCount;

  constructor () public {
    addCandidate("Candidate 1");
    addCandidate("Candidate 2");
  }

  function addCandidate (string memory _name) private {
    candidatesCount ++;
    candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
  }

  function vote (uint _candidateId) public {
    require(!voters[msg.sender]);
    require(_candidateId > 0 && _candidateId <= candidatesCount);
    voters[msg.sender] = true;
    candidates[_candidateId].voteCount ++;
  }

  event votedEvent (
    uint indexed _candidateId
  );

  function vote (uint _candidateId) public {
    // require that they haven't voted before
    require(!voters[msg.sender]);

    // require a valid candidate
    require(_candidateId > 0 && _candidateId <= candidatesCount);

    // record that voter has voted
    voters[msg.sender] = true;

    // update candidate vote Count
    candidates[_candidateId].voteCount ++;

    // trigger voted event
    votedEvent(_candidateId);
  }
}
