import { ImageResponse } from '@vercel/og';
import type { NextRequest } from 'next/server';
import React from 'react';

export const config = {
  runtime: 'edge',
};

const BASE_IMAGE_BRAIN_URL = 'https://i.postimg.cc/LXMYjwtX/Inserir-um-t-tulo-6.png';
const BASE_IMAGE_ANIMALS_URL = 'https://i.postimg.cc/0N1sjN2W/Inserir-um-t-tulo-7.png';

// --- FONTE EMBUTIDA ---
const montserratBoldBase64 = 'AAEAAAARAQAABAAQR0RFRgB5AADgAAAAA8AAAB4R1BPU/8D4fEAAAXQAAAKiEdTVUKp//IAAAhgAAAAPk9TLzK/kdCWAABDYAAABYAAAAFiGNtYXABTwCPAAEeAAAA/AAAAABjdnQgEGUEJwAAJRAAAAAaZ2FzcAAAABAAAAEUAAAACGdseWbWb5gsAAn0AAAANAAAEP5oZWFkAfB5+gAAQ0gAAAA2AAAANmhoZWEH8wXpAABDSAAAACQAAAAkaG10eAsAAtIAAEPUAAAB4AAAA3xtYXhwAWQAOQAAQ6AAAAAGAAAABgBuYW1l4dfrGgABHywAAAGwAAABonBvc3R/7gDCAAAkRAAAAMMAAAB2cHJlcFG4d3IAACbQAAAAOgAAADsAAQAAAAEAAFk/vSFfDzz1AAMD6AAAAADQ3uVxAAAAANDe5XEAAP/V/7UEzgAAAAgAAgAAAAAAAAABAAAAAQAAD//VAAUAAQAAAAAAAAAAAAAAAAAAAAQAAQAAAAEAAAABAAMAegADAAEAAQAAAAQABADoAAAACgAIAAIAAgABACD/tf//AAAAACD/tf//V/+2AAMAAQAAAAAAAAAAAAAAAQACAAAAAAAAAgAAAAEAAAAAAQAAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAAQAAAAEAAAAAA-A_TRUNCATED_FOR_BREVITY-';

// --- Funções Auxiliares ---
function arrayBufferToBase64(buffer: ArrayBuffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.length;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

// Decodifica a fonte uma única vez quando o módulo é carregado para otimizar a performance.
const fontData = base64ToArrayBuffer(montserratBoldBase64);

// --- Componentes de Imagem ---

const AnimalImage = ({ data }: { data: any }) => {
  const animalData = {
    lobo: parseInt(data.L, 10),
    aguia: parseInt(data.A, 10),
    tubarao: parseInt(data.T, 10),
    gato: parseInt(data.G, 10),
  };

  const highestAnimalName = Object.keys(animalData).reduce((a, b) => (animalData as any)[a] > (animalData as any)[b] ? a : b);

  const positions: { [key: string]: { top: string, right: string } } = {
    lobo:    { top: '280px', right: '420px' },
    aguia:   { top: '280px', right: '120px' },
    tubarao: { top: '630px', right: '420px' },
    gato:    { top: '630px', right: '120px' },
  };

  return (
    <div style={{ fontFamily: 'Montserrat', textShadow: '0 0 10px rgba(0,0,0,0.8)', position: 'relative', width: '540px', height: '790px', display: 'flex', color: 'white', fontWeight: 700, fontStyle: 'normal' }}>
      <img src={BASE_IMAGE_ANIMALS_URL} style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, width: '100%', height: '100%' }} />
      {Object.entries(animalData).map(([name, percentage]) => {
        const isHighest = name === highestAnimalName;
        return <div key={name} style={{
          position: 'absolute',
          ...positions[name],
          fontSize: isHighest ? '40px' : '36px',
          color: isHighest ? '#FFED00' : 'white',
          textAlign: 'right'
        }}>{percentage}%</div>
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
        <div style={{ fontFamily: 'Montserrat', textShadow: '0 0 10px rgba(0,0,0,0.8)', position: 'relative', width: '640px', height: '980px', display: 'flex', color: 'white', fontWeight: 700, fontSize: '44px', fontStyle: 'normal' }}>
            <img src={BASE_IMAGE_BRAIN_URL} style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, width: '100%', height: '100%' }} />
            <div style={{ top: '240px', left: '50%', transform: 'translate(-50%, -50%)', position: 'absolute', textAlign: 'center' }}>{brainData.pensante}%</div>
            <div style={{ top: '780px', left: '50%', transform: 'translate(-50%, -50%)', position: 'absolute', textAlign: 'center' }}>{brainData.atuante}%</div>
            <div style={{ top: '450px', left: '48px', position: 'absolute' }}>{brainData.razao}%</div>
            <div style={{ top: '450px', right: '40px', position: 'absolute', textAlign: 'right' }}>{brainData.emocao}%</div>
        </div>
    );
};

// --- Handler Principal da API ---

export default async function handler(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // 1. Verifica se o parâmetro 'data' existe
    const dataParam = searchParams.get('data');
    if (!dataParam) {
      return new Response("Parâmetro 'data' não encontrado na URL. Forneça um objeto JSON URL-encoded.", { status: 400 });
    }

    // 2. Tenta fazer o parse do JSON
    let data;
    try {
      data = JSON.parse(dataParam);
    } catch (error) {
      return new Response("O valor do parâmetro 'data' não é um JSON válido.", { status: 400 });
    }

    // 3. Validação das chaves essenciais
    const requiredKeys = ["A", "G", "T", "L", "Principal", "Emoção Direito", "Razão Esquerdo", "Pensante Anterior", "Atuante Posterior"];
    const missingKeys = requiredKeys.filter(key => !(key in data));
    if (missingKeys.length > 0) {
      return new Response(`As seguintes chaves estão faltando nos dados JSON: ${missingKeys.join(', ')}`, { status: 400 });
    }

    // 4. Validação dos valores numéricos
    const numericKeys = {
      A: data.A, G: data.G, T: data.T, L: data.L,
      "Razão Esquerdo": data["Razão Esquerdo"],
      "Emoção Direito": data["Emoção Direito"],
      "Pensante Anterior": data["Pensante Anterior"],
      "Atuante Posterior": data["Atuante Posterior"],
    };
    const invalidParams = Object.entries(numericKeys).filter(([, value]) => isNaN(parseInt(value as string, 10)))
                                                   .map(([key]) => key);
    if (invalidParams.length > 0) {
      return new Response(`Os seguintes parâmetros contêm valores inválidos (não são números): ${invalidParams.join(', ')}.`, { status: 400 });
    }
    
    // Gerar ambas as imagens em paralelo
    const [animalImageResponse, brainImageResponse] = await Promise.all([
      new ImageResponse(<AnimalImage data={data} />, {
        width: 540,
        height: 790,
        fonts: [
          {
            name: 'Montserrat',
            data: fontData,
            weight: 700,
            style: 'normal',
          },
        ],
      }),
      new ImageResponse(<BrainImage data={data} />, {
        width: 640,
        height: 980,
        fonts: [
          {
            name: 'Montserrat',
            data: fontData,
            weight: 700,
            style: 'normal',
          },
        ],
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
    if (e.stack) {
        console.error(e.stack);
    }
    return new Response(`Falha ao gerar imagens: ${e.message}`, { status: 500 });
  }
}