const express = require('express');
const router = express.Router();

let comentarios = [
  {
    id: 1,
    nombre: 'Ana García',
    narrativa: 'La historia detrás del producto genera confianza inmediata en el comprador.',
    fecha: '2026-03-20'
  }
];

let nextId = 2;

/**
 * @param {express.Response} res 
 * @param {number} status 
 * @param {boolean} ok 
 * @param {any} data 
 * @param {string} [mensaje]
 */
const sendResponse = (res, status, ok, data, mensaje = '') => {
  return res.status(status).json({ ok, data, mensaje });
};

router.get('/comentarios', (req, res) => {
  const result = [...comentarios].reverse();
  sendResponse(res, 200, true, result);
});

router.post('/comentarios', (req, res) => {
  const { nombre, narrativa } = req.body;

  if (!nombre || !narrativa || nombre.length < 2 || narrativa.length < 10) {
    return sendResponse(res, 400, false, null, 'Datos inválidos o insuficientes');
  }

  const nuevo = {
    id: nextId++,
    nombre: nombre.trim(),
    narrativa: narrativa.trim(),
    fecha: new Date().toISOString().split('T')[0]
  };

  comentarios.push(nuevo);
  sendResponse(res, 201, true, nuevo);
});

module.exports = router;
