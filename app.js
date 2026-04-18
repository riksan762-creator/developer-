// app.js
const btnAction = document.getElementById('btnAction');
const tiktokInput = document.getElementById('tiktokUrl');
const loader = document.getElementById('loader');
const resultArea = document.getElementById('result');

btnAction.addEventListener('click', async () => {
    const rawUrl = tiktokInput.value.trim();
    
    if (!rawUrl) {
        alert('Paste dulu link TikTok-nya, Bos!');
        return;
    }

    // UI State: Loading
    btnAction.disabled = true;
    btnAction.innerText = 'Memproses...';
    loader.classList.remove('hidden');
    resultArea.classList.add('hidden');

    try {
        const response = await fetch(`/api/download?url=${encodeURIComponent(rawUrl)}`);
        const result = await response.json();

        // Cek struktur data dari tiktok-scraper7 (biasanya ada di result.data)
        if (result && result.data) {
            const video = result.data;

            // Isi konten hasil
            document.getElementById('thumb').src = video.cover || '';
            document.getElementById('author').innerText = video.author?.nickname || 'TikTok User';
            document.getElementById('desc').innerText = video.title || 'Tidak ada deskripsi';
            
            // Link video tanpa watermark biasanya ada di properti 'play'
            const downloadBtn = document.getElementById('downloadLink');
            downloadBtn.href = video.play;
            
            // Tampilkan hasil
            resultArea.classList.remove('hidden');
        } else {
            alert('Gagal: Video tidak ditemukan atau link salah.');
        }
    } catch (error) {
        console.error('Frontend Error:', error);
        alert('Terjadi kesalahan koneksi ke API Vercel.');
    } finally {
        // UI State: Reset
        btnAction.disabled = false;
        btnAction.innerText = 'Ambil Video';
        loader.classList.add('hidden');
    }
});
