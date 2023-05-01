// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract MetaTree is ERC20 {
    address public owner;
    address public hotWallet;

    mapping (address => bool) public transferAllowed;

    /* 스마트 컨트랙트 생성자 */
    constructor(address _hotWallet) ERC20("MetaTreeToken", "MTT") {
        owner = msg.sender;
        hotWallet = _hotWallet;
        _mint(msg.sender, 10000000000);
    }
    /* 함수를 호출한 계정이 owner 계정과 일치해야만 실행 */
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function.");
        _;
    }
    /* 호출한 주소가 transferAllowed 등록된 주소거나 owner/hotWallet 주소와 일치해야만 실행 */
    modifier onlyAllowed(address sender) {
        require(transferAllowed[sender] == true || sender == owner || sender == hotWallet, "Transfer not allowed.");
        _;
    }
    /* owner 계정 변경 */
    function transferOwnership(address newOwner, uint256 amount) public onlyOwner {
        /* 전달 수량만큼 토큰 전송 */
        _transfer(owner, newOwner, amount);
        /* 오너 지갑 변경 */
        owner = newOwner;
    }
    /* hotWallet 변경 */
    function setHotWallet(address newHotWallet) public onlyOwner {
        hotWallet = newHotWallet;
    }
    /* transferAllowed 주소를 추가 */
    function allowTransfer(address user) public onlyOwner {
        transferAllowed[user] = true;
    }
    /* transferAllowed 주소 삭제 */
    function disallowTransfer(address user) public onlyOwner {
        transferAllowed[user] = false;
    }
    /* transferAllowed 허용 유무 조회 */
    function isTransferAllowed(address user) public view onlyOwner returns (bool) {
        return transferAllowed[user];
    }
    /* 전송 */
    function transfer(address recipient, uint256 amount) public virtual override onlyAllowed(msg.sender) returns (bool) {
        _transfer(_msgSender(), recipient, amount);
        return true;
    }



    /*  AccountList */
//    struct Account {
//        address accountAddress;
//        bytes32 privateKey;
//    }
//
//    Account[] public accounts;
//
//    function addAccount(address _accountAddress, bytes32 _privateKey) public {
//        Account memory newAccount = Account(_accountAddress, _privateKey);
//        accounts.push(newAccount);
//    }
//
//    function getAccount(uint256 _index) public view returns (address, bytes32) {
//        require(_index < accounts.length, "Index out of bounds");
//        Account memory account = accounts[_index];
//        return (account.accountAddress, account.privateKey);
//    }
//
//    function getAccounts() public view returns (Account[] memory) {
//        return accounts;
//    }
    /*  _AccountList */


}