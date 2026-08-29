import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {useAuth } from '../../context/AuthContext';

function Login() {
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    async function manejarEnvio(e){
        e.preventDefault();
        setError('');
        setCargando(true);
        try {
            await login(correo, contrasena);
            navigate('/');
        } catch(err){
            setError(err.response?.data?.erorr || 'No se pudo iniciar sesion');
        }finally{
            setCargando(false);
        }
    }
    
    return(
        <div>
            <h2>Iniciar Sesion</h2>
            <form onSubmit={manejarEnvio}>
                <div>
                    <label htmlFor="Correo">Correo Eletronico</label>
                    <input 
                    id="correo"
                    type="email"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    required
                    />
                </div>
                <div>
                    <label htmlFor="contrasena">Constraseña</label>
                    <input
                    id="contrasena"
                    type="password"
                    value={contrasena}
                    onChange={(e) => setContrasena(e.target.value)}
                    required
                    />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit" disabled={cargando}>
                    {cargando ? 'Ingresando...' : 'Ingresar'}
                </button>
            </form>
            <p>
                ¿No tienes cuenta? <Link to="/registro">Registrate</Link>
            </p>
            <p>
                <Link to="/recuperar">¿Olvidaste tu contraseña?</Link>
            </p>
        </div>
    );
}

export default Login;