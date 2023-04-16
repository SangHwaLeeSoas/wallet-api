const dotenv = require('dotenv');

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

module.exports = {
    ADMIN_SERVER: process.env.ADMIN_SERVER,
    FRONT_SERVER: process.env.FRONT_SERVER
};