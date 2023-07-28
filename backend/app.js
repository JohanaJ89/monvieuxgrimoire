const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors')
const rateLimit = require("express-rate-limit");
const { MongoClient } = require('mongodb');
const path = require('path');
const app = express();

// Charger les variables d'environnement depuis le fichier .env dans le dossier config
const envFilePath = path.join(__dirname, 'config', '.env');
const result = dotenv.config({ path: envFilePath });

console.log("je suis dans app au début");
if (result.error) {
  console.error('Error loading .env file:', result.error);
} else {
  console.log('Env variables loaded successfully:', result.parsed);
}


const client = new MongoClient(process.env.MONGO_URL);

async function main() {
  await client.connect();
  console.log('connexion réussit');
  const db = client.db('users');
  const collection = db.collection('utilisateurs crées');
  const insertUsers = await collection.insertMany([{}])
  return 'done!';
}

main()
.then(console.log)
.catch(console.error)
.finally(()=> client.close());

const booksRoutes = require('./routes/books');
const userRoutes = require('./routes/user');
const { log } = require('console');

const limitUserLogin = rateLimit({
  windowMS: 5 * 60 * 1000, //vaut 5 minutes
  max: 50,
  message: "Vous avez effectué trop de requêtes"
});

app.use(limitUserLogin);
app.use(express.urlencoded({ extended: true }));
app.use(cors())
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