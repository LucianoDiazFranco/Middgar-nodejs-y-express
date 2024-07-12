CREATE DATABASE prueba01;

USE prueba01;

CREATE TABLE personas(
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    correo VARCHAR(100) NOT NULL,
    telefono INT NOT NULL,
    fecha_nac DATE NOT NULL
);

SELECT * FROM personas;