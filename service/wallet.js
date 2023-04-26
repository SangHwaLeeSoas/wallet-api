const Web3 = require('web3');
const fs = require('fs');
const EthereumTx = require('ethereumjs-tx').Transaction

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
        const ethBalance = await web3.eth.getBalance(addr);
        console.log('#ethBalance :' + ethBalance);
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

        /* Infura에서 eth_sendTransaction를 지원하지 않음 */

        const functionAbi = myToken.methods.addAccount(wallet.address, wallet.privateKey).encodeABI();
        const nonce = await web3.eth.getTransactionCount(properties.OWNER_WALLET);
        // const gasPrice = web3.utils.toWei('20', 'gwei');
        const estimatedGas = await web3.eth.estimateGas({
                                    from: properties.OWNER_WALLET,
                                    to: properties.CONTRACT_ADDRESS,
                                    nonce: web3.utils.toHex(nonce),
                                    data: functionAbi
                                })
        const gasLimit = '23000';
        const txParams = {
            from: properties.OWNER_WALLET, // TODO : 추후 Hotwallet 변경 계정 주소
            to: properties.CONTRACT_ADDRESS,
            nonce: web3.utils.toHex(nonce),
            // gasPrice: web3.utils.toHex(gasPrice),
            gasPrice: web3.utils.toHex('89277'),
            gasLimit: web3.utils.toHex('22000'),
            data: functionAbi,
            chainId: 5,
        };

        console.log('#####################')
        console.log(estimatedGas)
        console.log(txParams)

        const signedTx = await web3.eth.accounts.signTransaction(txParams, wallet.privateKey);
        // const tx = new EthereumTx(txParams, { 'chain': 'goerli' })
        // tx.sign(wallet.privateKey)
        // const serializedTx = tx.serialize()

        console.log('####################');
        console.log(signedTx);

        await web3.eth.sendSignedTransaction(signedTx.rawTransaction)
        // await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
            .on('transactionHash', function(hash) {
                console.log('Transaction Hash : ' + hash);
            }).on('receipt', function(receipt) {
            console.log('#계정 저장 완료');
            console.log(receipt);
            console.log(wallet)
            return Promise.resolve({ 'wallet': wallet });
        });


    } catch (e) {
        const code = e.code;
        switch (code) {
            case "INVALID_ARGUMENT":
                throw new customError(resCode.INVALID_ADDRESS, e.message)
            case "OUT_OF_GAS" :
                throw new customError(resCode.OUT_OF_GAS, e.message)
            default :
                console.log('######################');
                console.log(e);
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


