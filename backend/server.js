const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const roomsRouter = require('./routes/rooms');
const devicesRouter = require('./routes/devices');
const scenesRouter = require('./routes/scenes');

const app = express();
const port = 3000;

// Middleware para habilitar o CORS
app.use(cors());

// Middleware para processar JSON
app.use(express.json());

// Configuração do pool de conexões com o banco de dados
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Casa_Inteligente',
  password: 'sextafeira',
  port: 5433,
});

app.get('/', (req, res) => {
  res.send('API de Domótica online!');
});
app.use('/api', roomsRouter(pool));
app.use('/api', devicesRouter(pool));
app.use('/api', scenesRouter(pool));

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});