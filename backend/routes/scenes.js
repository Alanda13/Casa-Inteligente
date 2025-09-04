const express = require('express');
const { body, validationResult } = require('express-validator');

module.exports = (pool) => {
    const router = express.Router();
    const updateDeviceState = async (dispositivoId, newStateString) => {
        try {
            const newStateBoolean = newStateString === 'Ligado';
            await pool.query('UPDATE dispositivos SET estado = $1 WHERE id = $2', [newStateBoolean, dispositivoId]);
            console.log(`Dispositivo ID ${dispositivoId} atualizado para o estado: ${newStateString}`);
        } catch (error) {
            console.error(`Erro ao atualizar o dispositivo ID ${dispositivoId}:`, error);
        }
    };
    const runScene = async (cenaId) => {
        try {
            const result = await pool.query(
                'SELECT * FROM acoes_cena WHERE cena_id = $1 ORDER BY ordem ASC',
                [cenaId]
            );
            const acoesCena = result.rows;

            for (const acao of acoesCena) {
                if (acao.delay_segundos > 0) {
                    await new Promise(resolve => setTimeout(resolve, acao.delay_segundos * 1000));
                }
                await updateDeviceState(acao.dispositivo_id, acao.acao);
            }

            console.log(`Cena ${cenaId} executada com sucesso.`);
        } catch (err) {
            console.error('Erro ao executar a cena:', err);
        }
    };
    router.post('/scenes', [
        body('name').isString().notEmpty().withMessage('O nome da cena é obrigatório.'),
        body('ativa').isBoolean().withMessage('O estado "ativa" deve ser um booleano.')
    ], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, ativa } = req.body;
        try {
            const result = await pool.query(
                'INSERT INTO cenas (nome, ativa) VALUES ($1, $2) RETURNING *',
                [name, ativa]
            );
            res.status(201).json(result.rows[0]);
        } catch (err) {
            console.error('Erro ao criar a cena:', err);
            res.status(500).json({ error: 'Erro interno do servidor.' });
        }
    });
    router.get('/scenes', async (req, res) => {
        try {
            const result = await pool.query('SELECT * FROM cenas ORDER BY id ASC');
            res.status(200).json(result.rows);
        } catch (err) {
            console.error('Erro ao listar as cenas:', err);
            res.status(500).json({ error: 'Erro interno do servidor.' });
        }
    });
    router.put('/scenes/:id', [
        body('nome').isString().notEmpty().withMessage('O nome da cena é obrigatório.'),
        body('ativa').isBoolean().withMessage('O estado "ativa" deve ser um booleano.')
    ], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const { nome, ativa } = req.body;

        try {
            const result = await pool.query(
                'UPDATE cenas SET nome = $1, ativa = $2 WHERE id = $3 RETURNING *',
                [nome, ativa, id]
            );
            if (result.rowCount === 0) {
                return res.status(404).json({ error: 'Cena não encontrada.' });
            }
            res.status(200).json(result.rows[0]);
        } catch (err) {
            console.error('Erro ao atualizar a cena:', err);
            res.status(500).json({ error: 'Erro interno do servidor.' });
        }
    });

    // Endpoint para EXCLUIR uma cena
    router.delete('/scenes/:id', async (req, res) => {
        const { id } = req.params;

        try {
            const result = await pool.query('DELETE FROM cenas WHERE id = $1 RETURNING *', [id]);
            if (result.rowCount === 0) {
                return res.status(404).json({ error: 'Cena não encontrada.' });
            }
            res.status(200).json({ message: 'Cena excluída com sucesso.' });
        } catch (err) {
            console.error('Erro ao excluir a cena:', err);
            res.status(500).json({ error: 'Erro interno do servidor.' });
        }
    });

    // Endpoint para EXECUTAR uma cena (NÃO-BLOQUEADORA)
    router.post('/execute-scene', [
        body('cena_id').isInt().withMessage('O ID da cena deve ser um número inteiro.')
    ], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { cena_id } = req.body;
        
        // Inicia a execução da cena em segundo plano e responde imediatamente
        runScene(cena_id);
        
        res.status(200).json({ message: 'Cena iniciada com sucesso. A execução ocorrerá em segundo plano.' });
    });

    // Endpoint para CRIAR uma ação para a cena
    router.post('/scene-actions', [
        body('cena_id').isInt().withMessage('O ID da cena deve ser um número inteiro.'),
        body('dispositivo_id').isInt().withMessage('O ID do dispositivo deve ser um número inteiro.'),
        body('ordem').isInt().withMessage('A ordem deve ser um número inteiro.'),
        body('delay_segundos').isInt().withMessage('O delay deve ser um número inteiro.'),
        body('acao').isIn(['Ligado', 'Desligado']).withMessage('Ação inválida. Use "Ligado" ou "Desligado".')
    ], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { cena_id, dispositivo_id, ordem, delay_segundos, acao } = req.body;
        try {
            const cenaCheck = await pool.query('SELECT id FROM cenas WHERE id = $1', [cena_id]);
            if (cenaCheck.rowCount === 0) {
                return res.status(404).json({ error: 'Cena não encontrada.' });
            }
            const dispositivoCheck = await pool.query('SELECT id FROM dispositivos WHERE id = $1', [dispositivo_id]);
            if (dispositivoCheck.rowCount === 0) {
                return res.status(404).json({ error: 'Dispositivo não encontrado.' });
            }
            const result = await pool.query(
                'INSERT INTO acoes_cena (cena_id, dispositivo_id, ordem, delay_segundos, acao) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                [cena_id, dispositivo_id, ordem, delay_segundos, acao]
            );
            res.status(201).json(result.rows[0]);
        } catch (err) {
            console.error('Erro ao criar a ação da cena:', err);
            res.status(500).json({ error: 'Erro interno do servidor.' });
        }
    });

    // Endpoint para LISTAR TODAS as ações de UMA CENA
    router.get('/scene-actions/:id', async (req, res) => {
        const { id } = req.params;
        try {
            const result = await pool.query('SELECT * FROM acoes_cena WHERE cena_id = $1 ORDER BY ordem ASC', [id]);
            if (result.rowCount === 0) {
                return res.status(200).json([]);
            }
            res.status(200).json(result.rows);
        } catch (err) {
            console.error('Erro ao listar as ações da cena:', err);
            res.status(500).json({ error: 'Erro interno do servidor.' });
        }
    });
    router.put('/scene-actions/:id', [
        body('cena_id').isInt().withMessage('O ID da cena deve ser um número inteiro.'),
        body('dispositivo_id').isInt().withMessage('O ID do dispositivo deve ser um número inteiro.'),
        body('ordem').isInt().withMessage('A ordem deve ser um número inteiro.'),
        body('delay_segundos').isInt().withMessage('O delay deve ser um número inteiro.'),
        body('acao').isIn(['Ligado', 'Desligado']).withMessage('Ação inválida. Use "Ligado" ou "Desligado".')
    ], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const { cena_id, dispositivo_id, ordem, delay_segundos, acao } = req.body;

        try {
            const cenaCheck = await pool.query('SELECT id FROM cenas WHERE id = $1', [cena_id]);
            if (cenaCheck.rowCount === 0) {
                return res.status(404).json({ error: 'Cena não encontrada.' });
            }
            const dispositivoCheck = await pool.query('SELECT id FROM dispositivos WHERE id = $1', [dispositivo_id]);
            if (dispositivoCheck.rowCount === 0) {
                return res.status(404).json({ error: 'Dispositivo não encontrado.' });
            }
            const result = await pool.query(
                'UPDATE acoes_cena SET cena_id = $1, dispositivo_id = $2, ordem = $3, delay_segundos = $4, acao = $5 WHERE id = $6 RETURNING *',
                [cena_id, dispositivo_id, ordem, delay_segundos, acao, id]
            );

            if (result.rowCount === 0) {
                return res.status(404).json({ error: 'Ação de cena não encontrada.' });
            }

            res.status(200).json(result.rows[0]);
        } catch (err) {
            console.error('Erro ao atualizar a ação da cena:', err);
            res.status(500).json({ error: 'Erro interno do servidor.' });
        }
    });
    router.delete('/scene-actions/:id', async (req, res) => {
        const { id } = req.params;
        try {
            const result = await pool.query('DELETE FROM acoes_cena WHERE id = $1 RETURNING *', [id]);

            if (result.rowCount === 0) {
                return res.status(404).json({ error: 'AÇÃO DE CENA NÃO ENCONTRADA!' });
            }
            res.status(200).json({ message: 'AÇÃO DA CENA EXCLUIDA COM SUCESSO!' });
        } catch (err) {
            console.error('Erro ao excluir a ação da cena:', err);
            res.status(500).json({ error: 'Erro interno do servidor.' });
        }
    });

    return router;
};