# 🚀 GUIA COMPLETO - Site do Bolão

Sistema 100% GRÁTIS com site HTML/JS + Google Sheets!

---

## 📦 O QUE VOCÊ TEM:

✅ **index.html** - Página principal  
✅ **style.css** - Estilos modernos  
✅ **app.js** - Lógica do aplicativo  
✅ **config.js** - Configurações (você vai editar)  
✅ **vercel.json** - Configuração de deploy  

---

## ⚙️ CONFIGURAÇÃO (30 minutos)

### **ETAPA 1: Configurar Google Sheets API** (10 min)

#### 1.1 - Ativar Google Sheets API

1. Acesse: https://console.cloud.google.com
2. Selecione ou crie um projeto
3. Vá em **"APIs & Services"** → **"Library"**
4. Busque: **"Google Sheets API"**
5. Clique em **"ENABLE"**

#### 1.2 - Criar API Key

1. Vá em **"APIs & Services"** → **"Credentials"**
2. Clique em **"+ CREATE CREDENTIALS"** → **"API key"**
3. Copie a chave gerada (algo como: `AIzaSyD...`)
4. Clique em **"RESTRICT KEY"**
5. Em "API restrictions": selecione **"Google Sheets API"**
6. Clique em **"SAVE"**

#### 1.3 - Configurar Google Sheets

1. Abra sua planilha no Google Sheets
2. Clique em **"Compartilhar"**
3. Mude para: **"Qualquer pessoa com o link"**
4. Permissão: **"Visualizador"** (não precisa ser Editor!)
5. Copie o ID da planilha (está na URL):
   ```
   https://docs.google.com/spreadsheets/d/SEU_ID_AQUI/edit
   ```

---

### **ETAPA 2: Criar Google Apps Script** (10 min)

Para salvar palpites, precisamos de um intermediário.

#### 2.1 - Criar Script

1. Na sua planilha Google Sheets
2. **Extensions** → **Apps Script**
3. Apague tudo e cole este código:

```javascript
function doPost(e) {
  try {
    const dados = JSON.parse(e.postData.contents);
    const participante = dados.participante;
    const palpites = dados.palpites;
    
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('PALPITES');
    
    // Remover palpites antigos
    const data = sheet.getDataRange().getValues();
    for (let i = data.length - 1; i >= 1; i--) {
      if (data[i][0] === participante) {
        sheet.deleteRow(i + 1);
      }
    }
    
    // Adicionar novos palpites
    for (const [idJogo, palpite] of Object.entries(palpites)) {
      sheet.appendRow([
        participante,
        idJogo,
        palpite.golsA,
        palpite.golsB,
        '', '', '', '' // GolsA, GolsB, Validade, Pontos
      ]);
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

#### 2.2 - Deploy do Script

1. Clique em **"Deploy"** → **"New deployment"**
2. Tipo: **"Web app"**
3. Execute as: **"Me"**
4. Who has access: **"Anyone"**
5. Clique em **"Deploy"**
6. **COPIE A URL** gerada (algo como: `https://script.google.com/macros/s/...`)

---

### **ETAPA 3: Configurar o Site** (5 min)

#### 3.1 - Editar config.js

Abra o arquivo `config.js` e preencha:

```javascript
// Seus participantes
const PARTICIPANTES = {
    "Felipe": "ABC123",
    "João": "XYZ789",
    // Adicione todos
};

// Suas datas limite
const DATAS_LIMITE = {
    'Grupo': new Date('2026-06-11T14:00:00'),
    // Ajuste conforme necessário
};

// ID da planilha (copie da URL)
const SPREADSHEET_ID = 'COLE_AQUI_O_ID';

// API Key do Google
const API_KEY = 'COLE_AQUI_SUA_API_KEY';
```

#### 3.2 - Editar app.js

Na função `salvarPalpites()`, linha ~280, cole a URL do Apps Script:

```javascript
const url = 'COLE_AQUI_A_URL_DO_APPS_SCRIPT';
```

---

### **ETAPA 4: Deploy no Vercel** (5 min)

#### 4.1 - Criar Conta

1. Acesse: https://vercel.com
2. **Sign Up** com GitHub
3. Autorize o acesso

#### 4.2 - Upload dos Arquivos

**Opção A - Via GitHub (Recomendado):**

1. Crie repositório no GitHub
2. Faça upload de todos os arquivos
3. No Vercel: **"New Project"**
4. Selecione o repositório
5. **"Deploy"**

**Opção B - Direto no Vercel:**

1. No Vercel: **"New Project"**
2. **"Import"** → Arraste a pasta inteira
3. **"Deploy"**

#### 4.3 - Pronto!

Seu site estará em:
```
https://seu-projeto.vercel.app
```

---

## ✅ TESTE

1. Acesse o link do Vercel
2. Faça login com um participante
3. Preencha alguns palpites
4. Clique em "ENVIAR"
5. Vá no Google Sheets → Aba PALPITES
6. **Veja os dados salvos!** 🎉

---

## 📊 Conectar no Power BI

1. Power BI Desktop
2. **"Obter Dados"** → **"Web"**
3. URL: `https://docs.google.com/spreadsheets/d/SEU_ID/export?format=xlsx`
4. Importa!

---

## 🎨 Personalizar

### Mudar cores:

Edite `style.css`, linha ~10:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Mudar título:

Edite `index.html`, linha ~11:
```html
<h1>⚽ SEU TÍTULO AQUI ⚽</h1>
```

---

## 🔒 Segurança

✅ Apenas leitura no Sheets (API Key restrita)  
✅ Escrita via Apps Script (você controla)  
✅ Códigos únicos por participante  
✅ Bloqueio automático por data  

---

## 💰 CUSTOS

- Google Sheets: **GRÁTIS**
- Google Cloud API: **GRÁTIS** (até 100 req/s)
- Vercel: **GRÁTIS** (ilimitado)
- **TOTAL: R$ 0,00** 🎉

---

## 🐛 Resolução de Problemas

### "Erro ao carregar jogos"
- Verifique se o SPREADSHEET_ID está correto
- Verifique se a planilha está compartilhada como "Visualizador"
- Verifique se a API Key está ativa

### "Erro ao salvar"
- Verifique a URL do Apps Script
- Verifique se o script tem permissão "Anyone"

### "Palpites não aparecem no Sheets"
- Verifique se a aba PALPITES existe
- Verifique os logs do Apps Script

---

## ✨ Vantagens dessa Solução

✅ **100% GRÁTIS**  
✅ **Acessos ilimitados**  
✅ **Muito rápido**  
✅ **Fácil de personalizar**  
✅ **Google Sheets integrado**  
✅ **Power BI conecta direto**  
✅ **Responsivo (mobile + desktop)**  

---

## 🎉 PRONTO!

Seu bolão está no ar, grátis e funcionando 24/7!

**Dúvidas?** Me chama! 🚀

---

**Desenvolvido com ❤️ para o Bolão da Copa 2026**
