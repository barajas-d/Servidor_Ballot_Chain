CREATE DATABASE IF NOT EXISTS ballot_chain;
USE ballot_chain;
DROP TABLE IF EXISTS employess;
DROP TABLE IF EXISTS opcion;
DROP TABLE IF EXISTS votacion;
DROP TABLE IF EXISTS tipoVotacion;

CREATE TABLE employess(
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(200) DEFAULT NULL,
    salary INT DEFAULT NULL,
    PRIMARY KEY(id)
);

INSERT INTO employess (name, salary) values ('pepito', 10000);
INSERT INTO employess (name, salary) values ('juanito', 20000);
INSERT INTO employess (name, salary) values ('juanito', 300000);

CREATE TABLE tipoVotacion(
    id INT NOT NULL AUTO_INCREMENT,
    descripcion VARCHAR(200) DEFAULT NULL,
    nombre VARCHAR(200) DEFAULT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE votacion(
    id INT NOT NULL AUTO_INCREMENT,
    fechaLimite DATE NOT NULL,
    plantillaAsociada INT DEFAULT NULL,
    tipoDeVotacion INT NOT NULL,
    descripcion VARCHAR(200) DEFAULT NULL,
    votos INT DEFAULT 1,
    PRIMARY KEY(id),
    FOREIGN KEY(tipoDeVotacion) REFERENCES tipoVotacion(id)
);
CREATE TABLE opcion(
    id INT NOT NULL AUTO_INCREMENT,
    descripcion VARCHAR(200) DEFAULT NULL,
    nombre VARCHAR(200) DEFAULT NULL,
    PRIMARY KEY(id),
    votacion INT NOT NULL,
    FOREIGN KEY(votacion) REFERENCES votacion(id)
);
INSERT INTO tipoVotacion (id, nombre) VALUES ( 1, 'Ranking');
INSERT INTO tipoVotacion (id, nombre) VALUES ( 2, 'Popular');
INSERT INTO tipoVotacion (id, nombre) VALUES ( 3, 'Clasificacion');


INSERT INTO votacion (id,fechaLimite, tipoDeVotacion, descripcion) VALUES (1, '2020-10-20', 1, 'ejemplo votacion ranking');
INSERT INTO votacion (id, fechaLimite, tipoDEVotacion, descripcion, votos) VALUES (2, '2020-10-20', 2, 'ejemplo votacion popular',20);
INSERT INTO votacion (id, fechaLimite, tipoDEVotacion, descripcion) VALUES (3, '2020-10-20', 3, 'ejemplo votacion clasificacion');


INSERT INTO opcion (id, nombre, descripcion, votacion) VALUES (1, 'Diego', 'Opcion de ejemplo', 1);
INSERT INTO opcion (id, nombre, descripcion, votacion) VALUES (2, 'Santiago', 'Opcion de ejemplo', 1);
INSERT INTO opcion (id, nombre, descripcion, votacion) VALUES (3, 'Brandonn', 'Opcion de ejemplo', 1);

INSERT INTO opcion (id, nombre, descripcion, votacion) VALUES (4, 'Hernando', 'Opcion de ejemplo', 2);
INSERT INTO opcion (id, nombre, descripcion, votacion) VALUES (5, 'Asaf', 'Opcion de ejemplo', 2);
INSERT INTO opcion (id, nombre, descripcion, votacion) VALUES (6, 'Padi', 'Opcion de ejemplo', 2);
INSERT INTO opcion (id, nombre, descripcion, votacion) VALUES (7, 'Santiago', 'Opcion de ejemplo', 2);

INSERT INTO opcion (id, nombre, descripcion, votacion) VALUES (8, 'Diego', 'Opcion de ejemplo', 3);
INSERT INTO opcion (id, nombre, descripcion, votacion) VALUES (9, 'Brandonn', 'Opcion de ejemplo', 3);
INSERT INTO opcion (id, nombre, descripcion, votacion) VALUES (10, 'Santiago', 'Opcion de ejemplo', 3);
INSERT INTO opcion (id, nombre, descripcion, votacion) VALUES (11, 'Briam', 'Opcion de ejemplo', 3);
SELECT * FROM employess;
SELECT * FROM  opcion;
SELECT * FROM  votacion;
SELECT * FROM  tipoDeVotacion;

