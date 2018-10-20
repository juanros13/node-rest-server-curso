require('./config/config');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

app.use(require('./routes/usuario'));

// parse application/json
app.use(bodyParser.json())



mongoose.connect(process.env.URLDB, (err, res) => {
    if (err) throw err;
    console.log('Base de datos ONLINE');

});
app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto:' + process.env.PORT);
});