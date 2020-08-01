const jwt= require('jsonwebtoken')

const secretKey= '123456789'

function verificarToken(req, res, next)
{
    //console.log(req.headers.authorization);
    if(!req.headers.authorization)
    {
        return res.status(401).send('Solicitud no autorizada');
    }
    const token = req.headers.authorization.split(' ')[1];
    if(token == null)
    {
        return res.status(401).send('Solicitud no autorizada 2');
    }
    //console.log('token: '+ token)

    const datos= jwt.verify(token, secretKey)
    //console.log(datos);
    req.userId= datos._id;
    console.log(req.userId)
    next();

}

module.exports = verificarToken;