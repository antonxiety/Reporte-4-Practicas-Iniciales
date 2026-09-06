import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Login/Login';
import Registro from '../pages/Registro/Registro';
import Home from '../pages/Home/Home';
import CrearPublicacion from '../pages/CrearPublicacion/CrearPublicacion';
import RecuperarContrasena from '../pages/RecuperarContrasena/RecuperarContrasena';
import BuscarPerfil from '../pages/BuscarPerfil/BuscarPerfil';
import Perfil from '../pages/Perfil/Perfil';
import RutaProtegida from './RutaProtegida';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/recuperar" element={<RecuperarContrasena />} />
      <Route path="/" element={<Home />} />
      <Route
        path="/publicaciones/nueva"
        element={
          <RutaProtegida>
            <CrearPublicacion />
          </RutaProtegida>
        }
      />
      <Route path="/perfiles/buscar" element={<RutaProtegida><BuscarPerfil /></RutaProtegida>} />
      <Route path="/perfiles/:carne" element={<RutaProtegida><Perfil /></RutaProtegida>} />
    </Routes>
  );
}

export default AppRoutes;