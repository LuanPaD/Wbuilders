const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const path = require('path');
const con = require('../../Banco/MySQL/conexaoMysql');
const cargo = require("../Cargo/cargo");
const checkCargo = require('../Cargo/cargo');
const crypto = require('crypto');

router.use(bodyParser.urlencoded({
  extended: true
}));


router.get('/entrar', (req, res) => {
  res.render(path.join(__dirname + "/Login", 'index.ejs'));
});

router.get('/cadastrar', (req, res) => {
  res.render(path.join(__dirname + "/seCadastrar", 'index4.ejs'));
});

// /AdicionarAdm
router.get('/AdicionarAdm', checkCargo("M"), (req, res) => {
  res.render(path.join(__dirname + "/cadastrarADM", 'index.ejs'));
});

router.post('/AdicionarAdm', checkCargo("M"), (req, res) => {
  let reqBody = req.body;
  con.query("UPDATE customers set adm = 'A' where email = ?", reqBody.email, (err, results, fields) => {
    if (err) {
      console.error('Error inserting adm:', err);
      res.status(500).send('Error inserting adm');
      return;
    }

    res.redirect('/');
  })
})

router.post('/cadastrar', (req, res) => {
  let reqBody = req.body;
  const email = reqBody.email;

  con.query('SELECT * FROM customers WHERE email = ?', [email], (err, results, fields) => {
    if (err) {
      console.error('Error checking email:', err);
      res.status(500).send('Error checking email');
      return;
    }

    if (results.length > 0) {
      res.status(400).send('Email Existente na base de dados');
      return;
    }
    let senhaCripty = encryptData(reqBody.passwords,encryptionKey )

    con.query('INSERT INTO customers VALUES (DEFAULT,?,?,?,?,?,?,DEFAULT)', [reqBody.names, reqBody.email, reqBody.age, reqBody.address, reqBody.cellphone,senhaCripty], (err, results, fields) => {
      if (err) {
        console.error('Error inserting user:', err);
        res.status(500).send('Error inserting user');
        return;
      }
  
      res.redirect("/entrar")
    });
  })
});

router.post('/entrar', (req, res) => {
  let reqBody = req.body;
  let senhadescript = encryptData(reqBody.passwords,encryptionKey)
  const query = 'SELECT * FROM customers WHERE `email` = ? AND `passwords` = ?';
  con.query(query, [reqBody.email, senhadescript], async (err, results) => {
    if (err) {
      console.error('Erro ao consultar o banco de dados:', err);
      res.status(500).send('Erro no servidor');
      return;
    }

    if (results.length === 1) {
      let dadosADM = await conferirADM(req, res, reqBody.email)
      console.log(dadosADM)
      req.session.login = reqBody.email;
      req.session.names = results[0].names;
      req.session.adm = dadosADM;
      req.session.id_customer = results[0].id_customer;

      res.status(200).redirect('/');
    } else {
      res.status(401).redirect('/entrar');
    }
  });
});

function conferirADM(req, res, email) {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM customers WHERE email = ? `;
    con.query(query, email, (err, results) => {
      if (err) {
        console.error('Erro ao consultar o banco de dados:', err);
        reject(err);
        return;
      }

      if (results.length === 1) {
        resolve(results[0].adm); // Resolver a Promise com o cargo
      } else {
        resolve("U"); // Resolver a Promise com "U" se não houver resultados
      }
    });
  });
}

const encryptionKey = crypto.createHash('sha256').update('wbuilder-security-total').digest();
const iv = Buffer.alloc(16, 0); 

function encryptData(data, key = encryptionKey) {
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

module.exports = router;