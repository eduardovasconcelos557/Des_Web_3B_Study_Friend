# Plano de Execução do Projeto — Study Friend

**Projeto:** Study Friend — Plataforma Estudantil Integrada  
**Dupla Criadora:** Eduardo de Jesus Vasconcelos e Ana Isabela Moreira Rezende Câmara  
**Agente de Programação:** Open Code  
**Estratégia Arquitetural:** Separação estrita de Front-end e Back-end (API RESTful)

---

## 1. Diretrizes Técnicas e Padrões de Arquitetura

O desenvolvimento conduzido pelo **Open Code** deve seguir a separação completa entre a camada de aplicação/interface (Front-end) e a camada de serviços/regras de negócio (Back-end), conforme a arquitetura oficial descrita no `README.md` do repositório.

```
+-----------------------------------+
|         FRONT-END (CLIENT)        |
|  React 18 (Vite + Tailwind CSS)   |
|  Estética Dark Glassmorphic       |
+-----------------+-----------------+
                  |
                  | HTTP / REST API (JSON)
                  v
+-----------------+-----------------+
|         BACK-END (SERVER)         |
|  Python 3 (FastAPI + Uvicorn)     |
|  Sanitização XSS e CORS           |
+-----------------+-----------------+
                  |
                  v
+-----------------+-----------------+
|      BANCO DE DADOS (DATABASE)    |
|        SQLite (sqlite3, WAL)      |
+-----------------------------------+
```

### 1.1 Stack Tecnológica Adotada
* **Back-end:** Python 3.13 com FastAPI e Uvicorn, persistência relacional via módulo nativo `sqlite3` (modo WAL), Pydantic e validadores para sanitização de dados.
* **Front-end:** React 18 com Vite, Tailwind CSS v3, JSX & React Hooks (`useState`, `useEffect`) e integração assíncrona via `fetch`/Axios.
* **Autenticação:** JSON Web Token (JWT via `PyJWT`) e encriptação de senhas via `bcrypt`/`passlib`.
* **Comunicação:** API RESTful orientada ao padrão JSON, com CORS Middleware controlando requisições Cross-Origin.
* **Idioma obrigatório:** 100% do código (variáveis, funções, tabelas, colunas, chaves JSON, rotas **e comentários**) em **português brasileiro**, seguindo o padrão já adotado no projeto.

---

## 2. Roteiro de Codificação para o Open Code

### Fase 1: Estruturação do Repositório
Criar a estrutura base separando o ambiente do servidor e do cliente, espelhando a organização já existente no repositório:

```
study-friend/
├── api/
│   ├── .env.example              # Variáveis de ambiente (PORT, ORIGEM_PERMITIDA, SEGREDO_JWT)
│   ├── requirements.txt          # Dependências do Python (fastapi, uvicorn, pydantic, PyJWT)
│   ├── iniciar_banco.py          # Script DDL de criação das tabelas no SQLite
│   ├── main.py                   # Ponto de entrada do servidor Uvicorn (Porta 3000)
│   ├── src/
│   │   ├── app.py                # Configuração do FastAPI, CORS, rotas e estáticos
│   │   ├── config/
│   │   │   └── conexao_banco.py  # Conexão SQLite com row_factory dict e WAL
│   │   ├── controladores/        # Lógica de negócio da API
│   │   ├── rotas/                # Endpoints HTTP da aplicação
│   │   └── utilitarios/          # Validadores, sanitização e segurança (JWT)
│   └── db/                       # Diretório do banco SQLite (criado em runtime)
├── frontend/
│   ├── src/
│   │   ├── components/           # Componentes React reutilizáveis
│   │   ├── pages/                # Telas do Aluno e do Painel Admin
│   │   ├── servicos/             # Cliente HTTP e chamadas à API
│   │   ├── hooks/                # Hooks customizados (autenticação, dados)
│   │   └── index.css             # Estilos globais, fontes e animações glassmorphic
│   ├── vite.config.js            # Configuração do Vite e proxy da API (/api -> 3000)
│   ├── tailwind.config.js        # Configuração do Tailwind CSS
│   ├── postcss.config.js         # Configuração do PostCSS
│   ├── index.html                # Ponto de montagem HTML com Google Fonts
│   └── package.json              # Dependências do React e scripts Vite
├── doc/
│   └── plano-execucao-study-friend.md   # ← Este documento
└── README.md                     # Documentação oficial do projeto
```

---

### Fase 2: Desenvolvimento do Back-end

#### 2.1 Modelagem do Banco de Dados (SQLite)
Implementar o script `iniciar_banco.py` com o DDL relacional e as seguintes entidades principais (nomes em PT-BR):

