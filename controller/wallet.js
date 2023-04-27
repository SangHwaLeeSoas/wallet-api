const express = require('express');
const app = express.Router();
const properties = require('../config/properties')
const customError = require('../exception/customError');
const resCode = require('../exception/resCode');
const logger = require('../config/log4').getLogger('walletController')
const walletService = require('../service/wallet')



/* * 잔액 조회 API
*  @Param : coin (ETH, TOKEN) addr (주소) */
app.get('/balance', async (req, res) => {

  try {
    logger.info(`/get/balance => ${req.query.coin} ${req.query.addr}`)
    const addr = req.query.addr || (() => { throw new customError(resCode.BAD_REQUEST, 'empty addr') })();
    const coin = req.query.coin || "TOKEN";
    const data = await walletService.getBalance(coin, addr)

    res.json({
      code: 200,
      data: data
    });
  } catch (e) {
    makeErrorResponse(e, res)
  }
});


/* * 지갑 생성 API */
app.post('/make/account', async (req, res) => {

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


/* * 코인 전송 API */
app.post('/transfer', async (req, res) => {

  try {
    logger.info(`/transfer => ${req.body.coin} ${req.body.amount} ${req.body.fromAddr} ${req.body.fromKey} ${req.body.toAddr}`)
    const coin = req.body.coin || "TOKEN";
    const amount = req.body.amount || (() => { throw new customError(resCode.BAD_REQUEST, 'empty amount') })();
    const toAddr = req.body.toAddr || (() => { throw new customError(resCode.BAD_REQUEST, 'empty toAddr') })();
    let fromAddr = req.body.fromAddr;
    let fromKey = req.body.fromKey;
    /* 기본값 Hot wallet에서 출금 */
    if (!fromAddr) {
      fromAddr = properties.HOT_WALLET_ADDRESS;
      fromKey = properties.HOT_WALLET_KEY
    } else {
      fromKey || (() => { throw new customError(resCode.BAD_REQUEST, 'empty fromKey') })();
    }
    const data = await walletService.transferToken(fromAddr, fromKey, toAddr, coin, amount);

    res.json({
      code: 200,
      data: data
    });
  } catch (e) {
    makeErrorResponse(e, res)
  }
});


/* * 지갑 목록 전체 조회 API */
// app.get('/get/all/account', async (req, res) => {
//
//   try {
//     const data = await walletService.getAccountAll()
//
//     res.json({
//       code: 200,
//       data: data
//     });
//   } catch (e) {
//     makeErrorResponse(e, res)
//   }
// });


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
