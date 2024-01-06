const { Pool } = require('pg');
const fs = require('fs');

/* const pool = new Pool({
    user: 'username',
    host: 'awseb-e-gm2ushduuq-stack-awsebrdsdatabase-7s6xoab2auew.c9qggycuc5il.us-east-2.rds.amazonaws.com',
    database: 'ebdb',
    password: 'Lapf80204318#',
    port: '5432',
     ssl: {
        ca: fs.readFileSync('./CA/global-bundle.pem').toString(),
    }
}); */
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
