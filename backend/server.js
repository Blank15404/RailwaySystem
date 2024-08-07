const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Update your DB password
    database: 'railwaydb',
});

db.connect((err) => {
    if (err) throw err;
    console.log('Database connected');
});

// Middleware to verify JWT tokens
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, 'your_secret_key', (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Register route
app.post('/register', async (req, res) => {
  const { userId, password, confirmPassword, phoneNumber, email, name, role } = req.body;

  if (!userId || !password || !confirmPassword || !phoneNumber || !email || !name || !role) {
      return res.status(400).send('All fields are required');
  }

  if (password !== confirmPassword) {
      return res.status(400).send('Passwords do not match');
  }

  db.query('SELECT * FROM users WHERE user_id = ?', [userId], async (err, results) => {
      if (err) {
          console.error('Error querying the database:', err);
          return res.status(500).send('Registration failed');
      }
      if (results.length > 0) {
          return res.status(400).send('User ID already exists');
      }

      try {
          const hashedPassword1 = await bcrypt.hash(password, 10);
          const hashedPassword2 = await bcrypt.hash(confirmPassword, 10);

          db.query('INSERT INTO users (user_id, password, confirm_password, phone_number, email, name, role) VALUES (?, ?, ?, ?, ?, ?, ?)',
              [userId, hashedPassword1, hashedPassword2, phoneNumber, email, name, role],
              (err) => {
                  if (err) {
                      console.error('Error inserting into the database:', err);
                      return res.status(500).send('Registration failed');
                  }
                  res.send('Registration successful');
              });
      } catch (error) {
          console.error('Error hashing passwords:', error);
          res.status(500).send('Registration failed');
      }
  });
});

// Login route
app.post('/login', (req, res) => {
    const { userId, password } = req.body;

    db.query('SELECT * FROM users WHERE user_id = ?', [userId], async (err, results) => {
        if (err) return res.status(500).send('Login failed');
        if (results.length === 0) return res.status(400).send('User ID not found');

        const user = results[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).send('Password incorrect');

        const accessToken = jwt.sign({ userId: user.user_id, role: user.role }, 'your_secret_key');
        res.json({ accessToken });
    });
});

app.get('/trains', (req, res) => {
    const { source, destination } = req.query;
    const query = 'SELECT * FROM trains WHERE Source = ? AND Destination = ?';
  
    db.query(query, [source, destination], (err, results) => {
      if (err) {
        console.error('Failed to fetch trains:', err);
        res.status(500).send('Server error');
        return;
      }
      res.json(results);
    });
  });

// Book train route
app.post('/bookings', (req, res) => {
    const { user_id, train_id, date } = req.body;
    //console.log(user_id)
    const checkSeatsQuery = 'SELECT Seat_available FROM trains WHERE Train_ID = ?';
    const bookQuery = 'INSERT INTO bookings (User_ID, Train_ID, Train_Name, Date, Status, Created_at, Updated_at) VALUES (?, ?, (SELECT Train_Name FROM trains WHERE Train_ID = ?), ?, "pending", NOW(), NOW())';
    const updateSeatsQuery = 'UPDATE trains SET Seat_available = Seat_available - 1 WHERE Train_ID = ? AND Seat_available > 0';
  
    db.beginTransaction(err => {
      if (err) {
        console.error('Failed to start transaction:', err);
        res.status(500).send('Server error');
        return;
      }
  
      db.query(checkSeatsQuery, [train_id], (error, results) => {
        if (error) {
          return db.rollback(() => {
            console.error('Failed to check seat availability:', error);
            res.status(500).send('Server error');
          });
        }
  
        if (results.length === 0) {
          return db.rollback(() => {
            res.status(404).send('Train not found');
          });
        }
  
        const seatsAvailable = results[0].Seat_available;
        if (seatsAvailable === 0) {
          return db.rollback(() => {
            res.status(400).send('No seats available');
          });
        }
  
        db.query(bookQuery, [user_id, train_id, train_id, date], (bookError, bookResults) => {
          if (bookError) {
            return db.rollback(() => {
              console.error('Failed to book:', bookError);
              res.status(500).send('Server error');
            });
          }
  
          db.query(updateSeatsQuery, [train_id], (updateError, updateResults) => {
            if (updateError) {
              return db.rollback(() => {
                console.error('Failed to update seats:', updateError);
                res.status(500).send('Server error');
              });
            }
  
            db.commit(commitError => {
              if (commitError) {
                return db.rollback(() => {
                  console.error('Failed to commit transaction:', commitError);
                  res.status(500).send('Server error');
                });
              }
  
              res.send('Booking successful');
            });
          });
        });
      });
    });
  });

// Fetch bookings route
app.get('/abookings', (req, res) => {
    db.query('SELECT * FROM bookings', (err, results) => {
        if (err) {
            console.error('Error fetching bookings:', err);
            return res.status(500).send('Failed to fetch bookings');
        }
        res.json(results);
    });
});

app.get('/atrains', (req, res) => {
    const { source, destination } = req.query;
    const query = 'SELECT * FROM trains';
  
    db.query(query, (err, results) => {
      if (err) {
        console.error('Failed to fetch trains:', err);
        res.status(500).send('Server error');
        return;
      }
      res.json(results);
    });
  });

// Add a new train
app.post('/crudtrains', (req, res) => {
  const newTrain = req.body;
  const sql = 'INSERT INTO trains SET ?';
  db.query(sql, newTrain, (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json({ id: result.insertId, ...newTrain });
    }
  });
});

// Update train details
app.put('/crudtrains/:id', (req, res) => {
  const { id } = req.params;
  const updatedTrain = req.body;
  const sql = 'UPDATE trains SET ? WHERE Train_ID = ?';
  db.query(sql, [updatedTrain, id], (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(result);
    }
  });
});

// Delete a train
app.delete('/crudtrains/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM trains WHERE Train_ID = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(result);
    }
  });
});


  // Get user profile route
app.get('/userprofile', (req, res) => {
    const { user_id } = req.query;
    db.query('SELECT user_id, name, email, phone_number FROM users WHERE user_id = ?', [user_id], (err, results) => {
      if (err) {
        console.error('Error fetching user profile:', err);
        return res.status(500).send('Failed to fetch user profile');
      }
      if (results.length === 0) return res.status(404).send('User not found');
      res.json(results[0]);
    });
  });
  
  // Get user bookings route
  app.get('/userbookings', (req, res) => {
    const { user_id} = req.query;
    db.query('SELECT Booking_ID as id, Train_Name as train_name, Date as date FROM bookings WHERE User_ID = ?', [user_id], (err, results) => {
      if (err) {
        console.error('Error fetching bookings:', err);
        return res.status(500).send('Failed to fetch bookings');
      }
      res.json(results);
    });
  });

    // Get admin profile route
app.get('/adminprofile', (req, res) => {
    const { user_id } = req.query;
    db.query('SELECT user_id, name, email, phone_number FROM users WHERE user_id = ?', [user_id], (err, results) => {
      if (err) {
        console.error('Error fetching user profile:', err);
        return res.status(500).send('Failed to fetch user profile');
      }
      if (results.length === 0) return res.status(404).send('User not found');
      res.json(results[0]);
    });
  });

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
