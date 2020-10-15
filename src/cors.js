const cors = require('cors');
 

var regex = new RegExp('/.*localhost.*');
var regex2 = new RegExp('.*')
var whitelist = [
    'http://186.81.169.18:4200',
    'http://localhost:4200'
]

var corsOptionsDelegate = {
    origin: function (origin, callback) {
    console.log('origin: ' + origin);
     if (whitelist.indexOf(origin) !== -1) {
      //console.log('ENTRO AL ORIGIN TRUE'); */
      callback(null, true);
     } else {
      //console.log('ENTRO AL ORIGIN FALSE');
      callback('Deny CORS', false);
    }
  }
}


module.exports = corsOptionsDelegate;