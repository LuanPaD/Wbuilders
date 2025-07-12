const initSystem = require('./src/Logger/dadosInit')
initSystem.logo("Iniciando Servidors")
const servidorExpress = require('./src/Hospedagem/HospedaExpress');
const Banco = require('./src/Banco/MySQL/conexaoMysql');