// require('dotenv').config;
const express = require('express');
const pool = require('./db');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/todos/:userEmail', async (req, res) => {
    const { userEmail } = req.params;
    try {
        const todos = await pool.query(
            'SELECT * FROM todos WHERE user_email = $1',
            [userEmail]
        );
        res.json(todos.rows);
    } catch (err) {
        res.send(err);
    }
});

app.post('/todos', async (req, res) => {
    const { user_email, title, progress, date } = req.body;
    console.log(user_email, title, progress, date);
    const id = uuidv4();
    try {
        const todos = await pool.query(
            `INSERT INTO todos (id,user_email,title,progress,date) VALUES ($1,$2,$3,$4,$5)`,
            [id, user_email, title, progress, date]
        );
        res.json(todos.rows);
    } catch (err) {
        console.error(err);
    }
});

app.put('/todos/:id', async (req, res) => {
    const { user_email, title, progress, date } = req.body;
    const id = req.params.id;
    console.log(id, user_email, title, progress, date);

    try {
        const todos = await pool.query(
            `UPDATE todos SET user_email=$2 , title=$3, progress=$4, date=$5 WHERE id=$1`,
            [id, user_email, title, progress, date]
        );
        res.json(todos.rows);
    } catch (err) {
        console.error(err);
    }
});

app.delete('/todos/:id', async (req, res) => {
    const { user_email, title, progress, date } = req.body;
    const id = req.params.id;
    console.log(id, user_email, title, progress, date);

    try {
        const todos = await pool.query(`DELETE FROM todos WHERE id=$1`, [id]);
        res.json(todos.rows);
    } catch (err) {
        console.error(err);
    }
});

app.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    try {
        const salt = bcrypt.genSaltSync(10);
        const hashedPass = bcrypt.hashSync(password, salt);

        await pool.query(`INSERT INTO users (email,password) VALUES ($1,$2)`, [
            email,
            hashedPass,
        ]);

        const token = jwt.sign({ email }, 'secret', { expiresIn: '1hr' });

        res.json({ email, token });
    } catch (err) {
        res.json({ detail: err.detail });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [
            email,
        ]);
        if (!user.rows.length)
            return res.json({ detail: 'User Does Not Exists' });

        const succes = await bcrypt.compare(password, user.rows[0].password);
        const token = jwt.sign({ email }, 'secret', { expiresIn: '1hr' });
        if (succes) {
            res.json({ email: user.rows[0].email, token });
        } else {
            res.json({ detail: 'Invalid Creentials' });
        }
    } catch (err) {
        console.error(err);
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server Running on port: ${PORT}`));
