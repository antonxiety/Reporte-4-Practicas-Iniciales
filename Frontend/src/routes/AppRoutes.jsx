import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '../pages/Login/Login';
import Registro from '../pages/Registro/Registro';
import Home from '../pages/Home/Home';
import CrearPublicacion from '../pages/CrearPublicacion/CrearPublicacion';
import RutaProtegida from './RutaProtegida';
import RecuperarContrasena from '../pages/RecuperarContrasena/RecuperarContrasena';
function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/registro" element={<Registro />} />
                <Route path="/" element={<Home />} />
                <Route path="/recuperar" element={<RecuperarContrasena />} />
                <Route
                path="/publicaciones/nueva"
                element={
                    <RutaProtegida>
                        <CrearPublicacion />
                    </RutaProtegida>
                }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;