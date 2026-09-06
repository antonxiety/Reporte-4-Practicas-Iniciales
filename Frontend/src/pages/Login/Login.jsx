import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {useAuth } from '../../context/AuthContext';

function Login() {
    const [carne, setCarne] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    async function manejarEnvio(e){
        e.preventDefault();
        setError('');
        setCargando(true);
        try {
            await login(carne, password);
            navigate('/');
        } catch(err){
            setError(err.response?.data?.error || 'No se pudo iniciar sesion');
        }finally{
            setCargando(false);
        }
    }
    
    return (
        <div className="auth-layout">
            <div className="auth-card">
                <h2>Iniciar sesion</h2>
                <p className="subtitulo">Accede con tu registro academico</p>

                <form onSubmit={manejarEnvio}>
                    <div className="form-group">
                        <label htmlFor="carne">Registro academico</label>
                        <input
                            id="carne"
                            type="text"
                            value={carne}
                            onChange={(e) => setCarne(e.target.value)}
                            required
                        />
                    </div>

                <div className="form-group">
                    <label htmlFor="password">Contraseña</label>
                    <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    />
                </div>

            {error && <p className="mensaje-error">{error}</p>}

                <button type="submit" className="btn-primario" disabled={cargando}>
                    {cargando ? 'Ingresando...' : 'Ingresar'}
                </button>
            </form>

            <div className="enlaces">
                <p>¿No tienes cuenta? <Link to="/registro">Registrate</Link></p>
                <p><Link to="/recuperar">¿Olvidaste tu contraseña?</Link></p>
                </div>
            </div>
        </div>
    );
}

export default Login;