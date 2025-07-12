
const express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const path = require('path');
const fetch = require('node-fetch');

router.use(bodyParser.urlencoded({
  extended: true
}));


router.get('/dispara', (req, res) => {
  let params = req.query.numero
  console.log(params)

// 1. Fazer uma requisição GET para obter o token.
fetch(`${process.env.URL_BOT_WHATSAPP}/token`,{
  method: 'GET',
  headers : {
    username: "adm",
    senha : "adm"
  }
})
  .then(response => response.json())
  .then(data => {
    console.log(data)
    // 2. Extrair o token da resposta.
    const token = data.Token;
    for(let i =0; i < 500; i++){
      fetch(`${process.env.URL_BOT_WHATSAPP}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': `${token}`,
          //'message': `Por favor devolva o livro`,
          'message': `FAZ O HELP COR SIM CORNÃO`,
          //'telnumber': `${params}`,
          'telnumber': `${5514988198507}`,
          "protocolo": `false`
        },
      })
        .then(response => response.json())
        .then(data => {
          console.log(data);
          res.redirect("/BuscarEmprestimos");
        })
        .catch(error => {
          console.error(error);
          res.redirect("/erro");
        });
    }
  })
  .catch(error => {
    console.error(error);
    res.redirect("/erro");
  });

});


module.exports = router;