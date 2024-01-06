const pool=require('./configuration');

async function prueba(callback) {
    try {
        const result = await pool.query('SELECT NOW()');
        callback(null, result.rows);
    } catch (error) {
        const errorMessage = `Error en la consulta: ${error}`;
        console.error(errorMessage);
        callback(errorMessage, null); 
    }
}


async function create(table, item, callback) {
    const keys = Object.keys(item);
    const columnas = keys.join(', ');
    const valores = keys.map(key => `'${item[key]}'`).join(', ');

    try {
        const { rows } = await pool.query(`INSERT INTO ${table} (${columnas}) VALUES (${valores}) RETURNING *`);
        callback(null, rows[0]);
    } catch (error) {
        callback(error, null);
    }
   
}

async function update(table, id, item, callback) {
    const keys = Object.keys(item);
    const actualizaciones = keys.map(key => `${key}='${item[key]}'`).join(', ');
    const sql = `UPDATE ${table} SET ${actualizaciones} WHERE id=${id} RETURNING *`;

    try {

        const { rows } = await pool.query(sql);
        callback(null, rows[0]);
    } catch (error) {
        callback(error, null);
    }
   
}

async function readTable(table, callback) {
    try {
      
        const { rows } = await pool.query(`SELECT * FROM ${table}`);
        callback(null, rows);
    } catch (error) {
    
        const mensajeError = `Error al ejecutar la consulta en la tabla ${table}: ${error.stack}`;
        console.error(mensajeError);
        callback(mensajeError, null);
    }
  
}

async function deleteData(table, id, callback) {
    try {
        await pool.query(`DELETE FROM ${table} WHERE id = $1`, [id]);
        callback(null);
    } catch (error) {
        callback(error, null);
    }
   
}


module.exports={
    prueba,
    create,
    update,
    readTable,
    deleteData
}