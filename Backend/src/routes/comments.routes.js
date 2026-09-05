import { Router } from 'express';
import db from '../config/db.js';
import { verificarToken } from '../middlewares/auth.js';

const router = Router();

router.get('/:publicacion_id', async (req, res) => {
  try {
    const [comentarios] = await db.query(
      `SELECT c.id, c.contenido, c.creado_en, u.carne, u.nombres, u.apellidos
       FROM comentarios c
       JOIN usuarios u ON c.usuario_id = u.id
       WHERE c.publicacion_id = ?
       ORDER BY c.creado_en ASC`,
      [req.params.publicacion_id]
    );
    res.json(comentarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:publicacion_id', verificarToken, async (req, res) => {
  const { contenido } = req.body;

  if (!contenido || !contenido.trim()) {
    return res.status(400).json({ error: 'El comentario no puede estar vacío' });
  }

  try {
    await db.query(
      'INSERT INTO comentarios (publicacion_id, usuario_id, contenido) VALUES (?, ?, ?)',
      [req.params.publicacion_id, req.usuario.id, contenido]
    );
    res.status(201).json({ mensaje: 'Comentario agregado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;