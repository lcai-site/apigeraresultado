// FIX: Import React to resolve 'React' namespace error for JSX and React types.
import React from 'react';
import { ImageResponse } from '@vercel/og';
// Use standard Request for better compatibility

export const runtime = 'edge';

// URLs das imagens base
const BASE_IMAGE_BRAIN_URL = 'https://i.postimg.cc/LXMYjwtX/Inserir-um-t-tulo-6.png';
const BASE_IMAGE_ANIMALS_URL = 'https://i.postimg.cc/0N1sjN2W/Inserir-um-t-tulo-7.png';
const N8N_WEBHOOK_URL = 'https://n8n.lcai.com.br/webhook/imagensprontas';

interface AnimalData {
  lobo: number;
  aguia: number;
  tubarao: number;
  gato: number;
}

interface BrainData {
  pensante: number;
  atuante: number;
  razao: number;
  emocao: number;
}

// Função para converter ArrayBuffer para Base64
function arrayBufferToBase64(buffer: ArrayBuffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

const getJsonData = (req: Request) => {
    const { searchParams } = new URL(req.url);
    const dataParam = searchParams.get('data');
    if (!dataParam) {
        throw new Error('Parâmetro "data" não encontrado na URL.');
    }
    try {
        return JSON.parse(dataParam);
    } catch (e) {
        throw new Error("O valor do parâmetro 'data' não é um JSON válido.");
    }
}

const generateImage = async (baseImageUrl: string, children: React.ReactNode) => {
    const fontData = await fetch(
        new URL('https://fonts.gstatic.com/s/montserrat/v26/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtr6Hw5aX8.ttf')
    ).then((res) => res.arrayBuffer());

    const response = new ImageResponse(
        (
            <div style={{
                display: 'flex',
                width: '100%',
                height: '100%',
                backgroundImage: `url(${baseImageUrl})`,
                backgroundSize: '100% 100%',
            }}>
                {children}
            </div>
        ),
        {
            width: 650,
            height: 900,
            fonts: [{ name: 'Montserrat', data: fontData, style: 'normal', weight: 700 }],
        }
    );
    const buffer = await response.arrayBuffer();
    return `data:image/png;base64,${arrayBufferToBase64(buffer)}`;
};

export default async function handler(req: Request) { // Changed to standard Request
    try {
        const jsonData = getJsonData(req);

        // Validação de dados
        const requiredKeys = ["A", "G", "T", "L", "Principal", "Emoção Direito", "Razão Esquerdo", "Pensante Anterior", "Atuante Posterior"];
        const missingKeys = requiredKeys.filter(key => !(key in jsonData));
        if (missingKeys.length > 0) {
            throw new Error(`As seguintes chaves estão faltando nos dados: ${missingKeys.join(', ')}`);
        }

        const animalData: AnimalData = {
            aguia: parseInt(jsonData.A, 10),
            gato: parseInt(jsonData.G, 10),
            tubarao: parseInt(jsonData.T, 10),
            lobo: parseInt(jsonData.L, 10),
        };

        const brainData: BrainData = {
            razao: parseInt(jsonData["Razão Esquerdo"], 10),
            emocao: parseInt(jsonData["Emoção Direito"], 10),
            pensante: parseInt(jsonData["Pensante Anterior"], 10),
            atuante: parseInt(jsonData["Atuante Posterior"], 10),
        };

        // Validação de valores numéricos
        const allValues = [...Object.values(animalData), ...Object.values(brainData)];
        if (allValues.some(isNaN)) {
            throw new Error("Um ou mais valores numéricos fornecidos são inválidos. Verifique se os dados de porcentagem são números.");
        }

        const principalAnimalFullName = jsonData.Principal;
        const animalNameMap: { [key: string]: keyof AnimalData } = {
            'Águia': 'aguia', 'Gato': 'gato', 'Tubarão': 'tubarao', 'Lobo': 'lobo'
        };
        const principalAnimalKey = animalNameMap[principalAnimalFullName];
        if (!principalAnimalKey) {
            throw new Error(`Valor de "Principal" inválido: "${principalAnimalFullName}".`);
        }

        // --- Geração da Imagem de Animais ---
        const animalImageBase64 = await generateImage(
            BASE_IMAGE_ANIMALS_URL,
            <>
                {/* Lobo */}
                <div style={{ position: 'absolute', top: 262, left: 110, width: 'auto', textAlign: 'right', color: principalAnimalKey === 'lobo' ? '#FFED00' : 'white', fontSize: principalAnimalKey === 'lobo' ? 40 : 36, fontFamily: 'Montserrat', fontWeight: 700, textShadow: '0 0 10px rgba(0,0,0,0.8)' }}>{animalData.lobo}%</div>
                {/* Águia */}
                <div style={{ position: 'absolute', top: 262, left: 410, width: 'auto', textAlign: 'right', color: principalAnimalKey === 'aguia' ? '#FFED00' : 'white', fontSize: principalAnimalKey === 'aguia' ? 40 : 36, fontFamily: 'Montserrat', fontWeight: 700, textShadow: '0 0 10px rgba(0,0,0,0.8)' }}>{animalData.aguia}%</div>
                {/* Tubarão */}
                <div style={{ position: 'absolute', top: 612, left: 110, width: 'auto', textAlign: 'right', color: principalAnimalKey === 'tubarao' ? '#FFED00' : 'white', fontSize: principalAnimalKey === 'tubarao' ? 40 : 36, fontFamily: 'Montserrat', fontWeight: 700, textShadow: '0 0 10px rgba(0,0,0,0.8)' }}>{animalData.tubarao}%</div>
                {/* Gato */}
                <div style={{ position: 'absolute', top: 612, left: 410, width: 'auto', textAlign: 'right', color: principalAnimalKey === 'gato' ? '#FFED00' : 'white', fontSize: principalAnimalKey === 'gato' ? 40 : 36, fontFamily: 'Montserrat', fontWeight: 700, textShadow: '0 0 10px rgba(0,0,0,0.8)' }}>{animalData.gato}%</div>
            </>
        );

        // --- Geração da Imagem do Cérebro ---
        const brainImageBase64 = await generateImage(
            BASE_IMAGE_BRAIN_URL,
            <>
                <div style={{ position: 'absolute', top: 218, left: 0, width: '100%', textAlign: 'center', color: 'white', fontSize: 44, fontFamily: 'Montserrat', fontWeight: 700, textShadow: '0 0 10px rgba(0,0,0,0.8)' }}>{brainData.pensante}%</div>
                <div style={{ position: 'absolute', top: 758, left: 0, width: '100%', textAlign: 'center', color: 'white', fontSize: 44, fontFamily: 'Montserrat', fontWeight: 700, textShadow: '0 0 10px rgba(0,0,0,0.8)' }}>{brainData.atuante}%</div>
                <div style={{ position: 'absolute', top: 428, left: 48, width: 'auto', textAlign: 'left', color: 'white', fontSize: 44, fontFamily: 'Montserrat', fontWeight: 700, textShadow: '0 0 10px rgba(0,0,0,0.8)' }}>{brainData.razao}%</div>
                <div style={{ position: 'absolute', top: 428, right: 48, width: 'auto', textAlign: 'right', color: 'white', fontSize: 44, fontFamily: 'Montserrat', fontWeight: 700, textShadow: '0 0 10px rgba(0,0,0,0.8)' }}>{brainData.emocao}%</div>
            </>
        );

        // --- Envio para N8N ---
        const n8nPayload = {
            animalImage: animalImageBase64,
            brainImage: brainImageBase64,
            params: jsonData,
        };
        
        const n8nResponse = await fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(n8nPayload),
        });

        if (!n8nResponse.ok) {
            const errorBody = await n8nResponse.text();
            throw new Error(`Falha ao enviar dados para N8N. Status: ${n8nResponse.status}. Corpo: ${errorBody}`);
        }
        
        // --- Resposta de Sucesso ---
        return new Response(
            JSON.stringify({
                success: true,
                message: "Imagens geradas e enviadas para o N8N com sucesso.",
            }),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            }
        );

    } catch (e: any) {
        console.error(e);
        return new Response(
            JSON.stringify({ success: false, error: e.message }),
            {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }
}
