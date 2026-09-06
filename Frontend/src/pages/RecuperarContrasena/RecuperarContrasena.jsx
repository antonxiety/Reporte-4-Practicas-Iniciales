import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';

function RecuperarContrasena() {
    const [carne, setCarne] = useState('');
    const [correo, setCorreo] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [cargando, setCargando] = useState(false);
    const navigate = useNavigate();

    async function manejarEnvio(e) {
    e.preventDefault();
    setError('');
    setMensaje('');
    setCargando(true);
    try {
        await api.post('/auth/recover', { carne, correo, nuevaPassword: newPassword });
        setMensaje('Contraseña actualizada. Ya puedes iniciar sesión.');
        setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
        setError(err.response?.data?.error || 'Los datos no coinciden');
    } finally {
        setCargando(false);
    }
}

    return (
        <div className="auth-layout">
            <div className="auth-card">
                <h2>Recuperar contraseña</h2>
                <p className="subtitulo">Confirma tu carne y correo para definir una nueva contraseña</p>

            <form onSubmit={manejarEnvio}>
                <div className="form-group">
                    <label htmlFor="carne">Registro academico</label>
                    <input
                    id="carne"
                    value={carne}
                    onChange={(e) => setCarne(e.target.value)}
                    required
                    />
                </div>

            <div className="form-group">
                <label htmlFor="correo">Correo electronico</label>
                <input
                    id="correo"
                    type="email"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="newPassword">Nueva contraseña</label>
                <input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                required
                />
            </div>

            {error && <p className="mensaje-error">{error}</p>}
            {mensaje && <p style={{ color: '#2F855A', fontSize: '0.9rem', marginBottom: '1rem' }}>{mensaje}</p>}

                <button type="submit" className="btn-primario" disabled={cargando}>
                    {cargando ? 'Verificando...' : 'Restablecer contraseña'}
                </button>
            </form>

                    <div className="enlaces">
                <p><Link to="/login">Volver a inicio de sesion</Link></p>
            </div>
        </div>
    </div>
    );
}

export default RecuperarContrasena;