# Documento de Escopo do Projeto — Study Friend

**Nome do Projeto:** Study Friend — Plataforma Estudantil Integrada  
**Versão:** 1.0  
**Data:** Agosto de 2026  
**Status:** Em Aprovação  

---

## 1. Visão Geral e Objetivos do Projeto

O **Study Friend** é uma plataforma web educacional focada em proporcionar aos estudantes do Ensino Médio e pré-vestibulandos um acesso rápido, intuitivo e centralizado aos principais conteúdos curriculares. 

### 1.1 Objetivos Principais
* **Simplificar o Estudo:** Oferecer resumos objetivos e materiais gráficos de rápido consumo.
* **Centralização:** Reunir todas as matérias do Ensino Médio em um único ecossistema digital.
* **Prática Ativa:** Disponibilizar ferramentas de revisão ativa (*flashcards* e banco de questões) para fixação do aprendizado.
* **Acessibilidade:** Garantir uma experiência leve e otimizada para navegação via dispositivos móveis.

---

## 2. Escopo do Projeto (In-Scope / MVP)

O escopo do Produto Mínimo Viável (MVP) contempla a criação da plataforma web responsiva com as seguintes funcionalidades:

### 2.1 Navegação por Disciplina e Ano Letivo
* Estruturação dos conteúdos em 9 disciplinas fundamentais:
  * **Exatas:** Matemática, Física, Química.
  * **Humanas:** História, Geografia, Filosofia, Sociologia.
  * **Biológicas & Linguagens:** Biologia, Língua Portuguesa / Literatura.
* Organização hierárquica por ano escolar (1º, 2º e 3º ano do Ensino Médio) e por tópicos/temas do ENEM.

### 2.2 Formatos de Conteúdo de Rápido Consumo
* **Resumos Diretos:** Textos sintetizados em estrutura de *bullet points* destacando conceitos-chave, fórmulas e datas.
* **Mapas Mentais:** Diagramas visuais interativos e disponíveis para download em PDF.
* **Flashcards Interativos:** Baralhos virtuais por assunto para aplicação do método de repetição espaçada.

### 2.3 Módulo de Exercícios e Prática
* Banco de questões atualizado com provas do ENEM e principais vestibulares do país.
* Sistema de filtros avançados por disciplina, assunto, ano e nível de dificuldade.
* Gabarito comentado para cada questão resolvida.

### 2.4 Área do Aluno (Dashboard)
* Perfil do usuário com estatísticas de desempenho e progresso nos estudos.
* Sistema de bookmarking/favoritos para salvar conteúdos e questões.
* Histórico de simulados e questões respondidas.

### 2.5 Ferramenta de Busca Otimizada
* Barra de pesquisa global com autocompletar e filtros por *tags* e palavras-chave.

### 2.6 Painel Administrativo (CMS)
* Gerenciador de conteúdo interno para a equipe pedagógica publicar, editar e categorizar resumos, mapas mentais e questões.

---

## 3. Fora do Escopo (Out-of-Scope)

Para garantir a viabilidade e entrega pontual da primeira versão, as seguintes funcionalidades **não** fazem parte desta etapa do projeto:

* ✖ **Aulas Ao Vivo / Tutoria:** Não haverá transmissão de vídeo ao vivo nem mentoria individualizada.
* ✖ **Correção de Redação por IA:** Recursos de análise automatizada de texto estão desconsiderados no MVP.
* ✖ **Rede Social / Fórum Aberto:** Sem recursos de chat entre alunos, comentários públicos ou fóruns de discussão.
* ✖ **Aplicativo Nativo (iOS/Android):** O desenvolvimento será focado exclusivamente em Web Responsiva (PWA).

---

## 4. Requisitos Não-Funcionais

* **Desempenho:** Tempo médio de carregamento inicial das páginas inferior a 2 segundos em conexões 4G.
* **Usabilidade:** Design com abordagem *Mobile-First*, focado em legibilidade, contraste acessível e navegação sem distrações.
* **Compatibilidade:** Suporte completo aos navegadores modernos (Chrome, Safari, Firefox, Edge).
* **Disponibilidade e Segurança:** Arquitetura em nuvem com meta de *uptime* de 99,5% e armazenamento seguro de dados de usuários conforme diretrizes da LGPD.

---

## 5. Públicos-Alvo (Personas)

1. **Estudantes do Ensino Médio (14 a 18 anos):** Buscam reforço escolar para provas periódicas de forma rápida.
2. **Vestibulandos e Alunos do ENEM:** Necessitam de rotinas de revisão rápida, mapas mentais e resolução contínua de questões.

---

## 6. Principais Marcos do Projeto (Milestones)

| Fase | Descrição | Entregável Principal |
| :--- | :--- | :--- |
| **Fase 1** | Planejamento & Design (UI/UX) | Wireframes e protótipo navegável |
| **Fase 2** | Desenvolvimento Front-end & Back-end | Estrutura web e CMS funcional |
| **Fase 3** | Ingestão de Conteúdo Pedagógico | Carga inicial de resumos e questões |
| **Fase 4** | Testes, QA e Lançamento Beta | Plataforma homologada para usuários |