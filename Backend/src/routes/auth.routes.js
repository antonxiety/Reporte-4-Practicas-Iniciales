import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';

const router = Router();

router.post('/register', async (req, res) => {
  const { carne, nombres, apellidos, correo, password } = req.body;

  if (!carne || !nombres || !apellidos || !correo || !password) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  try {
    const hash = await bcrypt.hash(password, 10);
    await db.query(
      'INSERT INTO usuarios (carne, nombres, apellidos, correo, contrasena_hash) VALUES (?, ?, ?, ?, ?)',
      [carne, nombres, apellidos, correo, hash]
    );
    res.status(201).json({ mensaje: 'Usuario registrado exitosamente' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'El carné o correo ya está registrado' });
    }
    res.status(500).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  const { carne, password } = req.body;

  if (!carne || !password) {
    return res.status(400).json({ error: 'Carné y contraseña son obligatorios' });
  }

  try {
    const [rows] = await db.query('SELECT * FROM usuarios WHERE carne = ?', [carne]);
    if (rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });

    const usuario = rows[0];
    const match = await bcrypt.compare(password, usuario.contrasena_hash);
    if (!match) return res.status(401).json({ error: 'Contraseña incorrecta' });

    const token = jwt.sign(
      { id: usuario.id, carne: usuario.carne, nombres: usuario.nombres },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ token, usuario: { id: usuario.id, carne: usuario.carne, nombres: usuario.nombres, correo: usuario.correo } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/recover', async (req, res) => {
  const { carne, correo, nuevaPassword } = req.body;

  if (!carne || !correo || !nuevaPassword) {
    return res.status(400).json({ error: 'Carné, correo y nueva contraseña son obligatorios' });
  }

  try {
    const [rows] = await db.query('SELECT * FROM usuarios WHERE carne = ? AND correo = ?', [carne, correo]);
    if (rows.length === 0) return res.status(404).json({ error: 'Datos no coinciden' });

    const hash = await bcrypt.hash(nuevaPassword, 10);
    await db.query('UPDATE usuarios SET contrasena_hash = ? WHERE id = ?', [hash, rows[0].id]);
    res.json({ mensaje: 'Contraseña actualizada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;