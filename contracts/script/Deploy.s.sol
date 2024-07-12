// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import { Script } from "forge-std/Script.sol";
import {TransferTest} from  "../src/TestTransfer.sol";

contract DeployDSC is Script {

    function run() external returns (address) {
        vm.startBroadcast();
        TransferTest test = new TransferTest();
        vm.stopBroadcast();
        return address(test);
    }
}