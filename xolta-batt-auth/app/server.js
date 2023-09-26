'use strict';
 
const express = require('express');
const xolta_auth = require('./xolta_auth');

const app = express();

const PORT = 8000;
const HOST = '0.0.0.0';

app.use(express.json());

app.post('/login', async (req, res) => {
  var result = await xolta_auth.doLogin(req.body.username, req.body.password);
  res.send(result);
});

app.listen(PORT, HOST, (err) => {
  if (err) {
    console.log('Error::', err);
  }
  console.log(`Running on http://${HOST}:${PORT}`);
});