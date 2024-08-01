CREATE DATABASE midgar;

USE midgar;

CREATE TABLE user(
    id_user INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    contrasenia VARCHAR(50) NOT NULL,
    rol VARCHAR(20) NOT NULL,
);
CREATE TABLE persona(
    dni INT PRIMARY KEY NOT NULL,
    id_user INT,
    nombre VARCHAR(30) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    correo VARCHAR(30) NOT NULL,
    fecha_nacimiento DATE,
    direccion VARCHAR(50),
    localidad VARCHAR(30),
    estado BOOLEAN NOT NULL,
    telefono INT,
    FOREIGN KEY (id_user) REFERENCES user(id_user)
);
CREATE TABLE educador(
    id_educador INT AUTO_INCREMENT PRIMARY KEY,
    dni INT NOT NULL,
    rol VARCHAR(20),
    rama VARCHAR(20),
    im_rama BOOLEAN,
    religion VARCHAR(30),
    FOREIGN KEY (dni) REFERENCES persona(dni)
);
CREATE TABLE beneficiario(
    id_beneficiario INT PRIMARY KEY,
    dni INT NOT NULL,
    rama VARCHAR(20),
    cada BOOLEAN,
    religion VARCHAR(30),
    FOREIGN KEY (dni) REFERENCES persona(dni)
);
CREATE TABLE familiar(
    id_familiar INT PRIMARY KEY,
    dni INT NOT NULL,
    cantidad_hijos INT,
    telefono INT NOT NULL
    relacion VARCHAR(30),
    FOREIGN KEY (dni) REFERENCES persona(dni)
);
CREATE TABLE pacto_familiar(
    id_beneficiario INT,
    id_familiar INT,
    PRIMARY KEY (id_beneficiario, id_familiar),
    FOREIGN KEY (id_beneficiario) REFERENCES beneficiario(id_beneficiario),
    FOREIGN KEY (id_familiar) REFERENCES familiar(id_familiar)
);
CREATE TABLE pagos(
    id_pagos INT AUTO_INCREMENT PRIMARY KEY,
    dni INT 
);



SELECT * FROM personas;