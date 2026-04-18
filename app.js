// app.js (Bagian handle respon)
const response = await fetch(`/api/download?url=${encodeURIComponent(rawUrl)}`);
const result = await response.json();

console.log("Respon API:", result); // Penting untuk cek di Console F12

if (result && result.status === "success" || result.video_url) {
    // Sesuaikan dengan respon tiktok-api23
    const videoData = result; 
    
    document.getElementById('thumb').src = videoData.cover || '';
    document.getElementById('author').innerText = "@" + (videoData.author || "TikTok User");
    document.getElementById('desc').innerText = videoData.title || "Video Downloaded";
    
    // Link video tanpa watermark di api23 biasanya ada di 'video_url'
    const downloadBtn = document.getElementById('downloadLink');
    downloadBtn.href = videoData.video_url || videoData.nowm_video_url; 
    
    resultArea.classList.remove('hidden');
} else {
    alert('Gagal mengambil video. Cek apakah link benar!');
}
