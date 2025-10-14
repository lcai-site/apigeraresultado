import { ImageResponse } from '@vercel/og';
import type { NextRequest } from 'next/server';
import React from 'react';

export const config = {
  runtime: 'edge',
};

const BASE_IMAGE_BRAIN_URL = 'https://i.postimg.cc/LXMYjwtX/Inserir-um-t-tulo-6.png';
const BASE_IMAGE_ANIMALS_URL = 'https://i.postimg.cc/0N1sjN2W/Inserir-um-t-tulo-7.png';

const getFont = async () => {
  const res = await fetch('https://fonts.gstatic.com/s/montserrat/v26/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtr6Hw5aXo.ttf');
  return res.arrayBuffer();
}

// --- Componentes de Imagem (sem alteração) ---

const AnimalImage = ({ data }: { data: any }) => {
  const animalData = {
    lobo: parseInt(data.L, 10),
    aguia: parseInt(data.A, 10),
    tubarao: parseInt(data.T, 10),
    gato: parseInt(data.G, 10),
  };

  const animalEntries = Object.entries(animalData);
  let highestAnimalName: string | null = null;
  let maxPercentage = -1;

  for (const [name, percentage] of animalEntries) {
    if (percentage > maxPercentage) {
      maxPercentage = percentage;
      highestAnimalName = name;
    }
  }

  const positions: { [key: string]: { top: string; left: string } } = {
    lobo:    { top: '280px', left: '120px' },
    aguia:   { top: '280px', left: '420px' },
    tubarao: { top: '630px', left: '120px' },
    gato:    { top: '630px', left: '420px' },
  };

  return (
    <div style={{ fontFamily: 'Montserrat', textShadow: '0 0 10px rgba(0,0,0,0.8)', position: 'relative', width: '540px', height: '790px', display: 'flex', color: 'white', fontWeight: 700 }}>
      <img src={BASE_IMAGE_ANIMALS_URL} style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, width: '100%', height: '100%' }} />
      {Object.entries(animalData).map(([name, percentage]) => {
        const isHighest = name === highestAnimalName;
        const pos = positions[name];
        return (
          <div
            key={name}
            style={{
              fontSize: isHighest ? '40px' : '36px',
              color: isHighest ? '#FFED00' : '#FFFFFF',
              top: pos.top,
              left: pos.left,
              transform: 'translateY(-50%)',
              position: 'absolute',
              width: '96px',
              textAlign: 'right'
            }}
          >
            {percentage}%
          </div>
        );
      })}
    </div>
  );
};

const BrainImage = ({ data }: { data: any }) => {
    const brainData = {
      pensante: parseInt(data['Pensante Anterior'], 10),
      atuante: parseInt(data['Atuante Posterior'], 10),
      razao: parseInt(data['Razão Esquerdo'], 10),
      emocao: parseInt(data['Emoção Direito'], 10),
    };

  return (
    <div style={{ fontFamily: 'Montserrat', textShadow: '0 0 10px rgba(0,0,0,0.8)', position: 'relative', width: '640px', height: '980px', display: 'flex', color: 'white', fontWeight: 700, fontSize: '44px' }}>
      <img src={BASE_IMAGE_BRAIN_URL} style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, width: '100%', height: '100%' }} />
      <div style={{ top: '240px', left: '50%', transform: 'translate(-50%, -50%)', position: 'absolute', textAlign: 'center' }}>{brainData.pensante}%</div>
      <div style={{ top: '780px', left: '50%', transform: 'translate(-50%, -50%)', position: 'absolute', textAlign: 'center' }}>{brainData.atuante}%</div>
      <div style={{ top: '450px', left: '48px', transform: 'translateY(-50%)', position: 'absolute', textAlign: 'left' }}>{brainData.razao}%</div>
      <div style={{ top: '450px', right: '40px', transform: 'translateY(-50%)', position: 'absolute', textAlign: 'right' }}>{brainData.emocao}%</div>
    </div>
  );
};

// --- Função para converter ArrayBuffer para Base64 ---
function arrayBufferToBase64(buffer: ArrayBuffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// --- Handler Principal da API ---

export default async function handler(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // 1. Verifica se o parâmetro 'data' existe
    const dataParam = searchParams.get('data');
    if (!dataParam) {
      return new Response('Parâmetro de consulta "data" ausente. Por favor, forneça o objeto JSON codificado na URL.', { status: 400 });
    }

    // 2. Tenta analisar o JSON
    let data;
    try {
      data = JSON.parse(dataParam);
    } catch (parseError: any) {
      console.error('Erro ao analisar JSON:', parseError.message);
      return new Response(`Falha ao analisar o parâmetro "data" como JSON. Verifique se o formato está correto. Erro: ${parseError.message}`, { status: 400 });
    }

    // 3. Valida se todas as chaves necessárias estão presentes nos dados
    const requiredKeys = ["A", "G", "T", "L", "Principal", "Emoção Direito", "Razão Esquerdo", "Pensante Anterior", "Atuante Posterior"];
    const missingKeys = requiredKeys.filter(key => !(key in data));
    if (missingKeys.length > 0) {
      return new Response(`As seguintes chaves estão faltando nos dados JSON: ${missingKeys.join(', ')}`, { status: 400 });
    }
    
    // Se a validação passar, continua com a geração da imagem
    const fontData = await getFont();

    // Gerar ambas as imagens em paralelo
    const [animalImageResponse, brainImageResponse] = await Promise.all([
      new ImageResponse(<AnimalImage data={data} />, {
        width: 540, height: 790,
        fonts: [{ name: 'Montserrat', data: fontData.slice(0), weight: 700, style: 'normal' }],
      }),
      new ImageResponse(<BrainImage data={data} />, {
        width: 640, height: 980,
        fonts: [{ name: 'Montserrat', data: fontData.slice(0), weight: 700, style: 'normal' }],
      }),
    ]);

    // Converter as respostas de imagem para ArrayBuffer
    const [animalImageBuffer, brainImageBuffer] = await Promise.all([
        animalImageResponse.arrayBuffer(),
        brainImageResponse.arrayBuffer()
    ]);

    // Codificar os buffers para Base64 e criar o Data URI
    const animalImageBase64 = `data:image/png;base64,${arrayBufferToBase64(animalImageBuffer)}`;
    const brainImageBase64 = `data:image/png;base64,${arrayBufferToBase64(brainImageBuffer)}`;

    // Criar o payload JSON de resposta
    const responsePayload = {
      animalImage: animalImageBase64,
      brainImage: brainImageBase64,
    };

    // Retornar a resposta como JSON
    return new Response(JSON.stringify(responsePayload), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });

  } catch (e: any) {
    console.error(`Erro inesperado no handler da API: ${e.message}`);
    return new Response(`Falha ao gerar imagens: ${e.message}`, { status: 500 });
  }
}
