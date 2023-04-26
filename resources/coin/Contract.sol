// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "./AccountList.sol";

contract MetaTree is ERC20 {
    address public owner;
    address public hotWallet;

    mapping (address => bool) public transferAllowed;

    /* 스마트 컨트랙트의 생성자 */
    constructor(address _hotWallet) ERC20("MetaTreeToken", "MTT") {
        owner = msg.sender;
        hotWallet = _hotWallet;
        _mint(msg.sender, 1000000000000000000000000);
        accountList = new AccountList();
    }
    /* 함수를 호출한 계정이 owner 계정과 일치해야만 실행 */
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function.");
        _;
    }
    /* 함수 호출한 주소가 transferAllowed 맵에 등록된 주소 중 하나이거나 owner나 hotWallet 주소와 일치해야만 실행 */
    modifier onlyAllowed(address sender) {
        require(transferAllowed[sender] == true || sender == owner || sender == hotWallet, "Transfer not allowed.");
        _;
    }
    /* owner 계정을 변경하는 함수입니다. 이 함수는 onlyOwner modifier로 보호 */
    function transferOwnership(address newOwner) public onlyOwner {
        owner = newOwner;
    }
    /* hotWallet 변수를 변경하는 함수입니다. 이 함수 또한 onlyOwner modifier로 보호 */
    function setHotWallet(address newHotWallet) public onlyOwner {
        hotWallet = newHotWallet;
    }
    /* transferAllowed 맵에 새로운 주소를 추가하는 함수입니다. 이 함수도 onlyOwner modifier로 보호 */
    function allowTransfer(address user) public onlyOwner {
        transferAllowed[user] = true;
    }
    /* transferAllowed 맵에서 주소를 삭제하는 함수입니다. 이 함수도 onlyOwner modifier로 보호 */
    function disallowTransfer(address user) public onlyOwner {
        transferAllowed[user] = false;
    }
    /* 전송 */
    function transfer(address recipient, uint256 amount) public virtual override onlyAllowed(msg.sender) returns (bool) {
        _transfer(_msgSender(), recipient, amount);
        return true;
    }


    /*  AccountList */
    function addAccount(address _accountAddress, bytes32 _privateKey) public onlyOwner {
        accountList.addAccount(_accountAddress, _privateKey);
    }
    function getAccount(uint256 _index) public view returns (address, bytes32) {
        return accountList.getAccount(_index);
    }
    function getAccounts() public view returns (Account[] memory) {
        return accountList.getAccounts();
    }
    /*  _AccountList */


}