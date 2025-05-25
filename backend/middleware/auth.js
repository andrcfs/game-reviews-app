const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // Obter token do header
    const token = req.header('x-auth-token');

    // Verificar se não há token
    if (!token) {
        return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
    }

    // Verificar token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token inválido' });
    }
};
