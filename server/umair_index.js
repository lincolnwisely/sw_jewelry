const express = require('express');
const morgan = require('morgan');

const app = express();

// Middleware
app.use(express.json());
app.use(morgan('dev'));
const userRoutes = require('./routes/userRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');


app.use('/api/users', userRoutes);
app.use('/api/inventory', inventoryRoutes);

app.all('*', (req, res) => {
res.status(404).send('<h1> 404 | Route not found </h1>');
});

module.exports = app;





