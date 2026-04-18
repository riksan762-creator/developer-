// api/download.js
export default async function handler(req, res) {
    // Hanya izinkan metode GET
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ message: 'URL TikTok wajib diisi!' });
    }

    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': process.env.RAPIDAPI_KEY,
            'x-rapidapi-host': process.env.RAPIDAPI_HOST
        }
    };

    try {
        // Menggunakan endpoint v1/download milik tiktok-scraper7
        const response = await fetch(`https://tiktok-scraper7.p.rapidapi.com/v1/download?url=${encodeURIComponent(url)}`, options);
        
        if (!response.ok) {
            throw new Error(`API Response Error: ${response.status}`);
        }

        const data = await response.json();
        
        // Kirim data ke frontend
        return res.status(200).json(data);
    } catch (error) {
        console.error('Fetch Error:', error);
        return res.status(500).json({ 
            message: 'Gagal terhubung ke server API',
            error: error.message 
        });
    }
}
