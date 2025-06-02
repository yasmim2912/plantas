// Função para fazer upload da imagem e processar
async function uploadImage(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Mostra preview da imagem
    const reader = new FileReader();
    reader.onload = function(e) {
        const imgElement = document.getElementById('plantImage');
        imgElement.src = e.target.result;
        imgElement.classList.remove('hidden');
    }
    reader.readAsDataURL(file);

    // Processa a imagem
    try {
        const { description, imagePath } = await processImage(file);
        
        document.getElementById('descriptionContainer').classList.remove('hidden');
        document.getElementById('questionContainer').classList.remove('hidden');
        
        if (description) {
            document.getElementById('plantDescription').textContent = description;
            if (imagePath) {
                document.getElementById('plantImage').src = imagePath;
            }
        } else {
            document.getElementById('plantDescription').textContent = "Não foi possível identificar esta planta em nosso sistema.";
        }
    } catch (error) {
        console.error('Erro:', error);
        document.getElementById('plantDescription').textContent = "Ocorreu um erro ao processar sua solicitação.";
    }
}

// Função para processar a imagem e buscar descrição
async function processImage(file) {
    // Aqui você implementaria a lógica de comparação de imagens
    // Esta é uma simulação da funcionalidade original
    
    // Simulação: verifica se a imagem é similar a alguma das imagens conhecidas
    const isMandacaru = await checkIfImageIsMandacaru(file);
    const isUmbuzeiro = await checkIfImageIsUmbuzeiro(file);
    
    if (isMandacaru) {
        const description = await fetchPlantDescription('Mandacaru');
        return {
            description: description,
            imagePath: 'static/uploads/mandacaru.jpg' // Exemplo de caminho
        };
    } else if (isUmbuzeiro) {
        const description = await fetchPlantDescription('Umbuzeiro');
        return {
            description: description,
            imagePath: 'static/uploads/umbuzeiro.jpg' // Exemplo de caminho
        };
    } else {
        return {
            description: "A imagem não é semelhante a imagens do nosso banco de dados.",
            imagePath: null
        };
    }
}

// Função para buscar descrição da planta (simulação da função original)
async function fetchPlantDescription(plantName) {
    // Esta função simularia a busca em APIs externas
    // Na implementação real, você faria chamadas HTTP para os serviços
    
    const descriptions = {
        'Mandacaru': `O mandacaru (Cereus jamacaru) é uma cactácea nativa do Brasil, muito comum na caatinga. 
        
        Pode atingir até 6 metros de altura e possui flores brancas que desabrocham à noite. 
        
        É uma planta extremamente resistente à seca, podendo sobreviver longos períodos sem água.`,
        
        'Umbuzeiro': `O umbuzeiro (Spondias tuberosa) é uma árvore frutífera típica do semiárido brasileiro.
        
        Produz o umbu, um fruto apreciado na culinária regional. A planta é conhecida por sua capacidade de armazenar água em suas raízes tuberosas.
        
        Pode viver mais de 100 anos e é uma espécie importante para a fauna local.`
    };
    
    return descriptions[plantName] || "Descrição não encontrada em fontes confiáveis.";
}

// Função para buscar resposta na descrição
function searchInDescription() {
    const pergunta = document.getElementById('plantQuestion').value.toLowerCase();
    const descricao = document.getElementById('plantDescription').textContent.toLowerCase();

    let resposta = "";

    if (pergunta.includes("vive") || pergunta.includes("dura")) {
        const match = descricao.match(/(vive|dura).{0,100}/);
        resposta = match ? match[0] : "Não encontramos uma resposta direta sobre isso na descrição.";
    } else if (pergunta.includes("altura") || pergunta.includes("tamanho")) {
        const match = descricao.match(/(atinge|altura|cresce até).{0,100}/);
        resposta = match ? match[0] : "Não encontramos uma resposta sobre altura/tamanho.";
    } else if (pergunta.includes("origem") || pergunta.includes("vem de")) {
        const match = descricao.match(/(origem|nativa|natural de).{0,100}/);
        resposta = match ? match[0] : "Não encontramos uma resposta sobre a origem.";
    } else {
        const palavras = pergunta.split(" ");
        const encontradas = palavras.filter(p => descricao.includes(p));
        resposta = encontradas.length > 0
            ? "Encontramos partes da sua pergunta na descrição, mas não temos uma resposta direta."
            : "Não encontramos nada relevante na descrição.";
    }

    const answerBox = document.getElementById('questionAnswer');
    answerBox.textContent = resposta;
    answerBox.classList.remove('hidden');
}

// Funções de simulação de comparação de imagens
async function checkIfImageIsMandacaru(file) {
    // Na implementação real, você usaria uma biblioteca como imagehash para comparar
    // Aqui é apenas uma simulação que retorna true para certos nomes de arquivo
    return file.name.toLowerCase().includes('mandacaru') || Math.random() > 0.5;
}

async function checkIfImageIsUmbuzeiro(file) {
    // Na implementação real, você usaria uma biblioteca como imagehash para comparar
    // Aqui é apenas uma simulação que retorna true para certos nomes de arquivo
    return file.name.toLowerCase().includes('umbuzeiro') || Math.random() > 0.5;
}