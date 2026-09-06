import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { obtenerCursos } from '../../services/catalogos.service';

function Perfil() {
  const { carne } = useParams();
  const { usuario } = useAuth();
  const [perfil, setPerfil] = useState(null);
  const [cursosAprobados, setCursosAprobados] = useState([]);
  const [cursosDisponibles, setCursosDisponibles] = useState([]);
  const [cursoSeleccionado, setCursoSeleccionado] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const esPropio = usuario?.carne === carne;

  async function cargarPerfil() {
    setCargando(true);
    setError('');
    try {
      const [{ data: datosPerfil }, { data: datosCursos }] = await Promise.all([
        api.get(`/users/${carne}`),
        api.get(`/users/${carne}/courses`),
      ]);
      setPerfil(datosPerfil);
      setCursosAprobados(datosCursos.cursos || []);
    } catch (err) {
      setError(err.response?.data?.error || 'No se encontró ese perfil');
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarPerfil();
    if (esPropio) {
      obtenerCursos().then(setCursosDisponibles);
    }
  }, [carne]);

  async function agregarCurso(e) {
    e.preventDefault();
    if (!cursoSeleccionado) return;
    try {
      await api.post(`/users/${carne}/courses`, { curso_id: cursoSeleccionado });
      setCursoSeleccionado('');
      cargarPerfil();
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo agregar el curso');
    }
  }

  async function agregarCurso(e) {
    e.preventDefault();
    if (!cursoSeleccionado) return;
    try {
      await api.post(`/users/${carne}/courses`, { curso_id: cursoSeleccionado });
      setCursoSeleccionado('');
      cargarPerfil();
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo agregar el curso');
    }
  }

  async function quitarCurso(cursoId) {
    try {
      await api.delete(`/users/${carne}/courses/${cursoId}`);
      cargarPerfil();
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo quitar el curso');
    }
  }

  if (cargando) return <div className="pagina"><p className="estado-vacio">Cargando perfil...</p></div>;
  if (error) return <div className="pagina"><p className="mensaje-error">{error}</p></div>;
  if (!perfil) return null;

  const totalCreditos = cursosAprobados.reduce((sum, c) => sum + (c.creditos || 0), 0);

  return (
    <div className="pagina">
      <div className="perfil-header">
        <div>
          <h2>{perfil.nombres} {perfil.apellidos}</h2>
          <p className="subtitulo">Carné: {perfil.carne || carne}</p>
        </div>
      </div>

      {esPropio && (
        <div className="perfil-dato">
          <span>Correo:</span> {perfil.correo}
        </div>
      )}

      <h3 style={{ marginTop: '1.5rem', marginBottom: '0.8rem', fontSize: '1.1rem' }}>Cursos aprobados</h3>

      {cursosAprobados.length === 0 && (
        <p className="estado-vacio">Sin cursos aprobados registrados.</p>
      )}

      {cursosAprobados.map((curso) => (
        <div key={curso.id || curso.curso_id} className="curso-aprobado-item">
          <span>{curso.nombre} ({curso.creditos} créditos)</span>
          {esPropio && (
            <button onClick={() => quitarCurso(curso.id || curso.curso_id)}>Quitar</button>
          )}
        </div>
      ))}

      <p className="total-creditos">Total de créditos: {totalCreditos}</p>

      {esPropio && (
        <form onSubmit={agregarCurso} className="filtros" style={{ marginTop: '1.5rem' }}>
          <select value={cursoSeleccionado} onChange={(e) => setCursoSeleccionado(e.target.value)}>
            <option value="">-- Agregar curso aprobado --</option>
            {cursosDisponibles.map((c) => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
          <button type="submit">Agregar</button>
        </form>
      )}
    </div>
  );
}

export default Perfil;