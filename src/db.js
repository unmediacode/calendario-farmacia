import { createClient } from '@libsql/client';
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Verificar variables de entorno
if (!process.env.TURSO_DB_URL || !process.env.TURSO_DB_AUTH_TOKEN) {
  console.error('Error: Faltan variables de entorno para la conexión a la base de datos');
  process.exit(1);
}

// Configuración del cliente de Turso
const config = {
  url: process.env.TURSO_DB_URL,
  authToken: process.env.TURSO_DB_AUTH_TOKEN,
};

// Crear instancia del cliente
const db = createClient(config);

// Función para ejecutar consultas SQL
export const query = async (sql, params = []) => {
  try {
    const result = await db.execute({
      sql,
      args: params,
    });
    return result;
  } catch (error) {
    console.error('Error ejecutando consulta:', error);
    throw error;
  }
};

// Función para inicializar la base de datos
export const initDB = async () => {
  try {
    // Leer el esquema SQL
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Ejecutar el esquema
    await query(schema);
    console.log('Base de datos inicializada correctamente');
  } catch (error) {
    console.error('Error inicializando la base de datos:', error);
    throw error;
  }
};

// Inicializar la base de datos al cargar el módulo
initDB().catch(console.error);

export default db;
