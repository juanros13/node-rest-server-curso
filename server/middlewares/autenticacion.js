const jwt = require('jsonwebtoken');

// ===========================
// Verificar token
// ===========================

let verificaToken = (req, res, next) => {
    let token = req.get('Authorization');
    jwt.verify(token, process.env.SEED, (err, decode) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        req.usuario = decode.usuario;
        next();
    });
    /* res.json({
        token
    }); */
    //console.log(token);
};
// ===========================
// Verificar token
// ===========================


let verificarAdmin_Role = (req, res, next) => {
    let usuario = req.usuario;
    if (usuario.role !== 'ADMIN_ROLE') {
        return res.json({
            ok: false,
            usuario: 'El usuario no es administrador'
        });
    }
    next();
    // console.log(usuario);




};
module.exports = {
    verificaToken,
    verificarAdmin_Role
}