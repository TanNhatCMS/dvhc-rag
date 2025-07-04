import { GoogleGenAI, Content } from "@google/genai";
import { AppSettings, ApiHistoryItem } from "../types";
import { getSystemInstruction, getTitleGenerationPrompt } from "./prompt";
import { tools as functionDeclarations, thucHienTraCuuDiaChiMoi } from "./tools";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const tools = [{ functionDeclarations }];

const parseJsonResponse = (jsonString: string): { response: string; suggestions: string[] } => {
    try {
        const match = jsonString.match(/```json\s*([\s\S]*?)\s*```/);
        const parsableString = match ? match[1] : jsonString;
        const parsed = JSON.parse(parsableString);
        if (typeof parsed.response === 'string' && Array.isArray(parsed.suggestions)) {
            return parsed;
        }
    } catch (e) {
        console.warn("Failed to parse JSON, returning original string.", e);
    }
    return {
        response: jsonString,
        suggestions: ["Có câu hỏi nào khác không?", "Tóm tắt lại thông tin.", "Cảm ơn bạn."]
    };
};

export const sendMessageToAI = async (
    history: ApiHistoryItem[],
    ragContent: string,
    settings: AppSettings
): Promise<{ newTurns: ApiHistoryItem[], responseText: string, suggestions: string[] }> => {
    const errorResponse = {
        newTurns: [{ role: 'model', parts: [{ text: "Xin lỗi, đã có lỗi xảy ra khi xử lý yêu cầu của bạn. Vui lòng thử lại sau." }] }] as ApiHistoryItem[],
        responseText: "Xin lỗi, đã có lỗi xảy ra khi xử lý yêu cầu của bạn. Vui lòng thử lại sau.",
        suggestions: []
    };
    
    try {
        const fullSystemInstruction = getSystemInstruction(settings, ragContent);
        
        const result = await ai.models.generateContent({
            model: settings.aiModel,
            contents: history,
            config: {
                systemInstruction: fullSystemInstruction,
                tools: tools,
            }
        });

        const response = result.candidates?.[0];

        if (response?.content?.parts[0]?.functionCall) {
            const call = response.content.parts[0].functionCall;
            let toolResponsePayload: any;

            if (call.name === 'traCuuDiaChiMoi') {
                const args = call.args as { diaChiCu: string };
                toolResponsePayload = await thucHienTraCuuDiaChiMoi(args.diaChiCu);
            } else {
                toolResponsePayload = { error: `Công cụ không xác định: ${call.name}` };
            }
            
            // Critical Fix: Reconstruct modelTurn precisely to avoid invalid history
            const modelTurn: ApiHistoryItem = { role: 'model', parts: [{ functionCall: call }] };

            const toolTurn: ApiHistoryItem = {
                role: 'function',
                parts: [{
                    functionResponse: {
                        name: call.name,
                        response: toolResponsePayload
                    }
                }]
            };

            const secondResult = await ai.models.generateContent({
                model: settings.aiModel,
                contents: [...history, modelTurn, toolTurn],
                config: {
                    systemInstruction: fullSystemInstruction,
                    tools: tools,
                }
            });
            
            const finalResponse = secondResult.candidates?.[0];
            if (!finalResponse?.content) {
                 return { ...errorResponse, responseText: "Xin lỗi, AI đã không đưa ra phản hồi.", newTurns: [{ role: 'model', parts: [{ text: "Xin lỗi, AI đã không đưa ra phản hồi."}] }]};
            }
            
            const parsed = parseJsonResponse(finalResponse.content.parts[0].text ?? '');
            const finalContent: ApiHistoryItem = { role: 'model', parts: [{ text: parsed.response }] };

            return {
                newTurns: [modelTurn, toolTurn, finalContent],
                responseText: parsed.response,
                suggestions: parsed.suggestions
            };
        } else if (response?.content?.parts[0]?.text) {
             const parsed = parseJsonResponse(response.content.parts[0].text);
             const finalContent: ApiHistoryItem = { role: 'model', parts: [{ text: parsed.response }] };
             return {
                newTurns: [finalContent],
                responseText: parsed.response,
                suggestions: parsed.suggestions
             };
        } else {
            return errorResponse;
        }
    } catch (error) {
        console.error("Error sending message to AI:", error);
        return errorResponse;
    }
};

export const sendMessageToAIStream = async (
    history: ApiHistoryItem[],
    ragContent: string,
    settings: AppSettings,
    onSuggestions: (suggestions: string[]) => void
): Promise<AsyncGenerator<string>> => {
     try {
        const fullSystemInstruction = getSystemInstruction(settings, ragContent);
        const result = await ai.models.generateContentStream({
            model: settings.aiModel,
            contents: history,
            config: {
                systemInstruction: fullSystemInstruction,
            }
        });

        async function* streamGenerator(): AsyncGenerator<string> {
            let fullText = '';
            for await (const chunk of result) {
                const chunkText = chunk.text;
                if(chunkText) {
                    fullText += chunkText;
                    yield chunkText;
                }
            }
            // In streaming, suggestions are part of the final text, so we parse it here.
            const parsed = parseJsonResponse(fullText);
            // We need to return the response part for display
            // and trigger suggestions separately.
            onSuggestions(parsed.suggestions);
            // The final yielded text might be different if the parsing logic cleans it.
            // But for simplicity, we'll assume the stream has yielded the full text.
            // A more robust solution might re-yield the parsed.response if it differs.
        }
        
        return streamGenerator();

    } catch (error) {
        console.error("Error sending message to AI for streaming:", error);
        async function* errorGenerator(): AsyncGenerator<string> {
            yield "Xin lỗi, đã có lỗi xảy ra khi bắt đầu phiên streaming.";
        }
        onSuggestions([]);
        return errorGenerator();
    }
}


export const generateChatTitle = async (userPrompt: string): Promise<string> => {
    try {
        const prompt = getTitleGenerationPrompt(userPrompt);
        const result = await ai.models.generateContent({
            model: 'gemini-2.5-flash-preview-04-17',
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
        });
        return result.text.trim().replace(/"/g, '');
    } catch (error) {
        console.error("Error generating title:", error);
        return "Cuộc trò chuyện mới";
    }
};