// api/download.js
export default async function handler(req, res) {
    // Hanya izinkan request GET
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Metode tidak diizinkan' });
    }

    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ message: 'URL TikTok tidak boleh kosong!' });
    }

    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': process.env.RAPIDAPI_KEY,
            'x-rapidapi-host': process.env.RAPIDAPI_HOST
        }
    };

    try {
        // Menuju endpoint download (BUKAN favorite)
        const response = await fetch(`https://tiktok-scraper7.p.rapidapi.com/v1/download?url=${encodeURIComponent(url)}`, options);
        
        if (!response.ok) {
            return res.status(response.status).json({ message: 'API RapidAPI bermasalah' });
        }

        const result = await response.json();
        
        // Kirim hasil mentah ke frontend
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: 'Server Error', error: error.message });
    }
}
