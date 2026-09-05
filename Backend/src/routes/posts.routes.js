import { Router } from 'express';
import db from '../config/db.js';
import { verificarToken } from '../middlewares/auth.js';

const router = Router();

/* Obtiene el listado de publicaciones en orden descendente.
 * Soporta filtros combinables:
 *   curso_id=       -> publicaciones de un curso exacto
 *   catedratico_id= -> publicaciones de un catedrático exacto
 *   busqueda=       -> coincidencia de texto en contenido, nombre de curso o nombre de catedrático
 */
router.get('/', async (req, res) => {
  const { curso_id, catedratico_id, busqueda } = req.query;
  try {
    let sql = `
      SELECT p.id, p.contenido, p.creado_en, 
             u.carne, u.nombres AS autor_nombres, u.apellidos AS autor_apellidos,
             c.id AS curso_id, c.nombre AS curso,
             cat.id AS catedratico_id, cat.nombres AS catedratico_nombres, cat.apellidos AS catedratico_apellidos
      FROM publicaciones p
      JOIN usuarios u ON p.usuario_id = u.id
      LEFT JOIN cursos c ON p.curso_id = c.id
      LEFT JOIN catedraticos cat ON p.catedratico_id = cat.id
    `;
    const condiciones = [];
    const params = [];

    if (curso_id) {
      condiciones.push('p.curso_id = ?');
      params.push(curso_id);
    }

    if (catedratico_id) {
      condiciones.push('p.catedratico_id = ?');
      params.push(catedratico_id);
    }

    if (busqueda) {
      condiciones.push('(p.contenido LIKE ? OR c.nombre LIKE ? OR cat.nombres LIKE ? OR cat.apellidos LIKE ?)');
      const termino = `%${busqueda}%`;
      params.push(termino, termino, termino, termino);
    }

    if (condiciones.length > 0) {
      sql += ` WHERE ${condiciones.join(' AND ')}`;
    }

    sql += ` ORDER BY p.creado_en DESC`;

    const [posts] = await db.query(sql, params);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crea una nueva publicación asignada al usuario autenticado.

router.post('/', verificarToken, async (req, res) => {
  const { curso_id, catedratico_id, contenido } = req.body;

  if (!contenido || !contenido.trim()) {
    return res.status(400).json({ error: 'El contenido de la publicación es obligatorio' });
  }

  const tieneCurso = Boolean(curso_id);
  const tieneCatedratico = Boolean(catedratico_id);

  if (tieneCurso === tieneCatedratico) {
    // ambos true (los dos enviados) o ambos false (ninguno enviado)
    return res.status(400).json({ error: 'Debes indicar exactamente un curso o un catedrático a evaluar, no ambos ni ninguno' });
  }

  try {
    await db.query(
      'INSERT INTO publicaciones (usuario_id, curso_id, catedratico_id, contenido) VALUES (?, ?, ?, ?)',
      [req.usuario.id, curso_id || null, catedratico_id || null, contenido]
    );
    res.status(201).json({ mensaje: 'Publicación creada exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* 
 * Obtiene la lista completa de cursos y catedráticos para los selectores del formulario.
 */
router.get('/auxiliares/datos', async (req, res) => {
  try {
    const [cursos] = await db.query('SELECT id, codigo, nombre FROM cursos');
    const [catedraticos] = await db.query('SELECT id, nombres, apellidos FROM catedraticos');
    res.json({ cursos, catedraticos });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;