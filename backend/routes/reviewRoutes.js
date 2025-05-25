const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const auth = require('../middleware/auth');

// @route   GET api/reviews
// @desc    Obter todas as avaliações
// @access  Public
router.get('/', async (req, res) => {
    try {
        const reviews = await Review.find()
            .sort({ createdAt: -1 })
            .populate('user', 'username');
        res.json(reviews);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

// @route   GET api/reviews/:id
// @desc    Obter uma avaliação por ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const review = await Review.findById(req.params.id).populate('user', 'username');

        if (!review) {
            return res.status(404).json({ message: 'Avaliação não encontrada' });
        }

        res.json(review);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Avaliação não encontrada' });
        }
        res.status(500).send('Erro no servidor');
    }
});

// @route   POST api/reviews
// @desc    Criar uma avaliação
// @access  Private
router.post('/', auth, async (req, res) => {
    const { gameTitle, rating, reviewText, gameImage } = req.body;

    try {
        const newReview = new Review({
            gameTitle,
            rating,
            reviewText,
            gameImage,
            user: req.user.id
        });

        const review = await newReview.save();

        // Retornar a avaliação com dados do usuário populados
        const populatedReview = await Review.findById(review._id).populate('user', 'username');

        res.json(populatedReview);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

// @route   PUT api/reviews/:id
// @desc    Atualizar uma avaliação
// @access  Private
router.put('/:id', auth, async (req, res) => {
    const { gameTitle, rating, reviewText, gameImage } = req.body;

    try {
        let review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ message: 'Avaliação não encontrada' });
        }

        // Verificar o usuário
        if (review.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Usuário não autorizado' });
        }

        // Atualizar campos
        if (gameTitle) review.gameTitle = gameTitle;
        if (rating) review.rating = rating;
        if (reviewText) review.reviewText = reviewText;
        if (gameImage) review.gameImage = gameImage;

        await review.save();

        res.json(review);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Avaliação não encontrada' });
        }
        res.status(500).send('Erro no servidor');
    }
});

// @route   DELETE api/reviews/:id
// @desc    Deletar uma avaliação
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ message: 'Avaliação não encontrada' });
        }

        // Verificar o usuário
        if (review.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Usuário não autorizado' });
        }

        await Review.findByIdAndDelete(req.params.id);

        res.json({ message: 'Avaliação removida com sucesso' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Avaliação não encontrada' });
        }
        res.status(500).send('Erro no servidor');
    }
});

// @route   GET api/reviews/user/:userid
// @desc    Obter avaliações de um usuário específico
// @access  Public
router.get('/user/:userid', async (req, res) => {
    try {
        const reviews = await Review.find({ user: req.params.userid })
            .sort({ createdAt: -1 })
            .populate('user', 'username');
        res.json(reviews);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

// @route   GET api/reviews/game/:gameTitle
// @desc    Obter avaliações de um jogo específico
// @access  Public
router.get('/game/:gameTitle', async (req, res) => {
    try {
        const reviews = await Review.find({
            gameTitle: new RegExp(req.params.gameTitle, 'i')
        })
            .sort({ createdAt: -1 })
            .populate('user', 'username');
        res.json(reviews);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

module.exports = router;
