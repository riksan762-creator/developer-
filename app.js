// Deklarasi Elemen
const btnAction = document.getElementById('btnAction');
const tiktokInput = document.getElementById('tiktokUrl');
const loader = document.getElementById('loader');
const resultArea = document.getElementById('result');
const downloadBtn = document.getElementById('downloadLink');

// 1. Logika Ambil Data Video
btnAction.addEventListener('click', async () => {
    const rawUrl = tiktokInput.value.trim();
    
    if (!rawUrl) {
        alert('Paste link TikTok-nya dulu, Bos!');
        return;
    }

    // UI State: Loading
    btnAction.disabled = true;
    btnAction.innerText = 'Sedang Memproses...';
    loader.classList.remove('hidden');
    resultArea.classList.add('hidden');

    try {
        const response = await fetch(`/api/download?url=${encodeURIComponent(rawUrl)}`);
        const result = await response.json();

        // Mapping data tiktok-api23 (sesuai curl Anda)
        const v = result.data || result;

        // Mencari link video dan thumbnail di berbagai properti
        const videoLink = v.video_url || v.nowm_video_url || v.play;
        const videoCover = v.cover || v.origin_cover || (v.video && v.video.cover);
        const videoAuthor = v.author?.nickname || v.author || "TikTok User";
        const videoTitle = v.title || v.desc || "Tanpa Judul";

        if (videoLink) {
            // Tampilkan Thumbnail & Data (Jangan sampai hilang)
            document.getElementById('thumb').src = videoCover;
            document.getElementById('author').innerText = "@" + videoAuthor;
            document.getElementById('desc').innerText = videoTitle;
            
            // Simpan link video ke atribut href tombol download
            downloadBtn.href = videoLink;
            
            // Tampilkan Area Hasil
            resultArea.classList.remove('hidden');
        } else {
            alert('Gagal: API tidak memberikan link video. Coba link lain.');
        }

    } catch (error) {
        console.error('Error:', error);
        alert('Terjadi kesalahan koneksi ke server.');
    } finally {
        btnAction.disabled = false;
        btnAction.innerText = 'Ambil Video';
        loader.classList.add('hidden');
    }
});

// 2. Logika Paksa Download (Save to Gallery)
downloadBtn.addEventListener('click', async (e) => {
    // Kita gunakan teknik Fetch Blob agar browser mendownload, bukan memutar video
    e.preventDefault();
    
    const videoUrl = downloadBtn.href;
    if (!videoUrl || videoUrl === "#") return;

    const originalText = downloadBtn.innerText;
    
    try {
        downloadBtn.innerText = "Mengunduh...";
        downloadBtn.classList.add('opacity-50');

        // Mengambil data file video
        const res = await fetch(videoUrl);
        const blob = await res.blob();
        
        // Membuat URL sementara di browser
        const blobUrl = window.URL.createObjectURL(blob);
        
        // Membuat elemen link download bayangan
        const tempLink = document.createElement('a');
        tempLink.style.display = 'none';
        tempLink.href = blobUrl;
        
        // Nama file saat tersimpan di HP/PC
        tempLink.download = `RiksanProjects_${Date.now()}.mp4`;
        
        document.body.appendChild(tempLink);
        tempLink.click(); // Klik otomatis untuk download
        
        // Hapus elemen dan URL sementara
        document.body.removeChild(tempLink);
        window.URL.revokeObjectURL(blobUrl);
        
        alert("Video berhasil diunduh ke galeri!");
        
    } catch (err) {
        console.error("Gagal paksa download:", err);
        // Fallback: Jika gagal (karena masalah CORS), buka di tab baru agar user bisa 'Simpan Manual'
        window.open(videoUrl, '_blank');
        alert("Gagal mengunduh otomatis. Video dibuka di tab baru, silakan tahan video lalu pilih 'Simpan'.");
    } finally {
        downloadBtn.innerText = originalText;
        downloadBtn.classList.remove('opacity-50');
    }
});
