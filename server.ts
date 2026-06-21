import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini AI Client to avoid application boot crashes when secret credentials are unset
let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error('GEMINI_API_KEY environment variable is required. Please set it in Settings > Secrets.');
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// 1. API: AI Lesson generation using "gemini-3.5-flash"
app.post('/api/generate-lesson', async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      res.status(400).json({ error: 'Chủ đề bài học (prompt) là bắt buộc.' });
      return;
    }

    const ai = getAiClient();
    
    const promptInstructions = `
      Hãy tạo một bài học luyện gõ tiếng Anh kết hợp học từ vựng/mẫu câu theo chủ đề sau: "${prompt}".
      Biên tập khoảng 6 đến 8 từ vựng hoặc cụm từ tiếng Anh liên quan mật thiết đến chủ đề.
      Cung cấp cấu trúc phản hồi đúng định dạng JSON yêu cầu.
      
      Yêu cầu mỗi từ vựng phải bao gồm:
      - word: Từ/cụm từ tiếng Anh chính xác (được viết thường hoặc viết hoa đúng ngữ pháp)
      - ipa: Cách phát âm theo chuẩn phiên âm quốc tế IPA (ví dụ: /ˈstræt.ə.dʒi/)
      - meaning: Nghĩa tiếng Việt giải thích ngắn gọn, súc tích
      - partOfSpeech: Từ loại của từ đó (như noun, verb, adjective, adverb, phrase)
      - example: Một câu ví dụ tiếng Anh ngắn, dễ hiểu, sử dụng từ này (độ dài khoảng 5-10 từ)
      - exampleMeaning: Dịch nghĩa tiếng Việt của câu ví dụ đó.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: promptInstructions,
      config: {
        systemInstruction: 'You are an educational curriculum expert. You compile beautiful vocabulary lists and conversational examples with translations in Vietnamese and phonetic IPA strings. Always response in strict valid JSON matching the requested schema.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            items: {
              type: Type.ARRAY,
              description: 'Mảng các từ vựng tiếng Anh được thiết kế',
              items: {
                type: Type.OBJECT,
                properties: {
                  word: { type: Type.STRING },
                  ipa: { type: Type.STRING, description: 'IPA phonetics e.g. /vaɪs/' },
                  meaning: { type: Type.STRING, description: 'Nghĩa tiếng Việt' },
                  partOfSpeech: { type: Type.STRING, description: 'Từ loại e.g. noun, verb, adj' },
                  example: { type: Type.STRING, description: 'Câu ví dụ ngắn bằng tiếng Anh' },
                  exampleMeaning: { type: Type.STRING, description: 'Dịch nghĩa câu ví dụ' }
                },
                required: ['word', 'meaning', 'example'],
              },
            },
            displayText: { 
              type: Type.STRING, 
              description: 'Một chuỗi dài ghép từ tất cả các thuộc tính "word" của các đối tượng trong mảng items, ngăn cách bởi duy nhất một dấu cách để thuận tiện khi gõ phím tập' 
            }
          },
          required: ['items'],
        }
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error('Gemini model returned empty response.');
    }

    const parsedData = JSON.parse(responseText.trim());

    // If displayText is absent, generate it by stitching words with a space
    if (!parsedData.displayText && parsedData.items) {
      parsedData.displayText = parsedData.items.map((it: any) => it.word).join(' ');
    }

    res.json(parsedData);
  } catch (err: any) {
    console.error('Lỗi khi gọi Gemini API:', err);
    res.status(500).json({ 
      error: 'Không thể khởi tạo bài viết từ AI.', 
      details: err.message || 'Lỗi không xác định' 
    });
  }
});

// 2. Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date() });
});

// Setup Vite Dev server or production static serving
async function initializeServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Vite middleware mounted in DEVELOPMENT mode');
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('Serving compiled client static bundles in PRODUCTION mode');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

initializeServer();
