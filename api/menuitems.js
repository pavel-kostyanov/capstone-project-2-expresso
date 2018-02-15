const express = require('express');
const menuitemsRouter = express.Router({mergeParams: true});
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

menuitemsRouter.get('/', (req, res, next) => {
  const sql = "SELECT * FROM MenuItem WHERE MenuItem.menu_id = $menu_id";
  const values = {$menu_id: req.params.menuId};
  db.all(sql, values, (err, menuItems) =>{
    if(err){
      next(err);
    }else{
      res.status(200).json({menuItems: menuItems});
    }
  })
})

menuitemsRouter.post('/', (req, res, next) => {
   const name = req.body.menuItem.name;
   const description = req.body.menuItem.description;
   const inventory = req.body.menuItem.inventory;
   const price = req.body.menuItem.price;
   if(!name || !description || !inventory || !price){
     return res.sendStatus(400);
   };
   const sql = 'INSERT INTO MenuItem (name, description, inventory, price, menu_id) VALUES ($name, $description, $inventory, $price, $menu_id)';
   const values = {
                    $name: name,
                    $description: description,
                    $inventory: inventory,
                    $price: price,
                    $menu_id: req.params.menuId
                  };
   db.run(sql, values, function(err){
     if(err){
       next(err);
     }else{
       db.get(`SELECT * FROM MenuItem WHERE id = ${this.lastID}`, (err, menuItem) =>{
         if(err){
           next(err);
         }else{
           res.status(201).json({menuItem: menuItem});
         }
       })
     }
   })
})

menuitemsRouter.delete('/:menuItemId', (req, res, next) => {
  db.get(`SELECT id FROM MenuItem WHERE MenuItem.id = ${req.params.menuItemId}`, (err, menuItemId) => {
    if(err){
      next(err);
    }else if(menuItemId){
      const sql = "DELETE FROM MenuItem WHERE MenuItem.id = $id";
      const values = {$id: req.params.menuItemId};
      db.run(sql, values, (error) => {
        if(error){
          next(error);
        }else{
          res.sendStatus(204);
        }
      })
    }else{
        res.sendStatus(404);
    }
  })
})




module.exports = menuitemsRouter;
