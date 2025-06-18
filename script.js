document.addEventListener('DOMContentLoaded', () => {
    // Ambil elemen dari DOM
    const nominalInput = document.getElementById('nominal');
    const emailInput = document.getElementById('email'); // Elemen baru
    const fileInput = document.getElementById('file-input');
    const prosesBtn = document.getElementById('proses-btn');
    const fileNameDisplay = document.getElementById('file-name');
    const depositForm = document.getElementById('deposit-form');
    const loadingOverlay = document.getElementById('loading-overlay');

    // Fungsi untuk validasi format email sederhana
    function isValidEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    // Fungsi untuk memeriksa apakah form sudah valid
    function validateForm() {
        const isNominalFilled = nominalInput.value.trim() !== '';
        const isEmailValid = isValidEmail(emailInput.value); // Pengecekan baru
        const isFileUploaded = fileInput.files.length > 0;

        // Tombol aktif jika semua kondisi terpenuhi
        if (isNominalFilled && isEmailValid && isFileUploaded) {
            prosesBtn.disabled = false;
        } else {
            prosesBtn.disabled = true;
        }
    }

    // Tambahkan event listener untuk setiap input
    nominalInput.addEventListener('input', validateForm);
    emailInput.addEventListener('input', validateForm);
    fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0) {
            fileNameDisplay.textContent = fileInput.files[0].name;
            fileNameDisplay.style.color = 'var(--text-color-primary)';
        } else {
            fileNameDisplay.textContent = 'Belum ada file';
            fileNameDisplay.style.color = 'var(--text-color-secondary)';
        }
        validateForm();
    });

    // Proses saat form disubmit
    depositForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        loadingOverlay.style.display = 'flex';

        // Ganti dengan URL Vercel Anda yang sudah berfungsi
        const backendUrl = 'https://...vercel.app/api/telegram-notify'; 
        
        const formData = new FormData();
        formData.append('nominal', nominalInput.value);
        formData.append('email', emailInput.value); // Tambahkan email ke data yang dikirim
        formData.append('bukti', fileInput.files[0]);

        try {
            const response = await fetch(backendUrl, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil Terkirim!',
                    text: 'Data Anda akan segera kami proses. Terima kasih.',
                    confirmButtonColor: 'var(--primary-color)'
                });
                depositForm.reset();
                fileNameDisplay.textContent = 'Belum ada file';
                validateForm();
            } else {
                throw new Error('Gagal mengirim data. Silakan coba lagi nanti.');
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops... Terjadi Kesalahan',
                text: error.message,
            });
        } finally {
            loadingOverlay.style.display = 'none';
        }
    });
});
