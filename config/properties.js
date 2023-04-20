const dotenv = require('dotenv');

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

module.exports = {
    ADMIN_SERVER: process.env.ADMIN_SERVER,
    FRONT_SERVER: process.env.FRONT_SERVER,
    PROTOCOL_SEPARATE: process.env.PROTOCOL_SEPARATE,
    RPC_PROTOCOL: process.env.RPC_PROTOCOL,
    RPC_URL: process.env.RPC_URL,
    ABI_PATH: process.env.ABI_PATH,
    CONTRACT_ADDRESS: process.env.CONTRACT_ADDRESS,

};