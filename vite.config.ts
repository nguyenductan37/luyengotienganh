import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

// Custom plugin to handle server-side API requests in development when Vite is run directly
function apiPlugin() {
  return {
    name: 'api-plugin',
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        if (req.url && req.url.startsWith('/api/generate-lesson') && req.method === 'POST') {
          try {
            // Read req body
            let body = '';
            for await (const chunk of req) {
              body += chunk;
            }
            const { prompt } = JSON.parse(body || '{}');

            if (!prompt) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Chủ đề bài học (prompt) là bắt buộc.' }));
              return;
            }

            const key = process.env.GEMINI_API_KEY;
            if (!key || key === 'MY_GEMINI_API_KEY') {
              res.statusCode = 401;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'GEMINI_API_KEY chưa được đặt. Vui lòng thiết lập key trong Settings > Secrets và chạy lại.' }));
              return;
            }

            const ai = new GoogleGenAI({ apiKey: key });

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
                          ipa: { type: Type.STRING },
                          meaning: { type: Type.STRING },
                          partOfSpeech: { type: Type.STRING },
                          example: { type: Type.STRING },
                          exampleMeaning: { type: Type.STRING }
                        },
                        required: ['word', 'meaning', 'example'],
                      },
                    },
                    displayText: { 
                      type: Type.STRING, 
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

            if (!parsedData.displayText && parsedData.items) {
              parsedData.displayText = parsedData.items.map((it: any) => it.word).join(' ');
            }

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(parsedData));
          } catch (err: any) {
            console.error('Lỗi khi gọi Gemini API từ Vite dev:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ 
              error: 'Không thể khởi tạo bài viết từ AI.', 
              details: err.message || 'Lỗi không xác định' 
            }));
          }
          return;
        }

        if (req.url === '/api/health') {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ status: 'ok', time: new Date() }));
          return;
        }

        next();
      });
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), apiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
