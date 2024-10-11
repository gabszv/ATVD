let dadosPaises = {};

function carregarDados() {
    fetch('https://api-paises.pages.dev/paises.json')
        .then(response => response.json())
        .then(dados => {
            dadosPaises = dados;
        })
        .catch(error => console.error('Erro ao carregar os dados dos países:', error));
}

function sugerirPaises() {
    const input = document.querySelector('#nome').value.toLowerCase();
    const sugestoes = document.querySelector('#sugestoes');

    sugestoes.innerHTML = ''; 

    if (input.length === 0) return; 

    const paisesFiltrados = Object.values(dadosPaises).filter(pais => 
        pais.pais.toLowerCase().includes(input)
    );

    paisesFiltrados.forEach(pais => {
        const li = document.createElement('li');
        li.innerHTML = `
            <img src="${pais.img}" alt="Bandeira de ${pais.pais}">
            <div>
                <span>${pais.pais}</span>
                <span>DDI: +${pais.ddi}</span>
                <span>${pais.continente}</span>
            </div>
        `;
        li.onclick = () => {
            document.querySelector('#nome').value = pais.pais;
            buscarPais(); 
            document.querySelector('#sugestoes').innerHTML = ''; // Limpa as sugestões
        };
        sugestoes.appendChild(li);
    });
}

function buscarPais() {
    const nomePais = document.querySelector('#nome').value.toLowerCase();
    const resultadoDiv = document.querySelector('#resultado');
    const sugestoes = document.querySelector('#sugestoes');

    resultadoDiv.innerHTML = ''; // Limpa o resultado anterior
    sugestoes.innerHTML = ''; // Limpa as sugestões

    const paisEncontrado = Object.values(dadosPaises).find(pais => 
        pais.pais.toLowerCase() === nomePais
    );

    if (paisEncontrado) {
        const paisDiv = document.createElement('div');
        paisDiv.className = 'pais';
        paisDiv.innerHTML = `
            <img src="${paisEncontrado.img}" alt="Bandeira de ${paisEncontrado.pais}">
            <div>
                <p><strong>País:</strong> ${paisEncontrado.pais}</p>
                <p><strong>DDI:</strong> +${paisEncontrado.ddi}</p>
                <p><strong>Continente:</strong> ${paisEncontrado.continente}</p>
            </div>
        `;
        resultadoDiv.appendChild(paisDiv);
    } else {
        resultadoDiv.innerHTML = '<p>País não encontrado.</p>';
    }
}

carregarDados();

document.querySelector('#nome').addEventListener('input', sugerirPaises);

// Adicionando a função de pesquisar com Enter
document.querySelector('#nome').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        buscarPais();
    }
});

// Função de pesquisa por voz
function pesquisarPorVoz() {
    const reconhecimentoDeVoz = window.SpeechRecognition || window.webkitSpeechRecognition;
    const reconhecimento = new reconhecimentoDeVoz();
    const statusVoz = document.querySelector('#status-voz');

    reconhecimento.lang = 'pt-BR'; // Define o idioma
    reconhecimento.start();

    // Indica que o microfone está ativo
    statusVoz.classList.add('ativo');

    reconhecimento.onresult = function(event) {
        const resultado = event.results[0][0].transcript;
        document.querySelector('#nome').value = resultado;
        buscarPais();

        // Para de indicar que o microfone está ativo
        statusVoz.classList.remove('ativo');
    };

    reconhecimento.onerror = function(event) {
        console.error('Erro no reconhecimento de voz:', event.error);

        // Remove a indicação de escuta em caso de erro
        statusVoz.classList.remove('ativo');
    };

    reconhecimento.onend = function() {
        // Remove a indicação de escuta quando a escuta por voz termina
        statusVoz.classList.remove('ativo');
    };
}

document.querySelector('#btn').addEventListener('click', buscarPais);
document.querySelector('#btn-voz').addEventListener('click', pesquisarPorVoz);
