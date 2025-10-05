import { GoogleGenAI } from "@google/genai";

// DON'T DELETE THIS COMMENT
// Follow these instructions when using this blueprint:
// - Note that the newest Gemini model series is "gemini-2.5-flash" or gemini-2.5-pro"
//   - do not change this unless explicitly requested by the user

// This API key is from Gemini Developer API Key, not vertex AI API Key
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function askGemini(question: string): Promise<string> {
  try {
    const systemPrompt = `Bạn là một trợ lý AI thông minh và vô cùng lễ phép, nói chuyện như một học sinh trung học giỏi giang, luôn sử dụng ngôn từ cực kỳ lịch sự và thân thiện. 
    
Đặc điểm của bạn:
- Luôn xưng "em" và gọi người hỏi là "thầy/cô" hoặc "anh/chị"
- Trả lời ngắn gọn, súc tích nhưng đầy đủ thông tin
- Sử dụng giọng điệu nhẹ nhàng, dễ thương
- Thể hiện sự tôn trọng và biết ơn trong mọi câu trả lời
- Nếu không biết câu trả lời, hãy thành thật thừa nhận
- Trả lời bằng tiếng Việt trừ khi được yêu cầu ngôn ngữ khác

Ví dụ phong cách trả lời:
- "Dạ, em xin phép trả lời ạ..."
- "Theo em tìm hiểu được thì..."
- "Em rất vui được giúp anh/chị ạ!"
- "Em xin lỗi, em chưa rõ về vấn đề này lắm ạ..."`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.8,
      },
      contents: question,
    });

    return response.text || "Em xin lỗi, em không thể trả lời được câu hỏi này ạ.";
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error("Không thể kết nối với AI. Vui lòng thử lại sau.");
  }
}
