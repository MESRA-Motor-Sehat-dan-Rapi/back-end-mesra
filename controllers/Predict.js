const { Storage } = require("@google-cloud/storage");
const axios = require("axios");
const uuid = require("uuid");

// Inisialisasi Google Cloud Storage
const storage = new Storage({
  projectId: process.env.GCLOUD_PROJECT,
  credentials: {
    client_email: process.env.GCLOUD_CLIENT_EMAIL,
    private_key: process.env.GCLOUD_PRIVATE_KEY.replace(/\\n/g, "\n"), // Ganti escape karakter untuk key
  },
});

const bucket = storage.bucket(process.env.GCS_BUCKET);

// Fungsi untuk menyimpan respons ke bucket
const saveResponseToBucket = async (responseData) => {
  const filename = `responses/${uuid.v1()}.json`; // File unik dengan UUID
  const blob = bucket.file(filename);

  try {
    // Simpan data sebagai JSON
    await blob.save(JSON.stringify(responseData), {
      contentType: "application/json",
    });
    console.log(`Respons berhasil disimpan di bucket: ${filename}`);
  } catch (error) {
    console.error(`Error menyimpan respons ke bucket: ${error.message}`);
    throw error;
  }
};

// Fungsi utama untuk prediksi chatbot
const predictChatbot = async (req, res) => {
  const userInput = req.body.message;

  if (!userInput) {
    return res.status(400).json({
      status: "fail",
      message: "Pesan input tidak boleh kosong",
    });
  }

  try {
    // Panggil API prediksi Flask
    const predictionResponse = await axios.post(
      process.env.API_PREDICT_HOST_CHATBOT,
      { message: userInput }
    );

    const predictedResponse = predictionResponse.data.response;

    // Simpan respons dan input pengguna ke bucket
    const responseData = {
      user_input: userInput,
      response: predictedResponse,
    };

    await saveResponseToBucket(responseData);

    // Kembalikan respons ke klien
    return res.status(200).json({
      status: "success",
      data: responseData,
    });
  } catch (error) {
    console.error(`Error saat memprediksi: ${error.message}`);
    return res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan saat memproses permintaan",
    });
  }
};

// Export fungsi untuk routing
module.exports = {
  predictChatbot,
};
