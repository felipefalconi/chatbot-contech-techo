/* --- Seletores --- */
const iconeTekFechado = document.getElementById('icone-tek-fechado');
const containerChatbot = document.getElementById('container-chatbot');
const cabecalhoChatbot = document.getElementById('cabecalho-chatbot');

// Áreas de Estado do Cabeçalho
const cabecalhoEstadoInicial = document.getElementById('cabecalho-estado-inicial');
const cabecalhoEstadoChat = document.getElementById('cabecalho-estado-chat');

// Áreas de Conteúdo
const elementosBoasVindas = document.getElementById('elementos-boasvindas');
const corpoChat = document.getElementById('corpo-chat');

// Inputs
const inputUsuario = document.getElementById('input-usuario');
const botaoEnviar = document.getElementById('botao-enviar');
const botoesCategoria = document.querySelectorAll('.botao-categoria');

// URLs (Substitua pelos seus caminhos)
const URL_MASCOTE_TEKINHO = "imagens/Cabeça.png"; 
const URL_ICONE_USUARIO = "imagens/icone usuario.png"; 
const URL_VIDEO = "URL_DO_SEU_VIDEO_AQUI";

let chatIniciado = false;

/* --- Funções de Controle --- */

function abrirChatbot() {
    iconeTekFechado.style.display = 'none';
    containerChatbot.classList.remove('fechado');

    // RESETAR PARA ESTADO 1 (Tela Inicial)
    chatIniciado = false;
    
    // 1. Mostrar Boas Vindas (Mascote grande e botão)
    elementosBoasVindas.classList.remove('escondido');
    
    // 2. Cabeçalho Transparente com Logo
    cabecalhoChatbot.classList.remove('modo-chat');
    cabecalhoEstadoInicial.classList.remove('escondido');
    cabecalhoEstadoChat.classList.add('escondido');

    // 3. Limpar chat e colocar msg inicial
    corpoChat.innerHTML = '';
    
    // Adicionar mensagens iniciais de exemplo (conforme imagem 1)
    adicionarMensagem("Olá, Eu sou o Techo!", 'bot');
    adicionarMensagem("O que quer saber?", 'bot');

    inputUsuario.focus();
}

function fecharChatbot() {
    containerChatbot.classList.add('fechado');
    setTimeout(() => {
        iconeTekFechado.style.display = 'block';
    }, 300);
}

function minimizarChatbot() {
    fecharChatbot();
}

function mostrarVideo() {
    window.open(URL_VIDEO, '_blank');
}

/* --- Lógica do Chat --- */

function iniciarModoChatCompleto() {
    if (chatIniciado) return;
    chatIniciado = true;

    // 1. Esconder elementos de boas vindas (Faz o cartão branco subir)
    elementosBoasVindas.classList.add('escondido');

    // 2. Mudar Cabeçalho para Branco com Título Bebas
    cabecalhoChatbot.classList.add('modo-chat');
    cabecalhoEstadoInicial.classList.add('escondido');
    cabecalhoEstadoChat.classList.remove('escondido');
}

function adicionarMensagem(texto, remetente) {
    const divMensagem = document.createElement('div');
    
    if (remetente === 'user') {
        divMensagem.classList.add('mensagem-usuario');
    } else {
        divMensagem.classList.add('mensagem-bot');
    }
    
    let iconeHTML = '';
    if (remetente === 'bot') {
        iconeHTML = `<img src="${URL_MASCOTE_TEKINHO}" alt="Tekinho" class="icone-mensagem-bot">`;
        // O <span> é crucial aqui para o CSS novo funcionar
        divMensagem.innerHTML = `${iconeHTML} <span>${texto}</span>`;
    } else {
        iconeHTML = `<img src="${URL_ICONE_USUARIO}" alt="Você" class="icone-mensagem-usuario">`;
        // O <span> é crucial aqui também
        divMensagem.innerHTML = `<span>${texto}</span> ${iconeHTML}`;
    }

    corpoChat.appendChild(divMensagem);
    corpoChat.scrollTop = corpoChat.scrollHeight;
}

async function processarQueryUsuario(textoUsuario) {
    // ... (Partes visuais: muda tela, mostra balão do usuário) ...

    try {
        
        // 1. O Carteiro (fetch)
        const response = await fetch('/api/chat', {
            
            // 2. O Método (POST)
            method: 'POST', 
            
            // 3. O Envelope (Headers)
            headers: {
                'Content-Type': 'application/json',
            },
            
            // 4. A Carta (Body)
            body: JSON.stringify({ message: textoUsuario })
        });

        // 5. A Espera (Await)
        const data = await response.json();
        
        // 6. A Entrega
        adicionarMensagem(data.reply, 'bot');

    } catch (error) {
        // Se a internet cair ou o servidor der erro, cai aqui.
        console.error("Erro:", error);
        adicionarMensagem("Ops! Estou sem conexão.", 'bot');
    }

}

/* --- Listeners --- */
botaoEnviar.addEventListener('click', () => processarMensagem(inputUsuario.value));

inputUsuario.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') processarMensagem(inputUsuario.value);
});

botoesCategoria.forEach(btn => {
    btn.addEventListener('click', () => {
        let texto = btn.getAttribute('data-prompt');
        processarMensagem(texto);
    });
});