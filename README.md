# 🌐 BOLÃO COPA 2026 - SITE WEB

Sistema **100% grátis** usando HTML/CSS/JavaScript + Google Sheets!

---

## ✨ Características

✅ **100% Grátis** - Vercel hosting gratuito  
✅ **Acessos Ilimitados** - Sem limite de usuários  
✅ **Rápido** - Site estático carrega instantaneamente  
✅ **Google Sheets** - Dados na nuvem  
✅ **Responsivo** - Funciona em celular e desktop  
✅ **Seguro** - Login com código único  
✅ **Múltiplos Prazos** - Cada fase tem seu prazo  

---

## 📂 Estrutura dos Arquivos

```
bolao_site/
├── index.html          # Página principal
├── styles.css          # Estilos
├── script.js           # Lógica JavaScript
├── config.js           # Configurações (EDITE AQUI!)
├── vercel.json         # Configuração Vercel
└── README.md           # Este arquivo
```

---

## ⚙️ CONFIGURAÇÃO (15 minutos)

### PASSO 1: Configurar Google Sheets

#### 1.1 - Criar Planilha

1. Acesse: https://sheets.google.com
2. Crie nova planilha: **"Bolão Copa 2026"**
3. Crie duas abas:
   - **JOGOS**
   - **PALPITES**

#### 1.2 - Aba JOGOS

Primeira linha (cabeçalhos):
```
ID_Jogo | Grupo | Fase | Data | Horário | SeleçãoA | SeleçãoB | GolsA | GolsB
```

Preencha com os 104 jogos.

#### 1.3 - Aba PALPITES

Primeira linha (cabeçalhos):
```
Participante | id_jogo | PalpiteA | PalpiteB | GolsA | GolsB | Validade | Pontos
```

Deixe as demais linhas vazias.

#### 1.4 - Obter ID da Planilha

Na URL da sua planilha:
```
https://docs.google.com/spreadsheets/d/1a2b3c4d5e6f7g8h9i0j/edit
                                      ^^^^^^^^^^^^^^^^^^^^
                                      Este é o SPREADSHEET_ID
```

Copie o ID!

---

### PASSO 2: Ativar Google Sheets API

#### 2.1 - Google Cloud Console

1. Acesse: https://console.cloud.google.com
2. Crie novo projeto: `bolao-copa-2026`
3. Menu: **"APIs & Services"** → **"Library"**
4. Busque: **"Google Sheets API"**
5. Clique em **"ENABLE"**

#### 2.2 - Criar API Key

1. Menu: **"APIs & Services"** → **"Credentials"**
2. Clique: **"+ CREATE CREDENTIALS"** → **"API key"**
3. Copie a API Key gerada
4. **IMPORTANTE:** Clique em **"Edit API key"**
5. Em **"API restrictions"**, selecione:
   - ✅ Google Sheets API
6. Salve

#### 2.3 - Tornar Planilha Pública (Leitura)

1. Volte no Google Sheets
2. Clique em **"Compartilhar"**
3. Em **"Acesso geral"**: **"Qualquer pessoa com o link"**
4. Permissão: **"Visualizador"** (apenas leitura)
5. Clique em **"Concluído"**

**OBS:** Visualizador é seguro! Ninguém pode editar pelo link.

---

### PASSO 3: Configurar o Site

#### 3.1 - Editar config.js

Abra o arquivo `config.js` e configure:

```javascript
// PARTICIPANTES
const PARTICIPANTES = {
    "Felipe": "ABC123",
    "João": "XYZ789",
    "Maria": "QWE456",
    // Adicione todos os participantes
};

// DATAS LIMITE
const DATAS_LIMITE = {
    'Grupo': new Date('2026-06-11T14:00:00'),
    // Ajuste as datas conforme necessário
};

// GOOGLE SHEETS
const SPREADSHEET_ID = 'COLE_SEU_SPREADSHEET_ID_AQUI';
const API_KEY = 'COLE_SUA_API_KEY_AQUI';
```

---

### PASSO 4: Deploy no Vercel (GRÁTIS)

#### 4.1 - Criar Conta Vercel

1. Acesse: https://vercel.com
2. Clique em **"Sign Up"**
3. Escolha: **"Continue with GitHub"**
4. Autorize

#### 4.2 - Fazer Upload

**Opção A - Arrastar e Soltar:**

1. No dashboard Vercel
2. Clique em **"Add New..."** → **"Project"**
3. **"Upload"** (aba)
4. Arraste a pasta `bolao_site` inteira
5. Clique em **"Deploy"**

**Opção B - Via GitHub:**

1. Faça push para GitHub
2. No Vercel: **"Import Git Repository"**
3. Selecione seu repositório
4. **"Deploy"**

#### 4.3 - Aguardar Deploy

- ⏳ Aguarde 1-2 minutos
- ✅ Quando aparecer **"Congratulations"**
- 🎉 Seu site está no ar!

#### 4.4 - Copiar URL

Seu site estará em:
```
https://seu-bolao.vercel.app
```

---

## 📱 USAR O SITE

### Para Participantes:

1. Acessar: `https://seu-bolao.vercel.app`
2. Digitar **Nome** e **Código**
3. Clicar em **"ENTRAR"**
4. Preencher palpites
5. Clicar em **"ENVIAR PALPITES"**

### Para Você (Admin):

1. Acessar Google Sheets
2. Aba **PALPITES**
3. Ver todos os palpites em tempo real!
4. Conectar Power BI direto no Sheets

---

## 🔧 LIMITAÇÃO ATUAL

**⚠️ ATENÇÃO:** O site atual **APENAS LÊ** do Google Sheets.

Para **ESCREVER** (salvar palpites), você tem 2 opções:

### OPÇÃO 1: Google Apps Script (Recomendado)

Criar um endpoint no Google Sheets para receber dados.

**Quer que eu crie isso?** É rápido!

### OPÇÃO 2: Backend Simples

Criar uma API simples (Node.js) no Vercel também.

---

## 📊 Conectar Power BI

1. Power BI Desktop
2. **"Obter Dados"** → **"Web"**
3. Cole a URL do Google Sheets
4. Importar aba PALPITES
5. Pronto! ✅

---

## 🎨 Personalização

### Mudar Cores:

Edite `styles.css`:
- Linha 11: Gradiente do background
- Linha 26: Gradiente do header
- Linha 118: Cor dos botões

### Mudar Textos:

Edite `index.html` ou `script.js`

### Adicionar Participantes:

Edite `config.js` → dicionário `PARTICIPANTES`

---

## ⚡ Próximos Passos

Como o salvamento ainda não está implementado, vou criar:

**1. Google Apps Script** para salvar palpites  
**2. Atualizar script.js** para chamar o endpoint

**Quer que eu faça isso agora?** Leva 10 minutos! 🚀

---

## 📞 Suporte

Qualquer dúvida, só chamar! 😊

---

**Desenvolvido com ❤️ | 100% Grátis | Acessos Ilimitados**
