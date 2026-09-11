# Plano de Arquitetura — Sistema Acadêmico em React 18 + Python (FastAPI)

> **Idioma obrigatório:** 100% do código (variáveis, funções, tabelas, colunas, chaves JSON, rotas **e comentários**) em **português brasileiro**. Comentários devem descrever a lógica em PT-BR em toda função e bloco relevante.

---

## 1. Visão Geral da Arquitetura

O projeto consiste em um **Sistema Acadêmico Full Stack** composto por duas camadas bem definidas:

1. **Frontend (React 18 + Vite + Tailwind CSS)**: Interface moderna com estilo **Dark Glassmorphism**, baseada em componentes reativos, gerenciamento de estado via Hooks (`useState`, `useEffect`), fontes Google Fonts (*Plus Jakarta Sans* e *Fira Code*), visualizador de snippets de código e modal interativo em tempo real para inspeção dos dados salvos no SQLite.
2. **Backend (Python 3 + FastAPI + SQLite)**: API RESTful encarregada do roteamento assíncrono, sanitização de inputs contra scripts maliciosos (XSS), tratamento de cabeçalhos de segurança (CORS) e persistência relacional no banco de dados SQLite via módulo nativo `sqlite3` com modo WAL ativo.

---

## 2. Estrutura Completa de Diretórios

```text
testereact/
├── api/                          # Backend Python
│   ├── .env                      # Variáveis de ambiente (PORT, ORIGEM_PERMITIDA)
│   ├── requirements.txt          # Dependências do servidor Python (fastapi, uvicorn, etc.)
│   ├── iniciar_banco.py          # Script DDL de criação da tabela de leads no SQLite
│   ├── main.py                   # Ponto de entrada do servidor Uvicorn (Porta 3000)
│   ├── src/
│   │   ├── app.py                # Configuração do FastAPI, CORS, rotas e estáticos
│   │   ├── server.py             # Script auxiliar de execução
│   │   ├── config/
│   │   │   └── conexao_banco.py  # Conexão SQLite com row_factory dict
│   │   ├── controladores/
│   │   │   └── lead_controlador.py# Regras de negócio da API
│   │   ├── rotas/
│   │   │   └── lead_rotas.py     # Rotas da API (/api/leads)
│   │   └── utilitarios/
│   │       └── validadores.py    # Sanitização e validação dos inputs
│   │
│   └── db/                       # Diretório do banco SQLite (runtime)
│       └── landing.db            # Arquivo da base de dados local
│
├── frontend/                     # Frontend Reativo (React 18 + Vite)
│   ├── package.json              # Dependências do React (dev, build, preview)
│   ├── vite.config.js            # Configuração do Vite e proxy da API (/api -> 3000)
│   ├── tailwind.config.js        # Configuração das rotas de scan do Tailwind CSS
│   ├── postcss.config.js         # Configuração do PostCSS
│   ├── index.html                # HTML Base com div #root e fontes do Google
│   └── src/
│       ├── main.jsx              # Ponto de entrada do React (ReactDOM.createRoot)
│       ├── App.jsx               # Componente raiz unificador da interface
│       ├── index.css             # Estilos globais, fontes e animações glassmorphic
│       └── components/
│           ├── Header.jsx        # Navbar fixa com marca AcademiStack
│           ├── Hero.jsx          # Seção Hero com seletor de snippets de código
│           ├── Beneficios.jsx    # Cards da arquitetura (Python, React, SQLite)
│           ├── FormularioLead.jsx# Formulário reativo com máscara e validação
│           ├── ModalLeads.jsx    # Modal de consulta em tempo real aos leads do SQLite
│           ├── Toast.jsx         # Componente de notificação flutuante
│           └── Footer.jsx        # Rodapé institucional
│
├── doc/
│   ├── plano_landingpage_python.md   # ← Este documento
│   └── plano_landingpage_nodejs.md   # Histórico da versão legada em Node.js
│
├── .gitignore                    # Especificação de arquivos ignorados pelo Git (.venv, etc.)
└── README.md                     # Guia de instalação e documentação oficial
```

---

## 3. Instruções de Ativação e Execução do Servidor React e Backend

### 3.1 Instalação das Dependências

Instalar pacotes do servidor backend Python:
```bash
cd api
python -m venv .venv
.venv\Scripts\pip install -r requirements.txt
```

Instalar pacotes da aplicação React frontend:
```bash
cd ../frontend
npm install
```

---

## 4. Modelagem do Banco de Dados (SQLite)

O banco de dados SQLite (`api/db/landing.db`) é instanciado automaticamente pelo script `iniciar_banco.py`.

### Tabela `leads`

```sql
CREATE TABLE IF NOT EXISTS leads (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    nome_completo       TEXT    NOT NULL,
    email               TEXT    NOT NULL,
    telefone_whatsapp   TEXT    NOT NULL,
    mensagem            TEXT    DEFAULT NULL,
    data_cadastro       TEXT    DEFAULT (datetime('now','localtime')),
    status_atendimento  TEXT    DEFAULT 'novo'
                                CHECK(status_atendimento IN ('novo','contatado','convertido','perdido'))
);

CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status_atendimento);
```

---

## 5. Endpoints da API RESTful

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/` | Servidor estático da aplicação React (`frontend/dist`) |
| `GET` | `/api/health` | Health Check do servidor Python (`{"sucesso": true, "mensagem": "API funcionando!"}`) |
| `POST` | `/api/leads` | Cadastrar novo lead com validação e sanitização |
| `GET` | `/api/leads` | Listar leads cadastrados no SQLite com paginação (`pagina`, `limite`) |
