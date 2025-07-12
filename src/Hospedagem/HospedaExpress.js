const express = require('express');
const http = require('http');
const app = express();
const ejs = require('ejs');
const bodyParser = require('body-parser');
const session = require('express-session');
const initSystem = require('../Logger/dadosInit.js');
const principal = require('../pages/principal/principal.js');
const login = require('../pages/login/login.js');
const relatorio = require('../pages/Relatorio/relatorio.js');
const Livros = require('../pages/Livros/Livros.js');
const AlterarDados = require('../pages/AlterarDados/alterarDados.js');
const emprestimo = require('../pages/Emprestimo/emprestimo.js')
const historico = require('../pages/Historico/historico.js')
const erro = require('../pages/Erros/erros.js')
const calendario = require('../pages/Calendario/calendario.js')
const institucional = require('../pages/Institucional/institucional.js')
const ajuda = require('../pages/Ajuda/ajuda.js')
// const disparaMensagem = require('../pages/NotificarWhatsapp/index.js')

const path = require('path');

app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(
  session({
    secret: 'portabeta123',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 30000000,
    },
  })
);

function isAuthenticated(req, res, next) {
  const publicRoutes = ['/entrar', '/cadastrar'];

  if (publicRoutes.includes(req.path) || req.session.login != undefined) {
    next();
  } else {
    res.redirect('/entrar');
  }
}

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Erro ao encerrar a sessão:', err);
      res.status(500).send('Erro ao encerrar a sessão');
    } else {
      res.redirect('/'); 
    }
  });
});
// app.use("/",disparaMensagem);
app.use("/ong", institucional);
app.use("/", isAuthenticated);
app.use("/", principal);
app.use("/", login);
app.use("/", relatorio);
app.use("/", Livros);
app.use("/", AlterarDados);
app.use("/", emprestimo);
app.use("/", historico);
app.use("/", erro);
app.use("/", calendario);
app.use("/", ajuda);

app.get('/status', (req, res) => {
  res.json({
    "status": "OK"
  });
});

app.use((req, res, next) => {
  //res.status(404).sendFile(__dirname + '/public/error404.html');
  res.status(404).redirect("/erro")
});

const port = process.env.PORT || 4421;
const server = http.createServer(app);

server.listen(port, () => {
  initSystem.logo('The app is running on port ' + port);
});

module.exports.Livros = Livros;
module.exports.principal = principal;
module.exports.login = login;
module.exports.relatorio = relatorio;
module.exports.AlterarDados = AlterarDados;
module.exports.emprestimo = emprestimo;
module.exports.historico = historico;
module.exports.erro = erro;
module.exports.calendario = calendario;
module.exports.institucional = institucional;
// module.exports.disparaMensagem = disparaMensagem;
