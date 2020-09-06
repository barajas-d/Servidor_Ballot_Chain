const NodeRSA = require('node-rsa');

var key = new nodeRSA({b: 1024});
var encryptPrivateKey = this.key.exportKey('private');
var encryptPublicKey = this.key.exportKey('public');
  
var signature = new nodeRSA({b: 1024});
var signaturePrivate = this.signature.exportKey('private');
var signaturePublic = this.signature.exportKey('public');


function getEncryptPublicKey(){
    return this.encryptPublicKey();
}

function encrypt(object){
    return this.key.encrypt(object, 'base64');
}

function decrypt(objectEncrypted){
    return this.key.decrypt(objectEncrypted, 'utf8');
}

function encryptExternal(externalPublicKey, object){
    let temporalyKey;
    temporalyKey = new nodeRSA(externalPublicKey);
    return temporalyKey.encrypt(object, 'base64');
}


//Firma Digital
function sign(object){
    return this.signature.sign(object, 'base64', 'base64');
}

function checkSing(objectUnsigned, objectSigned){
    return this.signature.verify(objectUnsigned, objectSigned, 'base64', 'base64');
}

exports.checkSing = checkSing;
exports.sign = sign;
exports.encryptExternal = encryptExternal;
exports.decrypt = decrypt;
exports.encrypt = encrypt;
exports.getEncryptPublicKey = getEncryptPublicKey;