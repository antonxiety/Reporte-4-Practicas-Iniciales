// Importamos la librería mysql2, dotenv
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10
});

// Prueba rápida de conexión al iniciar
db.getConnection()
  .then((connection) => {
    console.log('✅ Conexión exitosa a la base de datos MySQL (calificacion_cursos)');
    connection.release();
  })
  .catch((err) => {
    console.error('❌ Error al conectar a MySQL:', err.message);
  });

export default db;
  