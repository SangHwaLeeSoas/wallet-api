const properties = require('../config/properties')
const Web3 = require('web3');
const customError = require("../exception/customError");
const resCode = require("../exception/resCode");

/* * web3.js provider 세팅 */
const rpcUrl = properties.RPC_PROTOCOL + properties.PROTOCOL_SEPARATE + properties.RPC_URL
const provider = new Web3.providers.HttpProvider(rpcUrl);
const web3 = new Web3(provider);

/* * 잔액 조회 */
exports.getBalance = async (addr) => {
    try {
        return web3.eth.getBalance(addr);
    } catch (e) {
        throw new customError(resCode.BAD_REQUEST, e.message)
    }
}


