var express = require('express');
var router = express.Router();
const{prueba,create,update,readTable,deleteData,updateSection}=require('../db/CRUDfunctions')

router.get('/prueba',function(req,res,next){
    prueba((err,result)=>{
        if (err){
            console.log(err);
            return res.status(500).send('Error al hacerla prueba.'+err); 
        }
        res.send(result);
    })
} );

router.get('/:tableName', function(req,res,next){
    const tableName=req.params.tableName;
    readTable(tableName,(err,result)=>{
        if (err){
            console.log(err);
            return res.status(500).send(err); 
        }
        res.send(result);
    })
})

router.post('/:tableName', function (req, res, next) {
    const tableName = req.params.tableName;
    const item=req.body;
    
    create(tableName,item,(err,result)=>{
      if(err){
        return next(err);
      }
      res.send(result);
    });
  });

  router.put('/:tableName/:index',  function (req, res, next) {
    const tableName = req.params.tableName;
    const index = req.params.index;
    const item=req.body;
    update(tableName,index,item,(err,actualiced)=>{
      if(err){
        return next(err);
      }
      res.send(actualiced);
    });
  });
  router.put('/:oldName/:newName/:index',  function (req, res, next) {
    const oldName=req.params.oldName;
    const newName=req.params.newName;
    const index = req.params.index;
    const item=req.body;
    updateSection(oldName,newName,item,index,(err,actualiced)=>{
      if(err){
        return next(err);
      }
      res.send(actualiced);
    });
  });
  router.delete('/:tableName/:index', function(req, res, next) {
    const tableName = req.params.tableName;
    const index = req.params.index;

    deleteData(tableName,index,(err,deleted)=>{
        if(err){
          return next(err);
        }
        res.send(deleted);
      });
  });

module.exports = router;