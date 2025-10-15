import React, { useState, useEffect, useCallback } from 'react';
import { useUrlQuery } from './hooks/useUrlQuery';
import { generateAnimalImage, generateBrainImage, sendToN8N, AnimalData } from './services/imageProcessor';
import { ImageResultCard } from './components/ImageResultCard';
import { Loader } from './components/Loader';

// URLs das imagens base
const BASE_IMAGE_BRAIN_URL = 'https://i.postimg.cc/LXMYjwtX/Inserir-um-t-tulo-6.png';
const BASE_IMAGE_ANIMALS_URL = 'https://i.postimg.cc/0N1sjN2W/Inserir-um-t-tulo-7.png';

type SubmissionState = 'idle' | 'sending' | 'success' | 'error';

const getNormalizedDataFromQuery = (query: URLSearchParams): Record<string, any> | null => {
  const dataParam = query.get('data');
  if (dataParam) {
    try {
      return JSON.parse(dataParam);
    } catch (e) {
      throw new Error("O valor do parâmetro 'data' não é um JSON válido.");
    }
  }

  // Fallback para o tratamento de parâmetros legados
  const legacyParams: { [key: string]: string } = {
    A: 'aguia', G: 'gato', T: 'tubarao', L: 'lobo',
    "Razão Esquerdo": 'razao', "Emoção Direito": 'emocao',
    "Pensante Anterior": 'pensante', "Atuante Posterior": 'atuante',
  };

  const jsonData: Record<string, any> = {};
  let hasLegacyParams = false;

  for (const [key, paramName] of Object.entries(legacyParams)) {
    const value = query.get(paramName);
    if (value !== null) {
      jsonData[key] = value;
      hasLegacyParams = true;
    }
  }

  if (!hasLegacyParams) {
    return null; // Nenhum dado encontrado
  }

  // Infere o "Principal" para o formato legado, encontrando o animal com a maior porcentagem
  const animalScores: { [key: string]: number } = {
    'Águia': parseInt(jsonData.A, 10) || 0,
    'Gato': parseInt(jsonData.G, 10) || 0,
    'Tubarão': parseInt(jsonData.T, 10) || 0,
    'Lobo': parseInt(jsonData.L, 10) || 0,
  };
  
  let principalAnimal = 'Águia'; // Valor padrão
  let maxScore = -1;

  for (const [animal, score] of Object.entries(animalScores)) {
    if (score > maxScore) {
      maxScore = score;
      principalAnimal = animal;
    }
  }
  jsonData['Principal'] = principalAnimal;

  return jsonData;
};

const initialFormData = {
    A: "35",
    G: "20",
    T: "30",
    L: "15",
    Principal: "Águia",
    "Razão Esquerdo": "55",
    "Emoção Direito": "45",
    "Pensante Anterior": "60",
    "Atuante Posterior": "40"
};

