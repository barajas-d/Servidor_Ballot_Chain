const router = require("../routes/validador");
const mysqlConnection = require("../dataBase");
const { json } = require("express");
const cantGanadores = 2;
const stepTiempo = 60000;
var validadoresActivos = [];
var validadoresInactivos = null;
var validActiConfir = [];
var validInactConfir = [];
var ultimoHash = null;
var IO = null;
var tiempoValidadores = 0;

function revisarConfirmaciones() {
  const hash = confirmarHash();
  validInactConfir = validInactConfir.filter((element) => {
    hash === element.hashBlockchain;
  });
  setValidadorStatus(validadoresActivos.slice(), null, false);
}

function confirmarHash() {
  var mapa = new Map();
  for (var i = 0; i < validActiConfir.length; i++) {
    if (!mapa.has(validActiConfir[i].hashBlockchain)) {
      mapa.set(validActiConfir[i].hashBlockchain, 1);
    } else {
      var repeticiones = mapa.get(validActiConfir[i].hashBlockchain);
      mapa.set(validActiConfir[i].hashBlockchain, repeticiones + 1);
    }
  }
  var hashMayor;
  var repeticiones = 0;
  for (let [key, value] of mapa) {
    if (value >= repeticiones) {
      hashMayor = key;
      repeticiones = value;
    }
  }
  if (repeticiones >= Math.floor(validActiConfir.length * 0.6)) {
    return hashMayor;
  }
  return null; //TO-DO: ¿Que se hace en ese caso?
}
function iniciarTorneo(miIo) {
  console.log("Iniciando torneo...");
  if (IO == null) {
    IO = miIo;
  }
  solicitarValidadores();
}
function solicitarValidadores() {
  mysqlConnection.query(
    "select nombre, peerId, reputacion from usuario as u inner join validador as v on v.nombreValidador = u.nombre;",
    (err, validadores) => {
      if (!err) {
        randomSort(validadores);

        if (validadoresInactivos == null || validActiConfir.length === 0) {
          validInactConfir = validadores;
        }
        //TO-DO: Verificar listas vacìas

        console.log("Candidatos: ");
        console.log(validadores);
        validadoresActivos = torneo(validInactConfir.concat(validActiConfir));
        console.log("Terminando torneo...");
        tiempoValidadores = (validadoresActivos.length + 1) * stepTiempo;
        setValidadorStatus(validadoresActivos.slice(), validadores, true);
      } else {
      }
    }
  );
}

function notificarValidadores(validadores) {
  var objeto = {
    validadoresActivos: validadoresActivos,
    validadores: validadores,
    tiempo: stepTiempo,
  };

  IO.emit("torneo", JSON.stringify(objeto));
  setTimeout(revisarConfirmaciones, tiempoValidadores);
}
// tomado del algoritmo de Fisher–Yates de ordenamiento aleatorio
function randomSort(validadores) {
  for (var i = validadores.length - 1; i > 0; i--) {
    var ii = Math.floor(Math.random() * (i + 1));
    var aux = validadores[i];
    validadores[i] = validadores[ii];
    validadores[ii] = aux;
  }
}

function torneo(validadores) {
  console.log("validadores.length:" + validadores.length);
  console.log("cantGanadores: " + cantGanadores);
  if (cantGanadores >= validadores.length) {
    return validadores;
  } else {
    let ganadores = [];
    var i = 0;
    if (validadores.length % 2 === 1) {
      ganadores.push(validadores.pop());
    }
    while (i < validadores.length) {
      if (validadores[i].reputacion >= validadores[i + 1].reputacion) {
        ganadores.push(validadores[i]);
      } else {
        ganadores.push(validadores[i + 1]);
      }
      i += 2;
    }
    console.log("ganadores: ");
    console.log(ganadores);
    return torneo(ganadores);
  }
}
function setValidadorStatus(validActivCopy, validadores, status) {
  if (validActivCopy.length == 0) {
    if (status) {
      notificarValidadores(validadores);
    } else {
      iniciarTorneo();
    }
    return;
  }
  var validador = validActivCopy.pop();
  mysqlConnection.query(
    "update validador set isValidador = ? where peerId = ?",
    [status, validador.peerId],
    (err, rows) => {
      if (!err) {
        console.log("funciono");
        setValidadorStatus(validActivCopy, validadores, status);
      } else {
        console.log("error en dataBase");
      }
    }
  );
}

function getValidadoresActivos() {
  return validadoresActivos;
}

function notificarValidadorActivo(nombre, hashBlockchain) {
  if (esValidadorActivo(nombre)) {
    validActiConfir.push({ nombre: nombre, hashBlockchain: hashBlockchain });
  } else {
    if (esValidadorInactivo(nombre)) {
      validInactConfir.push({ nombre: nombre, hashBlockchain: hashBlockchain });
    }
  }
}

function esValidadorActivo(nombre) {
  const resultado = validadoresActivos.filter((element) => {
    nombre === element.nombre;
  });
  if (resultado.length > 0) return true;
  return false;
}
function esValidadorInactivo(nombre) {
  const resultado = validadoresInactivos.filter((element) => {
    nombre === element.nombre;
  });
  if (resultado.length > 0) return true;
  return false;
}
exports.notificarValidadorActivo = notificarValidadorActivo;
exports.iniciarTorneo = iniciarTorneo;
exports.validadoresActivos = getValidadoresActivos;
