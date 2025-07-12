const express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const path = require('path');
const con = require('../../Banco/MySQL/conexaoMysql');

router.use(bodyParser.urlencoded({
  extended: true
}));


router.get('/historico', (req, res) => {
  con.query('select b.title,b.edition,b.code,b.foto,ac.status,ac.id_action from actions ac INNER join historic h on (ac.id_action = h.id_action) inner join book b on (ac.id_book = b.id_book) where ac.id_customer = ? GROUP by id_action', req.session.id_customer, (err, books, results) => {
    if (err) {
      console.error('Error fetching books:', err);
      res.status(500).send('Error fetching books');
      return;
    }

    con.query('select h.date,h.status_book,ac.id_action from actions ac INNER join historic h on (ac.id_action = h.id_action) inner join book b on (ac.id_book = b.id_book) where ac.id_customer = ? order by h.date', req.session.id_customer, (err, historic) => {
      if (err) {
        console.error('Error fetching books:', err);
        res.status(500).send('Error fetching books');
        return;
      }
      res.render(path.join(__dirname, 'index.ejs'), {
        books,
        historic,
        names: req.session.names
      });
    });
  });
});

module.exports = router;