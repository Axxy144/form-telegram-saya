// Menggunakan 'import' yang lebih modern
import TelegramBot from 'node-telegram-bot-api';
import formidable from 'formidable';
import fs from 'fs';

// Ambil Token dan Chat ID dari Environment Variables
const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

// Inisialisasi bot
const bot = new TelegramBot(token);

// Fungsi utama yang akan dijalankan server
export default async function handler(req, res) {
    // Blok kode untuk mengizinkan CORS dari semua domain (termasuk localhost)
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );
    
    // Jawab request 'OPTIONS' dari browser
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Hanya izinkan metode POST
    if (req.method !== 'POST') {
        return res.status(405).send({ message: 'Only POST requests allowed' });
    }

    const form = formidable({});

    try {
        const [fields, files] = await form.parse(req);
        const nominal = fields.nominal[0];
        const email = fields.email[0];
        const buktiFile = files.bukti[0];

        // Buat caption (pesan) untuk dikirim ke Telegram
        const caption = `
✅ **Konfirmasi Transfer Baru**

**Email:** ${email}
**Nominal:** Rp ${parseInt(nominal).toLocaleString('id-ID')}
**Tanggal:** ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}
        `;

        // Kirim foto beserta caption
        await bot.sendPhoto(chatId, fs.createReadStream(buktiFile.filepath), {
            caption: caption,
            parse_mode: 'Markdown'
        });

        // Kirim respons sukses kembali ke website
        res.status(200).json({ message: 'Notification sent successfully!' });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error processing request' });
    }
}
