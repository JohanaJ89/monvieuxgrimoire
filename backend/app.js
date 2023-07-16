const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();


mongoose.connect('mongodb+srv://JoeJoTo:JoeMongo232207@atlascluster.rgghimt.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const stuffRoutes = require('./routes/stuff');
const userRoutes = require('./routes/user');

app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "default-src 'none'; font-src 'self' https://fonts.googleapis.com;");
  next();
});

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/stuff', stuffRoutes);
app.use('/api/stuff', stuffRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;