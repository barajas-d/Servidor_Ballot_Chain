const jwt= require('jsonwebtoken')

const secretKey= '123456789'

function verificarToken(req, res, next)
{
    if(!req.headers.authorization)
    {
        return res.status(401).send('Solicitud no autorizada');
    }
    const token = req.headers.authorization.split(' ')[1];
    if(token == null)
    {
        return res.status(401).send('Solicitud no autorizada 2');
    }

    const datos= jwt.verify(token, secretKey)
    req.userId= datos._id;
    next();

}

module.exports = verificarToken;