const express = require('express');
const employeesRouter = express.Router();
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite')

const headers = {
  "Access-Control-Allow-Origin", ["*"];
  "Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS";
  "Access-Control-Allow-Credentials", false;
  "Access-Control-Max-Age", '86400'; // 24 hours
  "Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept";
}

employeesRouter.param('employeeId', (req, res, next, employeeId) =>{
  const sql = "SELECT * FROM Employee WHERE Employee.id = $employeeId";
  const values = {$employeeId: employeeId};
  db.get(sql, values, (error, employee) => {
    if(error){
      next(error);
    }else if(employee){
      req.employee = employee;
      next();
    }else{
      res.sendStatus(404);
    }
  })
})

employeesRouter.get('/', (req, res, next) => {
  db.all("SELECT * FROM Employee WHERE Employee.is_current_employee = 1", (err, employees) => {
    if(err){
      next(err);
    }else{
      res.status(200).json({employees: employees});
    }
  });
})

employeesRouter.get('/:employeeId', (req, res, next) => {
  res.status(200).json({employee: req.employee});
})


module.exports = employeesRouter;
