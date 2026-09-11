# 🎓 Study Friend — Plataforma Estudantil Integrada

> **Projeto Acadêmico Full Stack:** Plataforma educacional construída em **React 18 (Vite + Tailwind CSS)** com interface **dark, limpa e minimalista** e API RESTful em **Python 3 (FastAPI + Uvicorn)** com banco de dados **SQLite** e autenticação **JWT**.

---

## 📋 Sobre o Projeto

O **Study Friend** é uma plataforma web educacional voltada para estudantes do Ensino Médio e pré-vestibulandos. Oferece resumos diretos, flashcards interativos e banco de questões das **9 disciplinas do Ensino Médio** (Matemática, Física, Química, História, Geografia, Filosofia, Sociologia, Biologia e Língua Portuguesa e Literatura), agrupadas em **4 áreas de conhecimento separadas** — Exatas, Humanas, Biológicas e Linguagens — cada uma com **ícone identificador** e organizadas por ano escolar.

A aplicação conta com autenticação JWT, dashboard de progresso do aluno, painel administrativo (CMS) para gerenciamento de conteúdo e uma interface limpa em tema escuro.

---

## 🎨 Destaques da Interface

- 🌑 **Tema escuro minimalista:** Tons slate com acento ciano, superfícies planas e hierarquia tipográfica limpa.
- 🔤 **Tipografia Google Fonts:** *Plus Jakarta Sans* para toda a interface.
- 🃏 **Flashcards com Flip 3D:** Animação CSS `rotateY` com `preserve-3d` e `backface-visibility`.
- 📊 **Dashboard de Progresso:** Barras de desempenho por disciplina com taxa de acerto.
- 🔐 **Autenticação JWT:** Cadastro, login e proteção de rotas com token.
- 🎛️ **Painel Admin (CMS):** Gerenciamento de disciplinas, tópicos, resumos, flashcards e questões.
- 🧭 **Disciplinas por área com ícones:** Tarjetas agrupadas em Exatas, Humanas, Biológicas e Linguagens, cada uma com ícone SVG próprio.
- 🪧 **Logotipo próprio:** Logo da plataforma (`logo.png`) no cabeçalho da aplicação.

---

## 🛠️ Tecnologias Utilizadas

### **Frontend (React 18 + Vite + Tailwind CSS)**
- **React 18** — Componentes funcionais com Hooks (`useState`, `useEffect`, `useContext`).
- **Vite** — Build tool com HMR instantâneo e proxy de API.
- **Tailwind CSS v3** — Utilitários CSS com abordagem *Mobile-First*.
- **Axios** — Cliente HTTP com interceptor automático para token JWT.
- **Tema escuro minimalista** — Superfícies planas em tons slate com acento ciano.

### **Backend (Python 3 + FastAPI + SQLite)**
- **Python 3.13** — Linguagem principal do backend.
- **FastAPI** — Framework async de alta performance para APIs RESTful.
- **Uvicorn** — Servidor ASGI ultrarrápido.
- **Pydantic & Sanitização** — Validação de dados e proteção contra XSS (`html.escape`).
- **SQLite** — Banco relacional leve com modo WAL e *Prepared Statements*.
- **PyJWT + bcrypt** — Autenticação JWT e encriptação de senhas com hashing seguro.

---

## 📁 Estrutura de Arquivos

