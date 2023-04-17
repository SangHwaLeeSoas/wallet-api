const express = require('express');
const app = express.Router();
const properties = require('../config/properties')
const customError = require('../exception/customError');
const resCode = require('../exception/resCode');

const walletService = require('../service/wallet')


app.get('/get/balance', async (req, res) => {

  try {
    // '0x23d02A1c3375Fb67F868147B7BB666e168F7C2ee'
    const addr = req.query.addr || (() => { throw new customError(resCode.BAD_REQUEST, 'empty addr') })();
    console.log(addr)
    const balance = await walletService.getBalance(addr)
    const data = {'balance' : balance};

    // JSON 형식으로 응답
    res.json({
      code: 200,
      data: data
    });
  } catch (e) {
    if (e instanceof customError) {
      console.log(e.httpStatusCode, e.code, e.message)
      res.status(e.httpStatusCode).json({
        code : e.code,
        msg : e.message
      })
    } else {
      const customRes = resCode.create(resCode.SERVER_ERROR)
      res.status(customRes.httpCode).json({
        code : customRes.code,
        msg : e.message
      })
    }
  }


});

module.exports = app;
