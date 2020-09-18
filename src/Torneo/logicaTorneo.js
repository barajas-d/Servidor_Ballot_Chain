const router = require("../routes/validador");
const mysqlConnection = require("../dataBase");
const { json } = require("express");
const cantGanadores= 2
const stepTiempo= 10000;
var validadoresActivos= [];
var validadoresInactivos= [];
var validActiConfir=[];
var validInactConfir=[];
var ultimoHash=null;

function revisarConfirmaciones(){
  const hash = confirmarHash();
  validInactConfir= validInactConfir.filter(element => {hash === element.hashBlockchain});
}

function confirmarHash(){
  var mapa= new Map();
  for(var i = 0; i < validActiConfir.length ; i++){
    if(!mapa.has(validActiConfir[i].hashBlockchain)){
      mapa.set(validActiConfir[i].hashBlockchain, 1);
    }else{
      var repeticiones = mapa.get(validActiConfir[i].hashBlockchain);
      mapa.set(validActiConfir[i].hashBlockchain, repeticiones+1 );
    }
  }
  var hashMayor;
  var repeticiones=0;
  for (let [key, value] of mapa) {
    if(value >= repeticiones){
      hashMayor=key;
      repeticiones= value;
    }
  }
  if(repeticiones >= Math.floor(validActiConfir.length*0.60) ){
    return hashMayor;
  }
  return null;  //TO-DO: ¿Que se hace en ese caso?
}
function iniciarTorneo( miIo) {
  console.log("Iniciando torneo...");
  solicitarValidadores(miIo);
}
function solicitarValidadores(miIo) {
  mysqlConnection.query(
    "select nombre, peerId, reputacion from usuario as u inner join validador as v on v.nombreValidador = u.nombre;",
    (err, validadores) => {
      if (!err) {
        randomSort(validadores);
        validadoresInactivos=validadores;

        console.log('Candidatos: ');
        console.log(validadores);
        validadoresActivos = torneo(validadores);
        console.log("Terminando torneo...");
        tiempoValidadores= (validadoresActivos.length+1)* stepTiempo
        notificarValidadores(miIo, validadores);
        setTimeout(iniciarTorneo, tiempoValidadores, miIo);
      } else {
      }
    }
  );
}

function notificarValidadores(miIo, validadores)
{
  var objeto ={validadoresActivos : validadoresActivos,
                validadores: validadores,
                tiempo : stepTiempo};
  
  miIo.emit('torneo', JSON.stringify(objeto));
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
  console.log('validadores.length:'+ validadores.length);
  console.log('cantGanadores: '+cantGanadores)
  if(cantGanadores>= validadores.length)
  {
      return validadores;
  }else{
    let ganadores=[];
    var i = 0;
    if(validadores.length % 2 === 1){
        ganadores.push(validadores.pop());
    }
    while (i < validadores.length) {
        if (validadores[i].reputacion >= validadores[i + 1].reputacion) {
            ganadores.push(validadores[i]);
        } else {
            ganadores.push(validadores[i+1]);
        }
        i += 2;
      }
      console.log('ganadores: ');
      console.log( ganadores);
    return torneo(ganadores);
    
  }
}

function getValidadoresActivos() {
  return validadoresActivos;
}

function notificarValidadorActivo(nombre, hashBlockchain){
  if(esValidadorActivo(nombre)){
    validActiConfir.push({nombre: nombre,
                          hashBlockchain: hashBlockchain});
  }else{
    if(esValidadorInactivo(nombre)){
      validInactConfir.push({nombre: nombre,
                            hashBlockchain: hashBlockchain});
    }
  }
}


function esValidadorActivo(nombre){
  const resultado=validadoresActivos.filter(element => {nombre === element.nombre});
  if(resultado.length>0)
    return true;
  return false;
}
function esValidadorInactivo(nombre){
  const resultado=validadoresInactivos.filter(element => {nombre === element.nombre});
  if(resultado.length>0)
    return true;
  return false;
}
exports.notificarValidadorActivo = notificarValidadorActivo;
exports.iniciarTorneo = iniciarTorneo;
exports.validadoresActivos = getValidadoresActivos;
