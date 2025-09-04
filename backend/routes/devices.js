const express = require('express');
const { body, validationResult } = require('express-validator');

module.exports = (pool) => {
    const router = express.Router();
    router.post('/devices', [
        body('nome').isString().notEmpty().withMessage('O nome do dispositivo é obrigatório.'),
        body('tipo').isString().notEmpty().withMessage('O tipo do dispositivo é obrigatório.'),
        body('estado').isIn(['Ligado', 'Desligado']).withMessage('O estado deve ser "Ligado" ou "Desligado".'),
        body('comodo_id').isInt().withMessage('O ID do cômodo deve ser um número inteiro.')
    ], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { nome, tipo, estado, comodo_id } = req.body;
        const estadoBoolean = estado === 'Ligado';
        
        try {
            const comodoCheck = await pool.query('SELECT id FROM comodos WHERE id = $1', [comodo_id]);
            if (comodoCheck.rowCount === 0) {
                return res.status(404).send('Cômodo não encontrado.');
            }
            const result = await pool.query(
                'INSERT INTO dispositivos (nome, tipo, estado, comodo_id) VALUES ($1, $2, $3, $4) RETURNING *',
                [nome, tipo, estadoBoolean, comodo_id]
            );
            res.status(201).json(result.rows[0]);
        } catch (err) {
            console.error('Erro ao criar o dispositivo:', err);
            res.status(500).send('Erro interno do servidor.');
        }
    });

    // Endpoint para LISTAR todos os dispositivos, incluindo o nome do cômodo
    router.get('/devices', async (req, res) => {
        try {
            const result = await pool.query('SELECT d.*, c.nome AS nome_comodo FROM dispositivos d JOIN comodos c ON d.comodo_id = c.id ORDER BY d.id ASC');
            res.status(200).json(result.rows);
        } catch (err) {
            console.error('ERRO AO LISTAR DISPOSITIVOS:', err);
            res.status(500).send('Erro interno do servidor.');
        }
    });

    router.put('/devices/:id', [
        body('nome').isString().notEmpty().withMessage('O nome do dispositivo é obrigatório.'),
        body('tipo').isString().notEmpty().withMessage('O tipo do dispositivo é obrigatório.'),
        body('estado').isIn(['Ligado', 'Desligado']).withMessage('O estado deve ser "Ligado" ou "Desligado".'),
        body('comodo_id').isInt().withMessage('O ID do cômodo deve ser um número inteiro.')
    ], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const { nome, tipo, estado, comodo_id } = req.body;
        const estadoBoolean = estado === 'Ligado';

        try {
            const comodoCheck = await pool.query('SELECT id FROM comodos WHERE id = $1', [comodo_id]);
            if (comodoCheck.rowCount === 0) {
                return res.status(404).send('Cômodo não encontrado.');
            }
            const result = await pool.query(
                'UPDATE dispositivos SET nome = $1, tipo = $2, estado = $3, comodo_id = $4 WHERE id = $5 RETURNING *',
                [nome, tipo, estadoBoolean, comodo_id, id]
            );

            if (result.rowCount === 0) {
                return res.status(404).send('Dispositivo não encontrado.');
            }
            res.status(200).json(result.rows[0]);
        } catch (err) {
            console.error('Erro ao atualizar o dispositivo:', err);
            res.status(500).send('Erro interno do servidor.');
        }
    });

    // Endpoint para EXCLUIR um dispositivo
    router.delete('/devices/:id', async (req, res) => {
        const { id } = req.params;

        try {
            const result = await pool.query('DELETE FROM dispositivos WHERE id = $1 RETURNING *', [id]);
            if (result.rowCount === 0) {
                return res.status(404).send('Dispositivo não encontrado.');
            }
            res.status(200).send('Dispositivo excluído com sucesso.');
        } catch (err) {
            console.error('Erro ao excluir o dispositivo:', err);
            res.status(500).send('Erro interno do servidor.');
        }
    });

    return router;
};