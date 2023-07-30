const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const bookCtrl = require('../controllers/books');

const compressImage = require('../middleware/imageCompression')


router.post('/', auth, multer, compressImage, bookCtrl.createBook);
router.post('/:id/rating', auth, bookCtrl.averageRating)
router.put('/:id', auth, multer, compressImage, bookCtrl.modifyBook);
router.delete('/:id', auth, bookCtrl.deleteBook);
router.get('/bestrating', bookCtrl.bestratingBook)
router.get('/:id', bookCtrl.getOneBook);
router.get('/', bookCtrl.getAllBook);

module.exports = router;