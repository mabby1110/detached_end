const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const soap = require('soap');
const path = require('path');

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Importar rutas
const restRoutes = require('./rest/routes');
app.use('/api', restRoutes);

// Configurar SOAP
const soapService = require('./soap/service');
const wsdlPath = path.join(__dirname, './soap/service.wsdl');

// Ruta para el WSDL
app.get('/soap/service.wsdl', (req, res) => {
  res.sendFile(wsdlPath);
});

// Iniciar servidor SOAP
const soapServer = soap.listen(app, '/soap', soapService.service, soapService.wsdl);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});