/*  ccountList
** ㅇ
*/
contract AccountList {
    struct Account {
        address accountAddress;
        bytes32 privateKey;
    }

    Account[] public accounts;

    function addAccount(address _accountAddress, bytes32 _privateKey) public {
        Account memory newAccount = Account(_accountAddress, _privateKey);
        accounts.push(newAccount);
    }

    function getAccount(uint256 _index) public view returns (address, bytes32) {
        require(_index < accounts.length, "Index out of bounds");
        Account memory account = accounts[_index];
        return (account.accountAddress, account.privateKey);
    }

    function getAccounts() public view returns (Account[] memory) {
        return accounts;
    }
}