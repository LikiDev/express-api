// models/user.js

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+\@.+\..+/, 'Email inválido'],
    },
    password: {
        type: String,
        required: true,
        select: false, // Para evitar devolver la contraseña en las consultas
    },
    bio: String,
    active: {
        type: Boolean,
        default: false,
    },
    createdAt: Date,
    updatedAt: Date,
});

// Antes de guardar, ciframos la contraseña
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

module.exports = mongoose.model('User', userSchema);
