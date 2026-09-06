import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function BuscarPerfil() {
  const [carne, setCarne] = useState('');
  const navigate = useNavigate();

  function manejarEnvio(e) {
    e.preventDefault();
    if (carne.trim()) {
      navigate(`/perfiles/${carne.trim()}`);
    }
  }

  return (
    <div className="pagina">
      <h2>Buscar perfil</h2>
      <form onSubmit={manejarEnvio} className="filtros">
        <input
          placeholder="Registro académico (carné)"
          value={carne}
          onChange={(e) => setCarne(e.target.value)}
        />
        <button type="submit">Buscar</button>
      </form>
    </div>
  );
}

export default BuscarPerfil;