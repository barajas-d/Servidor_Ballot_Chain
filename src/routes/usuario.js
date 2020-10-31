const express = require('express');
const cors = require('cors');
const router = express.Router();
const mysqlConnection = require('../dataBase');
const corsOptionsDelegate = require('../cors');
const jwt = require('jsonwebtoken');

const secretKey = '123456789';

router.post('/iniciarSesion', cors(corsOptionsDelegate), (req, res) => {
  const { nombre, contrasena } = req.body;
  mysqlConnection.query(
    'SELECT * FROM usuario WHERE nombre = ? AND contrasena = ?',
    [nombre, contrasena],
    (err, rows) => {
      if (!err) {
        const token = jwt.sign({ _id: nombre }, secretKey);
        if (rows.length >= 1) {
          res.json({ Status: 'sesion iniciada', token });
        } else {
          res.json({ Status: 'no hay cuentas asi' });
        }
      } else {
        console.log('error en dataBase');
      }
    }
  );
});

router.get(
  '/usuario',
  verificarToken,
  cors(corsOptionsDelegate),
  (req, res) => {
    mysqlConnection.query('SELECT * FROM usuario', (err, rows) => {
      if (!err) {
        res.json(rows);
      } else {
        console.log('error en dataBase');
      }
    });
  }
);

router.get(
  '/usuarioId',
  verificarToken,
  cors(corsOptionsDelegate),
  (req, res) => {
    const nombre = req.userId;
    mysqlConnection.query(
      'SELECT * FROM usuario WHERE nombre = ?',
      [nombre],
      (err, rows, fields) => {
        if (!err) {
          res.json(rows[0]);
        } else {
          console.log(err);
        }
      }
    );
  }
);

router.get('/usuario-existe/:nombre', cors(corsOptionsDelegate), (req, res) => {
  const nombre = req.params.nombre;

  mysqlConnection.query(
    'SELECT * FROM usuario WHERE nombre = ?',
    [nombre],
    (err, rows, fields) => {
      if (!err) {
        if (rows.length > 0) {
          res.json(true);
        } else {
          res.json(false);
        }
      } else {
        res.json(false);
      }
    }
  );
});

router.put(
  '/usuarioPut',
  verificarToken,
  cors(corsOptionsDelegate),
  (req, res) => {
    const nombreId = req.userId;
    const { nombre, saldo, correo } = req.body;
    const query =
      'UPDATE usuario SET nombre = ?, saldo = ?, correo = ? WHERE nombre = ?';
    mysqlConnection.query(
      query,
      [nombre, saldo, correo, nombreId],
      (err, rows, fields) => {
        if (!err) {
          if (rows.affectedRows == 0) {
            res.json({ Status: 'No existe el usuario ' + nombreId });
          } else {
            const token = jwt.sign({ _id: nombre }, secretKey);
            res.json({ Status: 'Usuario actualizado ' + nombreId, token });
          }
        } else {
          console.log(err);
        }
      }
    );
  }
);

router.post('/usuarioAdd', cors(corsOptionsDelegate), (req, res) => {
  const { nombre, correo, contrasena } = req.body;
  const token = jwt.sign({ _id: nombre }, secretKey);
  const query =
    'INSERT INTO usuario ( nombre, correo, contrasena ) VALUES (?, ?, ?)';
  mysqlConnection.query(
    query,
    [nombre, correo, contrasena],
    (err, rows, fields) => {
      if (!err) {
        res.json({ Status: 'usuario guardado', token });
      } else {
        console.log(err);
      }
    }
  );
});

router.get(
  '/privado',
  verificarToken,
  cors(corsOptionsDelegate),
  (req, res) => {
    console.log('id del usuario (por ahora es el nombre): ' + req.userId);
    res.json({
      Status: 'Información privada que posiblemente te lleve a la carcel D:',
    });
  }
);

router.get('/publico', cors(corsOptionsDelegate), (req, res) => {
  res.json({
    Status:
      'Información Family Friendly para que puedas ganar mas plata en youtubi ;v',
  });
});

router.get(
  '/validar-token',
  verificarToken,
  cors(corsOptionsDelegate),
  (req, res) => {
    res.json('Solicitud autorizada');
  }
);

function verificarToken(req, res, next) {

    if (!req.headers.authorization) {
      return res.status(401).send('Solicitud no autorizada');
    }

    const token = req.headers.authorization.split(' ')[1];
    if (token == null) {
      return res.status(401).send('Solicitud no autorizada');
    }
    const datos = jwt.verify(token, secretKey);
    req.userId = datos._id;
    mysqlConnection.query(
      'SELECT * FROM usuario WHERE nombre = ?',
      [req.userId],
      (err, rows, fields) => {
        if (!err) {
          if (rows.length > 0) {
            next();
          } else {
            res.status(401).send('Solicitud no autorizada')
          }
        } else {
            res.status(401).send('Solicitud no autorizada')
        }
      }
    );
}

module.exports = router;
