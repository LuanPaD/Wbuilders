const express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');


router.use(bodyParser.urlencoded({
    extended: true
}));


router.get('/download', (req, res) => {
    const filePath = __dirname + "/Help do Sistema - WBuilders.pdf";
  
    res.download(filePath, (err) => {
      if (err) {
        res.status(500).send('Erro ao baixar o arquivo');
      }
    });
  });


module.exports = router;