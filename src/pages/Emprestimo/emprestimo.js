const express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const path = require('path');
const con = require('../../Banco/MySQL/conexaoMysql');
const checkCargo = require('../Cargo/cargo');

router.use(bodyParser.urlencoded({
    extended: true
}));


router.get('/buscar', checkCargo("A"), (req, res) => {
    res.render(path.join(__dirname, 'index.ejs'), {
        names: req.session.names
    });
});

router.post('/buscar', checkCargo("A"), (req, res) => {
    let queryBanco = `SELECT * FROM customers c 
    inner join actions ac on(ac.id_customer = c.id_customer)
     inner join book b on(b.id_book = ac.id_book) 
     where ac.status <> 'F' and `;

    const emailbody = req.body.email;
    const namesbody = req.body.names;

    if (emailbody != undefined && emailbody != "") {
        queryBanco = `${queryBanco} email = '${emailbody}'`;
    } else if (namesbody != undefined && namesbody != "") {
        queryBanco = `${queryBanco} names = '${namesbody}'`;
    } else {
        res.redirect("/erro");
        return;
    }

    con.query(queryBanco, (err, values) => {
        if (err) {
            console.error('Erro na busca', err);
            res.status(500).send('Erro na busca');
            return;
        }

        if (values.length === 0) {
            res.redirect("/buscar");
        } else {
            const dados = values;
            res.render(path.join(__dirname + "/Busca", 'index.ejs'), {
                dados,
                names: req.session.names
            });
        }
    });
});

router.get('/finalizar', checkCargo("A"), (req, res) => {
    let id = req.query.id_action;
    con.query("update actions ac set ac.status = 'F' WHERE ac.id_action = ?", id, (err, results, fields) => {
        if (err) {
            console.error('Finalizado', err);
            res.status(500).send('Error inserting book');
            return;
        }
    });
    con.query("insert into historic values(?,DEFAULT,'F')", id, (err, results, fields) => {
        if (err) {
            console.error('Finalizado no historico', err);
            res.status(500).send('Error inserting book');
            return;
        }
        res.status(200).redirect('/buscar');
    });
    con.query(`UPDATE book b
    INNER JOIN actions  ac ON b.id_book = ac.id_book
    SET b.available = 1
    WHERE ac.id_action = ?
    `, id, (err, results, fields) => {
        if (err) {
            console.error('Finalizado', err);
            res.status(500).send('Error inserting book');
            return;
        }
    });
});

router.get('/cancelar', checkCargo("A"), (req, res) => {
    let id = req.query.id_action;
    con.query("update actions ac set ac.status = 'C' WHERE ac.id_action = ?", id, (err, results, fields) => {
        if (err) {
            console.error('Finalizado', err);
            res.status(404).redirect("/erro");
            return;
        }
    });
    con.query("insert into historic values(?,DEFAULT,'C')", id, (err, results, fields) => {
        if (err) {
            console.error('Finalizado no historico', err);
            res.status(404).redirect("/erro");
            return;
        }
        res.status(200).redirect('/buscar');
    });

    con.query(`UPDATE book b
    INNER JOIN actions  ac ON b.id_book = ac.id_book
    SET b.available = 1
    WHERE ac.id_action = ?
    `, id, (err, results, fields) => {
        if (err) {
            console.error('Finalizado', err);
            res.status(404).redirect("/erro");
            return;
        }
    });
});

router.get('/emails', checkCargo("A"), (req, res) => {
    con.query("SELECT email FROM customers", (err, results, fields) => {
        if (err) {
            console.error('Error querying customer names:', err);
            res.status(500).json({
                error: 'Error querying customer names'
            });
            return;
        }

        const customerNames = results.map(result => result.email);

        res.json(customerNames);
    });
});

router.get('/names', checkCargo("A"), (req, res) => {
    con.query("SELECT names FROM customers", (err, results, fields) => {
        if (err) {
            console.error('Error querying customer names:', err);
            res.status(500).json({
                error: 'Error querying customer names'
            });
            return;
        }

        const customerNames = results.map(result => result.names);

        res.json(customerNames);
    });
});

router.get('/emprestimo', checkCargo("A"), (req, res) => {
    let id = req.query.id_action;
    let dataHoje = new Date()
    dataHoje.getTime(dataHoje.getDate() - 1)
    let dataCortada = dataHoje.toISOString().split("T")
    let dataCerta = dataCortada[0]

    const currentDate = new Date();
    const currentDateString = currentDate.toISOString().slice(0, 19).replace('T', ' ');

    con.query(`select ac.id_action,cu.names,bo.title,bo.code from actions ac 
    inner join book bo on (ac.id_book = bo.id_book) 
    inner join customers cu on (cu.id_customer = ac.id_customer)
    where ac.id_action = ?;`, id, (err, results, fields) => {
        if (err) {
            console.error('Error querying customer names:', err);
            res.status(500).json({
                error: 'Error querying customer names'
            });
            return;
        }
        let dados = results[0];
        res.render(path.join(__dirname + "/Emprestimo", 'index 2.0.ejs'), {
            dados,
            names: req.session.names,
            dataCerta
        });
    });
});


router.post('/emprestimo', checkCargo("A"), (req, res) => {

    let body = req.body
    const date_init = body.date_init
    const date_end = body.date_end
    const id = body.id_action

    const dateInit = new Date(date_init);
    const dateEnd = new Date(date_end);
    const dateAlert = new Date(date_end);
    const dateLate = new Date(date_end);

    dateAlert.setDate(dateEnd.getDate() - 1);

    dateLate.setDate(dateEnd.getDate() + 1);



    con.query(`
        UPDATE actions ac
        SET ac.status = 'E',
            ac.date_init = ?,
            ac.date_end = ?,
            ac.date_alert = ?,
            ac.date_late = ?
        WHERE ac.id_action = ?
        `, [dateInit, dateEnd, dateAlert, dateLate, id], (err, results, fields) => {
        if (err) {
            console.error('Emprestado', err);
            res.status(500).send('Error updating actions');
            return;
        }
    });

    con.query("insert into historic values(?,DEFAULT,'E')", id, (err, results, fields) => {
        if (err) {
            console.error('Finalizado no historico', err);
            res.status(500).send('Error inserting book');
            return;
        }
    });

    con.query(`UPDATE book b
    INNER JOIN actions  ac ON b.id_book = ac.id_book
    SET b.available = 0
    WHERE ac.id_action = ?
    `, id, (err, results, fields) => {
        if (err) {
            console.error('Finalizado', err);
            res.status(500).send('Error inserting book');
            return;
        }
    });
    res.redirect("/")
});


module.exports = router;