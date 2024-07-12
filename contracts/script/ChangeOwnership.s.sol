// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.26;

import {Script} from "forge-std/Script.sol";
import {ABUSD} from "../src/StableCoin.sol";
import {console} from "forge-std/console.sol";
import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import {abUSDManager} from "../src/StableCoinManager.sol";
import {DevOpsTools} from "lib/foundry-devops/src/DevOpsTools.sol";

contract ChangeOwnership is Script {
    function run() external returns (address) {
        address mostRecentlyDeployedStableCoin = DevOpsTools
            .get_most_recent_deployment("ABUSD", block.chainid);
        address mostRecentlyDeployedStableCoinManager = DevOpsTools
            .get_most_recent_deployment("abUSDManager", block.chainid);
        return ABUSD(mostRecentlyDeployedStableCoin).owner();
    }
}
