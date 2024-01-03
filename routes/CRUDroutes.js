var express = require('express');
var router = express.Router();
const { Client } = require('pg');

router.get('/', async function(req, res, next) {
    const client = new Client({
        user: process.env.RDS_USERNAME,
        host: process.env.RDS_HOSTNAME,
        database: process.env.RDS_DB_NAME,
        password: process.env.RDS_PASSWORD,
        port: process.env.RDS_PORT,
    });
       
    try {
        await client.connect();
           
        const result = await client.query('SELECT NOW()');
        console.log(result.rows); // Resultado de la consulta
        
        await client.end();
        res.send('Consulta exitosa'); // Enviar respuesta al cliente
    } catch (err) {
        console.error('Error en la consulta:', err);
        res.status(500).send('Error al consultar la base de datos'); // Enviar respuesta de error al cliente
    }
});

module.exports = router;