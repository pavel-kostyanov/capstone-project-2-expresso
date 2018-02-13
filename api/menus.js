const express = require('express');
const menusRouter = express.Router();
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite')

menusRouter.get('/', (req, res, next) => {
  db.all("SELECT * FROM Menu", (err, menus) =>{
    if(err){
      next(err);
    }else{
      res.status(200).json({menus: menus});
    }
  })
})

menusRouter.post('/', (req, res, next) => {
  const title = req.body.menu.title;
  if(!title){
    return res.sendStatus(400);
  }else{
    db.run(`INSERT INTO Menu (title) VALUES ($title)`,
      {
        $title: title
      },
      function(err){
      if(err){
        next(err);
      };
      db.get(`SELECT * FROM Menu WHERE id = ${this.lastID}`, (err, menu) => {
        if(err){
          next(err);
        }else{
          res.status(201).json({menu: menu});
        }
      })
    })
  }
})

module.exports = menusRouter;
