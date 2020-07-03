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
app.use(require('./routes/participante'));
app.use(require('./routes/opcion'));
app.use(require('./routes/credencial'));
app.use(require('./routes/usuario'));
//Iniciar
app.listen(3000, () =>{
    console.log('Server on port', app.get('port'))
});