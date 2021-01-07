//configuraciones globales
require('./config/config');

//servidor
const express = require('express');
const app = express();
const puerto = process.env.PORT;

// conexion base de datos
require('./conexion_bd/conexion');

// rutas
app.use(require('./routes/rutas'));

//servidor escuchando el puerto
app.listen(puerto, () => {
    console.log(`Escuchando el puerto ${puerto}`);
});