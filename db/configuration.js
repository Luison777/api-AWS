const { Pool } = require('pg');
const fs = require('fs');


/* const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'Lapf80204318#',
    port: '5433',
    
}); */
const pool = new Pool({
    user: process.env.RDS_USERNAME,
    host: process.env.RDS_HOSTNAME,
    database: process.env.RDS_DB_NAME,
    password: process.env.RDS_PASSWORD,
    port: process.env.RDS_PORT,
    ssl: {
        ca: fs.readFileSync('./CA/global-bundle.pem').toString(),
    }
});

module.exports = pool;
