function PublicacionCard({ publicacion }){
    const entidad = publicacion.curso
    ? `Curso: ${publicacion.curso}`
    : `Catedratico: ${publicacion.catedratico}`;

    return (
        <div className="publicacion-card">
            <p className="entidad">{entidad}</p>
            <p className="contenido">{publicacion.contenido}</p>
            <p className="meta">
                Por {publicacion.usuario?.nombres} · {new Date(publicacion.creado_en).toLocaleDateString()}
            </p>
        </div>
    );
}

export default PublicacionCard;