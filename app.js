// Estado global
let usuarioLogado = null;
let jogosData = [];
let palpitesUsuario = {};
let palpitesAtuais = {};

// Elementos DOM
const loginScreen = document.getElementById('loginScreen');
const appScreen = document.getElementById('appScreen');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const nomeUsuario = document.getElementById('nomeUsuario');
const logoutBtn = document.getElementById('logoutBtn');
const jogosContainer = document.getElementById('jogosContainer');
const loading = document.getElementById('loading');
const submitContainer = document.getElementById('submitContainer');
const submitBtn = document.getElementById('submitBtn');
const successMessage = document.getElementById('successMessage');
const prazosInfo = document.getElementById('prazosInfo');

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    mostrarPrazos();
    
    loginForm.addEventListener('submit', handleLogin);
    logoutBtn.addEventListener('click', handleLogout);
    submitBtn.addEventListener('click', handleSubmit);
});

// Mostrar prazos na tela de login
function mostrarPrazos() {
    let html = '';
    for (const [fase, dataLimite] of Object.entries(DATAS_LIMITE)) {
        const tempoRestante = calcularTempoRestante(dataLimite);
        const classe = tempoRestante.indisponivel ? 'prazo-indisponivel' : 'prazo-aberto';
        const icone = tempoRestante.indisponivel ? '🔒' : '🟢';
        const texto = tempoRestante.indisponivel ? 'indisponivel' : tempoRestante.texto;
        
        html += `<div class="prazo-item ${classe}">${icone} ${fase}: ${texto}</div>`;
    }
    prazosInfo.innerHTML = html;
}

// Calcular tempo restante
function calcularTempoRestante(dataLimite) {
    const agora = new Date();
    const diferenca = dataLimite - agora;
    
    if (diferenca <= 0) {
        return { indisponivel: true, texto: 'indisponivel' };
    }
    
    const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diferenca % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((diferenca % (1000 * 60 * 60)) / (1000 * 60));
    
    if (dias > 0) {
        return { indisponivel: false, texto: `${dias}d ${horas}h ${minutos}min` };
    } else if (horas > 0) {
        return { indisponivel: false, texto: `${horas}h ${minutos}min` };
    } else {
        return { indisponivel: false, texto: `${minutos}min` };
    }
}

// Verificar se fase está aberta
function faseEstaAberta(fase) {
    if (!DATAS_LIMITE[fase]) return true;
    return !calcularTempoRestante(DATAS_LIMITE[fase]).indisponivel;
}

// Login
function handleLogin(e) {
    e.preventDefault();
    
    const nome = document.getElementById('nome').value.trim();
    const codigo = document.getElementById('codigo').value;
    
    if (PARTICIPANTES[nome] && PARTICIPANTES[nome] === codigo) {
        usuarioLogado = nome;
        loginError.textContent = '';
        nomeUsuario.textContent = nome;
        
        loginScreen.style.display = 'none';
        appScreen.style.display = 'block';
        
        carregarDados();
    } else {
        loginError.textContent = '❌ Nome ou código inválido!';
    }
}

// Logout
function handleLogout() {
    usuarioLogado = null;
    palpitesAtuais = {};
    
    loginScreen.style.display = 'block';
    appScreen.style.display = 'none';
    
    document.getElementById('nome').value = '';
    document.getElementById('codigo').value = '';
}

// Carregar dados do Google Sheets
async function carregarDados() {
    try {
        loading.style.display = 'block';
        jogosContainer.innerHTML = '';
        
        // Carregar jogos
        await carregarJogos();
        
        // Carregar palpites do usuário
        await carregarPalpites();
        
        // Renderizar interface
        renderizarJogos();
        
        loading.style.display = 'none';
        submitContainer.style.display = 'block';
        
    } catch (error) {
        loading.innerHTML = `<p style="color: #f44336;">❌ Erro ao carregar dados: ${error.message}</p>`;
    }
}

// Carregar jogos do Google Sheets
async function carregarJogos() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/JOGOS?key=${API_KEY}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (!data.values) {
        throw new Error('Nenhum jogo encontrado');
    }
    
    const headers = data.values[0];
    jogosData = data.values.slice(1).map(row => {
        const jogo = {};
        headers.forEach((header, index) => {
            jogo[header] = row[index] || '';
        });
        return jogo;
    });
}

// Carregar palpites do usuário
async function carregarPalpites() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/PALPITES?key=${API_KEY}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.values && data.values.length > 1) {
            const headers = data.values[0];
            const rows = data.values.slice(1);
            
            rows.forEach(row => {
                if (row[0] === usuarioLogado) {
                    const idJogo = row[1];
                    palpitesUsuario[idJogo] = {
                        golsA: parseInt(row[2]) || 0,
                        golsB: parseInt(row[3]) || 0
                    };
                }
            });
        }
    } catch (error) {
        console.log('Nenhum palpite anterior encontrado');
    }
}

