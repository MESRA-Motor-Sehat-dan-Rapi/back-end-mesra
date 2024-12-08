var express = require('express');
const Multer = require('multer');
var router = express.Router();

const {
  predictChatbot} = require('../controllers/Predict');

const multer = Multer({
  storage: Multer.memoryStorage()
});

router.post('/chatbot', multer.single('file'), predictChatbot);

module.exports = router;