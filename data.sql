CREATE DATABASE IF NOT EXISTS ballot_chain;

DROP TABLE IF EXISTS employess;
DROP TABLE IF EXISTS opcion;
DROP TABLE IF EXISTS votacion;


CREATE TABLE votacion(
    id INT NOT NULL AUTO_INCREMENT,
    fechaLimite DATE NOT NULL,
    plantillaAsociada INT DEFAULT NULL,
    tipoDeVotacion INT NOT NULL,
    descripcion VARCHAR(200) DEFAULT NULL,
    votos INT DEFAULT 1,
    PRIMARY KEY(id)
);

CREATE TABLE opcion(
    id INT NOT NULL AUTO_INCREMENT,
    idVotacion INT NOT NULL,
    identificacion VARCHAR(200) DEFAULT NULL, 
    descripcion VARCHAR(200) DEFAULT NULL,
    nombre VARCHAR(200) DEFAULT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY (idVotacion) REFERENCES votacion(id)
);


INSERT INTO votacion (fechaLimite, tipoDeVotacion, descripcion) VALUES ('2020-10-20', 1, 'ejemplo votacion popular');
INSERT INTO votacion (fechaLimite, tipoDEVotacion, descripcion) VALUES ('2020-10-20', 1, 'ejemplo votacion ranking');
INSERT INTO votacion (fechaLimite, tipoDEVotacion, descripcion) VALUES ('2020-10-20', 1, 'ejemplo votacion clasificacion');

INSERT INTO opcion (idVotacion, nombre, descripcion, identificacion) VALUES (1, 'candidato 1', 'Descripcion', '123');
INSERT INTO opcion (idVotacion, nombre, descripcion, identificacion) VALUES (1, 'candidato 2', 'Descripcion', '456');
INSERT INTO opcion (idVotacion, nombre, descripcion, identificacion) VALUES (2, 'candidato 1', 'Descripcion', '789');
