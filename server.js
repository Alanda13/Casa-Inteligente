// Importa o Express e a biblioteca do PostgreSQL
const express = require('express');
const { Pool } = require('pg');

// Cria uma instância do servidor Express
const app = express();
const port = 3000;

// Middleware para o servidor entender requisições em formato JSON
app.use(express.json());

// Configura a conexão com o banco de dados PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Casa_Inteligente',
  password: 'sextafeira',
  port: 5433,
});

// FUNÇÃO AUXILIAR para criar um atraso
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mensagem de teste para verificar se o servidor está funcionando
app.get('/', (req, res) => {
  res.send('API de Domótica online!');
});

// INÍCIO DOS ENDPOINTS DA API

// Endpoint para CRIAR um novo cômodo (POST /api/rooms)
app.post('/api/rooms', async (req, res) => {
  // Pega os dados do corpo da requisição
  const { name, description } = req.body;

  try {
    // Comando SQL para inserir um novo cômodo na tabela
    const result = await pool.query(
      'INSERT INTO comodos (nome, descricao) VALUES ($1, $2) RETURNING *',
      [name, description]
    );
    // Retorna o cômodo criado com status 201 (Created)
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao criar o cômodo:', err);
    res.status(500).send('Erro interno do servidor.');
  }
});

// Endpoint para LISTAR todos os cômodos (GET /api/rooms)
app.get('/api/rooms', async (req, res) => {
    try {
        // Comando SQL para selecionar todos os cômodos
        const result = await pool.query('SELECT * FROM comodos ORDER BY id ASC');
        // Retorna a lista de cômodos
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Erro ao listar os cômodos:', err);
        res.status(500).send('Erro interno do servidor.');
    }
});

// Endpoint para ATUALIZAR um cômodo (PUT /api/rooms/:id)
app.put('/api/rooms/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, descricao } = req.body;

    try {
        const result = await pool.query(
            'UPDATE comodos SET nome = $1, descricao = $2 WHERE id = $3 RETURNING *',
            [nome, descricao, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).send('Cômodo não encontrado.');
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao atualizar o cômodo:', err);
        res.status(500).send('Erro interno do servidor.');
    }
});

// Endpoint para EXCLUIR um cômodo (DELETE /api/rooms/:id)
app.delete('/api/rooms/:id', async (req, res) => {
    // Pega o ID do cômodo da URL
    const { id } = req.params;

    try {
        // Comando SQL para excluir o cômodo
        const result = await pool.query('DELETE FROM comodos WHERE id = $1 RETURNING *', [id]);

        // Verifica se o cômodo foi encontrado e excluído
        if (result.rowCount === 0) {
            return res.status(404).send('Cômodo não encontrado.');
        }

        // Retorna uma mensagem de sucesso
        res.status(200).send('Cômodo excluído com sucesso.');
    } catch (err) {
        console.error('Erro ao excluir o cômodo:', err);
        res.status(500).send('Erro interno do servidor.');
    }
});


// Endpoint para CRIAR um novo dispositivo (POST /api/devices)
app.post('/api/devices', async (req, res) => {
  // Pega os dados do corpo da requisição
  const { name, type, status, comodo_id } = req.body;

  try {
    // Comando SQL para inserir um novo dispositivo na tabela 'dispositivos'
    const result = await pool.query(
      'INSERT INTO dispositivos (nome, tipo, estado, comodo_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, type, status, comodo_id]
    );
    // Retorna o dispositivo criado com status 201 (Created)
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao criar o dispositivo:', err);
    res.status(500).send('Erro interno do servidor.');
  }
});

// Endpoint para LISTAR todos os dispositivos (GET /api/devices)
app.get('/api/devices', async (req, res) => {
    try {
        // Comando SQL para selecionar todos os dispositivos
        const result = await pool.query('SELECT * FROM dispositivos ORDER BY id ASC');
        // Retorna a lista de dispositivos
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Erro ao listar os dispositivos:', err);
        res.status(500).send('Erro interno do servidor.');
    }
});