const App: React.FC = () => {
  const query = useUrlQuery();
  const [brainImage, setBrainImage] = useState<string | null>(null);
  const [animalImage, setAnimalImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [submissionState, setSubmissionState] = useState<SubmissionState>('idle');
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>(initialFormData);
  const [dataFromUrl, setDataFromUrl] = useState<Record<string, any> | null>(null);
  
  const processData = useCallback(async (data: Record<string, any>) => {
    setLoading(true);
    setError(null);
    setAnimalImage(null);
    setBrainImage(null);
    setSubmissionState('idle');

    try {
      const requiredKeys = ["A", "G", "T", "L", "Principal", "Emoção Direito", "Razão Esquerdo", "Pensante Anterior", "Atuante Posterior"];
      const missingKeys = requiredKeys.filter(key => !(key in data));
      if (missingKeys.length > 0) {
        throw new Error(`As seguintes chaves estão faltando nos dados: ${missingKeys.join(', ')}`);
      }

      const animalData: AnimalData = {
        aguia: parseInt(data.A, 10),
        gato: parseInt(data.G, 10),
        tubarao: parseInt(data.T, 10),
        lobo: parseInt(data.L, 10),
      };

      const brainData = {
        razao: parseInt(data["Razão Esquerdo"], 10),
        emocao: parseInt(data["Emoção Direito"], 10),
        pensante: parseInt(data["Pensante Anterior"], 10),
        atuante: parseInt(data["Atuante Posterior"], 10),
      };
      
      const allData = { ...animalData, ...brainData };
      const invalidParams = Object.entries(allData).filter(([, value]) => isNaN(value)).map(([key]) => key);
      if (invalidParams.length > 0) {
        throw new Error(`Os seguintes parâmetros contêm valores inválidos (não são números): ${invalidParams.join(', ')}.`);
      }

      const principalAnimalFullName = data.Principal;
      const animalNameMap: { [key: string]: keyof AnimalData } = {
          'Águia': 'aguia',
          'Gato': 'gato',
          'Tubarão': 'tubarao',
          'Lobo': 'lobo'
      };
      const principalAnimalKey = animalNameMap[principalAnimalFullName];

      if (!principalAnimalKey) {
        throw new Error(`Valor de "Principal" inválido: "${principalAnimalFullName}". Valores esperados: Águia, Gato, Tubarão, Lobo.`);
      }

      const [generatedAnimalImg, generatedBrainImg] = await Promise.all([
        generateAnimalImage(BASE_IMAGE_ANIMALS_URL, animalData, principalAnimalKey),
        generateBrainImage(BASE_IMAGE_BRAIN_URL, brainData),
      ]);
      setAnimalImage(generatedAnimalImg);
      setBrainImage(generatedBrainImg);

      setSubmissionState('sending');
      try {
        await sendToN8N({
          animalImage: generatedAnimalImg,
          brainImage: generatedBrainImg,
          params: data,
        });
        setSubmissionState('success');
      } catch (n8nError) {
        console.error('N8N submission failed:', n8nError);
        setSubmissionState('error');
        setSubmissionError(n8nError instanceof Error ? n8nError.message : 'Ocorreu um erro desconhecido.');
      }

    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'Ocorreu um erro desconhecido ao processar os dados.';
      setError(`Falha ao processar dados: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    try {
        const jsonData = getNormalizedDataFromQuery(query);
        setDataFromUrl(jsonData);
        if (jsonData) {
            processData(jsonData);
        } else {
             setLoading(false);
        }
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Ocorreu um erro desconhecido ao processar os dados.';
        setError(`Falha ao processar dados da URL: ${errorMessage}`);
        setLoading(false);
    }
  }, [processData, query]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({...prev, [name]: value}));
  };

  const handleGenerateClick = () => {
     processData(formData);
  };
  
  const handleReset = () => {
    setAnimalImage(null);
    setBrainImage(null);
    setError(null);
    setSubmissionState('idle');
  };

  const renderSubmissionStatus = () => {
    if (submissionState === 'idle') return null;

    let message = '';
    let textColor = 'text-gray-400';
    let isPulsing = false;

    switch (submissionState) {
      case 'sending':
        message = 'Enviando resultados para o sistema...';
        isPulsing = true;
        break;
      case 'success':
        message = '✅ Resultados enviados com sucesso!';
        textColor = 'text-green-400';
        break;
      case 'error':
        message = `❌ Falha ao enviar os resultados.`;
        textColor = 'text-red-400';
        break;
    }

    return (
        <div className="mt-8 text-center">
            <p className={`text-lg ${textColor} ${isPulsing ? 'animate-pulse' : ''}`}>
                {message}
            </p>
            {submissionState === 'error' && submissionError && (
                 <p className="text-sm text-red-500 mt-1 font-mono">{submissionError}</p>
            )}
        </div>
    );
  };

  const renderForm = () => (
    <div className="w-full max-w-4xl mx-auto bg-gray-900/50 p-8 rounded-lg border border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="md:col-span-2">
                <h3 className="text-2xl font-bold text-teal-400 border-b border-gray-600 pb-2 mb-4">Perfil Comportamental</h3>
            </div>
            {Object.entries({ A: 'Águia %', G: 'Gato %', T: 'Tubarão %', L: 'Lobo %' }).map(([key, label]) => (
                <div key={key}>
                    <label htmlFor={key} className="block text-sm font-medium text-gray-300">{label}</label>
                    <input type="number" name={key} id={key} value={formData[key]} onChange={handleInputChange} className="mt-1 block w-full bg-gray-800 border-gray-600 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 text-white p-2" />
                </div>
            ))}
             <div>
                <label htmlFor="Principal" className="block text-sm font-medium text-gray-300">Animal Principal</label>
                <select name="Principal" id="Principal" value={formData.Principal} onChange={handleInputChange} className="mt-1 block w-full bg-gray-800 border-gray-600 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 text-white p-2">
                    <option>Águia</option>
                    <option>Gato</option>
                    <option>Tubarão</option>
                    <option>Lobo</option>
                </select>
            </div>

            <div className="md:col-span-2 mt-6">
                <h3 className="text-2xl font-bold text-teal-400 border-b border-gray-600 pb-2 mb-4">Mapeamento Cerebral</h3>
            </div>
            {Object.entries({ "Razão Esquerdo": 'Razão Esquerdo %', "Emoção Direito": 'Emoção Direito %', "Pensante Anterior": 'Pensante Anterior %', "Atuante Posterior": 'Atuante Posterior %' }).map(([key, label]) => (
                 <div key={key}>
                    <label htmlFor={key} className="block text-sm font-medium text-gray-300">{label}</label>
                    <input type="number" name={key} id={key} value={formData[key]} onChange={handleInputChange} className="mt-1 block w-full bg-gray-800 border-gray-600 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 text-white p-2" />
                </div>
            ))}
        </div>
        <div className="mt-8 text-center">
            <button onClick={handleGenerateClick} className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
                Gerar Imagens
            </button>
        </div>
    </div>
  );

  const renderContent = () => {
    if (loading) return <Loader />;

    if (error) {
      return (
        <div className="text-center p-8 bg-red-900/50 border border-red-700 rounded-lg max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-red-400 mb-2">Erro</h2>
          <p className="text-red-300 font-mono break-words">{error}</p>
          <button onClick={handleReset} className="mt-4 bg-gray-700 text-white py-2 px-4 rounded">Tentar Novamente</button>
          {dataFromUrl && <p className="mt-4 text-gray-400">Exemplo de URL correta (JSON precisa ser URL-encoded):<br/><code className="text-sm bg-gray-900 p-1 rounded">{'?data={"A":35,"G":20,"T":30,"L":15,"Principal":"Águia","Razão Esquerdo":55,"Emoção Direito":45,"Pensante Anterior":60,"Atuante Posterior":40}'}</code></p>}
        </div>
      );
    }

    if (animalImage && brainImage) {
      return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              <ImageResultCard title="Perfil Comportamental" imageUrl={animalImage} />
              <ImageResultCard title="Mapeamento Cerebral" imageUrl={brainImage} />
            </div>
            {renderSubmissionStatus()}
            <div className="text-center mt-8">
                <button onClick={handleReset} className="bg-gray-700 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-600 transition-colors">
                    Gerar Novamente
                </button>
            </div>
        </>
      );
    }
    
    if (!dataFromUrl) {
      return renderForm();
    }
    
    return null;
  };

  return (
    <div className="min-h-screen bg-black text-gray-100 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <header className="text-center mb-8 lg:mb-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
          Seu Resultado Personalizado
        </h1>
        <p className="mt-4 text-lg text-gray-400 max-w-3xl mx-auto">
          {animalImage ? 'As imagens abaixo foram geradas dinamicamente com base no seu perfil.' : 'Preencha os dados abaixo para gerar suas imagens personalizadas.'}
        </p>
      </header>
      <main className="w-full max-w-6xl">
        {renderContent()}
      </main>
      <footer className="mt-12 text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} - Processamento de Imagem Dinâmica</p>
      </footer>
    </div>
  );
};

export default App;