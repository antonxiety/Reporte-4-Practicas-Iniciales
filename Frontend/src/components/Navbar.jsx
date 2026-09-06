import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

    function Navbar() {
        const { usuario, logout } = useAuth();
        const navigate = useNavigate();

    if (!usuario) return null;

    function manejarSalir() {
        logout();
        navigate('/login');
    }

    return (
        <nav className="navbar">
            <span className="marca">Calificacion de Cursos</span>
            <div className="enlaces-nav">
                <Link to="/">Muro</Link>
                <Link to="/publicaciones/nueva">Nueva publicacion</Link>
                <Link to="/perfiles/buscar">Buscar perfil</Link>
                <Link to={`/perfiles/${usuario.carne}`}>Mi perfil</Link>
            <button onClick={manejarSalir}>Cerrar sesion</button>
            </div>
        </nav>
    );
}

export default Navbar;