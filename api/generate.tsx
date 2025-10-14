import { ImageResponse } from '@vercel/og';
import type { NextRequest } from 'next/server';

export const config = {
  runtime: 'edge',
};

const BASE_IMAGE_BRAIN_URL = 'https://i.postimg.cc/LXMYjwtX/Inserir-um-t-tulo-6.png';
const BASE_IMAGE_ANIMALS_URL = 'https://i.postimg.cc/0N1sjN2W/Inserir-um-t-tulo-7.png';

const getFont = async () => {
  const res = await fetch('https://fonts.gstatic.com/s/montserrat/v26/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtr6Hw5aXo.ttf');
  return res.arrayBuffer();
}

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

  const positions: { [key: string]: { top: number; left: number } } = {
    lobo:    { top: 280, left: 120 },
    aguia:   { top: 280, left: 420 },
    tubarao: { top: 630, left: 120 },
    gato:    { top: 630, left: 420 },
  };

  return (
    // FIX: Replaced `tw` prop with inline styles to resolve TypeScript error.
    <div style={{ fontFamily: 'Montserrat', textShadow: '0 0 10px rgba(0,0,0,0.8)', position: 'relative', width: '540px', height: '790px', display: 'flex', color: 'white', fontWeight: 'bold' }}>
      {/* FIX: Replaced `tw` prop with inline styles to resolve TypeScript error. */}
      <img src={BASE_IMAGE_ANIMALS_URL} style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, width: '100%', height: '100%' }} />
      {Object.entries(animalData).map(([name, percentage]) => {
        const isHighest = name === highestAnimalName;
        const pos = positions[name];
        return (
          <div
            key={name}
            // FIX: Replaced `tw` prop with inline styles to resolve TypeScript error.
            style={{
              fontSize: isHighest ? '40px' : '36px',
              color: isHighest ? '#FFED00' : '#FFFFFF',
              top: `${pos.top}px`,
              left: `${pos.left}px`,
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
    // FIX: Replaced `tw` prop with inline styles to resolve TypeScript error.
    <div style={{ fontFamily: 'Montserrat', textShadow: '0 0 10px rgba(0,0,0,0.8)', position: 'relative', width: '640px', height: '980px', display: 'flex', color: 'white', fontWeight: 'bold', fontSize: '44px' }}>
      {/* FIX: Replaced `tw` prop with inline styles to resolve TypeScript error. */}
      <img src={BASE_IMAGE_BRAIN_URL} style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, width: '100%', height: '100%' }} />
      
      {/* Pensante */}
      {/* FIX: Replaced `tw` prop with inline styles to resolve TypeScript error. */}
      <div style={{ top: '240px', left: '50%', transform: 'translate(-50%, -50%)', position: 'absolute', textAlign: 'center' }}>
        {brainData.pensante}%
      </div>

      {/* Atuante */}
      {/* FIX: Replaced `tw` prop with inline styles to resolve TypeScript error. */}
      <div style={{ top: '780px', left: '50%', transform: 'translate(-50%, -50%)', position: 'absolute', textAlign: 'center' }}>
        {brainData.atuante}%
      </div>
      
      {/* Razao */}
      {/* FIX: Replaced `tw` prop with inline styles to resolve TypeScript error. */}
      <div style={{ top: '450px', left: '48px', transform: 'translateY(-50%)', position: 'absolute', textAlign: 'left' }}>
        {brainData.razao}%
      </div>

      {/* Emocao */}
      {/* FIX: Replaced `tw` prop with inline styles to resolve TypeScript error. */}
      <div style={{ top: '450px', right: '40px', transform: 'translateY(-50%)', position: 'absolute', textAlign: 'right' }}>
        {brainData.emocao}%
      </div>

    </div>
  );
};


export default async function handler(req: NextRequest) {
  try {
    const fontData = await getFont();
    const { searchParams } = new URL(req.url);

    const type = searchParams.get('type');
    const dataParam = searchParams.get('data');

    if (!type || !dataParam) {
      return new Response('Missing "type" or "data" query parameters', { status: 400 });
    }

    const data = JSON.parse(dataParam);
    let imageComponent;
    let dimensions;

    if (type === 'animal') {
      imageComponent = <AnimalImage data={data} />;
      dimensions = { width: 540, height: 790 };
    } else if (type === 'brain') {
      imageComponent = <BrainImage data={data} />;
      dimensions = { width: 640, height: 980 };
    } else {
      return new Response('Invalid "type" parameter. Use "animal" or "brain".', { status: 400 });
    }

    return new ImageResponse(imageComponent, {
      ...dimensions,
      fonts: [{ name: 'Montserrat', data: fontData, weight: 700, style: 'normal' }],
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable',
      }
    });

  } catch (e: any) {
    console.error(e);
    return new Response(`Failed to generate image: ${e.message}`, { status: 500 });
  }
}