```text
study-friend/
├── api/                              # Backend Python (FastAPI)
│   ├── db/
│   │   └── landing.db                # Banco SQLite (criado em runtime)
│   ├── src/
│   │   ├── app.py                    # Configuração FastAPI, CORS e rotas
│   │   ├── config/
│   │   │   ├── conexao_banco.py      # Conexão SQLite (row_factory dict, WAL)
│   │   │   └── dependencias.py       # Dependências FastAPI (auth JWT, admin)
│   │   ├── controladores/
│   │   │   ├── auth_controlador.py   # Lógica de registro e login
│   │   │   ├── conteudo_controlador.py # Disciplinas, tópicos, resumos, flashcards
│   │   │   ├── questao_controlador.py  # Questões, responder e estatísticas
│   │   │   ├── admin_controlador.py    # CRUD administrativo (CMS)
│   │   │   └── lead_controlador.py    # Lógica de captura de leads (legado)
│   │   ├── rotas/
│   │   │   ├── auth_rotas.py         # POST /api/auth/registrar, /api/auth/login
│   │   │   ├── conteudo_rotas.py     # GET /api/disciplinas, /api/topicos, etc.
│   │   │   ├── questao_rotas.py      # GET /api/questoes, POST /responder
│   │   │   ├── admin_rotas.py        # CRUD /api/admin/*
│   │   │   └── lead_rotas.py         # Rotas de leads (legado)
│   │   └── utilitarios/
│   │       ├── seguranca.py          # JWT (PyJWT) e hash bcrypt
│   │       └── validadores.py        # Sanitização e validação de inputs
│   ├── iniciar_banco.py              # DDL SQLite + seed de dados pedagógicos
│   ├── main.py                       # Ponto de entrada Uvicorn (porta 3000)
│   ├── .env                          # Variáveis de ambiente
│   ├── .env.example                  # Template de variáveis
│   └── requirements.txt              # Dependências Python
│
├── frontend/                         # Frontend React 18 + Vite + Tailwind
│   ├── src/
│   │   ├── servicos/
│   │   │   └── api.js                # Instância Axios com interceptor JWT
│   │   ├── contextos/
│   │   │   └── AutenticacaoContexto.jsx # Context de autenticação global
│   │   ├── components/
│   │   │   ├── Navbar.jsx            # Barra de navegação responsiva (logo.png)
│   │   │   ├── Toast.jsx             # Notificação flutuante
│   │   │   └── IconeDisciplina.jsx   # Ícones SVG de cada disciplina
│   │   ├── utilidades/
│   │   │   └── areas.js              # Cores e agrupamento das áreas do conhecimento
│   │   ├── pages/
│   │   │   ├── Inicio.jsx            # Página inicial com hero e disciplinas
│   │   │   ├── HubDisciplinas.jsx    # Disciplinas por área com ícones
│   │   │   ├── PaginaTopicos.jsx     # Tópicos com filtro por ano escolar
│   │   │   ├── VisualizadorResumos.jsx # Leitor de Markdown com resumos
│   │   │   ├── ModuloFlashcards.jsx  # Flashcards com flip 3D
│   │   │   ├── BancoExercicios.jsx   # Questões de múltipla escolha
│   │   │   ├── Dashboard.jsx         # Gráfico de desempenho do aluno
│   │   │   ├── Login.jsx             # Formulário de login
│   │   │   ├── Registrar.jsx         # Formulário de cadastro
│   │   │   └── AdminCMS.jsx          # Painel administrativo CRUD
│   │   ├── App.jsx                   # Componente raiz com navegação SPA
│   │   ├── main.jsx                  # Ponto de entrada do React
│   │   └── index.css                 # Estilos globais e animações
│   ├── vite.config.js                # Configuração Vite e proxy API
│   ├── tailwind.config.js            # Configuração Tailwind
│   ├── postcss.config.js             # Configuração PostCSS
│   └── package.json                  # Dependências React
│
├── doc/
│   ├── escopo_do_projeto.md             # Documento de escopo
│   ├── requisitos_de_sistema.md         # Requisitos de sistema (RS)
│   └── requisitos_de_usuario.md         # Requisitos de usuário (RU)
│
├── .gitignore
└── README.md
```

---

## ⚡ Como Executar

### 1. Instalar Dependências

**Backend (API Python):**
```bash
cd api
python -m venv .venv
# Linux/Mac:
source .venv/bin/activate && pip install -r requirements.txt
# Windows:
.venv\Scripts\pip install -r requirements.txt
```

**Frontend (React 18 + Vite):**
```bash
cd ../frontend
npm install
```

### 2. Rodar em Desenvolvimento

**Terminal 1 — Backend Python:**
```bash
cd api
# Linux/Mac:
.venv/bin/python main.py
# Windows:
.venv\Scripts\python main.py
```

