import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';

function Registro(){
    const [formulario, setFormulario] = useState({
        carne:'',
        nombres:'',
        apellidos:'',
        correo: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(false);
    const navigate = useNavigate();

    function manejarCambio(e) {
        const { name, value } = e.target;
        setFormulario((anterior) => ({ ...anterior, [name]: value }));
    }

    async function manejarEnvio(e) {
        e.preventDefault();
        setError('');
        setCargando(true);
        try{
            await api.post('/auth/register', formulario);
            navigate('/login');
        }catch (err){
            setError(err.response?.data?.error || 'No se pudo completar el registro');
        } finally {
            setCargando(false);
        }
    }

    return (
        <div className="auth-layout">
            <div className="auth-card">
                <h2>Crear cuenta</h2>
                <p className="subtitulo">Registrate con tus datos academicos</p>

            <form onSubmit={manejarEnvio}>
                <div className="form-group">
                    <label htmlFor="carne">Registro academico</label>
                    <input id="carne" name="carne" value={formulario.carne} onChange={manejarCambio} required />
                </div>

                <div className="form-group">
                    <label htmlFor="nombres">Nombres</label>
                    <input id="nombres" name="nombres" value={formulario.nombres} onChange={manejarCambio} required />
                </div>

                <div className="form-group">
                    <label htmlFor="apellidos">Apellidos</label>
                    <input id="apellidos" name="apellidos" value={formulario.apellidos} onChange={manejarCambio} required />
                </div>

                <div className="form-group">
                    <label htmlFor="correo">Correo electronico</label>
                    <input id="correo" name="correo" type="email" value={formulario.correo} onChange={manejarCambio} required />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Contraseña</label>
                    <input id="password" name="password" type="password" value={formulario.password} onChange={manejarCambio} required />
                </div>

            {error && <p className="mensaje-error">{error}</p>}

                <button type="submit" className="btn-primario" disabled={cargando}>
                    {cargando ? 'Creando cuenta...' : 'Registrarme'}
                </button>
            </form>

                <div className="enlaces">
                    <p>¿Ya tienes cuenta? <Link to="/login">Inicia sesion</Link></p>
                </div>
            </div>
        </div>
    );
}

export default Registro;