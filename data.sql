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

/* CREATE TABLE validador(
    id INT NOT NULL AUTO_INCREMENT,
    peerId VARCHAR(200) NOT NULL,
    isValidador boolean NOT NULL DEFAULT false,
    nombreValidador VARCHAR(50) NOT NULL DEFAULT  '',
	PRIMARY KEY(id),
	FOREIGN KEY(nombreValidador) REFERENCES usuario(nombre) ON UPDATE CASCADE
); */

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



## Inserts ----------------------------------------------------------------------------------

INSERT INTO usuario ( nombre, correo, contrasena ) VALUES ('Santiago', 'jaj', '1234');


INSERT INTO tipoVotacion (id, nombre) VALUES ( 1, 'Ranking');
INSERT INTO tipoVotacion (id, nombre) VALUES ( 2, 'Popular');
INSERT INTO tipoVotacion (id, nombre) VALUES ( 3, 'Clasificacion');


INSERT INTO votacion (autor, titulo, id, fechaLimite, tipoDeVotacion, descripcion) VALUES ('Santiago', 'TituloVotacion', 1, '2020-10-20', 1, 'ejemplo votacion ranking');
INSERT INTO votacion (autor, titulo, id, fechaLimite, tipoDEVotacion, descripcion, votos) VALUES ('Santiago', 'TituloVotacion', 2, '2020-10-20', 2, 'ejemplo votacion popular',20);
INSERT INTO votacion (autor, titulo, id, fechaLimite, tipoDEVotacion, descripcion) VALUES ('Santiago', 'TituloVotacion', 3, '2020-10-20', 3, 'ejemplo votacion clasificacion');


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

INSERT INTO usuario (nombre, correo, contrasena) VALUES ('Alice', 'alice@gmail.com', '202cb962ac59075b964b07152d234b70');
INSERT INTO usuario (nombre, correo, contrasena) VALUES ('Bob', 'bob@gmail.com', '202cb962ac59075b964b07152d234b70');
INSERT INTO usuario (nombre, correo, contrasena) VALUES ('Brandonn', 'brandonn@gmail.com', '202cb962ac59075b964b07152d234b70');

INSERT INTO usuario (nombre, correo) VALUES 
('Usuario1','correo 1'),
('Usuario2','correo 2'),
('Usuario3','correo 3'),
('Usuario4','correo 4'),
('Usuario5','correo 5'),
('Usuario6','correo 6'),
('Usuario7','correo 7'),
('Usuario8','correo 8'),
('Usuario9','correo 9');

INSERT INTO grupo (nombre, descripcion, creador) VALUES
('Grupo 1', 'Descripcion de grupo 1', 'Usuario1'),
('Grupo 2', 'Descripcion de grupo 2', 'Usuario1'),
('Grupo 3', 'Descripcion de grupo 3', 'Usuario2'),
('Grupo 4', 'Descripcion de grupo 4', 'Usuario2');

INSERT INTO miembro (idUsuario, idGrupo) VALUES
('Usuario1', 2),
('Usuario2', 1),
('Usuario3', 1),
('Usuario4', 1),
('Usuario5', 2),
('Usuario6', 2),
('Usuario7', 3),
('Usuario8', 3),
('Usuario9', 4);

INSERT INTO pendiente (idUsuario, idGrupo) VALUES
('Usuario1', 3),
('Usuario3', 2),
('Usuario3', 4);

INSERT INTO votacion (fechaLimite, titulo, autor, tipoDeVotacion, descripcion) VALUES ('2020-10-20', 'Votacion 1','Brandonn', 1, 'ejemplo votacion popular');
INSERT INTO votacion (fechaLimite, titulo, autor, tipoDEVotacion, descripcion) VALUES ('2020-10-20', 'Votacion 2','Brandonn', 1, 'ejemplo votacion ranking');
INSERT INTO votacion (fechaLimite, titulo, autor, tipoDEVotacion, descripcion) VALUES ('2020-10-20', 'Votacion 3','Alice', 1, 'ejemplo votacion clasificacion');

