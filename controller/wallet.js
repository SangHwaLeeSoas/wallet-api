const express = require('express');
const app = express.Router();
const properties = require('../config/properties')
const customError = require('../exception/customError');
const resCode = require('../exception/resCode');
const logger = require('../config/log4').getLogger('walletController')
const walletService = require('../service/wallet')



/* * 잔액 조회 API */
app.get('/get/balance', async (req, res) => {

  try {
    logger.info(`/get/balance => ${req.query.addr}`)
    const addr = req.query.addr || (() => { throw new customError(resCode.BAD_REQUEST, 'empty addr') })();
    const coin = req.query.coin || "";
    const data = await walletService.getBalance(addr)

    res.json({
      code: 200,
      data: data
    });
  } catch (e) {
    makeErrorResponse(e, res)
  }
});


/* * 지갑 생성 API */
app.get('/make/account', async (req, res) => {

  try {
    logger.info(`/make/account`)
    const data = await walletService.makeWallet()

    res.json({
      code: 200,
      data: data
    });
  } catch (e) {
    makeErrorResponse(e, res)
  }
});


/* * 지갑 목록 전체 조회 API */
app.get('/get/all/account', async (req, res) => {

  try {
    const data = await walletService.getAccountAll()

    res.json({
      code: 200,
      data: data
    });
  } catch (e) {
    makeErrorResponse(e, res)
  }
});


/* * 공통 Error Response */
function makeErrorResponse (e, res) {
  if (e instanceof customError) {
    logger.info(e)
    res.status(e.httpStatusCode).json({
      code : e.code,
      msg : e.message
    })
  } else {
    logger.error(e)
    const customRes = resCode.create(resCode.SERVER_ERROR)
    res.status(customRes.httpCode).json({
      code : customRes.code,
      msg : e.message
    })
  }
}

module.exports = app;
