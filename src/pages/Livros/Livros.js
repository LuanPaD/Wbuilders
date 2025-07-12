const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const multer = require('multer');
const con = require('../../Banco/MySQL/conexaoMysql');
const path = require('path');
const fs = require('fs');
const notifier = require('node-notifier');

const cargo = require("../Cargo/cargo");
const checkCargo = require('../Cargo/cargo');
const {
  Console
} = require('console');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + '/uploads'); // Specify the path where files will be stored
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

router.use(bodyParser.urlencoded({
  extended: true
}));
router.get('/cadbook', checkCargo("A"), (req, res) => {
  let cargo = req.session.adm == 'M' || req.session.adm == "A"
  res.render(path.join(__dirname + "/CadastroLivros", 'index 2.0.ejs'), {
    names: req.session.names,
    cargo
  });
});

router.get('/infoLivros', (req, res) => {
  let idLivro = req.query.id;
  DadosLivro(req, res, idLivro)
});

async function DadosLivro(req, res, id) {
  con.query('SELECT * FROM book where id_book = ?', parseInt(id), (err, linhas) => {
    if (err) {
      res.status(404).redirect("/erro");
      return;
    }
    let book = linhas[0]

    try {
      res.render(path.join(__dirname + "/DadosLivro", 'index2.0.ejs'), {
        book,
        names: req.session.names
      });
    } catch (error) {
      res.status(404).redirect("/erro");
    }
  });
}

const upload = multer({
  storage: storage
});
router.post('/cadbook', checkCargo("A"), upload.single('image'), (req, res) => {
  const reqBody = req.body;
  const imagePath = req.file.path;
  const imageBuffer = fs.readFileSync(imagePath);

  reqBody.foto = imageBuffer;

  con.query('INSERT INTO book SET ?', reqBody, (err, results, fields) => {
    if (err) {
      console.error('Error inserting book:', err);
      res.status(500).send('Error inserting book');
      return;
    }

    res.status(200).redirect('/livros');
  });
});



router.get('/livros', (req, res) => {
  const cargo = req.session.adm === 'M' || req.session.adm === 'A';
  const page = parseInt(req.query.page) || 1;
  const perPage = 8;

  const offset = (page - 1) * perPage;

  const filterOptions = {
    available: req.query.available || '',
    place: req.query.place || '',
    nome_livro: req.query.nome_livro || '',
  };

  // Build the SQL query with the filter options
  let query = 'SELECT * FROM book';
  let query2 = 'SELECT COUNT(*) AS count FROM book '

  // Check if any filter options are provided
  if (filterOptions.available !== '' || filterOptions.place !== '' || filterOptions.nome_livro !== '') {
    query += ' WHERE';
    query2 += ' WHERE';

    if (filterOptions.available !== '') {
      query += ` available = '${filterOptions.available}'`;
      query2 += ` available = '${filterOptions.available}'`;

    }

    if (filterOptions.available !== '' && (filterOptions.place !== '' || filterOptions.nome_livro !== '')) {
      query += ' AND';
      query2 += ' AND';
    }

    if (filterOptions.place !== '') {
      query += ` place = '${filterOptions.place}'`;
      query2 += ` place = '${filterOptions.place}'`;
    }

    if (filterOptions.nome_livro !== '') {
      query += ` title LIKE '%${filterOptions.nome_livro}%'`;
      query2 += ` title LIKE '%${filterOptions.nome_livro}%'`;
    }
  }
  query += ' LIMIT ? OFFSET ?';

  con.query(query, [perPage, offset], (err, books) => {
    if (err) {
      console.error('Error fetching books:', err);
      res.status(404).redirect("/erro");
      return;
    }

    con.query(query2, (err, result) => {
      if (err) {
        console.error('Error counting books:', err);
        res.status(404).redirect("/erro");
        return;
      }

      const totalBooks = result[0].count;
      const totalPages = Math.ceil(totalBooks / perPage);

      res.render(path.join(__dirname + '/ListaLivros', 'index.ejs'), {
        books,
        names: req.session.names,
        cargo,
        currentPage: page,
        totalPages,
        filterOptions, // Pass filter options to the view for display
      });
    });
  });
});


async function ChecaLivro(req, res, idBook) {
  return new Promise((resolve, reject) => {
    con.query('SELECT available FROM book WHERE id_book = ?', [idBook], (err, disponibilidade) => {
      if (err) {
        console.error('Error fetching books:', err);
        res.status(404).redirect("/erro");
        reject(err);
        return false;
      }
      let LivroDisponivel = disponibilidade[0].available;
      resolve(LivroDisponivel != 0);
    });
  });
}

