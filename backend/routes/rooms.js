const express = require('express');
const { body, validationResult } = require('express-validator');
module.exports = (pool) => {
  const router = express.Router();
  router.post('/rooms', [
    body('name').isString().notEmpty().withMessage('O nome do cômodo é obrigatório.'),
    body('description').isString().withMessage('A descrição deve ser um texto.')
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description } = req.body;
    try {
      const result = await pool.query(
        'INSERT INTO comodos (nome, descricao) VALUES ($1, $2) RETURNING *',
        [name, description]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error('ERRO AO CRIAR CÔMODO:', err);
      res.status(500).send('Erro interno do servidor.');
    }
  });
  router.get('/rooms', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM comodos ORDER BY id ASC');
      res.status(200).json(result.rows);
    } catch (err) {
      console.error('ERRO AO LISTAR CÔMODOS:', err);
      res.status(500).send('Erro interno do servidor.');
    }
  });
  router.put('/rooms/:id', [
    body('nome').isString().notEmpty().withMessage('O nome do cômodo é obrigatório.'),
    body('descricao').isString().withMessage('A descrição deve ser um texto.')
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { nome, descricao } = req.body;

    try {
      const result = await pool.query(
        'UPDATE comodos SET nome = $1, descricao = $2 WHERE id = $3 RETURNING *',
        [nome, descricao, id]
      );

      if (result.rowCount === 0) {
        return res.status(404).send('CÔMODO NÃO FOI ENCONTRADO!!!');
      }
      res.status(200).json(result.rows[0]);
    } catch (err) {
      console.error('ERRO AO ATUALIZAR O COMODO:', err);
      res.status(500).send('Erro interno do servidor.');
    }
  });

  // Endpoint para EXCLUIR um cômodo
  router.delete('/rooms/:id', async (req, res) => {
    const { id } = req.params;

    try {
      const result = await pool.query('DELETE FROM comodos WHERE id = $1 RETURNING *', [id]);
      if (result.rowCount === 0) {
        return res.status(404).send('CÔMODO NÃO ENCONTRADO.');
      }
      res.status(200).send('CÔMODO EXCLUIDO COM SUCESSO!');
    } catch (err) {
      console.error('ERRO AO EXCLUIR O CÔMODO:', err);
      res.status(500).send('Erro interno do servidor.');
    }
  });

  return router;
};
