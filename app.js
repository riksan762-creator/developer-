const btnAction = document.getElementById('btnAction');
const tiktokInput = document.getElementById('tiktokUrl');
const loader = document.getElementById('loader');
const resultArea = document.getElementById('result');

btnAction.addEventListener('click', async () => {
    const rawUrl = tiktokInput.value.trim();
    
    if (!rawUrl) {
        alert('Paste link TikTok-nya dulu, Bos!');
        return;
    }

    // UI State
    btnAction.disabled = true;
    btnAction.innerText = 'Sedang Mencari...';
    loader.classList.remove('hidden');
    resultArea.classList.add('hidden');

    try {
        const response = await fetch(`/api/download?url=${encodeURIComponent(rawUrl)}`);
        const result = await response.json();

        console.log("Respon Full API:", result); // Cek di Console F12

        // Mapping Data: tiktok-api23 biasanya membungkus dalam 'data'
        // Kita ambil data terdalam jika ada, jika tidak pakai result itu sendiri
        const v = result.data || result;

        // Cari link video di berbagai kemungkinan nama properti (video_url atau nowm_video_url)
        const videoLink = v.video_url || v.nowm_video_url || v.play || (v.video && v.video.play);
        const videoCover = v.cover || v.origin_cover || (v.video && v.video.cover);
        const videoAuthor = v.author?.nickname || v.author || "TikTok User";
        const videoTitle = v.title || v.desc || "Video Berhasil Diambil";

        if (videoLink) {
            // Isi ke UI
            document.getElementById('thumb').src = videoCover;
            document.getElementById('author').innerText = "@" + videoAuthor;
            document.getElementById('desc').innerText = videoTitle;
            
            const dlBtn = document.getElementById('downloadLink');
            dlBtn.href = videoLink;
            
            // Tampilkan hasil
            resultArea.classList.remove('hidden');
        } else {
            // Jika link video tidak ditemukan sama sekali di dalam JSON
            console.error("Link video tidak ditemukan dalam objek:", v);
            alert('Gagal: API tidak memberikan link video. Cek kuota RapidAPI atau coba link lain.');
        }

    } catch (error) {
        console.error('Fetch Error:', error);
        alert('Terjadi kesalahan koneksi ke server.');
    } finally {
        btnAction.disabled = false;
        btnAction.innerText = 'Ambil Video';
        loader.classList.add('hidden');
    }
});
