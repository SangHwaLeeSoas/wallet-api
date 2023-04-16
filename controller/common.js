const express = require('express');
const app = express.Router();


app.get('/hello', (req, res) => {
  const name = req.query.name || 'World';
  const message = `Hello, ${process.env.ADMIN_SERVER}!`;

  console.log("asdfsadfsafsa")
  console.log(process.env.NODE_ENV)

  // JSON 형식으로 응답
  res.json({
    message: message
  });
});

module.exports = app;
