const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const path = require('path');
const con = require('../../Banco/MySQL/conexaoMysql');

router.use(bodyParser.urlencoded({ extended: true }));

let datasMarcadas = [];

function carregarDatas(idCustomer) {
    return new Promise((resolve, reject) => {
        const sqlRecebeDatas = "SELECT a.date_init, a.date_end, a.date_alert, a.date_late FROM actions a" +
            " INNER JOIN customers c ON a.id_customer = c.id_customer " +
            " WHERE c.id_customer = ? AND (a.status = 'R' OR a.status = 'E');";

        con.query(sqlRecebeDatas, [idCustomer], (err, results) => {
            if (err) {
                console.error('Erro na busca de datas', err);
                reject(err);
                return;
            }

            if (results.length === 0) {
                resolve([]);
            } else {
                const datas = [];
                for (const row of results) {

                    let mesinit = row.date_init.getMonth() + 1
                    let mesend =  row.date_end.getMonth() + 1
                    let mesalert = row.date_alert.getMonth() + 1
                    let mesless= row.date_late.getMonth() + 1
                    datas.push({
                        init: {
                            ano: row.date_init.getFullYear(),
                            mes: mesinit, 
                            dia: row.date_init.getDate()
                        },
                        end: {
                            ano: row.date_end.getFullYear(),
                            mes: mesend, 
                            dia: row.date_end.getDate()
                        },
                        alert: {
                            ano: row.date_alert.getFullYear(),
                            mes: mesalert,
                            dia: row.date_alert.getDate()
                        },
                        late: {
                            ano: row.date_late.getFullYear(),
                            mes: mesless,
                            dia: row.date_late.getDate()
                        }
                    });
                }
                resolve(datas);
            }
        });
    });
}


router.get('/calendario', (req, res) => {
    const idCustomer = req.session.id_customer;
    
    carregarDatas(idCustomer)
        .then((loadedDatas) => {
            datasMarcadas = loadedDatas;
            res.render(path.join(__dirname + '/index.ejs'), {
                names: req.session.names,
                datasMarcadas: JSON.stringify(datasMarcadas)
            });
        })
        .catch((error) => {
            console.error("Erro ao carregar datas:", error);
            res.status(404).redirect("/erro");
        });
});

router.post('/marcar-data', (req, res) => {
    const dataSelecionada = req.body.dataSelecionada;

    res.json({ message: 'Data marcada com sucesso.' });
});

module.exports = router;