// Renderizar jogos por fase
function renderizarJogos() {
    const fases = ['Grupo', '16 avos', 'Oitavas de final', 'Quartas de final', 'Semifinais', 'Terceiro e Quarto', 'Final'];
    let html = '';
    let temFaseAberta = false;
    
    fases.forEach(fase => {
        const jogosFase = jogosData.filter(j => j.Fase === fase);
        if (jogosFase.length === 0) return;
        
        const faseAberta = faseEstaAberta(fase);
        if (faseAberta) temFaseAberta = true;
        
        const tempoRestante = calcularTempoRestante(DATAS_LIMITE[fase]);
        
        html += `
            <div class="fase-section">
                <div class="fase-header">
                    <h2 class="fase-title">🏆 ${fase}</h2>
                    <div class="fase-prazo ${faseAberta ? 'aberta' : 'encerrada'}">
                        ${faseAberta ? '⏰ ' + tempoRestante.texto : '🔒 indisponivel'}
                    </div>
                </div>
        `;
        
        if (!faseAberta) {
            html += `<div class="fase-bloqueada">⚠️ Palpites desta fase indisponivels</div>`;
        }
        
        if (fase === 'Grupo') {
            const grupos = [...new Set(jogosFase.map(j => j.Grupo))].sort();
            grupos.forEach(grupo => {
                if (grupo) {
                    html += `<h3 class="grupo-subtitle">Grupo ${grupo}</h3>`;
                    const jogosGrupo = jogosFase.filter(j => j.Grupo === grupo);
                    jogosGrupo.forEach(jogo => {
                        html += renderizarJogo(jogo, faseAberta);
                    });
                }
            });
        } else {
            jogosFase.forEach(jogo => {
                html += renderizarJogo(jogo, faseAberta);
            });
        }
        
        html += `</div>`;
    });
    
    if (!temFaseAberta) {
        html += `<div class="fase-bloqueada" style="font-size: 1.2rem; padding: 30px;">
            🔒 Todas as fases encerradas. Você está visualizando seus palpites salvos.
        </div>`;
        submitContainer.style.display = 'none';
    }
    
    jogosContainer.innerHTML = html;
    
    // Adicionar event listeners aos inputs
    document.querySelectorAll('.gols-input').forEach(input => {
        input.addEventListener('change', handlePalpiteChange);
    });
}

// Renderizar um jogo individual
function renderizarJogo(jogo, faseAberta) {
    const idJogo = jogo.ID_Jogo;
    const palpiteAnterior = palpitesUsuario[idJogo] || { golsA: 0, golsB: 0 };
    
    if (faseAberta) {
        return `
            <div class="jogo-card">
                <div class="jogo-content">
                    <div class="time">
                        <h3>${jogo.SeleçãoA}</h3>
                    </div>
                    <div>
                        <input type="number" class="gols-input" 
                               data-jogo="${idJogo}" 
                               data-time="A" 
                               min="0" max="20" 
                               value="${palpiteAnterior.golsA}">
                    </div>
                    <div class="vs">X</div>
                    <div>
                        <input type="number" class="gols-input" 
                               data-jogo="${idJogo}" 
                               data-time="B" 
                               min="0" max="20" 
                               value="${palpiteAnterior.golsB}">
                    </div>
                    <div class="time">
                        <h3>${jogo.SeleçãoB}</h3>
                    </div>
                </div>
            </div>
        `;
    } else {
        return `
            <div class="jogo-card">
                <div class="jogo-content">
                    <div class="time">
                        <h3>${jogo.SeleçãoA}</h3>
                    </div>
                    <div class="gols-display">${palpiteAnterior.golsA}</div>
                    <div class="vs">X</div>
                    <div class="gols-display">${palpiteAnterior.golsB}</div>
                    <div class="time">
                        <h3>${jogo.SeleçãoB}</h3>
                    </div>
                </div>
            </div>
        `;
    }
}

// Atualizar palpite quando input muda
function handlePalpiteChange(e) {
    const idJogo = e.target.dataset.jogo;
    const time = e.target.dataset.time;
    const valor = parseInt(e.target.value) || 0;
    
    if (!palpitesAtuais[idJogo]) {
        palpitesAtuais[idJogo] = { golsA: 0, golsB: 0 };
    }
    
    if (time === 'A') {
        palpitesAtuais[idJogo].golsA = valor;
    } else {
        palpitesAtuais[idJogo].golsB = valor;
    }
}

// Enviar palpites
async function handleSubmit() {
    // Coletar todos os palpites dos inputs
    const inputs = document.querySelectorAll('.gols-input');
    inputs.forEach(input => {
        const idJogo = input.dataset.jogo;
        const time = input.dataset.time;
        const valor = parseInt(input.value) || 0;
        
        if (!palpitesAtuais[idJogo]) {
            palpitesAtuais[idJogo] = { golsA: 0, golsB: 0 };
        }
        
        if (time === 'A') {
            palpitesAtuais[idJogo].golsA = valor;
        } else {
            palpitesAtuais[idJogo].golsB = valor;
        }
    });
    
    if (Object.keys(palpitesAtuais).length === 0) {
        alert('⚠️ Preencha pelo menos um palpite!');
        return;
    }
    
    submitBtn.disabled = true;
    submitBtn.textContent = '⏳ Salvando...';
    
    try {
        await salvarPalpites();
        
        successMessage.innerHTML = `✅ ${Object.keys(palpitesAtuais).length} palpites salvos com sucesso! Boa sorte! 🍀`;
        successMessage.style.display = 'block';
        
        // Confete
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 5000);
        
        submitBtn.textContent = '🚀 ENVIAR PALPITES';
        submitBtn.disabled = false;
        
    } catch (error) {
        alert('❌ Erro ao salvar: ' + error.message);
        submitBtn.textContent = '🚀 ENVIAR PALPITES';
        submitBtn.disabled = false;
    }
}

// Salvar palpites no Google Sheets
async function salvarPalpites() {
    // Nota: Salvar no Google Sheets via API requer autenticação OAuth
    // Para simplificar, vou usar Google Apps Script como intermediário
    
    const url = 'SUA_URL_DO_GOOGLE_APPS_SCRIPT_AQUI';
    
    const dados = {
        participante: usuarioLogado,
        palpites: palpitesAtuais
    };
    
    const response = await fetch(url, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dados)
    });
    
    // Simulação de sucesso (já que no-cors não retorna resposta)
    return true;
}