async function ChecaUsuarioTemLivroReservado(req, res) {
  try {
    const ultimaAcao = await new Promise((resolve, reject) => {
      con.query('SELECT STATUS FROM `actions` WHERE id_customer = ? ORDER BY date_init DESC LIMIT 1', [req.session.id_customer], (err, result) => {
        if (err) {
          console.error('Error fetching books:', err);
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    if (ultimaAcao.length === 0) {
      return false;
    } else {
      const ultimaAcaoUsua = ultimaAcao[0].STATUS;
      return ultimaAcaoUsua === 'R' || ultimaAcaoUsua === 'E' || ultimaAcaoUsua === 'P';
    }
  } catch (error) {
    console.error(error);
    return false;
  }
}

router.post('/reservar/:id_book', async (req, res) => {
  const idBook = req.params.id_book;
  const idCustomer = req.session.id_customer;
  const imagePath = path.join(__dirname, 'PageReserva', 'img', 'livroTriste.png');
  let LivroDisponivel = await ChecaLivro(req, res, idBook);
  let UsuarioTemReservaPendente = await ChecaUsuarioTemLivroReservado(req, res);
  if (UsuarioTemReservaPendente) {
    notifier.notify({
      appName: 'WBuilders',
      title: 'Reserva Indisponível',
      message: 'Você já tem uma reserva, livro emprestado ou pendência, portanto não é possível reservar.',
      timeout: 10000,
    });
    res.status(200).redirect('/livros');
    return;
  }
  if (LivroDisponivel) {
    const currentDate = new Date();
    const numberOfDaysToAdd = 3;

    // Adiciona dias à data atual
    const date_end = new Date(currentDate);
    date_end.setDate(currentDate.getDate() + numberOfDaysToAdd);

    // Subtrai 1 dia da data final
    const date_alert = new Date(date_end);
    date_alert.setDate(date_end.getDate() - 1);

    // Adiciona 1 dia à data final
    const date_late = new Date(date_end);
    date_late.setDate(date_end.getDate() + 1);

    // Formata as datas em strings
    const currentDateString = currentDate.toISOString().slice(0, 19).replace('T', ' ');
    const date_endString = date_end.toISOString().slice(0, 19).replace('T', ' ');
    const date_alertString = date_alert.toISOString().slice(0, 19).replace('T', ' ');
    const date_lateString = date_late.toISOString().slice(0, 19).replace('T', ' ');

    con.query('UPDATE book SET available = ? WHERE id_book = ?', [0, idBook], (err, results, fields) => {
      if (err) {
        console.error('Error updating book:', err);
        res.status(404).redirect("/erro");
        return;
      }
    })
    // Primeiro INSERT na Tabela açaõ
    con.query('INSERT INTO actions (id_book, id_customer, date_init, date_end, date_alert, date_late, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [idBook, idCustomer, currentDateString, date_endString, date_alertString, date_lateString, "R"], (err, results, fields) => {
        if (err) {
          console.error('Error inserting into actions:', err);
          res.status(404).redirect("/erro");
          return;
        }

        const id_action = results.insertId; // Pega o ID gerado no primeiro INSERT

        // Segundo INSERT na tabela historico ( pode ser uma trigger)
        con.query('INSERT INTO historic (id_action, date, status_book) VALUES (?, ?, ?)', [id_action, currentDate, "R"], (err, results, fields) => {
          if (err) {
            console.error('Error inserting into historic:', err);
            res.status(404).redirect("/erro");
            return;
          }

          console.error('Livro Reservado com sucesso!');
          res.status(200).redirect('/livros');
        });
      });
  } else {
    console.error('Livro já Reservado! Reserva Cancelada');
    res.status(200).redirect('/livros'); // Redireciona em caso de falha na reserva
  }
});

router.post('/buscarEmprestimos', checkCargo("A"), upload.single('image'), (req, res) => {
  const reqBody = req.body;
  const imagePath = req.file.path;
  const imageBuffer = fs.readFileSync(imagePath);

  reqBody.foto = imageBuffer;

  con.query('INSERT INTO book SET ?', reqBody, (err, results, fields) => {
    if (err) {
      console.error('Error inserting book:', err);
      res.status(500).send('Error inserting book');
      return;
    }

    console.log('Id inserted: ' + results.insertId);

    res.status(200).redirect('/livros');
  });
});

router.use(bodyParser.urlencoded({
  extended: true
}));

router.get('/buscarEmprestimos', checkCargo("A"), (req, res) => {
  let cargo = req.session.adm == 'M' || req.session.adm == "A"
  con.query('SELECT c.names, c.address, c.cellphone, c.email, a.date_end  FROM actions a INNER JOIN customers c on c.id_customer = a.id_customer WHERE  a.status = "E" ORDER BY a.date_end ASC ',  (err, usuarios) => {
    if (err) {
      console.error('Error fetching books:', err);
      res.status(500).send('Error fetching books');
      return;
    }

    res.render(path.join(__dirname + "/BuscarEmprestimos", 'index.ejs'), {
      names: req.session.names,
      cargo,
      usuarios
    });
  });
});



module.exports = router;