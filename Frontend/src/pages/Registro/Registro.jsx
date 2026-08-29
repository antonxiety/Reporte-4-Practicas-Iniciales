import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';

function Registro(){
    const [formulario, setFormulario] = useState({
        carne:'',
        nombres:'',
        apellidos:'',
        correo: '',
        contrasena: '',
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
            await api.post('/auth/registro', formulario);
            navigate('/login');
        }catch (err){
            setError(err.response?.data?.error || 'No se pudo completar el registro');
        } finally {
            setCargando(false);
        }
    }

    return(
        <div>
            <h2>Crear cuenta</h2>
            <form onSubmit={manejarEnvio}>
                <div>
                    <label htmlFor="carne">Registro academico (carne)</label>
                    <input id="carne" name="carne" value={formulario.carne} onChange={manejarCambio} required />
                </div>
                <div>
                    <label htmlFor="nombres">Nombres</label>
                    <input id="nombres" name="nombres" value={formulario.nombres} onChange={manejarCambio} required />
                </div>
                <div>
                    <label htmlFor="apellidos">Apellidos</label>
                    <input id="apellidos" name="apellidos" value={formulario.apellidos} onChange={manejarCambio} required />
                </div>
                <div>
                    <label htmlFor="correo">Correo electronico</label>
                    <input id="correo" name="correo" type="email" value={formulario.correo} onChange={manejarCambio} required />
                </div>
                <div>
                    <label htmlFor="contrasena">Contraseña</label>
                    <input id="contrasena" name="contrasena" type="password" value={formulario.contrasena} onChange={manejarCambio} required />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit" disabled={cargando}>
                    {cargando ? 'Creando cuenta...' : 'Registrarme'}
                </button>
            </form>
            <p>
                ¿Ya tienes cuenta? <Link to="/login">Inicia sesion</Link>
            </p>
        </div>
    );
}

export default Registro;