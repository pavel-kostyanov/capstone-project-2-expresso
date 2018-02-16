const express = require('express');
const menusRouter = express.Router();
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite')

const menuitemsRouter = require('./menuitems');
menusRouter.use('/:menuId/menu-items', menuitemsRouter);

menusRouter.param('menuId', (req, res, next, menuId) => {
  const sql = "SELECT * FROM Menu WHERE Menu.id = $menuId";
  const values = {$menuId: menuId};
  db.get(sql, values, (err, menu) => {
    if(err){
      next(err);
    }else if(menu){
      req.menu = menu;
      next();
    }else{
      res.sendStatus(404);
    }
  })
})

menusRouter.get('/', (req, res, next) => {
  db.all("SELECT * FROM Menu", (err, menus) =>{
    if(err){
      next(err);
    }else{
      res.status(200).json({menus: menus});
    }
  })
})

menusRouter.get('/:menuId', (req, res, next) => {
  res.status(200).json({menu: req.menu});
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

menusRouter.put('/:menuId', (req, res, next) =>{
  const title = req.body.menu.title;
  if(!title){
    return res.sendStatus(400);
  };
  const sql = "UPDATE Menu SET title = $title";
  const values = {$title: title};
  db.run(sql, values, (err) => {
    if(err){
      next(err);
    }else{
      db.get(`SELECT * FROM Menu WHERE id = ${req.params.menuId}`, (err, menu) => {
        if(err){
          next(err);
        }else{
          res.status(200).json({menu: menu});
        }
      })
     }
   })
 })

menusRouter.delete('/:menuId', (req, res, next) =>{
  db.get(`SELECT * FROM MenuItem WHERE MenuItem.menu_id = ${req.params.menuId}`, (err, menu) =>{
    if(err){
      next(err);
    }else if(menu){
      res.sendStatus(400);
    }else{
      db.run(`DELETE FROM Menu WHERE Menu.id = ${req.params.menuId}`, (err) => {
        if(err){
          next(err);
        }else{
          res.sendStatus(204);
        }
      });
    }
  });
});

module.exports = menusRouter;
