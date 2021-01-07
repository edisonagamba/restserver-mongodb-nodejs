//configuraciones globales
require('../config/config');

//base de datos
const mongoose = require('mongoose');
const conexionDB = process.env.DB_URL;

// conexion base de datos mongodb
mongoose.connect(conexionDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}, (err, res) => {
    if (err) throw err;
    console.log('Conexion DB', { 'status': 'OK' });
});

module.exports = mongoose;