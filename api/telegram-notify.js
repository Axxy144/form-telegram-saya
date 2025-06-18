// --- PERUBAHAN UTAMA ADA DI 3 BARIS INI ---
// Menggunakan 'import' yang lebih modern, bukan 'require'
import TelegramBot from 'node-telegram-bot-api';
import formidable from 'formidable';
import fs from 'fs';

// Ambil Token dan Chat ID dari Environment Variables (sama seperti sebelumnya)
const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

// Inisialisasi bot (sama seperti sebelumnya)
const bot = new TelegramBot(token);

// Fungsi utama yang akan dijalankan server (sama seperti sebelumnya)
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).send({ message: 'Only POST requests allowed' });
    }

    // Pemanggilan formidable di sini sudah benar karena cara import-nya sudah diperbaiki
    const form = formidable({});

    try {
        const [fields, files] = await form.parse(req);

        const nominal = fields.nominal[0];
        const buktiFile = files.bukti[0];

        const caption = `
✅ **Konfirmasi Transfer Baru**

**Nominal:** Rp ${parseInt(nominal).toLocaleString('id-ID')}
**Tanggal:** ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}
        `;

        await bot.sendPhoto(chatId, fs.createReadStream(buktiFile.filepath), {
            caption: caption,
            parse_mode: 'Markdown'
        });

        res.status(200).json({ message: 'Notification sent successfully!' });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error processing request' });
    }
}
