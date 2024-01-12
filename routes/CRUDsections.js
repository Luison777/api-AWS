var express = require('express');
var router = express.Router();
const{deleteSubsection, createSection, createSubsection,deleteSection}=require('../db/CRUDfunctions')


router.post('/:newTableName', function (req, res, next) {
    const tableName = req.params.newTableName;
    const item=req.body;
    
    createSection(tableName,item,(err,result)=>{
      if(err){
        return next(err);
      }
      res.send(result);
    });
  });

  router.put('/:newTableName/:index',  function (req, res, next) {
    const newTableName = req.params.newTableName;
    const index = req.params.index;
    const item=req.body;
    createSubsection(newTableName,item,index,(err,actualiced)=>{
      if(err){
        return next(err);
      }
      res.send(actualiced);
    });
  });
  router.delete('/section/:tableName/:index', function(req, res, next) {
    const tableName = req.params.tableName;
    const index = req.params.index;
    
    deleteSection(tableName,index,(err,deleted)=>{
        if(err){
          return next(err);
        }
        res.send(deleted);
      });
  });
  router.delete('/:tableName/:index', function(req, res, next) {
    const tableName = req.params.tableName;
    const index = req.params.index;
    const item=req.body;

    deleteSubsection(tableName,item,index,(err,deleted)=>{
        if(err){
          return next(err);
        }
        res.send(deleted);
      });
  });

 
module.exports = router;