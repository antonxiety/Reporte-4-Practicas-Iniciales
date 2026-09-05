import api from './api';
import { cursosMock, catedraticosMock } from './mockData';

export async function obtenerCursos() {
  if (USAR_DATOS_PRUEBA) {
    return cursosMock;
  }
  const { data } = await api.get('/courses');
  return data;
}

export async function obtenerCatedraticos() {
  if (USAR_DATOS_PRUEBA) {
    return catedraticosMock;
  }
  const { data } = await api.get('/professors');
  return data;
}