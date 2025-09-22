import { query, initDB } from './db.js';
import dayjs from 'dayjs';

// Función para poblar la base de datos con datos de ejemplo
const seedDatabase = async () => {
  try {
    console.log('Iniciando siembra de datos...');

    // Primero, asegurarse de que la base de datos esté inicializada
    await initDB();

    // Verificar si ya existen farmacias
    const existingFarmacias = await query('SELECT COUNT(*) as count FROM farmacias');

    if (existingFarmacias.rows[0].count > 0) {
      console.log('La base de datos ya contiene datos. No se realizará la siembra.');
      return;
    }

    console.log('Insertando datos de ejemplo...');

    // Insertar farmacias de ejemplo
    const farmacias = [
      {
        nombre: 'Farmacia Central',
        direccion: 'Av. Principal 123',
        telefono: '123456789',
        email: 'central@farmacia.com'
      },
      {
        nombre: 'Farmacia del Pueblo',
        direccion: 'Calle Falsa 456',
        telefono: '987654321',
        email: 'pueblo@farmacia.com'
      },
      {
        nombre: 'Farmacia Express',
        direccion: 'Boulevard Los Olivos 789',
        telefono: '555555555',
        email: 'express@farmacia.com'
      }
    ];

    // Insertar farmacias
    for (const farmacia of farmacias) {
      await query(
        'INSERT INTO farmacias (nombre, direccion, telefono, email) VALUES (?, ?, ?, ?)',
        [farmacia.nombre, farmacia.direccion, farmacia.telefono, farmacia.email]
      );
    }

    // Obtener IDs de las farmacias insertadas
    const farmaciasDb = await query('SELECT id FROM farmacias');

    // Generar turnos para las próximas 2 semanas
    const hoy = dayjs();

    for (let i = 0; i < 14; i++) {
      const fecha = hoy.add(i, 'day');

      // Para cada farmacia
      for (const farmacia of farmaciasDb.rows) {
        // Crear 3 turnos por día por farmacia
        for (let j = 0; j < 3; j++) {
          const horaInicio = 9 + j * 4; // 9:00, 13:00, 17:00
          const horaFin = horaInicio + 4;

          await query(
            'INSERT INTO turnos (farmacia_id, fecha, hora_inicio, hora_fin) VALUES (?, ?, ?, ?)',
            [
              farmacia.id,
              fecha.format('YYYY-MM-DD'),
              `${horaInicio.toString().padStart(2, '0')}:00:00`,
              `${horaFin.toString().padStart(2, '0')}:00:00`
            ]
          );
        }
      }
    }

    console.log('¡Datos de ejemplo insertados correctamente!');
  } catch (error) {
    console.error('Error durante la siembra de datos:', error);
  } finally {
    // Cerrar la conexión
    process.exit();
  }
};

// Ejecutar la siembra
seedDatabase();
