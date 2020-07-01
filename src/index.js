const express = require('express');
const app = express();
const cors = require('cors');

//Configuracion acceso
app.set('port', process.env.PORT || 3000);
//Middlewares
app.use(cors());
app.use(express.json());
//Rutas
app.use(require('./routes/employees'));
app.use(require('./routes/votacion'));
app.use(require('./routes/grupo'));

//Iniciar
app.listen(3000, () =>{
    console.log('Server on port', app.get('port'))
});