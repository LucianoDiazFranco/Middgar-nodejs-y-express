CREATE DATABASE midgar;

USE midgar;

CREATE TABLE user(
    id_user INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    contrasenia VARCHAR(50) NOT NULL,
    rol VARCHAR(20) NOT NULL --tabla dudosa
);
CREATE TABLE persona(
    DNI INT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    correo VARCHAR(100) NOT NULL,
    fecha_nac DATE NOT NULL
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
    telefono INT NOT NULL,
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
    dni INT,
    fecha DATE NOT NULL,
    monto FLOAT NOT NULL,
    acreditado BOOLEAN NOT NULL,
    comprobante BOOLEAN NOT NULL,
    concepto VARCHAR(50) NOT NULL,
    metodo_pago VARCHAR(50),
    FOREIGN KEY (dni) REFERENCES persona(dni) 
);
CREATE TABLE actividad(
    id_actividad INT AUTO_INCREMENT PRIMARY KEY,
    id_educador INT,
    fecha DATE,
    lugar VARCHAR(50),
    actividad_tipo VARCHAR(50),
    FOREIGN KEY (id_educador) REFERENCES educador(id_educador) 
); 
CREATE TABLE administrador(
    id_actividad INT,
    id_educador INT,
    PRIMARY KEY (id_actividad, id_educador),
    FOREIGN KEY (id_educador) REFERENCES educador(id_educador),
    FOREIGN KEY (id_actividad) REFERENCES actividad(id_actividad)
); 
CREATE TABLE registro_actividad(
    id_registro INT AUTO_INCREMENT PRIMARY KEY,
    id_actividad INT,
    fecha DATE NOT NULL,
    cantidad_participantes INT NOT NULL,
    cantidad_educadores INT NOT NULL,
    cantidad_colaboradores INT,
    FOREIGN KEY (id_actividad) REFERENCES actividad(id_actividad)
); 
CREATE TABLE planilla_riesgo(
    id_planilla INT AUTO_INCREMENT PRIMARY KEY,
    id_actividad INT,
    id_beneficiario INT,
    fecha DATE NOT NULL,
    lugar VARCHAR(50) NOT NULL,
    diagnostico VARCHAR (100) NOT NULL,
    adulto_responsable VARCHAR(50),
    FOREIGN KEY (id_actividad) REFERENCES actividad(id_actividad),
    FOREIGN KEY (id_beneficiario) REFERENCES beneficiario(id_beneficiario)
);
CREATE TABLE documentacion(
    id_documentacion INT AUTO_INCREMENT PRIMARY KEY,
    dni INT NOT NULL,
    legajo INT,
    autorizacion_padre BOOLEAN,
    vacunas BOOLEAN,
    uso_de_imagen BOOLEAN,
    autorizacion_salida BOOLEAN,
    permiso_retiro BOOLEAN,
    permiso_acampe BOOLEAN,
    vencimiento DATETIME,
    FOREIGN KEY (dni) REFERENCES persona(dni)
);

CREATE TABLE Doc_PDF (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    fecha DATE NOT NULL,
    identifier VARCHAR(100) NOT NULL UNIQUE
);

SELECT * FROM user;