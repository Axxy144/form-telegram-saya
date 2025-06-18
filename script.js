document.addEventListener('DOMContentLoaded', () => {
    const nominalInput = document.getElementById('nominal');
    const fileInput = document.getElementById('file-input');
    const prosesBtn = document.getElementById('proses-btn');
    const fileNameDisplay = document.getElementById('file-name');
    const depositForm = document.getElementById('deposit-form');
    const loadingOverlay = document.getElementById('loading-overlay');

    // Fungsi untuk memeriksa apakah form sudah valid
    function validateForm() {
        const isNominalFilled = nominalInput.value.trim() !== '';
        const isFileUploaded = fileInput.files.length > 0;

        if (isNominalFilled && isFileUploaded) {
            prosesBtn.disabled = false;
        } else {
            prosesBtn.disabled = true;
        }
    }

    // Tampilkan nama file yang dipilih
    fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0) {
            fileNameDisplay.textContent = fileInput.files[0].name;
            fileNameDisplay.style.color = '#334155'; // Ubah warna teks nama file
        } else {
            fileNameDisplay.textContent = 'Tidak ada file yang dipilih';
            fileNameDisplay.style.color = '#94a3b8';
        }
        validateForm();
    });

    // Validasi saat pengguna mengetik nominal
    nominalInput.addEventListener('input', validateForm);

    // Proses saat form disubmit
    depositForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Mencegah form reload halaman

        loadingOverlay.style.display = 'flex'; // Tampilkan loading

        // URL server/back-end Anda
        const backendUrl = 'https://form-telegram-saya.vercel.app/api/telegram-notify';'; 
        
        const formData = new FormData();
        formData.append('nominal', nominalInput.value);
        formData.append('bukti', fileInput.files[0]);

        try {
            const response = await fetch(backendUrl, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil!',
                    text: 'Data Anda telah berhasil dikirim dan akan segera diproses.',
                    confirmButtonColor: '#0d9488'
                });
                depositForm.reset(); // Kosongkan form
                fileNameDisplay.textContent = 'Tidak ada file yang dipilih';
                validateForm();
            } else {
                throw new Error('Gagal mengirim data. Coba lagi.');
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error.message,
            });
        } finally {
            loadingOverlay.style.display = 'none'; // Sembunyikan loading
        }
    });
});
