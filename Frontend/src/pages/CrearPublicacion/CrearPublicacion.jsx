import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { obtenerCursos, obtenerCatedraticos } from '../../services/catalogos.service';
import { useAuth } from '../../context/AuthContext';

function CrearPublicacion(){
    const { usuario } = useAuth();
    const [tipo, setTipo] = useState('Curso');
    const [cursos, setCursos] = useState([]);
    const [catedraticos, setCatedraticos] = useState ([]);
    const [entidadId, setEntidadId] = useState('');
    const [contenido, setContenido] = useState('');
    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        async function cargarCatalogos() {
            const [listaCursos, listaCatedraticos] = await Promise.all([
                obtenerCursos(),
                obtenerCatedraticos(),
            ]);
            setCursos(listaCursos);
            setCatedraticos(listaCatedraticos);
        }
    cargarCatalogos();
}, []);

    async function manejarEnvio(e) {
        e.preventDefault();
        setError('');
        setCargando(true);
    
        const payload = {
            usuario_id: usuario?.id,
            contenido,
            curso_id: tipo === 'curso' ? entidadId : null,
            catedratico_id: tipo === 'catedratico' ? entidadId : null,
        };

        try {
            await api.post('/posts', payload);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'No se pudo crear la publicaion');
        } finally {
            setCargando(false);
        }
    }

    const opciones = tipo === 'curso' ? cursos: catedraticos;

    return (
        <div className="pagina">
            <h2>Nueva publicacion</h2>

            <form onSubmit={manejarEnvio}>
                <div className="opciones-tipo">
                    <label>
                        <input
                            type="radio"
                            name="tipo"
                            value="curso"
                            checked={tipo === 'curso'}
                            onChange={() => { setTipo('curso'); setEntidadId(''); }}
                        />
                        Sobre un curso
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="tipo"
                            value="catedratico"
                            checked={tipo === 'catedratico'}
                            onChange={() => { setTipo('catedratico'); setEntidadId(''); }}
                        />
                        Sobre un catedrático
                    </label>
                </div>

                <div className="form-group">
                    <label htmlFor="entidad">
                        {tipo === 'curso' ? 'Selecciona el curso' : 'Selecciona el catedratico'}
                    </label>
                    <select
                        id="entidad"
                        value={entidadId}
                        onChange={(e) => setEntidadId(e.target.value)}
                        required
                    >
                    <option value="">-- Selecciona --</option>
                    {opciones.map((op) => (
                        <option key={op.id} value={op.id}>
                            {tipo === 'curso' ? op.nombre : `${op.nombres} ${op.apellidos}`}
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="contenido">Tu opinion</label>
                <textarea
                    id="contenido"
                    value={contenido}
                    onChange={(e) => setContenido(e.target.value)}
                    required
                    rows={4}
                />
            </div>

            {error && <p className="mensaje-error">{error}</p>}

            <button type="submit" className="btn-primario" disabled={cargando}>
                {cargando ? 'Publicando...' : 'Publicar'}
            </button>
        </form>
    </div>
    );
}

export default CrearPublicacion;