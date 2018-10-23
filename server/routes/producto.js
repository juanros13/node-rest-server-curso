const express = require('express');

const Usuario = require('../models/usuario');
const Categoria = require('../models/categoria');
const Producto = require('../models/producto');
const _ = require('underscore');
const { verificaToken, verificarAdmin_Role } = require('../middlewares/autenticacion');


const app = express();


app.get('/producto', verificaToken, (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);
    Producto.find({ disponible: true }, 'nombre descripcion categoria usuario disponible')
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion usuario')
        .sort('descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Producto.count({ disponible: true }, (err, conteo) => {
                return res.json({
                    ok: true,
                    producto: productoDB,
                    conteo
                });
            });

        });

});
app.get('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Producto.find({ _id: id })
        .exec((err, productoDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Producto.count({ _id: id }, (err, conteo) => {
                return res.json({
                    ok: true,
                    producto: productoDB,
                    conteo
                });
            });

        });

});
app.get('/producto/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .exec((err, productosDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Producto.count({ nombre: termino }, (err, conteo) => {
                return res.json({
                    ok: true,
                    productos: productosDB,
                    conteo
                });
            });

        });

});
app.post('/producto', verificaToken, function(req, res) {

    let body = req.body;



    // Obtener una categoria random
    // Get the count of all categoria
    /*  Categoria.count().exec(function(err, count) {

        // Get a random entry
        var random = Math.floor(Math.random() * count);

        // Again query all users but only fetch one offset by our random #
        Categoria.findOne().skip(random).exec(
            function(err, categoriaDB) {
                // Tada! random user
                categoria = categoriaDB;
            });
    });
 */

    let producto = Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        // usuarioDB.password = null;


        return res.status(201).json({
            ok: true,
            producto: productoDB
        });
    });

});
app.put('/producto/:id', verificaToken, function(req, res) {
    let id = req.params.id;
    console.log(req.body);

    let body = _.pick(req.body, ['nombre', 'precioUni', 'descripcion', 'categoria', 'usuario']);
    console.log('asdasd');
    console.log(body);
    console.log('asdasd');

    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrada'
                }
            });
        }
        res.json({
            ok: true,
            producto: productoDB
        });
    });
});
app.delete('/producto/:id', verificaToken, function(req, res) {
    // res.json('delete usuario');
    let id = req.params.id;
    let body = {
        disponible: false
    };

    Producto.findByIdAndUpdate(id, body, { new: true }, (err, productoBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrada'
                }
            });
        }
        res.json({
            ok: true,
            producto: productoBorrado
        })

    });

});
module.exports = app;