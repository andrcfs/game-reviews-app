const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Carregar variáveis de ambiente
dotenv.config();

// Inicializar Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Importar rotas
const userRoutes = require('./routes/userRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

// Usar rotas
app.use('/api/users', userRoutes);
app.use('/api/reviews', reviewRoutes);

// Rota de teste
app.get('/', (req, res) => {
    res.json({ message: 'API de Avaliação de Jogos funcionando!' });
});

// Conectar ao MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Conectado ao MongoDB'))
    .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Iniciar o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
