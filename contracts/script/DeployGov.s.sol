// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.26;

import {Script} from "forge-std/Script.sol";
import {veUAB} from "../src/GovToken.sol";
import {console} from "forge-std/console.sol";
import {UAbyssGovernor} from "../src/Governor.sol";
import {TimeLock} from "../src/TimeLockController.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";


contract DeployGov is Script {

    function run() external returns (address token,address gov,address timelock) {
        address[] memory proposers = new address[](1);
        proposers[0] = msg.sender;
        address[] memory executors = new address[](1);
        executors[0] = msg.sender;
        vm.startBroadcast();
        TimeLock timeLock = new TimeLock(3600,proposers,executors, msg.sender);
        timelock = address(timeLock);
        veUAB veuab = new veUAB(timelock);
        token = address(veuab);
        veuab.mint(msg.sender,100);
        UAbyssGovernor governor = new UAbyssGovernor(IVotes(veuab),timeLock);
        gov = address(governor);
        vm.stopBroadcast(); 
    } 


}