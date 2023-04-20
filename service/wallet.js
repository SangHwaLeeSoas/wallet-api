const Web3 = require('web3');
const fs = require('fs');

const properties = require('../config/properties')
const customError = require("../exception/customError");
const resCode = require("../exception/resCode");


/* * web3.js provider 세팅 */
const rpcUrl = properties.RPC_PROTOCOL + properties.PROTOCOL_SEPARATE + properties.RPC_URL
const provider = new Web3.providers.HttpProvider(rpcUrl);
const web3 = new Web3(provider);


/* * 잔액 조회 */
exports.getBalance = async (addr) => {
    try {
        const rawAbi = fs.readFileSync(properties.ABI_PATH);
        const tokenAbi = JSON.parse(rawAbi.toString());
        const myToken = new web3.eth.Contract(tokenAbi, '0xd6e954Ec1c6749C442C65F40C6107d455A3721Ee');
        const balance = await myToken.methods.balanceOf(addr).call()
        return balance;
    } catch (e) {
        throw new customError(resCode.BAD_REQUEST, e.message)
    }
}


