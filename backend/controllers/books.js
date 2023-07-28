const Book = require('../models/books');
const fs = require('fs');

exports.getBooks = (req, res, next) => {
  Book.find()
    .then((books) => {
      res.status(200).json(books);
    })
    .catch(error => res.status(400).json({ error }));
};

exports.getBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (!book) {
        return res.status(404).json({ error: 'Book not found' });
      }
      res.status(200).json(book);
    })
    .catch(error => {
      res.status(404).json({ error });
    });
};

exports.getBestRating = (req, res, next) => {
  Book.find()
    .sort({ averageRating: -1 })
    .limit(3)
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
};

exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;
 
  const newBook = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });

  newBook.save()
    .then(() => {
      res.status(201).json({ message: 'Objet enregistré !' });
    })
    .catch(error => {
      res.status(400).json({ error });
    });
};

exports.modifyBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then(book => {
      if (book.userId != req.auth.userId) {
        return res.status(403).json({ message: 'Not authorized' });
      } else {
        const bookObject = req.file ? {
          ...JSON.parse(req.body.book),
          imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };

        delete bookObject.userId;

        book.set({ ...bookObject });

        book.save()
          .then(() => res.status(200).json({ message: 'Objet modifié!' }))
          .catch(error => res.status(401).json({ error }));
      }
    })
    .catch(error => {
      res.status(400).json({ error });
    });
};

exports.rateBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then(book => {
      // Check if user already rated this book
      const alreadyRated = book.ratings.some(rate => rate.userId.toString() === req.auth.userId);
      if (alreadyRated) {
        return res.status(400).json({ message: "You already rated this book" });
      }
      
      book.ratings.push({
        userId: req.auth.userId,
        grade: req.body.rating
      });
      
      let sum = 0;
      book.ratings.forEach(rate => sum += rate.grade);
      book.averageRating = sum / book.ratings.length;
     
      book.save()
        .then(() => {
          res.status(201).json(book);
        })
        .catch(error => {
          res.status(401).json({ error });
        });
    })
    .catch(error => {
      res.status(400).json({ error });
    });
};

exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then(book => {
      if (book.userId != req.auth.userId) {
        return res.status(401).json({ message: 'Not authorized' });
      } else {
        const filename = book.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          book.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: 'Objet supprimé !' });
            })
            .catch(error => {
              res.status(401).json({ error });
            });
        });
      }
    })
    .catch(error => {
      res.status(500).json({ error });
    });
};
