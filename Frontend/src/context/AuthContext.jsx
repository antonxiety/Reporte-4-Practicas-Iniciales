import { createContext, useContext, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export function AuthProvider({children }) {
    const [usuario, setUsuario] = useState(() => {
        const guardado = localStorage.getItem('usuario');
        return guardado ? JSON.parse(guardado) : null;
    });

    async function login(correo, contrasena) {
        const { data } = await api.post('/auth/login', {correo, contrasena});
        localStorage.setItem('token', data.token);
        localStorage.setItem('usuario', JSON.stringify(data.usuario));
        setUsuario(data.usuario);
    }

    function logout(){
        localStorage.removeItem('token');
        localStorage.removeItem('Usuario');
        setUsuario(null);
    }

    return (
        <AuthContext.Provider value={{ usuario, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(){
    return useContext(AuthContext);
}