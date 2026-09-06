import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import usersRoutes from './routes/users.routes.js';
import postsRoutes from './routes/posts.routes.js';
import commentsRoutes from './routes/comments.routes.js';
import './config/db.js'; // ejecuta la prueba de conexión al iniciar
import coursesRoutes from './routes/courses.routes.js';
import professorsRoutes from './routes/professors.routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Rutas principales
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/professors', professorsRoutes);

// Ruta de salud básica (opcional, útil para probar que el server responde)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});