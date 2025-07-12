const express = require('express');
const path = require("path");
var router = express.Router();
const bodyParser = require('body-parser');
const con = require('../../Banco/MySQL/conexaoMysql');

router.get('/institucional', (req, res) => {
  req.session, (err) => {
    console.error('Error page index:', err);
    res.status(500).send('Error page index');
    return;
  }
  res.render(path.join(__dirname, 'index.ejs'))
})

router.get('/about', (req, res) => {
  req.session, (err) => {
    console.error('Error page about:', err);
    res.status(500).send('Error page about');
    return;
  }
  res.render(path.join(__dirname, 'about.ejs'))
})

router.get('/mural', (req, res) => {
  req.session, (err) => {
    console.error('Error page mural:', err);
    res.status(500).send('Error page mural');
    return;
  }
  res.render(path.join(__dirname, 'mural.ejs'))
})

router.get('/queroajudar', (req, res) => {
  req.session, (err) => {
    console.error('Error page queroajudar:', err);
    res.status(500).send('Error page queroajudar');
    return;
  }
  res.render(path.join(__dirname, 'queroajudar.ejs'))
})

module.exports = router;