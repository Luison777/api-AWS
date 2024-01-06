var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
const {  countRequest} = require('../db/authfunctions');
var jwt = require('jsonwebtoken');

router.post('/login', function(req, res, next) {
    const credentials = req.body;
    // Obtener datos del usuario de la base de datos
    countRequest(credentials.user, (err, rowDB) => {
        if (err) {
            return next(err);
        }
        if (!rowDB) {
            return res.status(401).send('Usuario o contraseña incorrecto');
        }
        const hash = rowDB[0].hash;
        // Comparar la contraseña ingresada con el hash almacenado
        bcrypt.compare(credentials.password, hash, function(err, result) {
            if (err) {
                return res.status(500).send(`Error de autenticación `);
            }
            if (result) {
                const token=jwt.sign({
                    exp: Math.floor(Date.now() / 1000) + (60 * 60),
                    
                  }, 'secret');
                // La contraseña es correcta
                res.send({token:token});
            } else {
                // La contraseña es incorrecta
                res.status(401).send('Usuario o contraseña incorrecto');
            }
        });
    });
});

router.post('/verify', function(req, res, next) {
    const  token  = req.body;

    // Verificar el token
    jwt.verify(token.token, 'secret', function(err, decoded) {
        if (err) {
            // Si hay un error en la verificación, el token no es válido
            return res.status(401).send('Token inválido o expirado');
        }
        
        // Si el token es válido, enviar una respuesta de éxito
        res.status(200).send('Token válido');
    });
});
module.exports = router;