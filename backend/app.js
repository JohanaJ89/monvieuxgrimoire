const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

const stuffRoutes = require('./routes/stuff');
const userRoutes = require('./routes/user');

app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "default-src 'none'; font-src 'self' https://fonts.googleapis.com;");
  next();
});

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/stuff', stuffRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;