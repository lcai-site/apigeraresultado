export interface AnimalData {
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

// --- Image Processing ---

const drawTextWithShadow = (
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  font: string,
  fillStyle: string,
  textAlign: CanvasTextAlign,
  textBaseline: CanvasTextBaseline
) => {
  ctx.font = font;
  ctx.fillStyle = fillStyle;
  ctx.textAlign = textAlign;
  ctx.textBaseline = textBaseline;

  // Sombra para legibilidade
  ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  ctx.fillText(text, x, y);
  
  // Reset shadow for next drawing
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
};


export const generateAnimalImage = (baseImageUrl: string, data: AnimalData): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = baseImageUrl;

    img.onload = async () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          return reject(new Error('Não foi possível obter o contexto do canvas.'));
        }

        const dpr = window.devicePixelRatio || 1;
        canvas.width = img.width * dpr;
        canvas.height = img.height * dpr;
        ctx.scale(dpr, dpr);

        await document.fonts.ready;

        ctx.drawImage(img, 0, 0);

        const animalEntries = Object.entries(data) as [keyof AnimalData, number][];

        let highestAnimalName: keyof AnimalData | null = null;
        let maxPercentage = -1;

        for (const [name, percentage] of animalEntries) {
            if (percentage > maxPercentage) {
                maxPercentage = percentage;
                highestAnimalName = name;
            }
        }

        const fontName = 'Montserrat, sans-serif';
        const normalFontSize = 36;
        const highestFontSize = 40;
        const normalColor = '#FFFFFF';
        const highestColor = '#FFED00';

        const positions: { [key: string]: { x: number; y: number } } = {
          lobo:    { x: 120, y: 280 },
          aguia:   { x: 420, y: 280 },
          tubarao: { x: 120, y: 630 },
          gato:    { x: 420, y: 630 },
        };

        for (const [name, percentage] of animalEntries) {
          const isHighest = name === highestAnimalName;
          const fontSize = isHighest ? highestFontSize : normalFontSize;
          const color = isHighest ? highestColor : normalColor;
          const font = `bold ${fontSize}px ${fontName}`;
          const text = `${percentage}%`;
          const { x, y } = positions[name as keyof AnimalData];

          drawTextWithShadow(ctx, text, x, y, font, color, 'right', 'middle');
        }

        resolve(canvas.toDataURL('image/png'));
      } catch (err) {
        reject(new Error(`Erro durante o processamento da imagem dos animais: ${err instanceof Error ? err.message : String(err)}`));
      }
    };

    img.onerror = () => {
      reject(new Error(`Falha ao carregar a imagem base de ${baseImageUrl}. Verifique a URL e as políticas de CORS.`));
    };
  });
};


export const generateBrainImage = (baseImageUrl: string, data: BrainData): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = baseImageUrl;

    img.onload = async () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
  
        if (!ctx) {
          return reject(new Error('Não foi possível obter o contexto do canvas.'));
        }

        const dpr = window.devicePixelRatio || 1;
        canvas.width = img.width * dpr;
        canvas.height = img.height * dpr;
        ctx.scale(dpr, dpr);
        
        await document.fonts.ready;
  
        ctx.drawImage(img, 0, 0);
        
        const fontName = 'Montserrat, sans-serif';
        const fontSize = 44;
        const color = '#FFFFFF';
        const font = `bold ${fontSize}px ${fontName}`;

        const positions: { [key: string]: { x: number; y: number; align: CanvasTextAlign } } = {
            pensante: { x: 320, y: 240, align: 'center' },
            atuante:  { x: 320, y: 780, align: 'center' },
            razao:    { x: 48, y: 450, align: 'left'   },
            emocao:   { x: 600, y: 450, align: 'right'  },
        };
  
        const brainEntries = Object.entries(data) as [keyof BrainData, number][];

        for (const [name, percentage] of brainEntries) {
            const pos = positions[name];
            if(pos) {
                drawTextWithShadow(ctx, `${percentage}%`, pos.x, pos.y, font, color, pos.align, 'middle');
            }
        }
  
        resolve(canvas.toDataURL('image/png'));
      } catch (err) {
        reject(new Error(`Erro durante o processamento da imagem do cérebro: ${err instanceof Error ? err.message : String(err)}`));
      }
    };
  
      img.onerror = () => {
        reject(new Error(`Falha ao carregar a imagem base de ${baseImageUrl}. Verifique a URL e as políticas de CORS.`));
      };
  });
};
