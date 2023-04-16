const express = require('express');
const app = express.Router();
const properties = require('../config/properties')
const infuraService = require('../service/infura');


app.get('/hello', async (req, res) => {
  const name = req.query.name || 'World';
  const test = await infuraService.testAPI("테스트다");
  console.log(process.env.NODE_ENV);
  const message = `Hello, ${properties.ADMIN_SERVER}! /11 ${test} /22`;

  // JSON 형식으로 응답
  res.json({
    message: message
  });
});

module.exports = app;
