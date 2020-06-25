const cors = require('cors');
 

var regex = new RegExp('/.*localhost.*');
var regex2 = new RegExp('.*')
var whitelist = [
    /.*/
]

var corsOptionsDelegate = function (origin, callback) {
    var corsOptions;
    if (whitelist.indexOf(origin) != -1) {
      corsOptions = { origin: true }
      console.log('ENTRO AL ORIGIN TRUE');
    } else {
      corsOptions = { origin: false }
      console.log('ENTRO AL ORIGIN FALSE');
    }
    callback(null, corsOptions);
  }


module.exports = corsOptionsDelegate;