* **usuarios:** ID, nome, email, senha_criptografada, perfil (`ESTUDANTE` ou `ADMIN`).
* **disciplinas:** ID, nome (Ex: Matemática, Português, História) e area_conhecimento.
* **topicos:** ID, disciplina_id, titulo e ano_escolar (1º ao 3º ano e ENEM).
* **resumos:** ID, topico_id, titulo, conteudo (Markdown) e url_pdf (mapa mental).
* **flashcards:** ID, topico_id, frente (pergunta) e verso (resposta).
* **questoes:** ID, topico_id, enunciado, opcoes (JSON), resposta_correta, gabarito_comentado e nivel_dificuldade.
* **progresso_aluno:** ID, usuario_id, questao_id, status_acerto e data_resolucao.

Usar `Prepared Statements` e modo WAL (`PRAGMA journal_mode=WAL`), além de índices nas chaves estrangeiras e campos de busca.

#### 2.2 Autenticação e Segurança
* Rotas `/api/auth/registrar` e `/api/auth/login`.
* Dependência FastAPI de validação do Token JWT (`dependencias_autenticacao.py`).
* Dependência de proteção de rotas administrativas (`dependencia_admin`).
* Sanitização estrita de inputs com `html.escape` contra ataques XSS (seguindo o padrão de `validadores.py`).

#### 2.3 Endpoints RESTful
| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/disciplinas` | Retorna a lista de matérias e tópicos |
| `GET` | `/api/topicos/{id}/resumos` | Busca resumos e links dos mapas mentais |
| `GET` | `/api/topicos/{id}/flashcards` | Carrega baralhos de revisão |
| `GET` | `/api/questoes` | Filtra exercícios por matéria, ano e dificuldade |
| `POST` | `/api/questoes/responder` | Processa respostas e contabiliza progresso |
| `GET` | `/api/aluno/estatisticas` | Retorna relatórios de desempenho |
| `POST` | `/api/admin/*` | Rotas CRUD protegidas para gerenciamento do CMS |

---

### Fase 3: Desenvolvimento do Front-end

#### 3.1 Interface e Componentização
* Configuração do Tailwind CSS com abordagem *Mobile-First* e estética **Dark Glassmorphism** (tons slate, ciano e azul, `backdrop-blur` e efeitos *glow*).
* Tipografia importada do Google Fonts (*Plus Jakarta Sans* para interface e *Fira Code* para código).
* Criação de biblioteca de componentes reutilizáveis: `Botao`, `Card`, `Modal`, `Navbar`, `Sidebar` e `CampoTexto`.

#### 3.2 Telas do Aluno
* **Hub de Disciplinas:** Grade de seleção das 9 matérias do Ensino Médio.
* **Página de Tópicos:** Filtros por ano escolar (1º, 2º e 3º ano) e ENEM.
* **Visualizador de Resumos:** Leitor de Markdown limpo com botão para download de mapas mentais.
* **Módulo de Flashcards:** Componente interativo com animação de virada de card (*flip 3D*).
* **Banco de Exercícios:** Interface de múltipla escolha com retorno imediato e gabarito comentado.
* **Dashboard:** Visualização simples do desempenho acumulado.

#### 3.3 Painel Administrativo (CMS)
* Formulário para a equipe de conteúdo cadastrar e publicar resumos, questões e flashcards.

---

### Fase 4: Integração e Testes

1. **Cliente HTTP:** Configurar instância Axios (ou wrapper `fetch`) com interceptor para inclusão automática do token JWT nos cabeçalhos (`Authorization: Bearer <token>`).
2. **Tratamento de Erros:** Exibição de alertas (*Toasts*) e estados de carregamento (*Skeletons*).
3. **Otimização:** Garantir tempo de resposta do cliente inferior a 2 segundos em conexões móveis.

---

## 3. Regras de Código para o Open Code

* **Desacoplamento Total:** O Front-end consome exclusivamente a API REST; não há acesso direto ao banco de dados pelo cliente.
* **Idioma Português:** Variáveis, funções, tabelas, colunas, chaves JSON, rotas e comentários obrigatoriamente em PT-BR.
* **Sanitização Estrita:** Validar e escapar todos os inputs no servidor contra scripts maliciosos (XSS), conforme o padrão de `validadores.py`.
* **Documentação de Código:** Comentários descritivos da lógica em toda função e bloco relevante, e atualização do arquivo `README.md`.
* **Padrão de Commits:** Utilizar o padrão *Conventional Commits* (`feat:`, `fix:`, `docs:`, `refactor:`).
