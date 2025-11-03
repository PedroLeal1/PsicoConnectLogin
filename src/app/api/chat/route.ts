import { NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || ""; 
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${GEMINI_API_KEY}`;

function formatHistory(history: { role: string, text: string }[]): any[] {
  return history.map(msg => ({
    role: msg.role,
    parts: [{ text: msg.text }]
  }));
}

export async function POST(req: Request) {
  if (!GEMINI_API_KEY) {
    return NextResponse.json({ error: "Chave GEMINI_API_KEY não configurada no servidor." }, { status: 500 });
  }
  
  try {
    const { prompt, history } = await req.json();

    const contents = formatHistory(history);
    contents.push({ role: 'user', parts: [{ text: prompt }] });
    
    const systemInstruction = "Você é o PsicoConnect AI, um assistente empático especializado em fornecer informações gerais sobre saúde mental, terapias e bem-estar, baseado em fontes confiáveis. Mantenha um tom acolhedor e profissional. Se a pergunta for médica ou de diagnóstico, direcione o usuário a procurar um profissional de saúde qualificado. Use a ferramenta de busca para respostas atuais e fundamentadas.";

    const payload = {
      contents: contents,
      systemInstruction: {
        parts: [{ text: systemInstruction }]
      },
      tools: [{ google_search: {} }],
      generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.7,
      }
    };

    const apiResponse = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error("Erro da API Gemini:", apiResponse.status, errorText);
      return NextResponse.json({ error: "Falha ao obter resposta da IA." }, { status: apiResponse.status });
    }

    const result = await apiResponse.json();
    
    const responseText = result.candidates?.[0]?.content?.parts?.[0]?.text || "Desculpe, não consegui gerar uma resposta significativa.";

    let sources: any[] = [];
    const groundingMetadata = result.candidates?.[0]?.groundingMetadata;
    if (groundingMetadata && groundingMetadata.groundingAttributions) {
        sources = groundingMetadata.groundingAttributions.map((attr: any) => ({
            uri: attr.web?.uri,
            title: attr.web?.title,
        })).filter((source: any) => source.uri && source.title); 
    }
    
    let finalResponse = responseText;
    if (sources.length > 0) {
        finalResponse += "\n\n**Fontes de Pesquisa:**\n";
        sources.forEach((source, index) => {
            finalResponse += `* [${source.title}](${source.uri})\n`;
        });
    }

    return NextResponse.json({ response: finalResponse, sources: sources });

  } catch (error) {
    console.error("Erro no servidor de chat:", error);
    return NextResponse.json({ error: "Erro interno do servidor ao processar o chat." }, { status: 500 });
  }
}