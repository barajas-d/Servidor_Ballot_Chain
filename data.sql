CREATE DATABASE IF NOT EXISTS ballot_chain;

DROP TABLE IF EXISTS pendiente;
DROP TABLE IF EXISTS miembro;
DROP TABLE IF EXISTS usuario;
DROP TABLE IF EXISTS grupo;

CREATE TABLE usuario(
    nombre VARCHAR(50) NOT NULL,
    saldo DECIMAL(14,2) DEFAULT 0,
    correo VARCHAR(50) NOT NULL,
    idValidador VARCHAR(64) DEFAULT NULL,
    bloqAprobados INT DEFAULT 0,
    bloqPropuestos INT DEFAULT 0,
    bloqRevisados INT DEFAULT 0,
    bloqValidados INT DEFAULT 0,
    PRIMARY KEY(nombre)
);


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



CREATE TABLE grupo (
  id int(11) NOT NULL AUTO_INCREMENT,
  nombre varchar(200) DEFAULT NULL,
  descripcion varchar(200) DEFAULT NULL,
  creacion datetime DEFAULT current_timestamp(),
  creador varchar(50) NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (creador) REFERENCES usuario (nombre) ON DELETE CASCADE ON UPDATE CASCADE
);



INSERT INTO grupo (nombre, descripcion, creador) VALUES
('Grupo 1', 'Descripcion de grupo 1', 'Usuario1'),
('Grupo 2', 'Descripcion de grupo 2', 'Usuario1'),
('Grupo 3', 'Descripcion de grupo 3', 'Usuario2'),
('Grupo 4', 'Descripcion de grupo 4', 'Usuario2');


CREATE TABLE miembro (
  idUsuario varchar(200) NOT NULL,
  idGrupo int(11) NOT NULL,
  PRIMARY KEY (idUsuario,idGrupo),
  FOREIGN KEY (idUsuario) REFERENCES usuario (nombre) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (idGrupo) REFERENCES grupo (id) ON DELETE CASCADE ON UPDATE CASCADE
);



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


CREATE TABLE pendiente (
  idUsuario varchar(200) NOT NULL,
  idGrupo int(11) NOT NULL,
  PRIMARY KEY (idUsuario,idGrupo),
  FOREIGN KEY (idUsuario) REFERENCES usuario (nombre) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (idGrupo) REFERENCES grupo (id) ON DELETE CASCADE ON UPDATE CASCADE
);



INSERT INTO pendiente (idUsuario, idGrupo) VALUES
('Usuario1', 3),
('Usuario3', 2),
('Usuario3', 4);



