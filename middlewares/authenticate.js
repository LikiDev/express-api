const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No estás autenticado' });
    }

    try {
        const decodedToken = jwt.verify(token, 'SECRETO');
        req.userId = decodedToken.userId;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token inválido' });
    }
};
