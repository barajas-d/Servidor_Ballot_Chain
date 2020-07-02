CREATE DATABASE IF NOT EXISTS ballot_chain;

DROP TABLE IF EXISTS pendiente;
DROP TABLE IF EXISTS miembro;
DROP TABLE IF EXISTS usuario;
DROP TABLE IF EXISTS grupo;

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


INSERT INTO usuario (nombre, correo, contrasena) VALUES 
('Usuario 1','correo 1','correo 1'),
('Usuario 2','correo 2','correo 1'),
('Usuario 3','correo 3','correo 1'),
('Usuario 4','correo 4','correo 1'),
('Usuario 5','correo 5','correo 1'),
('Usuario 6','correo 6','correo 1'),
('Usuario 7','correo 7','correo 1'),
('Usuario 8','correo 8','correo 1'),
('Usuario 9','correo 9','correo 1');



CREATE TABLE grupo (
  id int(11) NOT NULL AUTO_INCREMENT,
  nombre varchar(200) DEFAULT NULL,
  descripcion varchar(200) DEFAULT NULL,
  creacion datetime DEFAULT current_timestamp(),
  creador varchar(200) NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (creador) REFERENCES usuario (nombre)
);



INSERT INTO grupo (nombre, descripcion, creador) VALUES
('Grupo 1', 'Descripcion de grupo 1', 'Usuario 1'),
('Grupo 2', 'Descripcion de grupo 2', 'Usuario 1'),
('Grupo 3', 'Descripcion de grupo 3', 'Usuario 2'),
('Grupo 4', 'Descripcion de grupo 4', 'Usuario 2');


CREATE TABLE miembro (
  idUsuario varchar(200) NOT NULL,
  idGrupo int(11) NOT NULL,
  PRIMARY KEY (idUsuario,idGrupo),
  FOREIGN KEY (idUsuario) REFERENCES usuario (nombre),
  FOREIGN KEY (idGrupo) REFERENCES grupo (id)
);



INSERT INTO miembro (idUsuario, idGrupo) VALUES
('Usuario 1', 2),
('Usuario 2', 1),
('Usuario 3', 1),
('Usuario 4', 1),
('Usuario 5', 2),
('Usuario 6', 2),
('Usuario 7', 3),
('Usuario 8', 3),
('Usuario 9', 4);


CREATE TABLE pendiente (
  idUsuario varchar(200) NOT NULL,
  idGrupo int(11) NOT NULL,
  PRIMARY KEY (idUsuario,idGrupo),
  FOREIGN KEY (idUsuario) REFERENCES usuario (nombre),
  FOREIGN KEY (idGrupo) REFERENCES grupo (id)
);



INSERT INTO pendiente (idUsuario, idGrupo) VALUES
('Usuario 1', 3),
('Usuario 2', 3),
('Usuario 3', 4);



