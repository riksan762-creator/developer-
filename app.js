// app.js
const btnAction = document.getElementById('btnAction');
const tiktokInput = document.getElementById('tiktokUrl');
const loader = document.getElementById('loader');
const resultArea = document.getElementById('result');

btnAction.addEventListener('click', async () => {
    const rawUrl = tiktokInput.value.trim();
    
    if (!rawUrl) {
        alert('Paste link-nya dulu, Bos!');
        return;
    }

    // UI: Start Loading
    btnAction.disabled = true;
    btnAction.innerText = 'Tunggu bentar...';
    loader.classList.remove('hidden');
    resultArea.classList.add('hidden');

    try {
        const response = await fetch(`/api/download?url=${encodeURIComponent(rawUrl)}`);
        
        // Cek apakah server (Vercel) merespon
        if (!response.ok) {
            throw new Error('Server Vercel error!');
        }

        const result = await response.json();
        console.log("Respon API:", result); // Lihat di F12 (Console)

        // Penyesuaian struktur data untuk tiktok-api23
        // Biasanya datanya ada di result.data atau langsung di result
        const videoData = result.data || result;

        if (videoData && (videoData.video_url || videoData.nowm_video_url)) {
            // Update UI dengan data yang didapat
            document.getElementById('thumb').src = videoData.cover || videoData.origin_cover || '';
            document.getElementById('author').innerText = "@" + (videoData.author?.nickname || videoData.author || "User");
            document.getElementById('desc').innerText = videoData.title || "TikTok Video";
            
            // Link Download
            const finalLink = videoData.video_url || videoData.nowm_video_url;
            document.getElementById('downloadLink').href = finalLink;
            
            // Munculkan hasil
            resultArea.classList.remove('hidden');
        } else {
            alert('Video tidak ditemukan. Cek apakah link-nya bener atau video-nya tidak diprivasi.');
        }
    } catch (error) {
        console.error('Error Detail:', error);
        alert('Waduh, koneksi putus atau ada error di sistem. Cek F12!');
    } finally {
        // UI: Reset
        btnAction.disabled = false;
        btnAction.innerText = 'Ambil Video';
        loader.classList.add('hidden');
    }
});
