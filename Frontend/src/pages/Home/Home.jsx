import { useState, useEffect } from 'react';
import api from '../../services/api';
import PublicacionCard from "../../components/PublicacionCard";

function Home(){
  const [publicaciones, setPublicaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [filtros, setFiltros] = useState({ curso: '', catedratico: '', texto: '' });

  async function cargarPublicaciones(filtrosActuales){
    setCargando(true);
    setError('');
    try{
      const {data} = await api.get('/publicaciones', { params: filtrosActuales });
      setPublicaciones(data);
    } catch (err) {
      setError('No se pudieron cargar las publicaciones');
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarPublicaciones(filtros);
  }, []);

  function manejarCambioFiltro(e) {
    const { name, value } = e.target;
    setFiltros((anterior) => ({ ...anterior, [name]: value }));
  }

  function manejarBuscar(e) {
    e.preventDefault();
    cargarPublicaciones(filtros);
  }

  return (
    <div className="pagina">
      <h2>Muro de publicaciones</h2>

      <form onSubmit={manejarBuscar} className="filtros">
        <input
          name="curso"
          placeholder="Buscar por curso"
          value={filtros.curso}
          onChange={manejarCambioFiltro}
        />
        <input
          name="catedratico"
          placeholder="Buscar por catedrático"
          value={filtros.catedratico}
          onChange={manejarCambioFiltro}
        />
        <input
          name="texto"
          placeholder="Buscar texto"
          value={filtros.texto}
          onChange={manejarCambioFiltro}
        />
        <button type="submit">Buscar</button>
      </form>

      {cargando && <p className="estado-vacio">Cargando publicaciones...</p>}
      {error && <p className="mensaje-error">{error}</p>}
      {!cargando && !error && publicaciones.length === 0 && (
        <p className="estado-vacio">No hay publicaciones todavía.</p>
      )}

      {publicaciones.map((pub) => (
        <PublicacionCard key={pub.id} publicacion={pub} />
      ))}
    </div>
  );
}


export default Home;