// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.18;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract TestTokenV1 is ERC20Upgradeable, UUPSUpgradeable, OwnableUpgradeable {
    uint private constant YES = 1;
    uint private constant NO = 2;
    uint public isUpgradable;


/// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }
    function init(uint initialMintAmount) initializer external {
        __ERC20_init("TestToken", "TTK");
        __Ownable_init();
        _mint(msg.sender, initialMintAmount * 10 ** decimals());
        isUpgradable = YES;
    }

    // uups proxy 패턴에서는 업그레이드 로직이 로직컨트렉트에 담겨있다.
    // 따라서 UUPSUpgradeable 컨트렉트를 상속받고,
    //  _authorizeUpgrade 함수를 접근제한자(ex onlyOwner) 걸어서 override 해줘야 한다
    function _authorizeUpgrade(address) internal override onlyOwner {
        require(isUpgradable == YES, "upgrade disabled");
    }

    function disableUpgrade() external onlyOwner {
        isUpgradable = NO;
    }

    function version() pure external returns(uint) {
        return 1;
    }
}