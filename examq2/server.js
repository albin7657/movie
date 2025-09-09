require('dotenv').config
const express =require('express')
const mysql=require('mysql2')
const { createConnection } = require('net')
const app=express()

const connection=mysql.createConnection({
host:process.env.MYSQL_HOST,
user:process.env.MYSQL_USER,
password:process.env.MYSQL_PASSWORD,
database:process.env.MYSQL_DB,
})
app.get('/movies_db', (req, res) => {
  connection.query('SELECT * FROM movies ', (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});
app.post('/movies_db', (req, res) => {
  const { title, director, year } = req.body;
  if (!title || !director || !year) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  connection.query(
    'INSERT INTO movies (title, director, year) VALUES (?, ?, ?)',
    [title, director, year],
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.status(201).json({ id: results.insertId, title, director, year });
    }
  );
});

app.put('/movies_db/:id', (req, res) => {
  const { id } = req.params;
  const { title, director, year } = req.body;
  connection.query(
    'UPDATE movies SET title = ?, director = ?, year = ? WHERE id = ?',
    [title, director, year, id],
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: 'Movie not found' });
      }
      res.json({ id, title, director, year });
    }
  );
});
app.delete('/movies_db/:id', (req, res) => {
  const { id } = req.params;
  connection.query(
    'DELETE FROM movies WHERE id = ?',
    [id],
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: 'Movie not found' });
      }
      res.json({ message: 'Movie deleted' });
    }
  );
});
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
