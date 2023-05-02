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
    sendResponse(resCode.SUCCESS, res, data);
  } catch (e) {
    makeErrorResponse(e, res)
  }
});


/* * 지갑 생성 API */
app.post('/make/account', async (req, res) => {

  try {
    logger.info(`/make/account`)
    const data = await walletService.makeWallet()
    sendResponse(resCode.SUCCESS, res, data);
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
    sendResponse(resCode.SUCCESS, res, data);
  } catch (e) {
    makeErrorResponse(e, res)
  }
});


/* 트랜잭션 조회 API */
app.get('/transaction', async (req, res) => {

  try {
    logger.info(`/transaction => ${req.query.txHash}`)
    const txHash = req.query.txHash || (() => { throw new customError(resCode.BAD_REQUEST, 'empty txHash') })();
    const data = await walletService.getTransactionInfo(txHash);
    sendResponse(resCode.SUCCESS, res, data);
  } catch (e) {
    makeErrorResponse(e, res)
  }
});


/* 계정 전송 상태 조회 API */
app.get('/allowed/account', async (req, res) => {

  try {
    logger.info(`/allowed/account => ${req.query.addr}`)
    const addr = req.query.addr || (() => { throw new customError(resCode.BAD_REQUEST, 'empty addr') })();
    const data = await walletService.getIsAllowed(addr);
    sendResponse(resCode.SUCCESS, res, data);
  } catch (e) {
    makeErrorResponse(e, res)
  }
});


/* 전송 허용 추가 API */
app.post('/add/allowed/account', async (req, res) => {

  try {
    logger.info(`/set/allowed/account => ${req.body.addr} ${req.body.isAllowed}`)
    const addr = req.body.addr || (() => { throw new customError(resCode.BAD_REQUEST, 'empty addr') })();
    const isAllowed = req.body.isAllowed || (() => { throw new customError(resCode.BAD_REQUEST, 'empty isAllowed') })();
    const data = await walletService.manageAllowedAccount(addr, isAllowed);
    sendResponse(resCode.SUCCESS, res, data);
  } catch (e) {
    makeErrorResponse(e, res)
  }
});


/* 오너 계정 변경 API */
app.post('/change/owner', async (req, res) => {
  try {
    logger.info(`/change/owner => ${req.body.ownerAddr} ${req.body.ownerKey}`)
    const ownerAddr = req.body.ownerAddr || (() => { throw new customError(resCode.BAD_REQUEST, 'empty ownerAddr') })();
    const ownerKey = req.body.ownerKey || (() => { throw new customError(resCode.BAD_REQUEST, 'empty ownerKey') })();
    const data = await walletService.changeOwner(ownerAddr, ownerKey);
    sendResponse(resCode.SUCCESS, res, data);
  } catch (e) {
    makeErrorResponse(e, res)
  }
});

/* * 공통 Error Response */
const makeErrorResponse = (e, res) => {
  if (e instanceof customError) {
    logger.info(e)
    sendResponse(e, res);
  } else {
    logger.error(e)
    const customRes = resCode.create(resCode.SERVER_ERROR)
    sendResponse(customRes, res);
  }
}

/* * response 응답 */
const sendResponse = (resCode, res, data) => {
  let httpStatus = 200;
  /* RPC 에러일 경우 Network Response code를 200이 아닌, 다른 코드로 변경*/
  if (resCode.code = 'RPC_ERROR')
    httpStatus = resCode.httpCode;
  res.status(httpStatus).json({
    status : resCode.code,
    message : resCode.message,
    data : data
  });
}

module.exports = app;
