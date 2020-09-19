const NodeRSA = require('node-rsa');

var key = new NodeRSA({b: 1024});
var encryptPrivateKey = key.exportKey('private');
var encryptPublicKey = key.exportKey('public');
  
var  signature = new NodeRSA({b: 1024});
var signaturePrivate = signature.exportKey('private');
var signaturePublic = signature.exportKey('public');


function getEncryptPublicKey(){
    return encryptPublicKey;
}

function encrypt(object){
    return key.encrypt(object, 'base64');
}

function decrypt(objectEncrypted){
    return key.decrypt(objectEncrypted, 'utf8');
}

function encryptExternal(externalPublicKey, object){
    let temporalyKey;
    temporalyKey = new nodeRSA(externalPublicKey);
    return temporalyKey.encrypt(object, 'base64');
}


//Firma Digital
function sign(object){
    return signature.sign(object, 'base64', 'base64');
}

function getSignaturePublic(){
    return signature.exportKey('public');
}

function checkSing(objectUnsigned, objectSigned, singKey){
    var temporalSignature;
    temporalSignature = new NodeRSA(singKey);
    return temporalSignature.verify(objectUnsigned, objectSigned, 'base64', 'base64');
}

exports.checkSing = checkSing;
exports.sign = sign;
exports.getSignaturePublic = getSignaturePublic;
exports.encryptExternal = encryptExternal;
exports.decrypt = decrypt;
exports.encrypt = encrypt;
exports.getEncryptPublicKey = getEncryptPublicKey;