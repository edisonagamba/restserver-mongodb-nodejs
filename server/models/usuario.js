// trae el mongoose para usar mongodb
const mongoose = require('mongoose');

//validador de correo
const uniqueValidator = require('mongoose-unique-validator');

//crear el esquema desde mongoose
let Schema = mongoose.Schema;

// valores para el enum que esta en usuarioSchema role
let roles = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol permitido'
}

//schema de usuario para usar en mongodb
let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El email es necesario']
    },
    password: {
        type: String,
        required: [true, 'Ingrese una contraseña']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: roles
    },
    estado: {
        type: Boolean,
        default: true

    },
    google: {
        type: Boolean,
        default: false

    },
});

//Esta funcion quita del JSON el registro password para que no lo retorne cuando se hace el GET
usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
}

//utiliza el uniqueValidator para validar que el correo no este repetido
usuarioSchema.plugin(uniqueValidator, { message: 'Este {PATH} ya esta registrado' });

//exporta el modelo de usuario para el CRUD
module.exports = mongoose.model('Usuario', usuarioSchema);