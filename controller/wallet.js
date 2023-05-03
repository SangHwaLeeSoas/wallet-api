const express = require('express');
const app = express.Router();
const properties = require('../config/properties')
const customError = require('../exception/customError');
const resCode = require('../exception/resCode');
const logger = require('../config/log4').getLogger('walletController')
const walletService = require('../service/wallet')



/* * 잔액 조회 API  */
app.get('/balance', async (req, res) => {

  try {
    logger.info(`/get/balance => ${req.query.symbol} ${req.query.address}`)
    const address = req.query.address || (() => { throw new customError(resCode.BAD_REQUEST, 'empty address') })();
    const symbol = req.query.symbol || "TOKEN";
    const data = await walletService.getBalance(symbol, address)
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
    logger.info(`/transfer => ${req.body.symbol} ${req.body.amount} ${req.body.fromAddress} ${req.body.fromKey} ${req.body.toAddress}`)
    const symbol = req.body.symbol || "TOKEN";
    const amount = req.body.amount || (() => { throw new customError(resCode.BAD_REQUEST, 'empty amount') })();
    const toAddress = req.body.toAddress || (() => { throw new customError(resCode.BAD_REQUEST, 'empty toAddress') })();
    let fromAddress = req.body.fromAddress;
    let fromKey = req.body.fromKey;
    /* 기본값 Hot wallet에서 출금 */
    if (!fromAddress) {
      fromAddress = properties.HOT_WALLET_ADDRESS;
      fromKey = properties.HOT_WALLET_KEY
    } else {
      fromKey || (() => { throw new customError(resCode.BAD_REQUEST, 'empty fromKey') })();
    }
    const data = await walletService.transferToken(fromAddress, fromKey, toAddress, symbol, amount);
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
    logger.info(`/allowed/account => ${req.query.address}`)
    const address = req.query.address || (() => { throw new customError(resCode.BAD_REQUEST, 'empty address') })();
    const data = await walletService.getIsAllowed(address);
    sendResponse(resCode.SUCCESS, res, data);
  } catch (e) {
    makeErrorResponse(e, res)
  }
});


/* 전송 허용 추가 API */
app.post('/add/allowed/account', async (req, res) => {

  try {
    logger.info(`/set/allowed/account => ${req.body.address} ${req.body.isAllowed}`)
    const address = req.body.address || (() => { throw new customError(resCode.BAD_REQUEST, 'empty address') })();
    const isAllowed = req.body.isAllowed || (() => { throw new customError(resCode.BAD_REQUEST, 'empty isAllowed') })();
    const data = await walletService.manageAllowedAccount(address, isAllowed);
    sendResponse(resCode.SUCCESS, res, data);
  } catch (e) {
    makeErrorResponse(e, res)
  }
});


/* 오너 계정 변경 API */
app.post('/change/owner', async (req, res) => {
  try {
    logger.info(`/change/owner => ${req.body.ownerAddress} ${req.body.ownerKey}`)
    const ownerAddress = req.body.ownerAddress || (() => { throw new customError(resCode.BAD_REQUEST, 'empty ownerAddress') })();
    const ownerKey = req.body.ownerKey || (() => { throw new customError(resCode.BAD_REQUEST, 'empty ownerKey') })();
    const data = await walletService.changeOwner(ownerAddress, ownerKey);
    sendResponse(resCode.SUCCESS, res, data);
  } catch (e) {
    makeErrorResponse(e, res)
  }
});

/* * 공통 Error Response */
const makeErrorResponse = (e, res) => {
  logger.info(e);
  if (e instanceof customError) {
    sendResponse(e, res);
  } else {
    const customRes = resCode.create(resCode.SERVER_ERROR)
    sendResponse(customRes, res);
  }
}

/* * response 응답 */
const sendResponse = (resCode, res, data) => {
  let httpStatus = 200;
  /* RPC 에러일 경우 Network Response code를 200이 아닌, 다른 코드로 변경*/
  if (resCode.code == 'RPC_ERROR')
    httpStatus = resCode.httpCode;

  res.status(httpStatus).json({
    status : resCode.httpCode,
    message : resCode.message,
    data : data
  });
}

module.exports = app;
