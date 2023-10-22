const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./models/user'); // Asegúrate de ajustar esta ruta al lugar correcto

const router = express.Router();

router.post('/api/users', async (req, res) => {
    try {
        const { name, email, password, bio } = req.body;

        // Verificar si el correo electrónico ya está registrado
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'El correo electrónico ya está registrado.' });
        }

        // Cifrar la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear un nuevo usuario
        const user = new User({
            name,
            email,
            password: hashedPassword,
            bio,
            active: false // Por defecto, el usuario estará inactivo
        });

        await user.save();

        // En un entorno real, aquí enviaríamos un correo electrónico al usuario con un enlace para confirmar su registro
        const token = jwt.sign({ userId: user._id }, 'SECRETO', { expiresIn: '1h' });
        const confirmationLink = `http://localhost:3000/api/users/confirm/${token}`;

        console.log(`Link de confirmación: ${confirmationLink}`);

        res.status(201).json({ message: 'Usuario registrado con éxito.', confirmationLink });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Endpoint para confirmar el registro del usuario
router.get('/api/users/confirm/:token', async (req, res) => {
    try {
        const { token } = req.params;
        
        // Verificar el token
        const decoded = jwt.verify(token, 'SECRETO');
        
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(400).json({ message: 'Usuario no encontrado.' });
        }

        // Activar el usuario
        user.active = true;
        await user.save();

        res.status(200).json({ message: 'Registro confirmado con éxito. Ahora puedes iniciar sesión.' });
    } catch (error) {
        res.status(400).json({ message: 'Error al confirmar el registro.', error: error.message });
    }
});

module.exports = router;
