import { Router } from 'express';
import db from '../config/db.js';
import { verificarToken } from '../middlewares/auth.js';

const router = Router();

/* 
 * Rutas de Gestión de Perfil
 */
router.get('/:carne', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, carne, nombres, apellidos, correo, creado_en FROM usuarios WHERE carne = ?',
      [req.params.carne]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:carne', verificarToken, async (req, res) => {
  const { nombres, apellidos, correo } = req.body;
  if (req.usuario.carne !== req.params.carne) return res.status(403).json({ error: 'No tienes permiso' });

  try {
    await db.query(
      'UPDATE usuarios SET nombres = ?, apellidos = ?, correo = ? WHERE carne = ?',
      [nombres, apellidos, correo, req.params.carne]
    );
    res.json({ mensaje: 'Perfil actualizado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* 
 * Rutas de Cursos Aprobados
 */
router.get('/:carne/courses', async (req, res) => {
  try {
    const [cursos] = await db.query(
      `SELECT c.id, c.codigo, c.nombre, c.creditos 
       FROM cursos_aprobados ca
       JOIN usuarios u ON ca.usuario_id = u.id
       JOIN cursos c ON ca.curso_id = c.id
       WHERE u.carne = ?`,
      [req.params.carne]
    );
    const totalCreditos = cursos.reduce((acc, curr) => acc + curr.creditos, 0);
    res.json({ cursos, totalCreditos });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:carne/courses', verificarToken, async (req, res) => {
  const { curso_id } = req.body;
  if (req.usuario.carne !== req.params.carne) return res.status(403).json({ error: 'No autorizado' });

  try {
    await db.query('INSERT INTO cursos_aprobados (usuario_id, curso_id) VALUES (?, ?)', [req.usuario.id, curso_id]);
    res.status(201).json({ mensaje: 'Curso agregado' });
  } catch (error) {
    res.status(400).json({ error: 'Curso ya aprobado anteriormente' });
  }
});

// NUEVO: elimina un curso aprobado del expediente del usuario logueado.
router.delete('/:carne/courses/:curso_id', verificarToken, async (req, res) => {
  if (req.usuario.carne !== req.params.carne) return res.status(403).json({ error: 'No autorizado' });

  try {
    const [resultado] = await db.query(
      'DELETE FROM cursos_aprobados WHERE usuario_id = ? AND curso_id = ?',
      [req.usuario.id, req.params.curso_id]
    );
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ error: 'El curso no estaba en tu expediente' });
    }
    res.json({ mensaje: 'Curso eliminado del expediente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;