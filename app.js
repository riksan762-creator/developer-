// app.js
const btnAction = document.getElementById('btnAction');
const tiktokInput = document.getElementById('tiktokUrl');
const loader = document.getElementById('loader');
const resultArea = document.getElementById('result');

btnAction.addEventListener('click', async () => {
    const rawUrl = tiktokInput.value.trim();
    
    if (!rawUrl) {
        alert('Masukkan link TikTok-nya dulu, Bos!');
        return;
    }

    // Efek Loading: Tombol mati & Loader muncul
    btnAction.disabled = true;
    btnAction.classList.add('opacity-50', 'cursor-not-allowed');
    loader.classList.remove('hidden');
    resultArea.classList.add('hidden');

    try {
        // Ambil data dari proxy API kita di Vercel
        const response = await fetch(`/api/download?url=${encodeURIComponent(rawUrl)}`);
        const result = await response.json();

        // Cek apakah data video ada (Struktur Scraper7: result.data)
        if (result && result.data && result.data.play) {
            const video = result.data;

            // Masukkan data ke UI
            document.getElementById('thumb').src = video.cover;
            document.getElementById('author').innerText = "@" + (video.author?.unique_id || "TikTok User");
            document.getElementById('desc').innerText = video.title || "Video Tanpa Judul";
            
            // Link Download (play = No Watermark)
            const downloadLink = document.getElementById('downloadLink');
            downloadLink.href = video.play;
            
            // Tampilkan kartu hasil
            resultArea.classList.remove('hidden');
        } else {
            alert('Gagal: Video tidak ditemukan. Pastikan link bukan video private.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Terjadi kesalahan sistem. Cek koneksi Anda.');
    } finally {
        // Reset UI
        btnAction.disabled = false;
        btnAction.classList.remove('opacity-50', 'cursor-not-allowed');
        loader.classList.add('hidden');
    }
});
