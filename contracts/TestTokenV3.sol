// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.18;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract TestTokenV3 is ERC20Upgradeable, UUPSUpgradeable, OwnableUpgradeable {

/// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }
    function init(uint initialMintAmount) initializer external {
        __ERC20_init("TestToken", "TTK");
        __Ownable_init();
        _mint(msg.sender, initialMintAmount * 10 ** decimals());
    }

    function _authorizeUpgrade(address) internal override onlyOwner {
        revert("upgrade disabled");
    }

    function version() pure external returns(uint) {
        return 3;
    }
}