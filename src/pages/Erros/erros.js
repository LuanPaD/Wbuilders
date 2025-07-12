const express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const path = require('path');
const con = require('../../Banco/MySQL/conexaoMysql');

router.use(bodyParser.urlencoded({
    extended: true
}));

router.get('/erro', (req, res) => {
        res.render(path.join(__dirname, 'index.ejs'));
        return;
});

module.exports = router;