//servidor
const express = require('express');
const app = express();

//encriptador de la contraseña
const bcrypt = require('bcrypt');

// el underscore es para usar funciones extendidas de js
const _ = require('underscore');

//controlador del post, sin el body-parser la peticion post no funciona
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}))

// parse application/json
app.use(bodyParser.json());

//middleware validar token
const { validarToken, validarAdmin } = require('../middlewares/autenticacion');

//modelos
const Usuario = require('../models/usuario');
const { findById } = require('../models/usuario');

//obtenemos los registros de usuario
app.get('/usuario', validarToken, (req, res) => {

    let desde = req.query.desde || 0; // el numero situa la posicion inicial de los registros
    desde = Number(desde); //debe ser un numero
    let limite = req.query.limite || 5; // cantidad de registros que serán devueltos
    limite = Number(limite); //debe ser un numero

    Usuario.find({ estado: true })
        .skip(desde) //elegir desde que registro quiere ver
        .limit(limite) // cantidad de registros que quiere ver
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.count({ estado: true }, (err, numeroRegistros) => {

                res.json({
                    ok: true, //estado de la peticion
                    numeroRegistros, //total de registros
                    usuarios, //registros
                });
            });

        });

});

//creamos un nuevo registro de usuario
app.post('/usuario', [validarToken, validarAdmin], function(req, res) {
    let body = req.body;
    let user = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10), //encripta la contraseña
        role: body.role,
    });

    user.save((err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            user: userDB
        });
    });

});

app.put('/usuario/:id', [validarToken, validarAdmin], function(req, res) {
    let id = req.params.id;
    // pick es para que actualice los valores que estan en el arreglo.
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);
    // runValidator es para que use las validaciones que estan en el schema
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            user: usuarioDB
        });
    })
})
app.delete('/usuario/:id', [validarToken, validarAdmin], function(req, res) {
    let id = req.params.id;

    let cambiarEstado = {
        estado: false,
    }

    Usuario.findByIdAndUpdate(id, cambiarEstado, { new: true }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado '
                }
            });
        }

        res.json({
            ok: true,
            user: usuarioBorrado
        });
    });

})

module.exports = app;