// Endpoint para ATUALIZAR um dispositivo (PUT /api/devices/:id)
app.put('/api/devices/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, tipo, estado, comodo_id } = req.body;

    try {
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

// Endpoint para EXCLUIR um dispositivo (DELETE /api/devices/:id)
app.delete('/api/devices/:id', async (req, res) => {
    // Pega o ID do dispositivo da URL
    const { id } = req.params;

    try {
        // Comando SQL para excluir o dispositivo
        const result = await pool.query('DELETE FROM dispositivos WHERE id = $1 RETURNING *', [id]);

        // Verifica se o dispositivo foi encontrado e excluído
        if (result.rowCount === 0) {
            return res.status(404).send('Dispositivo não encontrado.');
        }

        // Retorna uma mensagem de sucesso
        res.status(200).send('Dispositivo excluído com sucesso.');
    } catch (err) {
        console.error('Erro ao excluir o dispositivo:', err);
        res.status(500).send('Erro interno do servidor.');
    }
});

// Endpoint para CRIAR uma nova cena (POST /api/scenes)
app.post('/api/scenes', async (req, res) => {
    // Pega os dados do corpo da requisição
    const { name, ativa } = req.body;

    try {
        // Comando SQL para inserir uma nova cena na tabela 'cenas'
        const result = await pool.query(
            'INSERT INTO cenas (nome, ativa) VALUES ($1, $2) RETURNING *',
            [name, ativa]
        );
        // Retorna a cena criada com status 201 (Created)
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao criar a cena:', err);
        res.status(500).send('Erro interno do servidor.');
    }
});

// Endpoint para LISTAR todas as cenas (GET /api/scenes)
app.get('/api/scenes', async (req, res) => {
    try {
        // Comando SQL para selecionar todas as cenas
        const result = await pool.query('SELECT * FROM cenas ORDER BY id ASC');
        // Retorna a lista de cenas
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Erro ao listar as cenas:', err);
        res.status(500).send('Erro interno do servidor.');
    }
});

// Endpoint para ATUALIZAR uma cena (PUT /api/scenes/:id)
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

// Endpoint para EXCLUIR uma cena (DELETE /api/scenes/:id)
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

// Endpoint para EXECUTAR uma cena (POST /api/execute-scene)
app.post('/api/execute-scene', async (req, res) => {
    const { cena_id } = req.body;

    try {
        // 1. Busca todas as ações de cena para o ID fornecido, ordenando-as
        const result = await pool.query(
            'SELECT * FROM acoes_cena WHERE cena_id = $1 ORDER BY ordem ASC',
            [cena_id]
        );

        const acoesCena = result.rows;

        if (acoesCena.length === 0) {
            return res.status(404).send('Nenhuma ação encontrada para esta cena.');
        }

        // 2. Itera sobre as ações e simula a execução com atraso
        for (const acao of acoesCena) {
            // Espera o tempo definido em `delay_segundos` antes de executar a ação
            if (acao.delay_segundos > 0) {
                await delay(acao.delay_segundos * 1000); // Converte segundos para milissegundos
            }

            console.log(
                `Executando cena ${acao.cena_id}: ` +
                `Dispositivo ID ${acao.dispositivo_id} - Ação: ${acao.acao}`
            );
        }
        
        // 3. Retorna uma mensagem de sucesso
        res.status(200).send(`Cena ${cena_id} executada com sucesso.`);

    } catch (err) {
        console.error('Erro ao executar a cena:', err);
        res.status(500).send('Erro interno do servidor.');
    }
});

// Endpoint para CRIAR uma ação para a cena (POST /api/scene-actions)
app.post('/api/scene-actions', async (req, res) => {
    // Pega os dados do corpo da requisição
    const { cena_id, dispositivo_id, ordem, delay_segundos, acao } = req.body;

    try {
        // Comando SQL para inserir a ação na tabela 'acoes_cena'
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


// FIM DOS ENDPOINTS DA API

// Inicia o servidor para escutar as requisições na porta definida
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});