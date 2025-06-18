document.addEventListener('DOMContentLoaded', () => {
    // Ambil elemen dari DOM
    const nominalInput = document.getElementById('nominal');
    const emailInput = document.getElementById('email');
    const fileInput = document.getElementById('file-input');
    const prosesBtn = document.getElementById('proses-btn');
    const fileNameDisplay = document.getElementById('file-name');
    const depositForm = document.getElementById('deposit-form');
    const loadingOverlay = document.getElementById('loading-overlay');

    // --- FUNGSI BARU UNTUK FORMAT RUPIAH ---
    function formatRupiah(angka) {
        let number_string = angka.replace(/[^,\d]/g, '').toString(),
            split = number_string.split(','),
            sisa = split[0].length % 3,
            rupiah = split[0].substr(0, sisa),
            ribuan = split[0].substr(sisa).match(/\d{3}/gi);

        if (ribuan) {
            let separator = sisa ? '.' : '';
            rupiah += separator + ribuan.join('.');
        }

        rupiah = split[1] != undefined ? rupiah + ',' + split[1] : rupiah;
        return rupiah;
    }

    // Fungsi untuk validasi format email sederhana
    function isValidEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    // Fungsi untuk memeriksa apakah form sudah valid
    function validateForm() {
        const isNominalFilled = nominalInput.value.trim() !== '';
        const isEmailValid = isValidEmail(emailInput.value);
        const isFileUploaded = fileInput.files.length > 0;

        if (isNominalFilled && isEmailValid && isFileUploaded) {
            prosesBtn.disabled = false;
        } else {
            prosesBtn.disabled = true;
        }
    }

    // --- EVENT LISTENER BARU UNTUK INPUT NOMINAL ---
    // Kode ini akan berjalan setiap kali pengguna mengetik di kolom nominal
    nominalInput.addEventListener('keyup', function(e) {
        // Ambil nilai input dan format ke Rupiah
        nominalInput.value = formatRupiah(this.value);
        // Panggil validasi form setelah diformat
        validateForm();
    });

    // Event listener untuk input lainnya
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

        const backendUrl = 'https://...vercel.app/api/telegram-notify'; 
        
        const formData = new FormData();
        
        // --- MODIFIKASI PENGIRIMAN DATA NOMINAL ---
        // Hapus titik dari format Rupiah sebelum mengirim ke server
        const rawNominalValue = nominalInput.value.replace(/\./g, '');
        
        formData.append('nominal', rawNominalValue); // Kirim angka murni
        formData.append('email', emailInput.value);
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
