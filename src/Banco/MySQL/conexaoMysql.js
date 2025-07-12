require('dotenv').config();
const mysql = require('mysql2');
const initSystem = require('../../Logger/dadosInit.js');

let connection;

function initConnection() {
  const useUrl = !!process.env.DB_URL || !!process.env.DATABASE_URL;
  const dbUrl = process.env.DB_URL || process.env.DATABASE_URL;

  if (useUrl) {
    connection = mysql.createConnection(dbUrl);
    connection.connect((err) => {
      if (err) {
        console.error('💥 Erro ao conectar via URL:', err);
        process.exit(1);
      }
      initSystem.logo(`✅ Conectado ao MySQL via URL: ${dbUrl}`);
    });
  } else {
    const { DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE } = process.env;

    if (!DB_HOST || !DB_USER || !DB_PASSWORD || !DB_DATABASE) {
      console.error('❌ Variáveis de ambiente incompletas para conexão separada.');
      process.exit(1);
    }

    connection = mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_DATABASE,
    });

    connection.connect((err) => {
      if (err) {
        console.error('💥 Erro ao conectar com parâmetros:', err);
        process.exit(1);
      }
      initSystem.logo(`✅ Conectado ao MySQL: ${DB_HOST}/${DB_DATABASE}`);
    });
  }
}

initConnection();

module.exports = connection;
