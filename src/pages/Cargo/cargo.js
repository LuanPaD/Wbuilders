const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const multer = require('multer');
const con = require('../../Banco/MySQL/conexaoMysql');
const path = require('path');
const fs = require('fs');

router.use(bodyParser.urlencoded({
    extended: true
}));

function checkCargo(role) {
    return (req, res, next) => {
      if (req.session && req.session.adm === role || req.session.adm === 'M') {
        next(); 
      } else {
        res.status(403).send('Acesso negado'); 
      }
    };
  }
  

module.exports = router;
module.exports = checkCargo;