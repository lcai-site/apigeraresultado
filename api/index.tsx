import React from 'react'; // LINHA ADICIONADA E ESSENCIAL
import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  try {
    const data = await request.json();

    const {
      A = 0,
      G = 0,
      T = 0,
      L = 0,
      Principal = 'N/A',
      Secundario = 'N/A',
      'Emoção Direito': emocaoDireito = 0,
      'Razão Esquerdo': razaoEsquerdo = 0,
      'Pensante Anterior': pensanteAnterior = 0,
      'Atuante Posterior': atuantePosterior = 0,
    } = data;

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0a0a0a',
            color: 'white',
            fontFamily: 'sans-serif',
            padding: '40px',
          }}
        >
          <h1 style={{ fontSize: 60, color: '#82EEFD', marginBottom: 40, textShadow: '2px 2px 5px #000' }}>
            Seu Resultado Personalizado
          </h1>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: 32, marginBottom: 30 }}>
            <p style={{ margin: 0 }}>Perfil Principal: <b>{Principal}</b></p>
            <p style={{ margin: 0 }}>Perfil Secundário: <b>{Secundario}</b></p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-around', width: '90%', fontSize: 28, textAlign: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}><p style={{ margin: 0 }}>Águia</p><p style={{ margin: 5, color: '#FFD700', fontSize: 36 }}>{A}%</p></div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}><p style={{ margin: 0 }}>Gato</p><p style={{ margin: 5, color: '#FFD700', fontSize: 36 }}>{G}%</p></div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}><p style={{ margin: 0 }}>Lobo</p><p style={{ margin: 5, color: '#FFD700', fontSize: 36 }}>{L}%</p></div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}><p style={{ margin: 0 }}>Tubarão</p><p style={{ margin: 5, color: '#FFD700', fontSize: 36 }}>{T}%</p></div>
          </div>
          <div style={{ borderTop: '2px solid #444', width: '80%', margin: '40px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-around', width: '90%', fontSize: 24, textAlign: 'center' }}>
             <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 20px' }}><p style={{ margin: 0 }}><b>Lado Esquerdo (Razão):</b> {razaoEsquerdo}%</p><p style={{ margin: 5 }}><b>Lado Direito (Emoção):</b> {emocaoDireito}%</p></div>
             <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 20px' }}><p style={{ margin: 0 }}><b>Anterior (Pensante):</b> {pensanteAnterior}%</p><p style={{ margin: 5 }}><b>Posterior (Atuante):</b> {atuantePosterior}%</p></div>
          </div>
        </div>
      ),
      { width: 1200, height: 630 },
    );
  } catch (e: any) {
    console.error(e.message);
    return new Response(`Falha ao gerar a imagem: ${e.message}`, { status: 500 });
  }
}
