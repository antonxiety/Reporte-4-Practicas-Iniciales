import express from 'express';
import db from '../config/db.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const [catedraticos] = await db.query(
        'SELECT id, nombres, apellidos FROM catedraticos ORDER BY apellidos'
    );
    res.json(catedraticos);
    } catch (err) {
    console.error('Error al obtener catedráticos:', err.message);
    res.status(500).json({ error: 'No se pudieron obtener los catedráticos' });
    }
});

export default router;