INSERT INTO opcion (nombre, descripcion, votacion) VALUES ('Diego', 'Opcion de ejemplo', 4);
INSERT INTO opcion (nombre, descripcion, votacion) VALUES ('Santiago', 'Opcion de ejemplo', 4);
INSERT INTO opcion (nombre, descripcion, votacion) VALUES ('Brandonn', 'Opcion de ejemplo', 4);

INSERT INTO opcion (nombre, descripcion, votacion) VALUES ('Diego', 'Opcion de ejemplo', 5);
INSERT INTO opcion (nombre, descripcion, votacion) VALUES ('Santiago', 'Opcion de ejemplo', 5);
INSERT INTO opcion (nombre, descripcion, votacion) VALUES ('Brandonn', 'Opcion de ejemplo', 5);

INSERT INTO opcion (nombre, descripcion, votacion) VALUES ('Diego', 'Opcion de ejemplo', 6);
INSERT INTO opcion (nombre, descripcion, votacion) VALUES ('Santiago', 'Opcion de ejemplo', 6);
INSERT INTO opcion (nombre, descripcion, votacion) VALUES ('Brandonn', 'Opcion de ejemplo', 6);

INSERT INTO participante (id, nombre, idVotacion) VALUES (1, 'Alice', 1);
INSERT INTO participante (id, nombre, idVotacion) VALUES (2, 'Alice', 1);
INSERT INTO participante (id, nombre, idVotacion) VALUES (3, 'Bob', 2);
INSERT INTO participante (id, nombre, idVotacion) VALUES (4, 'Brandonn',1);
INSERT INTO participante (id, nombre, idVotacion) VALUES (5, 'Brandonn',2);
INSERT INTO participante (id, nombre, idVotacion) VALUES (6, 'Brandonn',3);

INSERT INTO votacion (autor, titulo, fechaLimite, tipoDeVotacion, descripcion) VALUES ('Santiago', 'TituloVotacion', '2020-10-20', 1, 'ejemplo votacion popular');
INSERT INTO votacion (autor, titulo, fechaLimite, tipoDEVotacion, descripcion) VALUES ('Santiago', 'TituloVotacion', '2020-10-20', 1, 'ejemplo votacion ranking');
INSERT INTO votacion (autor, titulo, fechaLimite, tipoDEVotacion, descripcion) VALUES ('Santiago', 'TituloVotacion', '2020-10-20', 1, 'ejemplo votacion clasificacion');

INSERT INTO opcion (votacion, nombre, descripcion, identificacion) VALUES (1, 'candidato 1', 'Descripcion', '123');
INSERT INTO opcion (votacion, nombre, descripcion, identificacion) VALUES (1, 'candidato 2', 'Descripcion', '456');
INSERT INTO opcion (votacion, nombre, descripcion, identificacion) VALUES (2, 'candidato 1', 'Descripcion', '789');


SELECT * FROM  opcion;
SELECT * FROM  votacion;
SELECT * FROM  tipoVotacion;
SELECT * FROM  credencial;
SELECT * FROM  usuario;
select * from validador;
SELECT * FROM usuario WHERE nombre = 'lal' AND contrasena = 'lal';

select nombre, peerId, reputacion from 
usuario as u inner join validador as v 
on v.nombreValidador = u.nombre;

/*
Prueba torneo
*/
insert into validador values(1, "abc", false, 'Brandonn');
insert into validador values (2, "efg", false, 'Santiago');
insert into validador values (3, "efg", false, 'Alice');
insert into validador values (4, "efg", false, 'Bob');
insert into validador values (5, "lal", false, 'Usuario1');

update usuario set reputacion= 20 where nombre ='Brandonn';
update usuario set reputacion= 60 where nombre ='Santiago';
update usuario set reputacion= 80 where nombre ='Alice';
update usuario set reputacion= 100 where nombre ='Bob';
update usuario set reputacion= 0 where nombre ='Usuario1';

select nombre, idVotacion from participante where nombre ='Brandonn' and idVotacion = 1;

commit;

