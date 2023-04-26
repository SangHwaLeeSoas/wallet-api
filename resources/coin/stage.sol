// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MetaTree is ERC20 {
    address public owner;
    address public hotWallet;

    mapping (address => bool) public transferAllowed;

    constructor(address _hotWallet) ERC20("MyToken", "MTK") {
        owner = msg.sender;
        hotWallet = _hotWallet;
        _mint(msg.sender, 1000000000000000000000000);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function.");
        _;
    }

    modifier onlyAllowed(address sender) {
        require(transferAllowed[sender] == true || sender == owner || sender == hotWallet, "Transfer not allowed.");
        _;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        owner = newOwner;
    }

    function setHotWallet(address newHotWallet) public onlyOwner {
        hotWallet = newHotWallet;
    }

    function allowTransfer(address user) public onlyOwner {
        transferAllowed[user] = true;
    }

    function disallowTransfer(address user) public onlyOwner {
        transferAllowed[user] = false;
    }

    function transfer(address recipient, uint256 amount) public virtual override onlyAllowed(msg.sender) returns (bool) {
        _transfer(_msgSender(), recipient, amount);
        return true;
    }
}