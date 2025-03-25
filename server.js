const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors()); // Permite que o frontend acesse o backend
app.use(bodyParser.json()); // Permite receber JSON no body das requisições

// Conexão com o MySQL usando variáveis de ambiente
const conexao = mysql.createConnection({
    host: process.env.MYSQLHOST,       // Host do banco (variável do Railway)
    user: process.env.MYSQLUSER,       // Usuário do banco (variável do Railway)
    password: process.env.MYSQLPASSWORD,  // Senha do banco (variável do Railway)
    database: process.env.MYSQL_DATABASE,    // Nome do banco (variável do Railway)
    port: process.env.MYSQLPORT,        // Porta do banco (variável do Railway)
});


// Testando a conexão
conexao.connect((err) => {
    if (err) {
        console.error('Erro ao conectar no MySQL:', err);
        return;
    }
    console.log('Conexão com o banco de dados MySQL estabelecida!');
});

// 🔹 Rota para listar usuários
app.get('/usuarios', (req, res) => {
    conexao.query('SELECT id, nome, email FROM usuarios', (err, resultados) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(resultados);
        }
    });
});

// 🔹 Rota para adicionar usuário
app.post('/usuarios', (req, res) => {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha) {
        return res.status(400).json({ erro: 'Todos os campos são obrigatórios' });
    }

    const sql = 'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)';
    conexao.query(sql, [nome, email, senha], (err, resultado) => {
        if (err) {
            return res.status(500).json({ erro: 'Erro ao inserir usuário' });
        }
        res.status(201).json({ id: resultado.insertId, nome, email });
    });
});

// Iniciar o servidor na porta 3000
app.listen(3000, () => {
    console.log('🚀 Servidor rodando em http://localhost:3000');
});
