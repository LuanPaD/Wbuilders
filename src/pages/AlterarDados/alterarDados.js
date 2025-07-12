//LIBS
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const path = require('path');
const con = require('../../Banco/MySQL/conexaoMysql');
const cargo = require('../Cargo/cargo');
const verificarAdm = require('../Cargo/cargo');
const checkRole = require('../Cargo/cargo');
const checkCargo = require('../Cargo/cargo');
const multer = require('multer');
const fs = require('fs');
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

const upload = multer({
    storage: storage
});

router.use(bodyParser.urlencoded({
    extended: true
}));

//Usuário
router.get('/alterarUsuario', (req, res) => {
    con.query('SELECT * FROM customers where email =?', req.session.login, (err, users) => {
        if (err) {
            console.error('Error fetching users:', err);
            //res.status(500).send('Error fetching users');
            res.status(404).redirect("/erro")
            return;
        }
        let user = users[0];
        res.render(path.join(__dirname + "/AlteraDadosUsuario", 'index2.0.ejs'), {
            user,
            names: req.session.names
        });
    });
});

router.post('/alterarUsuario', (req, res) => {
    const reqBody = req.body;
    con.query('Update customers set ? where email =?', [reqBody, req.session.login], (err, users) => {
        if (err) {
            console.error('Error fetching users:', err);
            //res.status(500).send('Error fetching users');
            res.status(404).redirect("/erro")
            return;
        }
        res.redirect("/")
    });
});

//Receber dados Livros
router.get('/alterarLivro', checkCargo("A"), (req, res) => {
    const id = req.query.id;

    con.query('SELECT * FROM book WHERE id_book = ?', id, (err, books) => {
        if (err) {
            console.error('Error fetching books:', err);
            res.status(500).send('Error fetching books');
            return;
        }

        if (books.length === 0) {
            // Book not found, redirect to an error page
            res.redirect("/erro");
        } else {
            const book = books[0];
            res.render(path.join(__dirname + "/AlteraDadosLivros", 'index2.0.ejs'), {
                book,
                names: req.session.names
            });
        }
    });
});


//Atualizar
router.post('/alterarLivro', checkCargo("A"), upload.single('image'), (req, res) => {
    const id = req.query.id;
    let reqBody = req.body
    if (req.file) {
        const imagePath = req.file.path;
        const imageBuffer = fs.readFileSync(imagePath);
        reqBody.foto = imageBuffer;
    }

    con.query('Update book set ? where id_book = ?', [reqBody, id], (err, books) => {
        if (err) {
            console.error('Error inserting books:', err);
            res.status(500).send('Error inserting book');
            return;
        }
        res.redirect("/livros")
    });
});
module.exports = router;