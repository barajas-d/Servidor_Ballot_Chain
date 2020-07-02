CREATE DATABASE IF NOT EXISTS ballot_chain;
USE ballot_chain;
DROP TABLE IF EXISTS employess;
DROP TABLE IF EXISTS opcion;
DROP TABLE IF EXISTS votacion;
DROP TABLE IF EXISTS tipoDeVotacion;

CREATE TABLE employess(
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(200) DEFAULT NULL,
    salary INT DEFAULT NULL,
    PRIMARY KEY(id)
);

INSERT INTO employess (name, salary) values ('pepito', 10000);
INSERT INTO employess (name, salary) values ('juanito', 20000);
INSERT INTO employess (name, salary) values ('juanito', 300000);

CREATE TABLE tipoDeVotacion(
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
    FOREIGN KEY(tipoDeVotacion) REFERENCES tipoDeVotacion(id)
);
CREATE TABLE opcion(
    id INT NOT NULL AUTO_INCREMENT,
    descripcion VARCHAR(200) DEFAULT NULL,
    nombre VARCHAR(200) DEFAULT NULL,
    PRIMARY KEY(id),
    votacion INT NOT NULL,
    FOREIGN KEY(votacion) REFERENCES votacion(id)
);
INSERT INTO tipoDeVotacion (id, nombre) VALUES ( 1, 'Popular');
INSERT INTO tipoDeVotacion (id, nombre) VALUES ( 2, 'Ranking');
INSERT INTO tipoDeVotacion (id, nombre) VALUES ( 3, 'Clasificacion');


INSERT INTO votacion (fechaLimite, tipoDeVotacion, descripcion) VALUES ('2020-10-20', 1, 'ejemplo votacion popular');
INSERT INTO votacion (fechaLimite, tipoDEVotacion, descripcion) VALUES ('2020-10-20', 2, 'ejemplo votacion ranking');
INSERT INTO votacion (fechaLimite, tipoDEVotacion, descripcion) VALUES ('2020-10-20', 3, 'ejemplo votacion clasificacion');


INSERT INTO opcion (id, nombre, descripcion, votacion) VALUES (1, 'Diego', 'Opcion de ejemplo', 1);
INSERT INTO opcion (id, nombre, descripcion, votacion) VALUES (2, 'Santiago', 'Opcion de ejemplo', 1);
INSERT INTO opcion (id, nombre, descripcion, votacion) VALUES (3, 'Brandonn', 'Opcion de ejemplo', 1);



SELECT * FROM employess;
SELECT * FROM  opcion;
SELECT * FROM  votacion;
SELECT * FROM  tipoDeVotacion;

