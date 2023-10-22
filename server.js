const express = require('express');
const bodyParser = require('body-parser');
const employees = require('./data/employees.json');

const app = express();

app.use(bodyParser.json());

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

app.listen(8000, () => {
    console.log('Server is running on port 8000');
});
