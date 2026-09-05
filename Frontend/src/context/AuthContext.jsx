import { createContext, useContext, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(() => {
        const guardado = localStorage.getItem('usuario');
    return guardado ? JSON.parse(guardado) : null;
    });

    async function login(carne, password) {
        const { data } = await api.post('/auth/login', { carne, password });
        localStorage.setItem('usuario', JSON.stringify(data.usuario || data));
        setUsuario(data.usuario || data);
    }

    function logout() {
        localStorage.removeItem('usuario');
        setUsuario(null);
    }

    return (
        <AuthContext.Provider value={{ usuario, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}