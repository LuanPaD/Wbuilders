const express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const path = require('path');


router.use(bodyParser.urlencoded({
    extended: true
}));


router.get('/', (req, res) => {
    let cargo =  req.session.adm == 'M'|| req.session.adm == "A"
    res.render(path.join(__dirname, 'index.ejs'), { names: req.session.names,cargo});
});
router.get('/escolher', (req, res) => {
    res.render(path.join(__dirname + "/Escolher", 'index.ejs'), { names: req.session.names });
});
router.get('/escolherBusca', (req, res) => {
    res.render(path.join(__dirname + "/EscolherBusca", 'index.ejs'), { names: req.session.names });
});



module.exports = router;