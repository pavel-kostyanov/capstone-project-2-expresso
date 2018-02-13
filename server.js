const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const PORT = process.env.PORT || 4000;
app.listen(PORT, console.log('app is listening on port 4000'));

app.use(bodyParser.json());



const apiRouter = require('./api/api.js');
app.use('/api', apiRouter);

module.exports = app;
