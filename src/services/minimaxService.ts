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
    try {
        const response = await fetch('/api/speech', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, voiceId }),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch from backend API');
        }

        const result: MiniMaxResponse = await response.json();

        if (result.base_resp.status_code !== 0 || !result.data?.audio) {
            throw new Error(`MiniMax Error: ${result.base_resp.status_msg}`);
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