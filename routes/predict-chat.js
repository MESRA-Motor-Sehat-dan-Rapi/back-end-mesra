const express = require('express');
const router = express.Router();

const { predictChatbot } = require('../controllers/Predict-chat');

// Middleware untuk parsing JSON
router.use(express.json());

// Route untuk menangani pesan chatbot
router.post('/chatbot', async (req, res) => {
  try {
    const { message } = req.body;

    // Validasi input
    if (!message) {
      return res.status(400).json({ error: 'Pesan (message) harus diisi.' });
    }

    // Panggil controller untuk memproses pesan
    const response = await predictChatbot(message);

    // Kirim respons ke client
    return res.json({ success: true, response });
  } catch (error) {
    console.error('Error saat memproses pesan:', error);
    return res.status(500).json({ error: 'Terjadi kesalahan server.' });
  }
});

module.exports = router;
