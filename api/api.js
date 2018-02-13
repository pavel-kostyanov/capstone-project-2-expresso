const express = require('express');
const apiRouter = express.Router();

apiRouter.use((req, res, next) => {
  const headers = {
    "Access-Control-Allow-Origin": ["*"],
    "Access-Control-Allow-Methods": "POST, GET, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Credentials": false,
    "Access-Control-Max-Age": '86400', // 24 hours
    "Access-Control-Allow-Headers": "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
  }
  res.set(headers);
  next();
});




const employeesRouter = require('./employees.js');
apiRouter.use('/employees', employeesRouter);

const menusRouter = require('./menus.js');
apiRouter.use('/menus', menusRouter);


module.exports = apiRouter;
