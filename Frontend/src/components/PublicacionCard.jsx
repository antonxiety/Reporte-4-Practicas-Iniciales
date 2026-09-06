import { useState, useEffect } from 'react';
import api from '../services/api';

function PublicacionCard({ publicacion }) {
  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [enviando, setEnviando] = useState(false);

  const entidad = publicacion.curso
    ? `Curso: ${publicacion.curso}`
    : `Catedrático: ${publicacion.catedratico_nombres} ${publicacion.catedratico_apellidos}`;

  async function cargarComentarios() {
    try {
      const { data } = await api.get(`/comments/${publicacion.id}`);
      setComentarios(data);
    } catch (err) {
      // si falla, simplemente no mostramos comentarios, sin romper la tarjeta
    }
  }

  useEffect(() => {
    cargarComentarios();
  }, [publicacion.id]);

  async function manejarComentar(e) {
    e.preventDefault();
    if (!nuevoComentario.trim()) return;
    setEnviando(true);
    try {
      await api.post(`/comments/${publicacion.id}`, { contenido: nuevoComentario });
      setNuevoComentario('');
      cargarComentarios();
    } catch (err) {
      // error silencioso, no rompe la tarjeta
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="publicacion-card">
      <p className="entidad">{entidad}</p>
      <p className="contenido">{publicacion.contenido}</p>
      <p className="meta">
        Por {publicacion.autor_nombres} {publicacion.autor_apellidos} · {new Date(publicacion.creado_en).toLocaleDateString()}
      </p>

      <div className="comentarios-seccion">
        {comentarios.map((c) => (
          <p key={c.id} className="comentario-item">
            <span className="autor">{c.nombres} {c.apellidos}:</span>
            {c.contenido}
          </p>
        ))}

        <form onSubmit={manejarComentar} className="form-comentario">
          <input
            placeholder="Escribe un comentario..."
            value={nuevoComentario}
            onChange={(e) => setNuevoComentario(e.target.value)}
          />
          <button type="submit" disabled={enviando}>
            {enviando ? '...' : 'Comentar'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PublicacionCard;