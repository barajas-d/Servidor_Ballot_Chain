CREATE DATABASE IF NOT EXISTS ballot_chain;

DROP TABLE IF EXISTS employess;
DROP TABLE IF EXISTS votacion;
DROP TABLE IF EXISTS opcion;

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

CREATE TABLE votacion(
    id INT NOT NULL AUTO_INCREMENT,
    fechaLimite DATE NOT NULL,
    plantillaAsociada INT DEFAULT NULL,
    tipoDeVotacion INT NOT NULL,
    descripcion VARCHAR(200) DEFAULT NULL,
    votos INT DEFAULT 1,
    PRIMARY KEY(id),
    FOREIGN KEY(tipoDeVotacion) REFERENCES opcion(id)
);


INSERT INTO opcion (id, nombre, descripcion) VALUES (1, 'Popular', 'Opcion de ejemplo');
INSERT INTO opcion (id, nombre, descripcion) VALUES (2, 'Ranking', 'Opcion de ejemplo');
INSERT INTO opcion (id, nombre, descripcion) VALUES (3, 'Clasificación', 'Opcion de ejemplo');

INSERT INTO votacion (fechaLimite, tipoDeVotacion, descripcion) VALUES ('2020-10-20', 1, 'ejemplo votacion popular');
INSERT INTO votacion (fechaLimite, tipoDEVotacion, descripcion) VALUES ('2020-10-20', 1, 'ejemplo votacion ranking');
INSERT INTO votacion (fechaLimite, tipoDEVotacion, descripcion) VALUES ('2020-10-20', 1, 'ejemplo votacion clasificacion');
