const mongoose = require('mongoose');

const BookSchema = mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  imageUrl: { type: String, required: true },
  userId: { type: String, required: true },
  year: { type: Number, required: true },
  genre: { type: String, required: true },
  ratings: [
    {
      userId: { type: String},
      grade: { type: Number}
    },
  ],
  averageRating:{type: Number},
});

module.exports = mongoose.model('book', BookSchema);