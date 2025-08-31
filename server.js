const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 3000;

app.use(express.json());
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Casa_Inteligente',
  password: 'sextafeira',
  port: 5433,
});
// cria atrasp
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

app.get('/', (req, res) => {
  res.send('API de Domótica online!');
});
// Endpoint para CRIAR um novo cômodo 
app.post('/api/rooms', async (req, res) => {
  const { name, description } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO comodos (nome, descricao) VALUES ($1, $2) RETURNING *',
      [name, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('ERRO AO CRIAR COMODO:', err);
    res.status(500).send('Erro interno do servidor.');
  }
});

// Endpoint para LISTAR todos os cômodos 
app.get('/api/rooms', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM comodos ORDER BY id ASC');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('ERRO AO CRIAR CÔMODOS:', err);
        res.status(500).send('Erro interno do servidor.');
    }
});

// Endpoint para ATUALIZAR um cômodo 
app.put('/api/rooms/:id', async (req, res) => {
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
app.delete('/api/rooms/:id', async (req, res) => {
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
// Endpoint para CRIAR um novo dispositivo 
app.post('/api/devices', async (req, res) => {
  const { name, type, status, comodo_id } = req.body;
  try {
    const comodoCheck = await pool.query('SELECT id FROM comodos WHERE id = $1', [comodo_id]);
    if (comodoCheck.rowCount === 0) {
        return res.status(404).send('Cômodo não encontrado.');
    }
    const result = await pool.query(
      'INSERT INTO dispositivos (nome, tipo, estado, comodo_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, type, status, comodo_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao criar o dispositivo:', err);
    res.status(500).send('Erro interno do servidor.');
  }
});
// Endpoint para LISTAR todos os dispositivos 
app.get('/api/devices', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM dispositivos ORDER BY id ASC');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Erro ao listar os dispositivos:', err);
        res.status(500).send('Erro interno do servidor.');
    }
});
// Endpoint para ATUALIZAR um dispositivo 
app.put('/api/devices/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, tipo, estado, comodo_id } = req.body;

    try {
        const comodoCheck = await pool.query('SELECT id FROM comodos WHERE id = $1', [comodo_id]);
        if (comodoCheck.rowCount === 0) {
            //erro 404 (Não Encontrado)
            return res.status(404).send('Cômodo não encontrado.');
        }

        // 2. Se o comodo_id existe, tenta atualizar o dispositivo
        const result = await pool.query(
            'UPDATE dispositivos SET nome = $1, tipo = $2, estado = $3, comodo_id = $4 WHERE id = $5 RETURNING *',
            [nome, tipo, estado, comodo_id, id]
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
app.delete('/api/devices/:id', async (req, res) => {
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
// Endpoint para CRIAR uma nova cena 
app.post('/api/scenes', async (req, res) => {
    const { name, ativa } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO cenas (nome, ativa) VALUES ($1, $2) RETURNING *',
            [name, ativa]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao criar a cena:', err);
        res.status(500).send('Erro interno do servidor.');
    }
});
// Endpoint para LISTAR todas as cenas 
app.get('/api/scenes', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM cenas ORDER BY id ASC');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Erro ao listar as cenas:', err);
        res.status(500).send('Erro interno do servidor.');
    }
});
// Endpoint para ATUALIZAR uma cena
app.put('/api/scenes/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, ativa } = req.body;

    try {
        const result = await pool.query(
            'UPDATE cenas SET nome = $1, ativa = $2 WHERE id = $3 RETURNING *',
            [nome, ativa, id]
        );
        if (result.rowCount === 0) {
            return res.status(404).send('Cena não encontrada.');
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao atualizar a cena:', err);
        res.status(500).send('Erro interno do servidor.');
    }
});
// Endpoint para EXCLUIR uma cena
app.delete('/api/scenes/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('DELETE FROM cenas WHERE id = $1 RETURNING *', [id]);

        if (result.rowCount === 0) {
            return res.status(404).send('Cena não encontrada.');
        }
        
        res.status(200).send('Cena excluída com sucesso.');
    } catch (err) {
        console.error('Erro ao excluir a cena:', err);
        res.status(500).send('Erro interno do servidor.');
    }
});
// Endpoint para EXECUTAR uma cena 
app.post('/api/execute-scene', async (req, res) => {
    const { cena_id } = req.body;
    try {
        const result = await pool.query(
            'SELECT * FROM acoes_cena WHERE cena_id = $1 ORDER BY ordem ASC',
            [cena_id]
        );
        const acoesCena = result.rows;
        if (acoesCena.length === 0) {
            return res.status(404).send('Nenhuma ação encontrada para esta cena.');
        }
        for (const acao of acoesCena) {
            if (acao.delay_segundos > 0) {
                await delay(acao.delay_segundos * 1000); 
            }

            console.log(
                `Executando cena ${acao.cena_id}: ` +
                `Dispositivo ID ${acao.dispositivo_id} - Ação: ${acao.acao}`
            );
        }
        res.status(200).send(`Cena ${cena_id} executada com sucesso.`);
    } catch (err) {
        console.error('Erro ao executar a cena:', err);
        res.status(500).send('Erro interno do servidor.');
    }
});
// Endpoint para CRIAR uma ação para a cena 
app.post('/api/scene-actions', async (req, res) => {
    const { cena_id, dispositivo_id, ordem, delay_segundos, acao } = req.body;

    try {
        const cenaCheck = await pool.query('SELECT id FROM cenas WHERE id = $1', [cena_id]);
        if (cenaCheck.rowCount === 0) {
            return res.status(404).send('Cena não encontrada.');
        }
        const dispositivoCheck = await pool.query('SELECT id FROM dispositivos WHERE id = $1', [dispositivo_id]);
        if (dispositivoCheck.rowCount === 0) {
            return res.status(404).send('Dispositivo não encontrado.');
        }
        const result = await pool.query(
            'INSERT INTO acoes_cena (cena_id, dispositivo_id, ordem, delay_segundos, acao) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [cena_id, dispositivo_id, ordem, delay_segundos, acao]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao criar a ação da cena:', err);
        res.status(500).send('Erro interno do servidor.');
    }
});
// Endpoint para LISTAR TODAS as ações de UMA CENA
app.get('/api/scene-actions/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM acoes_cena WHERE cena_id = $1 ORDER BY ordem ASC', [id]);
        if (result.rowCount === 0) {
            return res.status(404).send('Nenhuma ação encontrada para esta cena.');
        }
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Erro ao listar as ações da cena:', err);
        res.status(500).send('Erro interno do servidor.');
    }
});
// Endpoint para ATUALIZAR uma ação da cena 
app.put('/api/scene-actions/:id', async (req, res) => {
    const { id } = req.params;
    const { cena_id, dispositivo_id, ordem, delay_segundos, acao } = req.body;

    try {
        // verifica se o cena_id existe no banco de dados
        const cenaCheck = await pool.query('SELECT id FROM cenas WHERE id = $1', [cena_id]);
        if (cenaCheck.rowCount === 0) {
            return res.status(404).send('Cena não encontrada.');
        }
        //  vai verificar se o dispositivo_id existe no banco de dados
        const dispositivoCheck = await pool.query('SELECT id FROM dispositivos WHERE id = $1', [dispositivo_id]);
        if (dispositivoCheck.rowCount === 0) {
            return res.status(404).send('Dispositivo não encontrado.');
        }
        //atualizar a ação de cena
        const result = await pool.query(
            'UPDATE acoes_cena SET cena_id = $1, dispositivo_id = $2, ordem = $3, delay_segundos = $4, acao = $5 WHERE id = $6 RETURNING *',
            [cena_id, dispositivo_id, ordem, delay_segundos, acao, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).send('Ação de cena não encontrada.');
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao atualizar a ação da cena:', err);
        res.status(500).send('Erro interno do servidor.');
    }
});

// Endpoint para DELETAR uma ação da cena 
app.delete('/api/scene-actions/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM acoes_cena WHERE id = $1 RETURNING *', [id]);

        if (result.rowCount === 0) {
            return res.status(404).send('AÇÃO DE CENA NÃO ENCONTRADA!');
        }
        res.status(200).send('AÇÃO DA CENA EXCLUIDA COM SUCESSO!');
    } catch (err) {
        console.error('Erro ao excluir a ação da cena:', err);
        res.status(500).send('Erro interno do servidor.');
    }
});

//inicia servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
