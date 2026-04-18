// api/download.js
export default async function handler(req, res) {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': 'a3ae7239c5mshed8fb2f0bc05f98p149e10jsn83d12272bd79',
            'x-rapidapi-host': 'tiktok-api23.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(`https://tiktok-api23.p.rapidapi.com/api/download/video?url=${encodeURIComponent(url)}`, options);
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
}
