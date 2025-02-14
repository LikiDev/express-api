const express = require('express');
const bodyParser = require('body-parser');
const employees = require('./data/employees.json');
//entrega2
const mongoose = require('mongoose');
const Post = require('./models/post'); 
//entrega3
const User = require('../models/user');
const bcrypt = require('bcrypt');

const authenticate = require('./middlewares/authenticate');
const postRoutes = require('./routes/posts');

const app = express();

app.use(express.json());


app.use(authenticate);
app.use('/api/posts', postRoutes);


// 1. GET /api/employees devuelve todos los empleados
app.get('/api/employees', (req, res) => {
    return res.json(employees);
});

// 2-3. GET /api/employees?page=N   devuelve el resultado paginado de 2 en 2
app.get('/api/employees', (req, res) => {
    const page = parseInt(req.query.page) || null;
    const pageSize = 2;

    if (page) {
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;

        const paginatedEmployees = employees.slice(startIndex, endIndex);

        if (paginatedEmployees.length === 0) {
            return res.json([]);
        }
        return res.json(paginatedEmployees);
    }
    res.json(employees);
});

// 4. GET /api/employees/oldest  devuelve el más viejo
app.get('/api/employees/oldest', (req, res) => {
    const oldest = [...employees].sort((a, b) => b.age - a.age)[0];
    return res.json(oldest);
});

// 5. GET /api/employees?user=true usuarios con privileges 'user' = true
app.get('/api/employees', (req, res) => {
    if (req.query.user) {
        const users = employees.filter(e => e.privileges === 'user');
        return res.json(users);
    }
});

// 6. POST /api/employees
app.post('/api/employees', (req, res) => {
    const newEmployee = req.body;

    if (!newEmployee.name || !newEmployee.age || !newEmployee.badges || !newEmployee.privileges) {
        return res.status(400).json({ "code": "bad_request" });
    }

    employees.push(newEmployee);
    return res.json(newEmployee);
});

// 7. GET /api/employees?badges=black
app.get('/api/employees', (req, res) => {
    if (req.query.badges) {
        const filteredEmployees = employees.filter(e => e.badges.includes(req.query.badges));
        return res.json(filteredEmployees);
    }
});

// 8. GET /api/employees/NAME
app.get('/api/employees/:name', (req, res) => {
    const employee = employees.find(e => e.name === req.params.name);
    if (!employee) {
        return res.status(404).json({ "code": "not_found" });
    }
    return res.json(employee);
});


//ENTREGA 2


// POST /api/posts
app.post('/api/posts', async (req, res) => {
    try {
        console.log(req.body);
        const post = new Post(req.body);
        await post.save();
        res.status(201).json(post);
    } catch (error) {
        console.log('ESTOY AQUI');
        res.status(400).json({ message: 'Error de la validación' });
    }
});

// GET /api/posts
app.get('/api/posts', async (req, res) => {
    try {
        const posts = await Post.find();
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// GET /api/posts/:id
app.get('/api/posts/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post no encontrado' });
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// PATCH /api/posts/:id
app.patch('/api/posts/:id', async (req, res) => {
    try {
        const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!post) return res.status(404).json({ message: 'Post no encontrado' });
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// DELETE /api/posts/:id
app.delete('/api/posts/:id', async (req, res) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post no encontrado' });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

app.listen(8000, () => {
    console.log('Server is running on port 8000');
});
