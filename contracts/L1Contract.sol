// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@matterlabs/zksync-contracts/l1/contracts/zksync/interfaces/IZkSync.sol";

contract L1Contract {
     event MessageSent(bytes32 indexed txHash, address indexed zkSyncAddress, address indexed l2ContractAddress, bytes data);
  
    address public admin;

    constructor() {
        admin = msg.sender;
    }

    function sendGreetingMessageToL2(
        address zkSyncAddress,
        address l2ContractAddress,
        bytes memory data,
        uint256 gasLimit,
        uint256 gasPerPubdataByteLimit
    ) external payable returns(bytes32 txHash){

        require(msg.sender == admin, "Only admin is allowed");
        
        IZkSync zksync = IZkSync(zkSyncAddress);
        txHash = zksync.requestL2Transaction{value: msg.value}(l2ContractAddress, 0, 
            data, gasLimit, gasPerPubdataByteLimit, new bytes[](0), msg.sender);
        
        
        emit MessageSent(txHash, zkSyncAddress, l2ContractAddress, data);
        return txHash;
    }
}
