// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract L2Contract {
    address l1Contract;
    string public greeting='hello';

    constructor (address _l1Contract) {
      l1Contract = _l1Contract;
    }

    function setGreeting(string memory _greeting) public {
        require(msg.sender == l1Contract, "Only l1Contract is allowed");
        greeting = _greeting;
    }
}
