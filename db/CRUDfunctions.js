const pool=require('./configuration');

async function prueba(callback) {
    const client = await pool.connect()
    try {
        const result = await client.query('SELECT NOW()');
        callback(null, result.rows);
    } catch (error) {
        const errorMessage = `Error en la consulta: ${error}`;
        console.error(errorMessage);
        callback(errorMessage, null); 
    }
    finally {
        client.release()
      }
}
async function create(table, item, callback) {
    const keys = Object.keys(item);
    const columnas = keys.join(', ');
    const valores = keys.map(key => `'${item[key]}'`).join(', ');

    const client = await pool.connect()
    try {
        const { rows } = await client.query(`INSERT INTO ${table} (${columnas}) VALUES (${valores}) RETURNING *`);
        callback(null, rows[0]);
    } catch (error) {
        callback(error, null);
    }
    finally {
        client.release()
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
    const client = await pool.connect()
    try {
      
        const { rows } = await client.query(`SELECT * FROM ${table}`);
        callback(null, rows);
    } catch (error) {
    
        const mensajeError = `Error al ejecutar la consulta en la tabla ${table}: ${error.stack}`;
        console.error(mensajeError);
        callback(mensajeError, null);
    }
    finally {
        client.release()
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
/*fuctions for sections*/
async function createSection(newtable, item, callback) {
    const keys = Object.keys(item);
    const columnas = keys.join(', ');
    const valores = keys.map(key => `'${item[key]}'`).join(', ');
    
    const client = await pool.connect()
    try {
     
        await client.query('BEGIN');
        const { rows } = await client.query(`INSERT INTO sections (${columnas}) VALUES (${valores}) RETURNING *`);
        await client.query(`CREATE TABLE ${newtable} (
            id SERIAL PRIMARY KEY,
            dish VARCHAR (100),
            ingredients TEXT,
            price VARCHAR (40),
            src VARCHAR(255)
        );`);
        await client.query('COMMIT');
        callback(null, rows[0]);
    } catch (error) {
        await client.query('ROLLBACK')
        callback(error,null)
    }finally {
        client.release()
      }
   
}
async function createSubsection(newtable, item, id, callback) {
    const keys = Object.keys(item);
    const actualizaciones = keys.map(key => `${key}='${item[key]}'`).join(', ');

    
    const client = await pool.connect()
    try {
     
        await client.query('BEGIN');
        const { rows } = await client.query(`UPDATE sections SET ${actualizaciones} WHERE id=${id} RETURNING *`);
        await client.query(`CREATE TABLE ${newtable} (
            id SERIAL PRIMARY KEY,
            dish VARCHAR (100),
            ingredients TEXT,
            price VARCHAR (40),
            src VARCHAR(255)
        );`);
        await client.query('COMMIT');
        callback(null, rows[0]);
    } catch (error) {
        await client.query('ROLLBACK')
        callback(error,null)
    }finally {
        client.release()
      }
   
}
async function updateSection(oldTable,newTable, item, id, callback) {
    const keys = Object.keys(item);
    const actualizaciones = keys.map(key => `${key}='${item[key]}'`).join(', ');

    
    const client = await pool.connect()
    try {
     
        await client.query('BEGIN');
        const { rows } = await client.query(`UPDATE sections SET ${actualizaciones} WHERE id=${id} RETURNING *`);
        await client.query(`ALTER TABLE ${oldTable} RENAME TO ${newTable}`);
        await client.query('COMMIT');
        callback(null, rows[0]);
    } catch (error) {
        await client.query('ROLLBACK')
        callback(error,null)
    }finally {
        client.release()
      }
   
}
async function deleteSubsection(table, item, id, callback) {
    const keys = Object.keys(item);
    const actualizaciones = keys.map(key => `${key}='${item[key]}'`).join(', ');

    const client = await pool.connect()
    try {
     
        await client.query('BEGIN');
        const { rows } = await client.query(`UPDATE sections SET ${actualizaciones} WHERE id=${id} RETURNING *`);
        await client.query(`DROP TABLE ${table}`);
        await client.query('COMMIT');
        callback(null, rows[0]);
    } catch (error) {
        await client.query('ROLLBACK')
        callback(error,null)
    }finally {
        client.release()
      }
   
}
async function deleteSection(table, id, callback) {
   
    const client = await pool.connect()
    try {
     
        await client.query('BEGIN');
        await client.query(`DELETE FROM sections WHERE id=${id}`);
        await client.query(`DROP TABLE ${table}`);
        await client.query('COMMIT');
        callback(null,{ ok: 'Operación de eliminación exitosa' } );
    } catch (error) {
        await client.query('ROLLBACK')
        callback(error,null)
    }finally {
        client.release()
      }
   
}
module.exports={
    prueba,
    create,
    update,
    readTable,
    deleteData,
    createSection,
    createSubsection,
    updateSection,
    deleteSubsection,
    deleteSection
}