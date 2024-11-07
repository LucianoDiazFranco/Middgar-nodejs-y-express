CREATE DATABASE middgar;

USE middgar;

CREATE TABLE users(
    email VARCHAR (100) NOT NULL PRIMARY KEY,
    name VARCHAR (50)NOT NULL,
    password VARCHAR(255) NOT NULL
);
CREATE TABLE persona(
    DNI INT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    correo VARCHAR(100) NOT NULL,
    fecha_nac DATE NOT NULL,
    rama VARCHAR(50) NOT NULL,
    activo INT NOT NULL
);
CREATE TABLE planillaDeRiesgo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fecha_actividad DATE NOT NULL,
    lugar_actividad VARCHAR(255) NOT NULL,
    cantidad_beneficiarios INT NOT NULL,
    cantidad_educadores INT NOT NULL,
    im_a_cargo VARCHAR(255) NOT NULL,
    elementos_seguridad TEXT,
    accidente_sucedido VARCHAR(255) NOT NULL,
    descripcion_accidente TEXT,  -- Campo adicional para describir el accidente si es 'Otros'
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE doc_pdf (
  id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nombre varchar(255) NOT NULL,
  fecha date NOT NULL,
  subido_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  rama varchar(50) DEFAULT NULL
);
CREATE TABLE archivos (
  id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nombre_archivo varchar(255) NOT NULL,
  fecha_subida  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE documentosUsuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    dni INT NOT NULL,
    nombre_documento VARCHAR(255) NOT NULL,
    fecha_subida TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (dni) REFERENCES persona(DNI) ON DELETE CASCADE
);

/****************************************************/
CREATE TABLE educador(
    id_educador INT AUTO_INCREMENT PRIMARY KEY,
    dni INT NOT NULL,
    rol VARCHAR(20),
    rama VARCHAR(20),
    im_rama BOOLEAN,
    religion VARCHAR(30),
    FOREIGN KEY (dni) REFERENCES persona(dni)
);

CREATE TABLE pagos(
    id_pagos INT AUTO_INCREMENT PRIMARY KEY,
    dni INT,
    fecha DATE NOT NULL,
    monto FLOAT NOT NULL,
    acreditado BOOLEAN NOT NULL,
    comprobante BOOLEAN NOT NULL,
    concepto VARCHAR(50) NOT NULL,
    metodo_pago VARCHAR(50),
    FOREIGN KEY (dni) REFERENCES persona(dni) 
);

CREATE TABLE administrador(
    id_actividad INT,
    id_educador INT,
    PRIMARY KEY (id_actividad, id_educador),
    FOREIGN KEY (id_educador) REFERENCES educador(id_educador),
    FOREIGN KEY (id_actividad) REFERENCES actividad(id_actividad)
); 
