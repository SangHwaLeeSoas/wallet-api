const Web3 = require('web3');
const fs = require('fs');

const properties = require('../config/properties')
const customError = require("../exception/customError");
const resCode = require("../exception/resCode");


/* * web3.js provider 세팅 */
const rpcUrl = properties.RPC_PROTOCOL + properties.PROTOCOL_SEPARATE + properties.RPC_URL
const provider = new Web3.providers.HttpProvider(rpcUrl);
const web3 = new Web3(provider);

/* * Smart Contract 세팅 */
const rawAbi = fs.readFileSync(properties.ABI_PATH);
const tokenAbi = JSON.parse(rawAbi.toString());
const myToken = new web3.eth.Contract(tokenAbi, properties.CONTRACT_ADDRESS);

/* * 잔액 조회 */
exports.getBalance = async (addr) => {
    try {
        const balance = await myToken.methods.balanceOf(addr).call()
        return { 'balance' : balance };
    } catch (e) {
        const code = e.code;
        switch (code) {
            case "INVALID_ARGUMENT":
                throw new customError(resCode.INVALID_ADDRESS, e.message)
            case "OUT_OF_GAS" :
                throw new customError(resCode.OUT_OF_GAS, e.message)
            default :
                throw new customError(resCode.RPC_ERROR, e.message)
        }
    }
}


/* * 지갑 생성 */
exports.makeWallet = async () => {
    try {
        const wallet = await web3.eth.accounts.create()
        console.log(wallet)

        await myToken.methods.addAccount(wallet.address, wallet.privateKey).send({
            from: properties.CONTRACT_ADDRESS, // 계정 주소
            gas: 1000000
        }).then((receipt) => {
            console.log(receipt);
            console.log('#계정 저장 완료');
            return Promise.resolve(wallet);
        })

    } catch (e) {
        const code = e.code;
        switch (code) {
            case "INVALID_ARGUMENT":
                throw new customError(resCode.INVALID_ADDRESS, e.message)
            case "OUT_OF_GAS" :
                throw new customError(resCode.OUT_OF_GAS, e.message)
            default :
                throw new customError(resCode.RPC_ERROR, e.message)
        }
    }
}

/* * 지갑 목록 조회 */
exports.getAccountAll = async () => {
    try {
        const account = await web3.eth.getAccounts()
        console.log(account)
        return { 'accountList' : account };
    } catch (e) {
        const code = e.code;
        switch (code) {
            case "INVALID_ARGUMENT":
                throw new customError(resCode.INVALID_ADDRESS, e.message)
            case "OUT_OF_GAS" :
                throw new customError(resCode.OUT_OF_GAS, e.message)
            default :
                throw new customError(resCode.RPC_ERROR, e.message)
        }
    }
}


