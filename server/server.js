require('./config/config');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// Configuracion global de rutas
app.use(require('./routes/index'));

// parse application/json
app.use(bodyParser.json());

//  habilitar la carpeta public

app.use(express.static(path.resolve(__dirname, '../public')));



mongoose.connect(process.env.URLDB, (err, res) => {
    if (err) throw err;
    console.log('Base de datos ONLINE');

});
app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto:' + process.env.PORT);
});