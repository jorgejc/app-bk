const { Router } = require('express');
const Usuario = require('../models/Usuario');
const { validationResult, check } = require('express-validator');

const router = Router();

//CREAR USUARIO
router.post('/', [
    check('nombre', 'invalid.nombre').not().isEmpty(),
    check('email', 'invalid.email').isEmail(),
    check('estado', 'invalid.estado').isIn(['Activo', 'Inactivo']),
], async function (req, res) {

    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ mensaje: errors.array() });
        }

        const existeUsuario = await Usuario.findOne({ email: req.body.email })
        if (existeUsuario) {
            return res.status(400).send('Email ya existe');
        }
        let usuario = new Usuario();
        usuario.nombre = req.body.nombre;
        usuario.email = req.body.email;
        usuario.estado = req.body.estado;
        usuario.fechaCreacion = new Date;
        usuario.fechaActualizacion = new Date;

        usuario = await usuario.save();

        res.send(usuario);

    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error al crear usuario');
    }

});

//LISTAR USUARIO
router.get('/', async function (req, res) {

    try {

        const usuarios = await Usuario.find();
        res.send(usuarios);

    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error');
    }

});

//ACTUALIZAR USUARIO
router.put('/:usuarioId', [
    check('nombre', 'invalid.nombre').not().isEmpty(),
    check('email', 'invalid.email').isEmail(),
    check('estado', 'invalid.estado').isIn(['Activo', 'Inactivo']),
], async function (req, res) {

    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ mensaje: errors.array() });
        }

        let usuario = await Usuario.findById(req.params.usuarioId);
        if(!usuario) {
            return res.status(400).send('usuario no existe');
        }

        const existeUsuario = await Usuario.findOne({ email: req.body.email, _id: { $ne: usuario._id } });
        if (existeUsuario) {
            return res.status(400).send('Email ya existe');
        }

        usuario.nombre = req.body.nombre;
        usuario.email = req.body.email;
        usuario.estado = req.body.estado;
        usuario.fechaActualizacion = new Date;

        usuario = await usuario.save();

        res.send(usuario);

    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error al actualizar usuario');
    }

});

module.exports = router;