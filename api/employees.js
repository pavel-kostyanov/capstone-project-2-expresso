const express = require('express');
const employeesRouter = express.Router();
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite')


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

employeesRouter.post('/', (req, res, next) => {
  const name = req.body.employee.name;
  const position = req.body.employee.position;
  const wage = req.body.employee.wage;
  const is_current_employee = req.body.employee.is_current_employee === 0 ? 0 : 1;
  if(!name || !position || !wage){
    return res.sendStatus(400);
  };
  const sql = "INSERT INTO Employee (name, position, wage, is_current_employee) VALUES ($name, $position, $wage, $is_current_employee)";
  const values = {
                  $name: name,
                  $position: position,
                  $wage: wage,
                  $is_current_employee: is_current_employee
                };
  db.run(sql, values, function(err){
    if(err){
      next(err);
    }else{
      db.get(`SELECT * FROM Employee WHERE id = ${this.lastID}`, (err, employee) => {
        if(err){
          next(err);
        }else{
          res.status(201).json({employee});
        }
      })
    }
  })
})


employeesRouter.put('/:employeeId', (req, res, next) => {
  const name = req.body.employee.name;
  const position = req.body.employee.position;
  const wage = req.body.employee.wage;
  const is_current_employee = req.body.employee.is_current_employee === 0 ? 0 : 1;
  if(!name || !position || !wage){
    return res.sendStatus(400);
  };
  const sql = "UPDATE Employee SET name = $name, position = $position, wage = $wage, is_current_employee = $is_current_employee";
  const values = {
                  $name: name,
                  $position: position,
                  $wage: wage,
                  $is_current_employee: is_current_employee
                };
  db.run(sql, values, (err) => {
    if(err){
      next(err);
    }else{
      db.get(`SELECT * FROM Employee WHERE id = ${req.params.employeeId}`, (err, employee) => {
        if(err){
          next(err);
          }else{
            res.status(200).json({employee: employee});
          }
      })
    }
  })
})


module.exports = employeesRouter;
