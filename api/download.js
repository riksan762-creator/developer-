export default async function handler(req, res) {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: 'URL Kosong' });

    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': process.env.RAPIDAPI_KEY,
            'x-rapidapi-host': 'tiktok-api23.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(`https://tiktok-api23.p.rapidapi.com/api/download/video?url=${encodeURIComponent(url)}`, options);
        const data = await response.json();
        
        // Log untuk intip di Vercel Dashboard jika error lagi
        console.log("Respon API23:", data);

        res.setHeader('Cache-Control', 'no-store');
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
}
