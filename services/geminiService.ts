import { GoogleGenAI, Chat } from "@google/genai";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Edits an image based on a text prompt using Gemini 2.5 Flash Image.
 * @param base64Image The source image in base64 format.
 * @param prompt The user's editing instruction (e.g., "Add a retro filter").
 * @returns The base64 string of the generated image.
 */
export const editImageWithGemini = async (base64Image: string, prompt: string): Promise<string | null> => {
  try {
    // Strip header if present (e.g., "data:image/png;base64,")
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: 'image/jpeg', // Assuming jpeg for simplicity, or detect from source
            },
          },
          {
            text: prompt,
          },
        ],
      },
    });

    // Parse the response to find the image part
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error("Gemini Image Edit Error:", error);
    throw error;
  }
};

/**
 * Creates a new chat session with the VendeAqui assistant persona.
 * Supports context awareness and multi-language responses.
 */
export const createChatSession = (): Chat => {
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      systemInstruction: `
        Você é o assistente virtual inteligente da plataforma 'VendeAqui'.
        
        SUA MISSÃO:
        Ajudar compradores a encontrar produtos e vendedores a gerir suas lojas.
        
        IDIOMAS:
        Você deve ser capaz de compreender e responder fluentemente em: Português (PT), Inglês (EN), Espanhol (ES) e Francês (FR).
        Detecte o idioma do usuário e responda no mesmo idioma. Se não tiver certeza, use Português.

        CONTEXTO DA LOJA:
        - Categorias: Electrónica, Moda, Casa & Cozinha, Serviços, Supermercado.
        - Moeda: Metical (MT).
        - Localização: Moçambique.

        COMPORTAMENTO:
        1. Seja educado, breve e direto.
        2. Use formatação Markdown (negrito, listas) para facilitar a leitura.
        3. Se o usuário perguntar sobre o status de um pedido, explique que eles podem ver no Dashboard > Pedidos.
        4. Sugira produtos baseados em descrições vagas (ex: "quero algo para jogar" -> sugira laptops ou consoles).
      `,
    },
  });
};
