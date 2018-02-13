const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const PORT = process.env.PORT || 4000;
app.listen(PORT, console.log('app is listening on port 4000'));

app.use(bodyParser.json());

app.use((req, res, next) => {
  //if (req.method === 'OPTIONS') {
    var headers = {};
    "Access-Control-Allow-Origin", ["*"];
    "Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS";
    "Access-Control-Allow-Credentials", false;
    "Access-Control-Max-Age", '86400'; // 24 hours
    "Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept";
    res.set(headers);
    res.status(200);

  //}

  // res.setHeader('Access-Control-Allow-Origin', null);
  // res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  // res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
      next();
});

const apiRouter = require('./api/api.js');
app.use('/api', apiRouter);

module.exports = app;
