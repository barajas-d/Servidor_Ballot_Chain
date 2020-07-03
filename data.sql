CREATE DATABASE IF NOT EXISTS ballot_chain;

DROP TABLE IF EXISTS employess;
DROP TABLE IF EXISTS participante;
DROP TABLE IF EXISTS votacion;
DROP TABLE IF EXISTS opcion;
DROP TABLE IF EXISTS usuario;

CREATE TABLE employess(
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(200) DEFAULT NULL,
    salary INT DEFAULT NULL,
    PRIMARY KEY(id)
);

INSERT INTO employess (name, salary) values ('pepito', 10000);
INSERT INTO employess (name, salary) values ('juanito', 20000);
INSERT INTO employess (name, salary) values ('juanito', 300000);


CREATE TABLE opcion(
    id INT NOT NULL AUTO_INCREMENT,
    descripcion VARCHAR(200) DEFAULT NULL,
    nombre VARCHAR(200) DEFAULT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE usuario(
    nombre VARCHAR(50) NOT NULL,
    saldo DECIMAL(14,2) DEFAULT 0,
    correo VARCHAR(50) NOT NULL,
    contrasena VARCHAR(64) NOT NULL,
    idValidador VARCHAR(64) DEFAULT NULL,
    bloqAprobados INT DEFAULT 0,
    bloqPropuestos INT DEFAULT 0,
    bloqRevisados INT DEFAULT 0,
    bloqValidados INT DEFAULT 0,
    PRIMARY KEY(nombre)
);

CREATE TABLE votacion(
    id INT NOT NULL AUTO_INCREMENT,
    titulo VARCHAR(50) NOT NULL,
    autor VARCHAR(50) NOT NULL,
    fechaLimite DATE NOT NULL,
    plantillaAsociada INT DEFAULT NULL,
    tipoDeVotacion INT NOT NULL,
    descripcion VARCHAR(200) DEFAULT NULL,
    votos INT DEFAULT 1,
    PRIMARY KEY(id),
    FOREIGN KEY(autor) REFERENCES usuario(nombre) ON UPDATE CASCADE,
    FOREIGN KEY(tipoDeVotacion) REFERENCES opcion(id)
);

CREATE TABLE participante(
    id INT NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    PRIMARY KEY(id, nombre),
    FOREIGN KEY(id) REFERENCES votacion(id),
    FOREIGN KEY(nombre) REFERENCES usuario(nombre) ON UPDATE CASCADE
);

INSERT INTO opcion (id, nombre, descripcion) VALUES (1, 'Popular', 'Opcion de ejemplo');
INSERT INTO opcion (id, nombre, descripcion) VALUES (2, 'Ranking', 'Opcion de ejemplo');
INSERT INTO opcion (id, nombre, descripcion) VALUES (3, 'Clasificación', 'Opcion de ejemplo');

INSERT INTO usuario (nombre, correo, contrasena) VALUES ('Alice', 'alice@gmail.com', '123');
INSERT INTO usuario (nombre, correo, contrasena) VALUES ('Bob', 'bob@gmail.com', '123');
INSERT INTO usuario (nombre, correo, contrasena) VALUES ('Brandonn', 'brandonn@gmail.com', '123');

INSERT INTO votacion (fechaLimite, titulo, autor, tipoDeVotacion, descripcion) VALUES ('2020-10-20', 'Votacion 1','Brandonn', 1, 'ejemplo votacion popular');
INSERT INTO votacion (fechaLimite, titulo, autor, tipoDEVotacion, descripcion) VALUES ('2020-10-20', 'Votacion 2','Brandonn', 1, 'ejemplo votacion ranking');
INSERT INTO votacion (fechaLimite, titulo, autor, tipoDEVotacion, descripcion) VALUES ('2020-10-20', 'Votacion 3','Alice', 1, 'ejemplo votacion clasificacion');

INSERT INTO participante (id, nombre) VALUES (1, 'Alice');
INSERT INTO participante (id, nombre) VALUES (3, 'Alice');
INSERT INTO participante (id, nombre) VALUES (1, 'Bob');
INSERT INTO participante (id, nombre) VALUES (1, 'Brandonn');
INSERT INTO participante (id, nombre) VALUES (2, 'Brandonn');
INSERT INTO participante (id, nombre) VALUES (3, 'Brandonn');