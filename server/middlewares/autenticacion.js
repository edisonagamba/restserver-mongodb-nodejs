//importacion jwt
const jwt = require('jsonwebtoken');

//autenticacion del token
let validarToken = (req, res, next) => {
    let token = req.get('token');
    jwt.verify(token, process.env.SEED_TOKEN, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }
        req.usuario = decoded.usuario;
        next();
    });
};

//administracion de role
let validarAdmin = (req, res, next) => {
    let usuario = req.usuario;
    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.json({
            ok: false,
            err: {
                message: 'No tiene permisos de administrador'
            }
        });
    }

};

module.exports = { validarToken, validarAdmin };