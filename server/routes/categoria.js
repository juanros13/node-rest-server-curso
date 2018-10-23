const express = require('express');

const Usuario = require('../models/usuario');
const Categoria = require('../models/categoria');
const _ = require('underscore');
const { verificaToken, verificarAdmin_Role } = require('../middlewares/autenticacion');


const app = express();


app.get('/categoria', verificaToken, (req, res) => {
    Categoria.find({}, 'descripcion usuario')
        .populate('usuario', 'nombre email')
        .sort('descripcion')
        .exec((err, categoriaDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Categoria.count({}, (err, conteo) => {
                return res.json({
                    ok: true,
                    categoria: categoriaDB,
                    conteo
                });
            });

        });

});
app.get('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Categoria.find({ _id: id })
        .exec((err, categoriaDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Categoria.count({ _id: id }, (err, conteo) => {
                return res.json({
                    ok: true,
                    categoria: categoriaDB,
                    conteo
                });
            });

        });

});
app.post('/categoria', verificaToken, function(req, res) {

    let body = req.body;

    let categoria = Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        // usuarioDB.password = null;


        return res.json({
            ok: true,
            categoria: categoriaDB
        });
    });

});
app.put('/categoria/:id', verificaToken, function(req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, 'descripcion');

    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});
app.delete('/categoria/:id', [verificaToken, verificarAdmin_Role], function(req, res) {
    // res.json('delete usuario');
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!categoriaBorrada) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            });
        }
        res.json({
            ok: true,
            usuario: categoriaBorrada
        })

    });

});
module.exports = app;