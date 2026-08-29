function PublicacionCard({ publicacion }){
    const entidad = publicacion.curso
    ? `Curso: ${publicacion.curso}`
    : `Catedratico: ${publicacion.catedratico}`;

    return (
        <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
            <p style={{ fontWeight: 'bold' }}>{entidad}</p>
            <p>{publicacion.contenido}</p>
            <p style={{ fontSize: '0.85rem', color: '#666' }}>
                Por {publicacion.usuario?.nombres} · {new Date(publicacion.creado_en).toLocaleDateString()}
            </p>
        </div>
    );
}

export default PublicacionCard;