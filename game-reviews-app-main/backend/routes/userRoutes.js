const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware de autenticação
const auth = require('../middleware/auth');

// @route   POST api/users/register
// @desc    Registrar um usuário
// @access  Public
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Verificar se o usuário já existe
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'Usuário já existe' });
        }

        user = new User({
            username,
            email,
            password
        });

        await user.save();

        // Criar JWT
        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1d' },
            (err, token) => {
                if (err) throw err;
                res.json({
                    token,
                    user: {
                        _id: user._id,
                        username: user.username,
                        email: user.email
                    }
                });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

// @route   POST api/users/login
// @desc    Autenticar usuário e obter token
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Verificar se o usuário existe
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Credenciais inválidas' });
        }

        // Verificar senha
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Credenciais inválidas' });
        }

        // Criar JWT
        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1d' },
            (err, token) => {
                if (err) throw err;
                res.json({
                    token,
                    user: {
                        _id: user._id,
                        username: user.username,
                        email: user.email
                    }
                });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

// @route   GET api/users/me
// @desc    Obter dados do usuário atual
// @access  Private
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

module.exports = router;
