// app.js
const btnAction = document.getElementById('btnAction');
const loader = document.getElementById('loader');
const result = document.getElementById('result');

btnAction.addEventListener('click', async () => {
    const url = document.getElementById('tiktokUrl').value;
    
    if (!url) {
        alert('Masukkan URL TikTok dulu bos!');
        return;
    }

    // Reset UI
    loader.classList.remove('hidden');
    result.classList.add('hidden');
    btnAction.disabled = true;

    try {
        // Memanggil internal API (Vercel Function)
        const response = await fetch(`/api/download?url=${encodeURIComponent(url)}`);
        const data = await response.json();

        if (data.status === "success" || data.data) {
            const videoData = data.data;
            document.getElementById('thumb').src = videoData.cover;
            document.getElementById('author').innerText = "@" + (videoData.author.unique_id || "User");
            document.getElementById('desc').innerText = videoData.title || "No description";
            document.getElementById('downloadLink').href = videoData.play;

            result.classList.remove('hidden');
        } else {
            alert('Video tidak ditemukan atau API Limit!');
        }
    } catch (error) {
        console.error(error);
        alert('Terjadi kesalahan server.');
    } finally {
        loader.classList.add('hidden');
        btnAction.disabled = false;
    }
});
