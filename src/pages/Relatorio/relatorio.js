const PDFDocument = require('pdfkit');
const fs = require('fs');
const connection = require('../../Banco/MySQL/conexaoMysql');
const express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const path = require('path');


router.use(bodyParser.urlencoded({ extended: true }));


router.get('/relatorio', (req, res) => {
  fetchReportData((reportData) => {
    // Define o cabeçalho da resposta para download do arquivo PDF
    res.setHeader('Content-Disposition', 'attachment; filename=relatorio.pdf');
    res.setHeader('Content-type', 'application/pdf');

    // Pipe o conteúdo do arquivo PDF gerado para a resposta HTTP
    generateReport(reportData, res);
  });
  res.send("Relatório gerado")
});

function generateReport(reportData, response) {
  const doc = new PDFDocument();

  // Pipe o PDF diretamente para a resposta HTTP
  doc.pipe(response);

  // Add content to the PDF
  doc.fontSize(24).text('Relatório', { align: 'center' });
  doc.moveDown();

  for (const section of reportData) {
    doc.fontSize(18).text(section.title, { underline: true });
    doc.moveDown();

    doc.fontSize(12).text(section.content);
    doc.moveDown();
  }

  // Finalize o PDF e encerre a resposta HTTP
  doc.end();
}

function fetchReportData(callback) {
  connection.query('SELECT * FROM book', (error, results) => {
    if (error) {
      console.error('Erro ao buscar os dados:', error);
      return;
    }

    const reportData = results.map((row) => ({
      content: `Titulo: ${row.title}, Edição: ${row.edition}`,
    }));

    callback(reportData);
  });
}

module.exports = router;