const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const Usuario = require('../models/usuario');
const { verificaToken, verificarAdmin_Role } = require('../middlewares/autenticacion');


const app = express();


app.get('/usuario', verificaToken, (req, res) => {
    /* return res.json({
        usuario: req.usuario,
        nombre: req.usuario.nombre,
        email: req.usuario.email,
    }); */
    //res.json('get usuario LOCAL');
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);
    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuariosDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Usuario.count({ estado: true }, (err, conteo) => {
                return res.json({
                    ok: true,
                    usuario: usuariosDB,
                    conteo
                });
            });

        });

});
app.post('/usuario', [verificaToken, verificarAdmin_Role], function(req, res) {
    let body = req.body;

    let usuario = Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        // usuarioDB.password = null;


        return res.json({
            ok: true,
            usuario: usuarioDB
        });
    });

});
app.put('/usuario/:id', [verificaToken, verificarAdmin_Role], function(req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);



    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});
app.delete('/usuario/:id', [verificaToken, verificarAdmin_Role], function(req, res) {
    // res.json('delete usuario');
    /*let id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
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
                    message: 'Usuario no encontrado'
                }
            });
        }
        res.json({
            ok: true,
            usuario: usuarioBorrado
        }) 
        
    });*/
    let id = req.params.id;
    let body = {
        estado: false
    };
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }
        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    });
});
module.exports = app;