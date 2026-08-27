CREATE DATABASE IF NOT EXISTS calificacion_cursos
    CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE calificacion_cursos;

CREATE TABLE usuarios(
    id INT AUTO_INCREMENT PRIMARY KEY,
    carne VARCHAR(20) NOT NULL UNIQUE,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    correo VARCHAR(150) NOT NULL UNIQUE,
    contrasena_hash VARCHAR(255) NOT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cursos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(20) NOT NULL UNIQUE,
    nombre VARCHAR(150) NOT NULL,
    creditos INT NOT NULL DEFAULT 0
);

CREATE TABLE catedraticos(
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL
);

CREATE TABLE publicaciones(
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuarios_id INT NOT NULL,
    curso_id INT NULL,
    catedratico_id INT NULL,
    contenido TEXT NOT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuarios_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (curso_id) REFERENCES cursos(id) ON DELETE CASCADE,
    FOREIGN KEY (catedratico_id) REFERENCES catedraticos(id) ON DELETE CASCADE,
    CONSTRAINT chk_entidad_evaluad CHECK(
        (curso_id IS NOT NULL AND catedratico_id IS NULL) OR
        (curso_id IS NULL AND catedratico_id IS NOT NULL)
    )
);

CREATE TABLE comentarios(
    id INT AUTO_INCREMENT PRIMARY KEY,
    publicacion_id INT NOT NULL,
    usuario_id INT NOT NULL,
    contenido TEXT NOT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (publicacion_id) REFERENCES publicaciones(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE cursos_aprobados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    curso_id INT NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (curso_id) REFERENCES cursos(id) ON DELETE CASCADE,
    UNIQUE KEY unico_usuario_curso (usuario_id, curso_id)
);