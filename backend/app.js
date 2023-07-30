const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors')
const rateLimit = require("express-rate-limit");
const mongoose = require('mongoose');
const path = require('path');
const app = express();

dotenv.config();

console.log("je suis dans app au début");
  
 
const url = process.env.MONGO_URL
  async function main() {
     await mongoose.connect(url, 
      { useNewUrlParser: true, useUnifiedTopology: true }).then();
     
  }

  main()
  .then(console.log('connexion réussit'))
  .catch(console.error)
  

const booksRoutes = require('./routes/books');
const userRoutes = require('./routes/user');
/*const { log } = require('console');*/

const limitUserLogin = rateLimit({
  windowMS: 5 * 60 * 1000, //vaut 5 minutes
  max: 50,
  message: "Vous avez effectué trop de requêtes"
});



app.use(limitUserLogin);
app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});
app.use(express.json());
console.log("je suis avant ratemescoilles");


console.log("je suis dans app");
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "default-src 'none'; font-src 'self' https://fonts.googleapis.com;");
  next();
});

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/books', booksRoutes);
app.use('/api/auth', userRoutes);



module.exports = app;