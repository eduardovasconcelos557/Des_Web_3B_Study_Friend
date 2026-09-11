# Documento de Requisitos de Sistema — Study Friend

**Projeto:** Study Friend — Plataforma Estudantil Integrada  
**Autores:** Eduardo de Jesus Vasconcelos e Ana Isabela Moreira Rezende Câmara  
**Arquitetura:** Front-end e Back-end desacoplados via API RESTful  

---

## 1. Requisitos Funcionais (RF)

Os requisitos funcionais descrevem o comportamento e os serviços que o sistema deve oferecer aos usuários:

### RF01: Gestão de Contas e Autenticação
* O sistema deve permitir o cadastro de estudantes informando nome, e-mail e senha.
* O sistema deve realizar autenticação segura via e-mail e senha com geração de token JWT.
* O sistema deve oferecer dois níveis de acesso: Estudante e Administrador.

### RF02: Organização Pedagógica de Conteúdos
* O sistema deve categorizar conteúdos em 9 disciplinas do Ensino Médio (Matemática, Física, Química, História, Geografia, Filosofia, Sociologia, Biologia e Língua Portuguesa/Literatura).
* O sistema deve estruturar a navegação por ano letivo (1º, 2º e 3º ano) e tópicos do ENEM.

### RF03: Consumo de Resumos e Mapas Mentais
* O sistema deve exibir resumos textuais formatados com tópicos (*bullet points*).
* O sistema deve disponibilizar mapas mentais gráficos para visualização e *download* em formato PDF.

### RF04: Módulo de Flashcards (Memorização Ativa)
* O sistema deve exibir cartões virtuais com a pergunta/conceito no anverso e a resposta no verso.
* O sistema deve permitir o giro interativo do cartão (animação *flip 3D*) e classificação da dificuldade pelo estudante.

### RF05: Resolução de Exercícios e Gabarito
* O sistema deve listar questões de vestibulares e ENEM com filtros por matéria, ano e dificuldade.
* O sistema deve validar a resposta marcada pelo usuário de forma imediata.
* O sistema deve exibir o gabarito detalhado e comentado após a submissão.

### RF06: Painel do Aluno (Dashboard)
* O sistema deve registrar o progresso de leitura e histórico de questões respondidas pelo estudante.
* O sistema deve exibir métricas sintéticas e estatísticas de taxa de acerto por matéria.
* O sistema deve permitir que o estudante salve conteúdos e questões em uma lista de favoritos.

### RF07: Sistema de Busca
* O sistema deve disponibilizar uma barra de pesquisa global por palavras-chave, nomes de tópicos e *tags*.

### RF08: Painel Administrativo (CMS)
* O sistema deve permitir que administradores criem, editem, listem e excluam disciplinas, tópicos, resumos, flashcards e exercícios.

---

## 2. Requisitos Não-Funcionais (RNF)

Os requisitos não-funcionais definem as qualidades, restrições e padrões técnicos da plataforma:

### RNF01: Desempenho e Latência
* O tempo de resposta inicial para o carregamento de telas deve ser inferior a 2 segundos em conexões 4G.

### RNF02: Usabilidade e Responsividade
* A interface do Front-end deve ser desenvolvida com a abordagem *Mobile-First*, garantindo layout adaptável para dispositivos móveis, tablets e desktops.

### RNF03: Segurança e Privacidade
* As senhas de usuários devem ser armazenadas de forma criptografada no banco de dados utilizando algoritmo hash (`bcryptjs`).
* Todas as rotas privadas do Back-end devem validar a presença de um token JWT válido.
* A plataforma deve respeitar os princípios gerais de proteção de dados pessoais (LGPD).

### RNF04: Desacoplamento e Arquitetura
* O Front-end não deve realizar conexões diretas ao banco de dados; a comunicação deve ser feita exclusivamente via requisições HTTP RESTful em JSON para o Back-end.
* Todo o código deve ser implementado em TypeScript com tipagem estrita.

### RNF05: Disponibilidade
* A infraestrutura do serviço em nuvem deve manter uma meta de disponibilidade (*uptime*) de no mínimo 99,5%.

---

## 3. Matriz de Rastreabilidade (Requisitos x Componentes)

| Requisito | Camada Responsável | Módulo do Sistema |
| :--- | :--- | :--- |
| **RF01, RNF03** | Back-end / Banco de Dados | Serviço de Autenticação (`/api/auth`) |
| **RF02, RF03** | Front-end & Back-end | Módulo de Disciplinas e Conteúdos (`/api/topicos`) |
| **RF04** | Front-end | Componente Interativo `Flashcard` |
| **RF05, RF06** | Front-end & Back-end | Módulo de Exercícios (`/api/questoes`) e Dashboard (`/api/aluno`) |
| **RF08** | Back-end (Middleware) & Front-end | Painel Administrativo (`/api/admin`) |