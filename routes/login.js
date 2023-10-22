const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('./models/user'); // Asegúrate de ajustar esta ruta al lugar correcto

const router = express.Router();

router.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Buscar usuario por correo electrónico
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(401).json({ message: 'Correo electrónico o contraseña inválidos' });
        }

        // Verificar si la cuenta está activa
        if (!user.active) {
            return res.status(401).json({ message: 'Cuenta no activada. Por favor, verifica tu correo electrónico.' });
        }

        // Verificar la contraseña
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Correo electrónico o contraseña inválidos' });
        }

        // Crear y enviar el token
        const token = jwt.sign({ userId: user._id }, 'SECRETO', { expiresIn: '1h' });
        res.status(200).json({ token: token });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;

