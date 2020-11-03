const router = require("../routes/validador");
const mysqlConnection = require("../dataBase");
const { json } = require("express");
const cantGanadores = 2;
const stepTiempo = 15000;
var validadoresActivos = [];
var validadoresInactivos = [];
var validActiConfir = [];
var validInactConfir = [];
var ultimoHash = null;
var IO = null;
var tiempoValidadores = 0;
var inicio = 0;
var final = 0;
var reportados = null;
var castigo = 10;
var recompensa = 10;

const validadoresDefault = ["rockbandicoot", "1bandicoot"]

function revisarConfirmaciones() {
  const hash = confirmarHash();
  console.log('----Hash ganador----', hash);
  validInactConfir = validInactConfir.filter((element) =>
    hash === element.hashBlockchain
  );
  validActiConfir = validActiConfir.filter((element) =>
    hash === element.hashBlockchain
  );
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
  return null; 
}

function iniciarTorneo(miIo) {
  if (final !== inicio){
    final = Date.now();
    console.log('Tiempo transcurrido desde el último torneo:', Math.floor((final - inicio)/1000));
  }
  inicio = Date.now();
  if (IO == null) {
    IO = miIo;
  }
  solicitarValidadores();
}

function solicitarValidadores() {
  mysqlConnection.query(
    "select nombre, peerId, reputacion from usuario as u inner join validador as v on v.nombreValidador = u.nombre WHERE nombreValidador IS NOT NULL;",
    (err, validadores) => {
      if (!err) {
        randomSort(validadores);

        let participantes;
        validActiConfir = transformarValidadoresConf(validActiConfir, validadoresActivos);
        validInactConfir = transformarValidadoresConf(validInactConfir, validadoresInactivos);
        console.log('Activos confirmados', validActiConfir);
        console.log('Inactivos confirmados', validInactConfir);
        if (validActiConfir.length === 0 || validadoresActivos.length === 0) {
          validInactConfir = validadores;
          participantes = validadores;
        } else{
          participantes = validInactConfir.concat(validActiConfir);
        }
        //TO-DO: Verificar listas vacìas

        console.log("Candidatos: ");
        console.log(participantes);
        validadoresActivos = [];

        for (let i = 0; i < validadoresDefault.length; i++) {
          const element = validadoresDefault[i];
          const aux = participantes.filter((validador) => validador.nombre === element);
          if(aux.length > 0){
            participantes = participantes.filter((validador) => validador.nombre !== element);
            validadoresActivos.push(aux[0]);
          } 
        }

        validadoresActivos = validadoresActivos.concat(torneo(participantes));
        console.log('-----------------GANADORES--------------------');
        console.log(validadoresActivos);
        iniciarReportes();

        validadoresInactivos = [];
        for (const validador of validadores) {
          let encontrado = false;
          for (const activo of validadoresActivos) {
            if (validador['nombre'] === activo['nombre']){
              encontrado = true;
              break;
            }
          }
          if (!encontrado){
            validadoresInactivos.push(validador);
          }
        }

        tiempoValidadores = (validadoresActivos.length + 2) * stepTiempo;
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
    inicio: Date.now() + stepTiempo
  };
  validActiConfir = [];
  validInactConfir = [];
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
    return torneo(ganadores);
  }
}

function setValidadorStatus(validActivCopy, validadores, status) {
  if (validActivCopy.length === 0) {
    if (status) {
      notificarValidadores(validadores);
    } else {
      recompensarValidadores();
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

function getValidadores() {
  return validadores;
}

function notificarValidadorActivo(nombre, hashBlockchain) {
  console.log('El validador '+nombre+' confirma con hash '+hashBlockchain);
  if (esValidadorActivo(nombre)) {
    validActiConfir.push({ nombre: nombre, hashBlockchain: hashBlockchain });
  } else {
    if (esValidadorInactivo(nombre)) {
      validInactConfir.push({ nombre: nombre, hashBlockchain: hashBlockchain });
    }
  }
}

function esValidadorActivo(nombre) {
  if (validadoresActivos != null || validadoresActivos != undefined){
    const resultado = validadoresActivos.filter((element) => 
      nombre === element.nombre
    );
    if (resultado.length > 0) return true;
  }
  return false;
}

function esValidadorInactivo(nombre) {
  if (validadoresInactivos != null || validadoresInactivos != undefined){
    const resultado = validadoresInactivos.filter((element) =>
      nombre === element.nombre
    );
    if (resultado.length > 0) return true;
  }
  return false;
}

function transformarValidadoresConf(confirmados, validadores){
  const respuesta = [];
  for (const confirmado of confirmados) {
    respuesta.push(validadores.filter( validador => validador.nombre === confirmado.nombre )[0])
  }
  return respuesta;
}

function reportarValidador(validadorReportado) {
  if (reportados.has(validadorReportado)){
    reportados.set(validadorReportado, reportados.get(validadorReportado) + 1);
  }else{
    reportados.set(validadorReportado, 1);
  }
  if (reportados.get(validadorReportado) > validadoresActivos.length * 0.6){
    castigarValidador(validadorReportado);
  }
}

function castigarValidador(validadorReportado) {
  reportado = validadoresActivos.filter(v => v.nombre === validadorReportado)[0];
  mysqlConnection.query(
    "update usuario set reputacion = ? where nombre = ?",
    [reportado.reputacion - castigo, validadorReportado],
    (err, rows) => {
      if (!err) {
        console.log('Reputacion del validador '+validadorReportado+' disminuída');
      } else {
        console.log("error en dataBase");
      }
    }
  );
}

function iniciarReportes() {
  reportados = new Map();
  for (const validador of validadoresActivos) {
    reportados.set(validador.nombre, 0);
  }
}

function recompensarValidadores() {
  for (const validador of reportados.keys()){
    if (reportados.get(validador) === 0){
      recompensarValidador(validador);
    }
  }
}

function recompensarValidador(nombreValidador) {
  validador = validadoresActivos.filter(v => v.nombre === nombreValidador)[0];
  if (validador.reputacion < 100){
    mysqlConnection.query(
      "update usuario set reputacion = ? where nombre = ?",
      [validador.reputacion + recompensa, nombreValidador],
      (err, rows) => {
        if (!err) {
          console.log('Reputacion del validador '+nombreValidador+' aumentada');
        } else {
          console.log("error en dataBase");
        }
      }
    );
  }
}

exports.notificarValidadorActivo = notificarValidadorActivo;
exports.iniciarTorneo = iniciarTorneo;
exports.validadoresActivos = getValidadoresActivos;
exports.validadoresActivos = getValidadores;
exports.reportarValidador = reportarValidador;
