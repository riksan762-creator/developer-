// app.js - Final Version by Riksan
const btnAction = document.getElementById('btnAction');
const tiktokInput = document.getElementById('tiktokUrl');
const loader = document.getElementById('loader');
const resultArea = document.getElementById('result');
const downloadBtn = document.getElementById('downloadLink');

// 1. Ambil Data Video
btnAction.addEventListener('click', async () => {
    const rawUrl = tiktokInput.value.trim();
    if (!rawUrl) return alert('Masukkan link dulu, Bos!');

    // Reset UI
    btnAction.disabled = true;
    btnAction.innerText = 'Memproses...';
    loader.classList.remove('hidden');
    resultArea.classList.add('hidden');

    try {
        const response = await fetch(`/api/download?url=${encodeURIComponent(rawUrl)}&t=${Date.now()}`);
        const result = await response.json();

        // Mapping tiktok-api23 data
        const v = result.data || result;
        const videoLink = v.video_url || v.nowm_video_url || v.play;
        const videoCover = v.cover || v.origin_cover;
        const videoAuthor = v.author?.nickname || v.author || "TikTok User";
        const videoTitle = v.title || v.desc || "TikTok Video Downloaded";

        if (videoLink) {
            // Tampilkan Thumbnail dengan trik anti-blokir
            const thumbImg = document.getElementById('thumb');
            thumbImg.src = videoCover;
            thumbImg.onerror = function() { this.src = 'https://via.placeholder.com/400x225/0f172a/cyan?text=Thumbnail+Ready'; };

            document.getElementById('author').innerText = "@" + videoAuthor;
            document.getElementById('desc').innerText = videoTitle;
            
            // Simpan link ke tombol download
            downloadBtn.href = videoLink;
            resultArea.classList.remove('hidden');
        } else {
            alert('Video tidak ditemukan! Pastikan link bukan video private.');
        }
    } catch (error) {
        alert('Gagal menyambung ke server.');
    } finally {
        btnAction.disabled = false;
        btnAction.innerText = 'Ambil Video';
        loader.classList.add('hidden');
    }
});

// 2. Paksa Download ke Galeri (Blob Technique)
downloadBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const videoUrl = downloadBtn.href;
    if (!videoUrl || videoUrl === "#") return;

    const originalText = downloadBtn.innerText;
    
    try {
        downloadBtn.innerText = "Downloading...";
        downloadBtn.style.pointerEvents = "none";

        // Fetch video as blob
        const res = await fetch(videoUrl);
        const blob = await res.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        
        // Trigger Download
        const tempLink = document.createElement('a');
        tempLink.href = blobUrl;
        tempLink.download = `RiksanProject_${Date.now()}.mp4`;
        document.body.appendChild(tempLink);
        tempLink.click();
        
        // Cleanup
        document.body.removeChild(tempLink);
        window.URL.revokeObjectURL(blobUrl);
        alert("Selesai! Cek Galeri atau Folder Download.");
    } catch (err) {
        // Jika gagal paksa, buka tab baru (User bisa simpan manual)
        window.open(videoUrl, '_blank');
    } finally {
        downloadBtn.innerText = originalText;
        downloadBtn.style.pointerEvents = "auto";
    }
});
