import express from 'express';
import db from '../config/db.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const [cursos] = await db.query(
        'SELECT id, codigo, nombre, creditos FROM cursos ORDER BY nombre'
    );
    res.json(cursos);
    } catch (err) {
    console.error('Error al obtener cursos:', err.message);
    res.status(500).json({ error: 'No se pudieron obtener los cursos' });
    }
});

export default router;