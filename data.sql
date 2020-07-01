CREATE DATABASE IF NOT EXISTS ballot_chain;

DROP TABLE IF EXISTS pendiente;
DROP TABLE IF EXISTS miembro;
DROP TABLE IF EXISTS usuario;
DROP TABLE IF EXISTS grupo;

CREATE TABLE usuario (
  id int(11) NOT NULL AUTO_INCREMENT,
  nombre varchar(200) DEFAULT NULL,
  saldo int(11) DEFAULT NULL,
  correo varchar(200) DEFAULT NULL,
  idValidador int(11) NOT NULL,
  bloqAprobados int(11) NOT NULL,
  bloqPropuestos int(11) NOT NULL,
  bloqRevisados int(11) NOT NULL,
  bloqValidados int(11) NOT NULL,
  PRIMARY KEY (id)
);


INSERT INTO usuario (nombre, idValidador, bloqAprobados, bloqPropuestos, bloqRevisados, bloqValidados) VALUES 
('Usuario 1', 1, 0, 0, 0, 0),
('Usuario 2', 2, 0, 0, 0, 0),
('Usuario 3', 3, 0, 0, 0, 0),
('Usuario 4', 4, 0, 0, 0, 0),
('Usuario 5', 5, 0, 0, 0, 0),
('Usuario 6', 6, 0, 0, 0, 0),
('Usuario 7', 7, 0, 0, 0, 0),
('Usuario 8', 8, 0, 0, 0, 0),
('Usuario 9', 9, 0, 0, 0, 0);



CREATE TABLE grupo (
  id int(11) NOT NULL AUTO_INCREMENT,
  nombre varchar(200) DEFAULT NULL,
  descripcion varchar(200) DEFAULT NULL,
  creacion datetime DEFAULT current_timestamp(),
  creador int(11) DEFAULT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (creador) REFERENCES usuario (id)
);



INSERT INTO grupo (nombre, descripcion, creador) VALUES
('Grupo 1', 'Descripcion de grupo 1', 1),
('Grupo 2', 'Descripcion de grupo 2', 1),
('Grupo 3', 'Descripcion de grupo 3', 2),
('Grupo 4', 'Descripcion de grupo 4', 2);


CREATE TABLE miembro (
  idUsuario int(11) NOT NULL,
  idGrupo int(11) NOT NULL,
  PRIMARY KEY (idUsuario,idGrupo),
  FOREIGN KEY (idUsuario) REFERENCES usuario (id),
  FOREIGN KEY (idGrupo) REFERENCES grupo (id)
);



INSERT INTO miembro (idUsuario, idGrupo) VALUES
(1, 2),
(2, 1),
(3, 1),
(4, 1),
(5, 2),
(6, 2),
(7, 3),
(8, 3),
(9, 4);


CREATE TABLE pendiente (
  idUsuario int(11) NOT NULL,
  idGrupo int(11) NOT NULL,
  PRIMARY KEY (idUsuario,idGrupo),
  FOREIGN KEY (idUsuario) REFERENCES usuario (id),
  FOREIGN KEY (idGrupo) REFERENCES grupo (id)
);



INSERT INTO pendiente (idUsuario, idGrupo) VALUES
(1, 3),
(2, 3),
(3, 4);



