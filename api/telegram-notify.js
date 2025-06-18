// Impor library yang dibutuhkan
const TelegramBot = require('node-telegram-bot-api');
const formidable = require('formidable');
const fs = require('fs');

// Ambil Token dan Chat ID dari Environment Variables yang sudah Anda set di Vercel
const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

// Inisialisasi bot (jangan diubah)
const bot = new TelegramBot(token);

// ---> INI BAGIAN PALING PENTING <---
// Baris ini memberitahu Vercel fungsi mana yang harus dijalankan saat ada request
export default async function handler(req, res) {
    // Hanya izinkan metode POST
    if (req.method !== 'POST') {
        return res.status(405).send({ message: 'Only POST requests allowed' });
    }

    const form = formidable({});

    try {
        const [fields, files] = await form.parse(req);

        // Ambil data nominal dan file dari form
        const nominal = fields.nominal[0];
        const buktiFile = files.bukti[0];

        // Buat caption (pesan) untuk dikirim ke Telegram
        const caption = `
✅ **Konfirmasi Transfer Baru**

**Nominal:** Rp ${parseInt(nominal).toLocaleString('id-ID')}
**Tanggal:** ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}
        `;

        // Kirim foto beserta caption ke Telegram
        await bot.sendPhoto(chatId, fs.createReadStream(buktiFile.filepath), {
            caption: caption,
            parse_mode: 'Markdown'
        });

        // Kirim respons sukses kembali ke website (front-end)
        res.status(200).json({ message: 'Notification sent successfully!' });

    } catch (error) {
        // Jika ada error, catat di log Vercel dan kirim respons error
        console.error('Error:', error);
        res.status(500).json({ message: 'Error processing request' });
    }
}
