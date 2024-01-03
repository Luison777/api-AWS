const db=require('./configuration');

async function prueba(callback) {
    try {
        const result = await db.any('SELECT NOW()');
        callback(null, result);
    } catch (error) {
        const errorMessage = `Error en la consulta: ${error}`;
        console.error(errorMessage);
        callback(errorMessage);
    } finally {
        try {
            await pgp.end();
        } catch (err) {
            console.error('Error al cerrar la conexión:', err);
        }
    }
}

async function create(table,item,callback){

    const keys=Object.keys(item);
    const columnas=keys.join(', ');
    const valores= keys.map(key=> `'${item[key]}'`).join(', ');
    db.any(`INSERT INTO ${table} (${columnas}) VALUES(${valores}) returning *`)
    .then(([resultado])=>{
        callback(null,resultado);
    })
    .catch(error=>{
        callback(error);
    });
}

async function update(table,id,item,callback){
    const keys=Object.keys(item);
    const actualizaciones= keys.map(key=> `${key}='${item[key]}'`).join(', ');
    const sql=`UPDATE ${table} set ${actualizaciones} WHERE id=${id} returning *`;
    db.any(sql)
    .then(([resultado])=>{
        callback(null,resultado);
    })
    .catch(error=>{
        callback(error);
    });
}

async function readTable(table,callback){
    db.any(`SELECT * FROM ${table}`)
    .then(resultado => {
        callback(null, resultado);
    })
    .catch(error => {
        const mensajeError = `Error al ejecutar la consulta en la tabla ${tabla}: ${error.stack}`;
        console.error(mensajeError); 
        callback(mensajeError); 
    });
}

async function deleteData(table, id, callback) {
    db.none(`DELETE FROM ${table} WHERE id = $1`, [id])
        .then(() => {
            callback(null);
        })
        .catch(error => {
            callback(error);
        });
}


module.exports={
    prueba,
    create,
    update,
    readTable,
    deleteData
}