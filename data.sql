CREATE DATABASE IF NOT EXISTS ballot_chain;

USE ballot_chain;


DROP TABLE IF EXISTS participante;
DROP TABLE IF EXISTS opcion;
DROP TABLE IF EXISTS pendiente;
DROP TABLE IF EXISTS miembro;
DROP TABLE IF EXISTS grupo;
DROP TABLE IF EXISTS validador;
DROP TABLE IF EXISTS credencial;
DROP TABLE IF EXISTS votacion;
DROP TABLE IF EXISTS usuario;
DROP TABLE IF EXISTS tipoVotacion;


CREATE TABLE validador(
    id INT NOT NULL AUTO_INCREMENT,
    peerId VARCHAR(200) NOT NULL,
    isValidador boolean NOT NULL DEFAULT false,
    nombreValidador VARCHAR(200) DEFAULT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE tipoVotacion(
    id INT NOT NULL AUTO_INCREMENT,
    descripcion VARCHAR(200) DEFAULT NULL,
    nombre VARCHAR(200) DEFAULT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE usuario(
    nombre VARCHAR(50) NOT NULL,
    saldo DECIMAL(14,2) DEFAULT 0,
    correo VARCHAR(50) NOT NULL,
    contrasena VARCHAR(64) DEFAULT NULL,
    idValidador VARCHAR(64) DEFAULT NULL,
	reputacion INT NOT NULL Default 40 check(reputacion between 0 and 100),
    bloqAprobados INT DEFAULT 0,
    bloqPropuestos INT DEFAULT 0,
    bloqRevisados INT DEFAULT 0,
    bloqValidados INT DEFAULT 0,
    PRIMARY KEY(nombre)
);

CREATE TABLE votacion(
    id INT NOT NULL AUTO_INCREMENT,
    titulo VARCHAR(50) DEFAULT NULL,
    autor VARCHAR(50) NOT NULL,
    fechaInicio DATE,
    fechaLimite DATE,
    plantillaAsociada INT DEFAULT NULL,
    tipoDeVotacion INT NOT NULL,
    descripcion VARCHAR(200) DEFAULT NULL,
    votos INT DEFAULT 1,
    PRIMARY KEY(id),
    FOREIGN KEY(autor) REFERENCES usuario(nombre) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY(tipoDeVotacion) REFERENCES tipoVotacion(id) ON DELETE CASCADE
);

CREATE TABLE  credencial(
  id INT NOT NULL AUTO_INCREMENT,
  clave VARCHAR(200) DEFAULT NUll,
  isValid boolean NOT NULL DEFAULT false,
  votacion INT NOT NULL,
  PRIMARY KEY(id),
  FOREIGN KEY(votacion) REFERENCES votacion(id)
);


CREATE TABLE participante(
    id INT NOT NULL AUTO_INCREMENT,
    credencial INT DEFAULT NULL,
    idVotacion INT NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(credencial) REFERENCES credencial(id) ON DELETE CASCADE,
    FOREIGN KEY(idVotacion) REFERENCES votacion(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY(nombre) REFERENCES usuario(nombre) ON DELETE CASCADE ON UPDATE CASCADE
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

CREATE TABLE grupo (
  id int(11) NOT NULL AUTO_INCREMENT,
  nombre varchar(200) DEFAULT NULL,
  descripcion varchar(200) DEFAULT NULL,
  creacion datetime DEFAULT current_timestamp(),
  creador varchar(50) NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (creador) REFERENCES usuario (nombre) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE miembro (
  idUsuario varchar(200) NOT NULL,
  idGrupo int(11) NOT NULL,
  PRIMARY KEY (idUsuario,idGrupo),
  FOREIGN KEY (idUsuario) REFERENCES usuario (nombre) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (idGrupo) REFERENCES grupo (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE pendiente (
  idUsuario varchar(200) NOT NULL,
  idGrupo int(11) NOT NULL,
  PRIMARY KEY (idUsuario,idGrupo),
  FOREIGN KEY (idUsuario) REFERENCES usuario (nombre) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (idGrupo) REFERENCES grupo (id) ON DELETE CASCADE ON UPDATE CASCADE
 );


INSERT INTO tipoVotacion (id, nombre) VALUES ( 1, 'Ranking');
INSERT INTO tipoVotacion (id, nombre) VALUES ( 2, 'Popular');
INSERT INTO tipoVotacion (id, nombre) VALUES ( 3, 'Clasificacion');

commit;