**Terminal 2 — Frontend React:**
```bash
cd frontend
npm run dev
```

**Acessar no navegador:**
- 🌐 **Interface React:** `http://localhost:5173`
- 🔌 **API Python:** `http://localhost:3000/api/health`

### 3. Modo Produção

```bash
cd frontend && npm run build
cd ../api && .venv/bin/python main.py
```
Acesse tudo em `http://localhost:3000`

---

## 🔑 Usuário Admin Padrão

Um usuário administrador é criado automaticamente no primeiro acesso:

| Campo | Valor |
|-------|-------|
| E-mail | `admin@studyfriend.com` |
| Senha | `admin123` |
| Perfil | `ADMIN` |

---

## 🗄️ Modelo de Dados (SQLite)

| Tabela | Descrição |
|--------|-----------|
| `usuarios` | Usuários com nome, e-mail, senha hash e perfil (ESTUDANTE/ADMIN) |
| `disciplinas` | 9 matérias do Ensino Médio com área do conhecimento (Exatas, Humanas, Biológicas, Linguagens) e chave de ícone |
| `topicos` | Tópicos por disciplina e ano escolar (1º, 2º, 3º, ENEM) |
| `resumos` | Conteúdo em Markdown com links de mapas mentais (PDF) |
| `flashcards` | Baralhos de revisão ativa (frente/verso) |
| `questoes` | Exercícios de múltipla escolha com gabarito comentado |
| `progresso_aluno` | Registro de acertos/erros por questão e por aluno |

---

## 🔌 Endpoints da API RESTful

### Autenticação
| Método | Rota | Descrição |
|--------|------|-----------|
| `POST` | `/api/auth/registrar` | Criar conta de estudante |
| `POST` | `/api/auth/login` | Login e retorno do token JWT |

### Conteúdo
| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/disciplinas` | Lista as 9 disciplinas com ícone, área e contagem de tópicos |
| `GET` | `/api/disciplinas/{id}/topicos` | Tópicos de uma disciplina (filtro por ano) |
| `GET` | `/api/topicos/{id}/resumos` | Resumos e links de mapas mentais |
| `GET` | `/api/topicos/{id}/flashcards` | Baralho de flashcards de revisão |

### Questões e Progresso (🔒 autenticado)
| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/questoes` | Questões com filtros (disciplina, ano, dificuldade) |
| `POST` | `/api/questoes/responder` | Enviar resposta e contabilizar progresso |
| `GET` | `/api/aluno/estatisticas` | Dashboard de desempenho do aluno |

### Admin CMS (🔒 admin)
| Método | Rota | Descrição |
|--------|------|-----------|
| `GET/POST` | `/api/admin/disciplinas` | Listar/Criar disciplinas |
| `PUT/DELETE` | `/api/admin/disciplinas/{id}` | Atualizar/Remover disciplina |
| `GET/POST` | `/api/admin/topicos` | Listar/Criar tópicos |
| `PUT/DELETE` | `/api/admin/topicos/{id}` | Atualizar/Remover tópico |
| `GET/POST` | `/api/admin/resumos` | Listar/Criar resumos |
| `PUT/DELETE` | `/api/admin/resumos/{id}` | Atualizar/Remover resumo |
| `GET/POST` | `/api/admin/flashcards` | Listar/Criar flashcards |
| `PUT/DELETE` | `/api/admin/flashcards/{id}` | Atualizar/Remover flashcard |
| `GET/POST` | `/api/admin/questoes` | Listar/Criar questões |
| `PUT/DELETE` | `/api/admin/questoes/{id}` | Atualizar/Remover questão |

### Legado
| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/health` | Health check do servidor |
| `POST` | `/api/leads` | Cadastrar lead (landing page legada) |
| `GET` | `/api/leads` | Listar leads (landing page legada) |

---

## 📜 Licença e Créditos

Projeto desenvolvido com fins acadêmicos. Repositório oficial:
🔗 [https://github.com/eduardovasconcelos557/Des_Web_3B_Study_Friend.git](https://github.com/eduardovasconcelos557/Des_Web_3B_Study_Friend.git)
