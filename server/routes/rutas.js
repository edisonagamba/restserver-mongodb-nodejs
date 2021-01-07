//servidor
const express = require('express');
const app = express();

// rutas
app.use(require('./login'));
app.use(require('./usuario'));

module.exports = app;