// Importa a biblioteca da Vercel para criar imagens a partir de código
import { ImageResponse } from '@vercel/og';

// Configuração para a Vercel executar este código no ambiente mais rápido (Edge)
export const config = {
  runtime: 'edge',
};

// A função principal que será executada quando a API for chamada
export default async function handler(request: Request) {
  try {
    // Pega o objeto JSON enviado no corpo (body) da requisição POST
    const data = await request.json();

    // Extrai cada valor do JSON. Se um valor não for enviado, usa um valor padrão (0 ou 'N/A').
    const {
      A = 0, // Águia
      G = 0, // Gato
      T = 0, // Tubarão
      L = 0, // Lobo
      Principal = 'N/A',
      Secundario = 'N/A',
      'Emoção Direito': emocaoDireito = 0,
      'Razão Esquerdo': razaoEsquerdo = 0,
      'Pensante Anterior': pensanteAnterior = 0,
      'Atuante Posterior': atuantePosterior = 0,
    } = data;

    // Cria a imagem dinamicamente usando HTML e CSS
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
          {/* Título Principal */}
          <h1 style={{ fontSize: 60, color: '#82EEFD', marginBottom: 40, textShadow: '2px 2px 5px #000' }}>
            Seu Resultado Personalizado
          </h1>

          {/* Seção de Perfis */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: 32, marginBottom: 30 }}>
            <p style={{ margin: 0 }}>Perfil Principal: <b>{Principal}</b></p>
            <p style={{ margin: 0 }}>Perfil Secundário: <b>{Secundario}</b></p>
          </div>

          {/* Barras de Porcentagem dos Animais */}
          <div style={{ display: 'flex', justifyContent: 'space-around', width: '90%', fontSize: 28, textAlign: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <p style={{ margin: 0 }}>Águia</p>
              <p style={{ margin: 5, color: '#FFD700', fontSize: 36 }}>{A}%</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <p style={{ margin: 0 }}>Gato</p>
              <p style={{ margin: 5, color: '#FFD700', fontSize: 36 }}>{G}%</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <p style={{ margin: 0 }}>Lobo</p>
              <p style={{ margin: 5, color: '#FFD700', fontSize: 36 }}>{L}%</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <p style={{ margin: 0 }}>Tubarão</p>
              <p style={{ margin: 5, color: '#FFD700', fontSize: 36 }}>{T}%</p>
            </div>
          </div>
          
          {/* Divisor */}
          <div style={{ borderTop: '2px solid #444', width: '80%', margin: '40px 0' }} />

          {/* Seção do Cérebro */}
          <div style={{ display: 'flex', justifyContent: 'space-around', width: '90%', fontSize: 24, textAlign: 'center' }}>
             <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 20px' }}>
                 <p style={{ margin: 0 }}><b>Lado Esquerdo (Razão):</b> {razaoEsquerdo}%</p>
                 <p style={{ margin: 5 }}><b>Lado Direito (Emoção):</b> {emocaoDireito}%</p>
             </div>
             <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 20px' }}>
                 <p style={{ margin: 0 }}><b>Anterior (Pensante):</b> {pensanteAnterior}%</p>
                 <p style={{ margin: 5 }}><b>Posterior (Atuante):</b> {atuantePosterior}%</p>
             </div>
          </div>
        </div>
      ),
      {
        width: 1200, // Largura padrão para posts em redes sociais
        height: 630, // Altura padrão para posts em redes sociais
      },
    );
  } catch (e: any) {
    // Em caso de erro (ex: JSON mal formatado), retorna uma mensagem de erro
    console.error(e.message);
    return new Response(`Falha ao gerar a imagem: ${e.message}`, {
      status: 500,
    });
  }
}
