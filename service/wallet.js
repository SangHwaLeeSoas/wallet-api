const Web3 = require('web3');
const fs = require('fs');

const properties = require('../config/properties')
const customError = require("../exception/customError");
const resCode = require("../exception/resCode");
const logger = require('../config/log4').getLogger('walletController')


/* * web3.js provider 세팅 */
const rpcUrl = properties.RPC_PROTOCOL + properties.PROTOCOL_SEPARATE + properties.RPC_URL
const provider = new Web3.providers.HttpProvider(rpcUrl);
const web3 = new Web3(provider);

/* * Smart Contract 세팅 */
const rawAbi = fs.readFileSync(properties.ABI_PATH);
const tokenAbi = JSON.parse(rawAbi.toString());
const myToken = new web3.eth.Contract(tokenAbi, properties.CONTRACT_ADDRESS);

/* * 잔액 조회 */
exports.getBalance = async (coin, addr) => {
    try {
        let balance;
        switch (coin) {
            case 'ETH' :
                balance = await web3.eth.getBalance(addr);
                balance = web3.utils.fromWei(balance.toString(), 'ether').toString();
                break;
            case 'TOKEN' :
                balance = await myToken.methods.balanceOf(addr).call()
                break;
        }
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
        return { 'wallet' : wallet };
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

/* 토큰 전송 */
exports.transferToken = async (fromAddress, privateKey, toAddress, coin, amount) => {
    try {

        let balance = 0;
        let to = properties.CONTRACT_ADDRESS;
        let data = null;
        let value = null;
        switch (coin) {
            case 'TOKEN':
                balance = await myToken.methods.balanceOf(fromAddress).call();
                data = myToken.methods.transfer(toAddress, amount).encodeABI()
                break;
            case 'ETH':
                balance = await web3.eth.getBalance(fromAddress);
                value = web3.utils.toBN(web3.utils.toWei(amount.toString(), 'ether')).toString();
                to = toAddress;
                break;
        }

        /* 잔액 최대 제한 */
        if (balance < amount)
            throw new customError(resCode.OUT_OF_AMOUNT)

        let gasPrice = await web3.eth.getGasPrice();
        let gasLimit = properties.GAS_LIMIT;
        let tx = {
            from: fromAddress,
            to: to,
            gasPrice: web3.utils.toHex(gasPrice),
            gas: web3.utils.toHex(gasLimit),
            chainId: properties.CHAIN_ID
        };
        if (data) tx.data = data;
        if (value) tx.value = value;

        logger.info(tx);
        const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
        return await new Promise((resolve, reject) => {
            web3.eth.sendSignedTransaction(signedTx.rawTransaction)
                /* transactionHash 생성 직후 응답 */
                .on('transactionHash', async (hash) => {
                    logger.info(`#transactionHash => ${hash}`);
                    resolve({ 'transactionHash' : hash });
                })
                /* 비동기로 남은 작업들은 실행 */
                .on('receipt', (receipt) => {
                    logger.info(receipt);
                });
        });

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


/* * 트랜잭션 정보 조회 */
exports.getTransactionInfo = async (txHash) => {
    try {
        const txInfo = await web3.eth.getTransactionReceipt(txHash);
        logger.info(txInfo);
        return { 'txInfo' : txInfo };
    } catch (e) {
        const code = e.code;
        switch (code) {
            default :
                throw new customError(resCode.RPC_ERROR, e.message)
        }
    }
}


