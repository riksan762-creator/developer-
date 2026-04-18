const btnAction = document.getElementById('btnAction');
const tiktokInput = document.getElementById('tiktokUrl');
const loader = document.getElementById('loader');
const resultArea = document.getElementById('result');
const downloadBtn = document.getElementById('downloadLink');

btnAction.addEventListener('click', async () => {
    const rawUrl = tiktokInput.value.trim();
    if (!rawUrl) return alert('Paste linknya dulu!');

    btnAction.disabled = true;
    btnAction.innerText = 'Mencari Video...';
    loader.classList.remove('hidden');
    resultArea.classList.add('hidden');

    try {
        const response = await fetch(`/api/download?url=${encodeURIComponent(rawUrl)}&t=${Date.now()}`);
        const result = await response.json();

        // LOGIKA MAPPING TERKUAT:
        // Cek di result.data (api23) atau langsung di result
        const d = result.data || result;

        // Cari video di segala kemungkinan nama property
        const videoURL = d.video_url || d.nowm_video_url || d.play || d.download_url;
        const coverURL = d.cover || d.origin_cover || d.thumbnail;
        const authorName = d.author?.nickname || d.author || "TikTok User";
        const videoTitle = d.title || d.desc || "Berhasil Diambil";

        if (videoURL) {
            // Tampilkan Gambar
            const thumbImg = document.getElementById('thumb');
            thumbImg.src = coverURL;
            
            document.getElementById('author').innerText = "@" + authorName;
            document.getElementById('desc').innerText = videoTitle;
            
            // Masukkan link ke tombol
            downloadBtn.href = videoURL;
            resultArea.classList.remove('hidden');
        } else {
            // Kalau masih gagal, kita munculkan pesan error dari API jika ada
            alert('Gagal: ' + (result.msg || 'Struktur data API berubah / Video Private'));
        }
    } catch (err) {
        alert('Koneksi bermasalah!');
    } finally {
        btnAction.disabled = false;
        btnAction.innerText = 'Ambil Video';
        loader.classList.add('hidden');
    }
});

// Logika Download (Tetap Pakai Blob agar masuk galeri)
downloadBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const url = downloadBtn.href;
    if (!url || url === "#") return;

    try {
        downloadBtn.innerText = "Mengunduh...";
        const res = await fetch(url);
        const blob = await res.blob();
        const bUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = bUrl;
        a.download = `TikTok_Riksan_${Date.now()}.mp4`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(bUrl);
        alert("Selesai! Cek Galeri.");
    } catch (e) {
        window.open(url, '_blank');
    } finally {
        downloadBtn.innerText = "Download ke Galeri";
    }
});
