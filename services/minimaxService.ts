const BASE_URL = "https://api.minimax.chat/v1/t2a_v2";
const API_KEY = import.meta.env.VITE_MINIMAX_API_KEY;


interface MiniMaxResponse {
    base_resp: {
        status_code: number;
        status_msg: string;
    };
    data?: {
        audio: string;
        status?: number;
    };
}


function hexToUint8Array(hexString: string): Uint8Array {
    if (hexString.length % 2 !== 0) {
        console.error("Invalid hex string");
        return new Uint8Array(0);
    }
    const bytes = new Uint8Array(hexString.length / 2);
    for (let i = 0; i < hexString.length; i += 2) {
        bytes[i / 2] = Number.parseInt(hexString.slice(i, i + 2), 16);
    }
    return bytes;
}



export async function generateSpeechFromMiniMax(
    text: string,
    voiceId: string = "French_MovieLeadFemale"
): Promise<string> {
    if (!API_KEY) {
        throw new Error("Missing VITE_MINIMAX_API_KEY");
    }
    const payload = {
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
    };

    try {
        const response = await fetch(`${BASE_URL}`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`MiniMax API Error: ${response.statusText}`);
        }

        const result: MiniMaxResponse = await response.json();

        if (result.base_resp.status_code !== 0 || !result.data?.audio) {
            throw new Error(`MiniMax Business Error: ${result.base_resp.status_msg}`);
        }

        const hexAudio = result.data.audio;
        const audioBuffer = hexToUint8Array(hexAudio);
        const blob = new Blob([audioBuffer as any], { type: "audio/mpeg" });
        const audioUrl = URL.createObjectURL(blob);
        return audioUrl;
    } catch (error) {
        console.error("Speech generation failed:", error);
        throw error;
    }
}