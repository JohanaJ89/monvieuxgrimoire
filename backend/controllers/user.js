const path = require('path'); 

const User = require("../models/user");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');


dotenv.config();

exports.signup = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });

      user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => {
          res.status(400).json({ error });
        });
    })
    .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
  const { email, password } = req.body; // Ajouter cette ligne pour extraire email et password

  User.findOne({ email: email })
    .then(user => {
      if (user === null) {
        res.status(401).json({ message: 'Incorrect username/password pair' });
      } else {
        bcrypt.compare(password, user.password)
          .then(valid => {
            if (!valid) {
              res.status(401).json({ message: 'Incorrect username/password pair' });
            } else {
              res.status(200).json({
                userId: user._id,
                token: jwt.sign(
                  { userId: user._id },
                  process.env.RANDOM_TOKEN_SECRET, 
                  { expiresIn: process.env.EXPIRES }
                )
              });
            }
          })
          .catch(error => res.status(500).json({ error }));
      }
    })
    .catch(error => res.status(500).json({ error }));
};
