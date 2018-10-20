// ===========================
// Puerto
// ===========================

process.env.PORT = process.env.PORT || 3000;

// ===========================
// Entorno 
// ===========================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// ===========================
// DB 
// ===========================


let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb://cafeuser:activo2018@ds135552.mlab.com:35552/cafecursonode';
}

process.env.URLDB = urlDB;