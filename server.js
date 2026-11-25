const express = require('express');
const sql = require('mssql');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.json());

const config = {
    user: 'webuser',
    password: 'webpassword123!',
    server: '192.168.56.101',
    database: 'sis_db',
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

// 1. Serve static HTML files
app.use(express.static('public'));

sql.connect(config)
    .then(pool => {
    if (pool.connecting) console.log('Connecting to MSSQL...');
    if (pool.connected) console.log('Connected to MSSQL (sis_db)');
    })
    .catch(err => console.error('Database connection failed:', err));


app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Username and password are required.');
    }

    try {
        
        let request = new sql.Request()
        let result = await request
            .input('userParam', sql.VarChar, username)
            .input('passParam', sql.VarChar, password)
            .query('SELECT * FROM Users WHERE username = @userParam AND password = @passParam');
        
        if (result.recordset.length > 0) {
            res.status(200).json({ message: 'Login successful', user: username });
        } else {
            res.status(401).send('اسم المستخدم او كلمة المرور خاطئة');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Database connection error. Please try again later.');
    }
});


app.get('/api/students', async (req, res) => {
    try {
       const result = await sql.query`SELECT * FROM Students`;
        res.json(result.recordset);
    } catch (err) {
        console.error('SQL Error:', err.message);
        res.status(500).json({ error: 'Failed to retrieve student records' });
    }
});

// 4. Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});