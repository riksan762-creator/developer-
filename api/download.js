// api/download.js
export default async function handler(req, res) {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: 'URL missing' });

    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': process.env.RAPIDAPI_KEY,
            'x-rapidapi-host': process.env.RAPIDAPI_HOST
        }
    };

    try {
        // Menggunakan endpoint tiktok-api23 sesuai curl Anda
        const response = await fetch(`https://tiktok-api23.p.rapidapi.com/api/download/video?url=${encodeURIComponent(url)}`, options);
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
}
