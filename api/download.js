// api/download.js
export default async function handler(req, res) {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'URL TikTok tidak boleh kosong!' });
    }

    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': process.env.RAPIDAPI_KEY,
            'x-rapidapi-host': 'tiktok-api23.p.rapidapi.com'
        }
    };

    try {
        // Ambil data dari API
        const response = await fetch(`https://tiktok-api23.p.rapidapi.com/api/download/video?url=${encodeURIComponent(url)}`, options);
        const data = await response.json();

        // Header Anti-Cache agar data selalu fresh
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Server Error', detail: error.message });
    }
}
