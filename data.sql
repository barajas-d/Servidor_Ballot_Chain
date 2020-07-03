CREATE DATABASE IF NOT EXISTS ballot_chain;
USE ballot_chain;
DROP TABLE IF EXISTS credencial;
DROP TABLE IF EXISTS opcion;
DROP TABLE IF EXISTS votacion;
DROP TABLE IF EXISTS tipoVotacion;
DROP TABLE IF EXISTS usuario;


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
    identificacion VARCHAR(200) DEFAULT NULL, 
    FOREIGN KEY(votacion) REFERENCES votacion(id)
);

CREATE TABLE  credencial(
id INT NOT NULL AUTO_INCREMENT,
clave VARCHAR(200) NOT NULL,
isValid boolean NOT NULL,
votacion INT NOT NULL,
PRIMARY KEY(id),
FOREIGN KEY(votacion) REFERENCES votacion(id)
);

CREATE TABLE usuario(
    nombre VARCHAR(50) NOT NULL,
    saldo DECIMAL(14,2) DEFAULT 0,
    correo VARCHAR(50) DEFAULT NULL,##NOT NULL
    contrasena VARCHAR(64)DEFAULT NULL,
    idValidador VARCHAR(64) DEFAULT NULL,
    bloqAprobados INT DEFAULT 0,
    bloqPropuestos INT DEFAULT 0,
    bloqRevisados INT DEFAULT 0,
    bloqValidados INT DEFAULT 0,
    PRIMARY KEY(nombre)
);


INSERT INTO usuario ( nombre, correo, contrasena ) VALUES ('Santiago', 'jaj', '1234');


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


INSERT INTO credencial (id, clave, isValid, votacion) VALUES(1,'abc',True, 1);
INSERT INTO credencial (id, clave, isValid, votacion) VALUES(2,'def',True, 2);
INSERT INTO credencial (id, clave, isValid, votacion) VALUES(3,'ghi',True, 3);
INSERT INTO credencial (id, clave, isValid, votacion) VALUES(4,'jkl',False, 1);




INSERT INTO votacion (fechaLimite, tipoDeVotacion, descripcion) VALUES ('2020-10-20', 1, 'ejemplo votacion popular');
INSERT INTO votacion (fechaLimite, tipoDEVotacion, descripcion) VALUES ('2020-10-20', 1, 'ejemplo votacion ranking');
INSERT INTO votacion (fechaLimite, tipoDEVotacion, descripcion) VALUES ('2020-10-20', 1, 'ejemplo votacion clasificacion');

INSERT INTO opcion (votacion, nombre, descripcion, identificacion) VALUES (1, 'candidato 1', 'Descripcion', '123');
INSERT INTO opcion (votacion, nombre, descripcion, identificacion) VALUES (1, 'candidato 2', 'Descripcion', '456');
INSERT INTO opcion (votacion, nombre, descripcion, identificacion) VALUES (2, 'candidato 1', 'Descripcion', '789');



SELECT * FROM  opcion;
SELECT * FROM  votacion;
SELECT * FROM  tipoDeVotacion;
SELECT * FROM  credencial;
SELECT * FROM  usuario;
##SELECT * FROM credencial WHERE id = 1 AND isValid = False;

