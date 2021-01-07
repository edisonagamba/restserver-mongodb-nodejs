//servidor
const express = require('express');
const app = express();

//encriptador de la contraseña
const bcrypt = require('bcrypt');

//json webtoken
const jwt = require('jsonwebtoken');

//modelos
const Usuario = require('../models/usuario');

//controlador del post, sin el body-parser la peticion post no funciona
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}));

// parse application/json
app.use(bodyParser.json());

//datos de login
app.post('/login', (req, res) => {
    let body = req.body;

    Usuario.find({ estado: true })
        .findOne({ email: body.email }, (err, usuarioDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!usuarioDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: '(Email) o contraseña incorrectos'
                    }
                });
            }
            if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Email o (contraseña) incorrectos'
                    }
                });
            }
            let token = jwt.sign({
                usuario: usuarioDB
            }, process.env.SEED_TOKEN, { expiresIn: process.env.TOKEN_CADUCIDAD });
            res.json({
                ok: true,
                Usuario: usuarioDB,
                token
            });
        });


});

module.exports = app;