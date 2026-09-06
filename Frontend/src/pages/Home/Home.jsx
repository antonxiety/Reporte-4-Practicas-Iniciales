import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { obtenerCursos, obtenerCatedraticos } from '../../services/catalogos.service';
import PublicacionCard from '../../components/PublicacionCard';

function Home() {
  const [publicaciones, setPublicaciones] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [catedraticos, setCatedraticos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [filtros, setFiltros] = useState({ curso_id: '', catedratico_id: '', busqueda: '' });
  const { logout } = useAuth();
  const navigate = useNavigate();

  async function cargarPublicaciones(filtrosActuales) {
    setCargando(true);
    setError('');
    try {
      const params = {};
      if (filtrosActuales.curso_id) params.curso_id = filtrosActuales.curso_id;
      if (filtrosActuales.catedratico_id) params.catedratico_id = filtrosActuales.catedratico_id;
      if (filtrosActuales.busqueda) params.busqueda = filtrosActuales.busqueda;

      const { data } = await api.get('/posts', { params });
      setPublicaciones(data);
    } catch (err) {
      setError('No se pudieron cargar las publicaciones');
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarPublicaciones(filtros);
    obtenerCursos().then(setCursos);
    obtenerCatedraticos().then(setCatedraticos);
  }, []);

  function manejarCambioFiltro(e) {
    const { name, value } = e.target;
    setFiltros((anterior) => ({ ...anterior, [name]: value }));
  }

  function manejarBuscar(e) {
    e.preventDefault();
    cargarPublicaciones(filtros);
  }

  function manejarSalir() {
    logout();
    navigate('/login');
  }

  return (
    <div className="pagina">
      <h2>Muro de publicaciones</h2>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <Link to="/publicaciones/nueva" className="btn-primario" style={{ display: 'inline-block', width: 'auto', padding: '0.6rem 1.2rem', textDecoration: 'none' }}>
          + Nueva publicacion
        </Link>
      </div>

      <form onSubmit={manejarBuscar} className="filtros">
        <select name="curso_id" value={filtros.curso_id} onChange={manejarCambioFiltro}>
          <option value="">-- Todos los cursos --</option>
          {cursos.map((c) => (
            <option key={c.id} value={c.id}>{c.nombre}</option>
          ))}
        </select>

        <select name="catedratico_id" value={filtros.catedratico_id} onChange={manejarCambioFiltro}>
          <option value="">-- Todos los catedraticos --</option>
          {catedraticos.map((c) => (
            <option key={c.id} value={c.id}>{c.nombres} {c.apellidos}</option>
          ))}
        </select>

        <input
          name="busqueda"
          placeholder="Buscar texto"
          value={filtros.busqueda}
          onChange={manejarCambioFiltro}
        />
        <button type="submit">Buscar</button>
      </form>

      {cargando && <p className="estado-vacio">Cargando publicaciones...</p>}
      {error && <p className="mensaje-error">{error}</p>}
      {!cargando && !error && publicaciones.length === 0 && (
        <p className="estado-vacio">No hay publicaciones todavia.</p>
      )}

      {publicaciones.map((pub) => (
        <PublicacionCard key={pub.id} publicacion={pub} />
      ))}
    </div>
  );
}

export default Home;