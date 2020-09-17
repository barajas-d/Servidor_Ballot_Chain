const router = require("../routes/validador");
const mysqlConnection = require("../dataBase");
const { json } = require("express");
const cantGanadores= 2
var validadoresActivos;

function iniciarTorneo(tiempo) {
  console.log("Iniciando torneo...");
  //TO-DO: Pedir la lista de validador y los usuarios relacionados
  solicitarValidadores();
  setTimeout(iniciarTorneo, 10000);
}
function solicitarValidadores() {
  mysqlConnection.query(
    "select nombre, peerId, reputacion from usuario as u inner join validador as v on v.nombreValidador = u.nombre;",
    (err, validadores) => {
      if (!err) {
        randomSort(validadores);
        console.log('Candidatos: ');
        console.log(validadores);
        validadoresActivos = torneo(validadores);
        console.log("Terminando torneo...");
      } else {
      }
    }
  );
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

exports.iniciarTorneo = iniciarTorneo;
exports.validadoresActivos = getValidadoresActivos;
