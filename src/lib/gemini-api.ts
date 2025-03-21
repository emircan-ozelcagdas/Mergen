import { GoogleGenerativeAI } from '@google/generative-ai';
import { toast } from "sonner";

// API Yanıt Tipi
export interface GeminiResponse {
  success: boolean;
  data?: {
    content: string;
    metadata: {
      model: string;
      promptTokens?: number;
      totalTokens?: number;
      finishReason?: string;
    }
  };
  error?: {
    code: string;
    message: string;
    details?: unknown;
  }
}

// İstek Parametreleri
export interface GeminiRequestParams {
  grade: string;
  subject: string;
  topic: string;
}

// API Anahtarını Kontrol Et
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.error("VITE_GEMINI_API_KEY bulunamadı!");
  toast.error("API anahtarı eksik. Lütfen sistem yöneticisiyle iletişime geçin.");
}

// Gemini API İstemcisi
const genAI = new GoogleGenerativeAI(API_KEY);

// API İstek Fonksiyonu
export async function sendMessageToGemini(params: GeminiRequestParams): Promise<GeminiResponse> {
  try {
    console.info("[Gemini API] İstek başlatılıyor:", {
      ...params,
      timestamp: new Date().toISOString()
    });
    
    const { grade, subject, topic } = params;
    const subjectName = subject === 'literature' ? 'Edebiyat' : 'Matematik';

    // Model Konfigürasyonu
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-pro-002",
      generationConfig: {
        temperature: 0.9,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      }
    });

    // Prompt Şablonu
    const prompt = `Sen bir ${grade}. sınıf ${subjectName} öğretmenisin. "${topic}" konusunu öğrenciye anlatman gerekiyor. 
    Lütfen konuyu basit ve anlaşılır bir şekilde, örneklerle açıkla. Türkçe yanıt ver.
    
    Yanıtını şu formatta ver:
    
    KONU TANITIMI:
    [Konunun kısa bir tanıtımı]
    
    TEMEL KAVRAMLAR:
    - [Kavram 1]: [Açıklama]
    - [Kavram 2]: [Açıklama]
    ...
    
    ÖRNEKLER:
    1. [Örnek]
    2. [Örnek]
    ...
    
    ALIŞTIRMALAR:
    1. [Soru]
    2. [Soru]
    ...
    
    ÖNEMLİ NOTLAR:
    - [Not 1]
    - [Not 2]
    ...`;

    console.debug("[Gemini API] Prompt hazırlandı:", prompt);

    // Chat Oturumu Başlat
    const chat = model.startChat({
      history: [],
      generationConfig: {
        temperature: 0.9,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      }
    });

    // API İsteği Gönder
    const result = await chat.sendMessage(prompt);
    console.debug("[Gemini API] Ham yanıt alındı:", result);

    const response = await result.response;
    const text = response.text();

    if (!text) {
      throw new Error("API'den boş yanıt geldi");
    }

    // Başarılı Yanıt
    const successResponse: GeminiResponse = {
      success: true,
      data: {
        content: text,
        metadata: {
          model: "gemini-1.5-pro-002",
          // API yanıtından token bilgilerini al
          promptTokens: response.promptFeedback?.safetyRatings?.length || 0,
          totalTokens: response.candidates?.length || 0,
          finishReason: response.candidates?.[0]?.finishReason || 'STOP'
        }
      }
    };

    console.info("[Gemini API] İstek başarıyla tamamlandı:", {
      requestId: Date.now().toString(),
      timestamp: new Date().toISOString(),
      metadata: successResponse.data.metadata
    });

    return successResponse;

  } catch (error) {
    // Hata Detaylarını Logla
    console.error("[Gemini API] Hata:", {
      error,
      timestamp: new Date().toISOString(),
      request: params
    });
    
    // Hata Yanıtı Oluştur
    const errorResponse: GeminiResponse = {
      success: false,
      error: {
        code: error instanceof Error ? error.name : 'UNKNOWN_ERROR',
        message: error instanceof Error ? error.message : 'Beklenmeyen bir hata oluştu',
        details: error
      }
    };

    // Kullanıcıya Bildirim Göster
    toast.error(errorResponse.error.message);
    
    return errorResponse;
  }
}

export interface GenerateTestParams {
  grade: string;
  subject: string;
  topic: string;
}

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface GenerateTestResponse {
  success: boolean;
  data?: {
    questions: Question[];
  };
  error?: {
    message: string;
  };
}

export async function generateTest(params: GenerateTestParams): Promise<GenerateTestResponse> {
  try {
    const { grade, subject, topic } = params;
    const subjectName = subject === 'literature' ? 'Edebiyat' : 'Matematik';

    // Model Konfigürasyonu
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-pro-002",
      generationConfig: {
        temperature: 0.9,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      }
    });

    // Prompt Şablonu
    const prompt = `${grade}. sınıf ${subjectName} dersinden "${topic}" konusu için 10 adet çoktan seçmeli soru oluştur. 
    Her soru için 5 şık olmalı. Yanıtı aşağıdaki JSON formatında ver:
    
    {
      "question": "Soru metni",
      "options": ["A şıkkı", "B şıkkı", "C şıkkı", "D şıkkı", "E şıkkı"],
      "correctAnswer": 0
    }
    
    Her soruyu ayrı bir satırda ver.`;

    // Chat Oturumu Başlat
    const chat = model.startChat({
      history: [],
      generationConfig: {
        temperature: 0.9,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      }
    });

    // API İsteği Gönder
    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const text = response.text();

    if (!text) {
      throw new Error("API'den boş yanıt geldi");
    }

    // API yanıtını işle ve soruları oluştur
    const questions: Question[] = text
      .split('\n')
      .filter(line => line.trim())
      .map((line, index) => {
        try {
          const parsed = JSON.parse(line);
          return {
            id: index + 1,
            question: parsed.question,
            options: parsed.options,
            correctAnswer: parsed.correctAnswer
          };
        } catch (error) {
          console.error('Soru ayrıştırma hatası:', error);
          throw new Error('Soru formatı geçersiz');
        }
      });

    return {
      success: true,
      data: {
        questions
      }
    };
  } catch (error) {
    console.error('Test oluşturma hatası:', error);
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Test oluşturulurken bir hata oluştu'
      }
    };
  }
}
