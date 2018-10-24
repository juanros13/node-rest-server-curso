const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const fs = require('fs');

const path = require('path');



// default options (pasa todo lo que se esta subiendo y lo pone en req.files)
app.use(fileUpload());


app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;
    
    if (Object.keys(req.files).length == 0) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'No se ha seleccionado ningun archivo'
                }
            });
    }
    let archivo = req.files.archivo;

    // Valida tipo

    let tiposValidos = ['productos','usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitodos son ' + tiposValidos.join(', '),
            }
        });    
    }

    // Extensiones permitidas

    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    let nombreCortado = archivo.name.split('.');

    let extension = nombreCortado[nombreCortado.length - 1];
    console.log(extension);

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son ' + extensionesValidas.join(', '),
                ext: extension
            }
        })
    }
    /// Cambiar nombre archivo
    let nombreArchivo = `${ id }-${ new Date().getMilliseconds()}.${ extension }`

    archivo.mv(`uploads/${ tipo }/${ nombreArchivo }`, (err) => {
        if (err) {
            return res.status(500)
                .json({
                    ok: false,
                    err
                });
        }
        if(tipo == 'productos'){
            // aqui imagen ya cargada
            imagenProducto(id, res, nombreArchivo);
        }else{
            imagenUsuario(id, res, nombreArchivo);
        }

        /* res.json({
            ok: true,
            message: 'Image subida correctamente'
        }); */
    });

});
function imagenProducto(id, res, nombreArchivo){
    Producto.findById(id, (err, productoDB) =>{
        if (err) {
            borraArchivo(nombreArchivo, 'productos');
            return res.status(500)
                .json({
                    ok: false,
                    err
                });
        }
        if(!productoDB){
            borraArchivo(nombreArchivo, 'productos');
            return res.status(400)
                .json({
                    ok: false,
                    err: {
                        message: 'Usuario no existe'
                    }
                });
        }

        borraArchivo(productoDB.img, 'productos');
        productoDB.img = nombreArchivo;
        productoDB.save((err, productoGuardado) =>{
            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            });
        });
    });
}

function imagenUsuario(id, res, nombreArchivo){
    Usuario.findById(id, (err, usuarioDB) =>{
        if (err) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(500)
                .json({
                    ok: false,
                    err
                });
        }
        if(!usuarioDB){
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(400)
                .json({
                    ok: false,
                    err: {
                        message: 'Usuario no existe'
                    }
                });
        }

        borraArchivo(usuarioDB.img, 'usuarios');
        usuarioDB.img = nombreArchivo;
        usuarioDB.save((err, usuarioGuardado) =>{
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            });
        });
    });

}

function borraArchivo(nombreImagen, tipo){
    let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${ nombreImagen }`);
    if(fs.existsSync(pathImagen)){
        fs.unlinkSync( pathImagen);
    }
}

module.exports = app;