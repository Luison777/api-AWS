const pool=require('./configuration');

async function countRequest(username, callback) {
    try {
      
        const { rows } = await pool.query('SELECT * FROM counts WHERE usercount=$1', [username]);
        callback(null, rows);
    } catch (error) {
    
        const mensajeError = `Error al ejecutar la consulta en la tabla ${table}: ${error.stack}`;
        console.error(mensajeError);
        callback(mensajeError, null);
    }
  
}

module.exports={
    countRequest
}