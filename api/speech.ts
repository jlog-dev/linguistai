import type { VercelRequest, VercelResponse } from '@vercel/node';

const MINIMAX_API_KEY = process.env.MINIMAX_API_KEY;

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') return res.status(405).end();

    const { text, voiceId } = req.body;

    if (!MINIMAX_API_KEY) {
        return res.status(500).json({ error: 'Server configuration error: Missing API Key' });
    }

    try {
        const response = await fetch(`https://api.minimax.chat/v1/t2a_v2`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${MINIMAX_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "speech-2.6-hd",
                text: text,
                stream: false,
                voice_setting: {
                    voice_id: voiceId,
                    speed: 1,
                    vol: 1,
                    pitch: 0,
                },
                audio_setting: {
                    sample_rate: 32000,
                    bitrate: 128000,
                    format: "mp3",
                    channel: 1,
                },
            }),
        });

        const data = await response.json();
        res.status(200).json(data);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch speech from MiniMax' });
    }
}