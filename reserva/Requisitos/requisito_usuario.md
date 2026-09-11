# 📄 Especificação de Requisitos de Usuário (RU) — Study Friend

**Projeto:** Plataforma Estudantil Integrada *Study Friend*  
**Padrão de Documentação:** ISO/IEC/IEEE 29148:2018 & UML 2.5.1 (ISO/IEC 19505)  
**Versão:** 1.0.0  
**Data:** 01 de Setembro de 2026  
**Status:** Aprovado / Baseline Técnica  
**Autor:** Engenharia de Software & Arquitetura UML  

---

## 1. Introdução e Contexto do Sistema

### 1.1 Propósito do Documento
Este documento especifica os **Requisitos de Usuário (RU)** e o **Modelo de Casos de Uso** para a plataforma **Study Friend**, em inteira conformidade com a especificação **UML 2.5.1 (ISO/IEC 19505)**. O objetivo é estabelecer o contrato comportamental e funcional entre as partes interessadas (estudantes do Ensino Médio/pré-vestibulandos e administradores de conteúdo) e a equipe de desenvolvimento.

### 1.2 Visão Geral do Sistema
O **Study Friend** é uma plataforma educacional web full-stack projetada para otimizar a preparação pedagógica de alunos do Ensino Médio e candidatos ao ENEM/Vestibulares. O sistema consolida 9 disciplinas estruturadas por áreas do conhecimento e anos escolares, oferecendo:
- Resumos didáticos em formato Markdown com suporte a mapas mentais;
- Módulo de revisão ativa utilizando *flashcards* com animação tridimensional (Flip 3D);
- Banco de exercícios interativo de múltipla escolha com gabarito comentado;
- Painel analítico (*Dashboard*) de acompanhamento estatístico de desempenho;
- Painel Administrativo (*CMS*) seguro para gestão descentralizada do acervo pedagógico.

---

## 2. Taxonomia de Atores (UML 2.5.1 Actor Specification)

Na sintaxe UML 2.5.1, um **Ator** (*Actor*) define um papel desempenhado por uma entidade externa (humano ou sistema secundário) que interage diretamente com o sistema sob estudo (*Subject*).

```
                 +-------------------+
                 |   <<abstract>>    |
                 |      Usuário      |
                 +-------------------+
                           ^
                           |
             +-------------+-------------+
             |                           |
   +-------------------+       +-------------------+
   |     Estudante     |       |   Administrador   |
   |   <<humanActor>>  |       |   <<humanActor>>  |
   +-------------------+       +-------------------+
```

### 2.1 Atores Humanos (`<<humanActor>>`)

1. **`Usuário` (Classe Abstrata de Ator):**
   * **Descrição:** Representa qualquer entidade humana autenticada no sistema. Possui os atributos básicos de identidade (E-mail, Nome, Hash de Senha, Perfil de Acesso).
   * **Especializações:** `Estudante`, `Administrador`.

2. **`Estudante` (Especialização de `Usuário`):**
   * **Descrição:** Usuário final primário da plataforma (estudante do Ensino Médio ou pré-vestibulando).
   * **Objetivos:** Navegar pelas disciplinas, visualizar resumos e mapas mentais, praticar retenção com *flashcards*, resolver questões de múltipla escolha e monitorar sua taxa de rendimento no *dashboard*.

3. **`Administrador` (Especialização de `Usuário`):**
   * **Descrição:** Usuário gestor responsável pela curadoria pedagógica e manutenção do catálogo de dados do sistema (CMS).
   * **Objetivos:** Cadastrar, editar, atualizar e remover disciplinas, tópicos, resumos, baralhos de *flashcards* e questões de múltipla escolha.

### 2.2 Atores de Sistema / Secundários (`<<systemActor>>`)

1. **`Serviço de Autenticação JWT` (`<<systemActor>>`):**
   * **Descrição:** Subsistema responsável por emitir, validar e decodificar tokens JSON Web Token (JWT), garantindo o controle de acesso baseado em papéis (*RBAC*).

2. **`Motor de Persistência SQLite` (`<<systemActor>>`):**
   * **Descrição:** Banco de dados relacional (operando em modo WAL) responsável pelo armazenamento atômico das entidades e histórico de progresso do aluno.

---

## 3. Requisitos de Usuário (RU)

Os requisitos a seguir estão categorizados por módulos funcionais e seguem a codificação padronizada `RU-[MODULO]-[NUMERO]`.

### 3.1 Módulo de Autenticação e Gestão de Perfil (RU-AUTH)

| ID | Título | Descrição | Prioridade | Ator Principal |
| :--- | :--- | :--- | :--- | :--- |
| **RU-AUTH-01** | Cadastro de Estudante | O sistema deve permitir que um visitante cadastre uma conta de estudante fornecendo nome, e-mail e senha válida. | **Alta** | Estudante |
| **RU-AUTH-02** | Autenticação por E-mail e Senha | O sistema deve autenticar usuários cadastrados e retornar um token de acesso seguro (JWT) para manutenção da sessão. | **Alta** | Usuário |
| **RU-AUTH-03** | Controle de Acesso Baseado em Papéis (RBAC) | O sistema deve restringir o acesso ao Painel Admin (CMS) exclusivamente a usuários com perfil `ADMIN`. | **Alta** | Administrador |
| **RU-AUTH-04** | Encerramento de Sessão (*Logout*) | O sistema deve permitir que o usuário invalide localmente credenciais ativas e encerre a sessão com segurança. | **Média** | Usuário |

### 3.2 Módulo de Conteúdo e Navegação Pedagógica (RU-CONT)

| ID | Título | Descrição | Prioridade | Ator Principal |
| :--- | :--- | :--- | :--- | :--- |
| **RU-CONT-01** | Catálogo de Disciplinas | O sistema deve disponibilizar um Hub com as 9 disciplinas do Ensino Médio, exibindo a contagem de tópicos vinculados. | **Alta** | Estudante |
| **RU-CONT-02** | Filtragem de Tópicos por Ano Escolar | O sistema deve permitir a filtragem dos tópicos de uma disciplina por ano escolar (1º Ano, 2º Ano, 3º Ano ou ENEM). | **Alta** | Estudante |
| **RU-CONT-03** | Visualização de Resumos Didáticos | O sistema deve renderizar resumos conceituais formatados em Markdown rich text. | **Alta** | Estudante |
| **RU-CONT-04** | Acesso a Mapas Mentais | O sistema deve fornecer links externos diretos para mapas mentais complementares em formato PDF. | **Média** | Estudante |

### 3.3 Módulo de Revisão Ativa por Flashcards (RU-CARD)

| ID | Título | Descrição | Prioridade | Ator Principal |
| :--- | :--- | :--- | :--- | :--- |
| **RU-CARD-01** | Estudo de Baralhos de Flashcards | O sistema deve apresentar cartões interativos de revisão por tópico com pergunta (frente) e resposta (verso). | **Alta** | Estudante |
| **RU-CARD-02** | Animação Flip 3D | O sistema deve permitir ao estudante virar o cartão por meio de interação visual tridimensional (*Flip 3D*). | **Média** | Estudante |
| **RU-CARD-03** | Navegação Sequencial de Cartões | O sistema deve permitir avançar e retroceder entre os flashcards de um determinado baralho. | **Média** | Estudante |

### 3.4 Módulo de Banco de Exercícios e Prática (RU-EXER)

| ID | Título | Descrição | Prioridade | Ator Principal |
| :--- | :--- | :--- | :--- | :--- |
| **RU-EXER-01** | Filtragem Dinâmica de Exercícios | O sistema deve permitir filtrar questões por disciplina, ano escolar e grau de dificuldade (Fácil, Médio, Difícil). | **Alta** | Estudante |
| **RU-EXER-02** | Submissão e Validação de Resposta | O sistema deve permitir selecionar uma alternativa, registrar a resposta e indicar imediatamente o acerto ou erro. | **Alta** | Estudante |
| **RU-EXER-03** | Exibição de Gabarito Comentado | O sistema deve exibir a explicação detalhada do gabarito após a confirmação da resposta do aluno. | **Alta** | Estudante |

### 3.5 Módulo de Acompanhamento de Desempenho (RU-DASH)

| ID | Título | Descrição | Prioridade | Ator Principal |
| :--- | :--- | :--- | :--- | :--- |
| **RU-DASH-01** | Dashboard de Estatísticas do Aluno | O sistema deve apresentar um painel gráfico com o histórico do estudante, exibindo total de questões resolvidas e taxa de acerto (%). | **Alta** | Estudante |
| **RU-DASH-02** | Desempenho Categorizado por Disciplina | O sistema deve detalhar visualmente a porcentagem de aproveitamento individualizada para cada uma das 9 disciplinas. | **Média** | Estudante |

### 3.6 Módulo de Gestão Administrativa CMS (RU-ADMIN)

| ID | Título | Descrição | Prioridade | Ator Principal |
| :--- | :--- | :--- | :--- | :--- |
| **RU-ADMIN-01** | Gestão de Disciplinas | O sistema deve permitir cadastrar, atualizar e excluir disciplinas da plataforma. | **Alta** | Administrador |
| **RU-ADMIN-02** | Gestão de Tópicos | O sistema deve permitir criar, editar e excluir tópicos associados a uma disciplina e ano escolar. | **Alta** | Administrador |
| **RU-ADMIN-03** | Gestão de Resumos | O sistema deve disponibilizar formulário para cadastro e edição de resumos em Markdown e anexação de links de mapas mentais. | **Alta** | Administrador |
| **RU-ADMIN-04** | Gestão de Flashcards | O sistema deve permitir incluir, editar e remover pares de pergunta/resposta no baralho de flashcards. | **Alta** | Administrador |
| **RU-ADMIN-05** | Gestão do Banco de Questões | O sistema deve permitir o cadastro de questões com enunciado, opções de múltipla escolha, alternativa correta e gabarito comentado. | **Alta** | Administrador |

---

## 4. Especificação de Casos de Uso (UML 2.5.1 Use Case Diagram & Specifications)

### 4.1 Diagrama de Casos de Uso Geral do Sistema (PlantUML)

```plantuml
@startuml
left to right direction
skinparam packageStyle rectangle
skinparam shadowing false
skinparam monochrome false

actor "Estudante" as est << humanActor >>
actor "Administrador" as adm << humanActor >>
actor "Serviço JWT" as jwt << systemActor >>

rectangle "Plataforma Study Friend (Subject)" {

  package "Autenticação" {
    usecase "UC-01: Autenticar Usuário" as UC01
    usecase "UC-02: Cadastrar Estudante" as UC02
    usecase "UC-03: Validar Token JWT" as UC03
  }

  package "Área Pedagógica" {
    usecase "UC-04: Consultar Disciplinas e Tópicos" as UC04
    usecase "UC-05: Visualizar Resumo Didático" as UC05
    usecase "UC-06: Praticar com Flashcards" as UC06
    usecase "UC-07: Resolver Questão de Exercício" as UC07
    usecase "UC-08: Registrar Resposta e Progresso" as UC08
    usecase "UC-09: Consultar Dashboard de Desempenho" as UC09
  }

  package "Painel Administrativo (CMS)" {
    usecase "UC-10: Gerenciar Disciplinas" as UC10
    usecase "UC-11: Gerenciar Tópicos" as UC11
    usecase "UC-12: Gerenciar Resumos" as UC12
    usecase "UC-13: Gerenciar Flashcards" as UC13
    usecase "UC-14: Gerenciar Banco de Questões" as UC14
  }
}

' Relacionamentos do Estudante
est --> UC01
est --> UC02
est --> UC04
est --> UC05
est --> UC06
est --> UC07
est --> UC09

' Relacionamentos do Administrador
adm --> UC01
adm --> UC10
adm --> UC11
adm --> UC12
adm --> UC13
adm --> UC14

' Relacionamentos UML <<include>> e <<extend>>
UC01 .> UC03 : <<include>>
UC07 .> UC08 : <<include>>
UC05 <.. UC04 : <<extend>> 
 {condition = "Selecão de Tópico"}
UC06 <.. UC04 : <<extend>> 
 {condition = "Modo Flashcard"}

' Atores Secundários
UC03 -- jwt

@enduml
```

---

### 4.2 Descrição Detalhada dos Casos de Uso Principais

#### 📄 UC-01: Autenticar Usuário
* **Identificador:** `UC-01`
* **Nome:** Autenticar Usuário no Sistema
* **Atores:** `Usuário` (Iniciador / Primário), `Serviço de Autenticação JWT` (Secundário).
* **Descrição:** Permite que Estudantes ou Administradores realizem login na plataforma para obter credenciais de acesso JWT.
* **Pré-condições:** O usuário deve possuir uma conta ativa cadastrada no banco de dados.
* **Pós-condições:** Um token JWT válido é armazenado no cliente HTTP (Axios LocalStorage/Context) e o usuário é redirecionado à área logada.
* **Fluxo Principal de Eventos:**
  1. O usuário acessa a página de Login (`/login`).
  2. O usuário insere e-mail e senha e submete o formulário.
  3. O sistema valida a presença e sintaxe dos campos.
  4. O backend consulta o e-mail na tabela `usuarios`.
  5. O backend verifica o hash bcrypt da senha informada.
  6. O `Serviço de Autenticação JWT` gera o token codificado contendo `sub` (ID do usuário) e `perfil` (`ESTUDANTE` ou `ADMIN`).
  7. O sistema retorna o token com status HTTP 200 OK.
  8. O frontend armazena a sessão no `AutenticacaoContexto` e redireciona o usuário.
* **Fluxo Alternativo (FA-01 - Redirecionamento Admin):**
  * Na etapa 8, se o perfil do usuário for `ADMIN`, o sistema redireciona diretamente para a rota `/admin`.
* **Fluxos de Exceção:**
  * **FE-01 Credenciais Inválidas:** Na etapa 5, se a senha for incorreta ou o e-mail não existir, o sistema retorna erro HTTP 401 Unauthorized ("E-mail ou senha inválidos") e solicita nova tentativa.

---

#### 📄 UC-07: Resolver Questão de Exercício
* **Identificador:** `UC-07`
* **Nome:** Resolver Questão do Banco de Exercícios
* **Atores:** `Estudante` (Primário), `Motor de Persistência SQLite` (Secundário).
* **Descrição:** Permite que o estudante selecione, responda a uma questão de múltipla escolha e visualize o gabarito comentado.
* **Relacionamentos UML:**
  * **`<<include>>`** `UC-08: Registrar Resposta e Progresso` (Sempre que uma questão é respondida, o progresso é persistido).
* **Pré-condições:** O estudante deve estar autenticado e com token JWT válido.
* **Pós-condições:** A resposta é contabilizada, a estatística do aluno é atualizada e o gabarito comentado é exibido na interface.
* **Fluxo Principal de Eventos:**
  1. O estudante navega até o Banco de Exercícios (`/exercicios`).
  2. O estudante seleciona filtros desejados (Disciplina, Ano Escolar ou Dificuldade).
  3. O sistema carrega a lista de questões via `GET /api/questoes`.
  4. O estudante escolhe uma alternativa de múltipla escolha para a questão atual.
  5. O estudante clica em "Confirmar Resposta".
  6. O sistema executa o `UC-08` enviando `POST /api/questoes/responder` com `questao_id` e `resposta_opcao`.
  7. O backend valida a resposta contra a alternativa correta gravada no banco.
  8. O backend registra a tentativa na tabela `progresso_aluno` (indicando acerto = `true/false`).
  9. O sistema exibe o resultado visual (Verde para acerto, Vermelho para erro) e apresenta a explicação do Gabarito Comentado.

---

#### 📄 UC-09: Consultar Dashboard de Desempenho
* **Identificador:** `UC-09`
* **Nome:** Consultar Dashboard de Desempenho
* **Atores:** `Estudante` (Primário).
* **Descrição:** Exibe relatórios visuais e estatísticos da evolução do aluno por matéria.
* **Pré-condições:** O estudante deve estar autenticado.
* **Pós-condições:** Dados analíticos compilados são renderizados na tela.
* **Fluxo Principal de Eventos:**
  1. O estudante clica no menu "Dashboard" (`/dashboard`).
  2. O frontend efetua uma requisição `GET /api/aluno/estatisticas` enviando o token JWT no cabeçalho `Authorization`.
  3. O backend calcula:
     * Total de questões respondidas pelo aluno.
     * Taxa geral de acerto em percentual (%).
     * Distribuição de acertos e erros agrupados pelas 9 disciplinas.
  4. O sistema renderiza no frontend os gráficos de barra interativos e métricas estatísticas em estilo *Dark Glassmorphism*.

---

#### 📄 UC-14: Gerenciar Banco de Questões (CMS)
* **Identificador:** `UC-14`
* **Nome:** Gerenciar Banco de Questões no Painel CMS
* **Atores:** `Administrador` (Primário).
* **Descrição:** Permite criar, atualizar e remover questões cadastradas no acervo do sistema.
* **Pré-condições:** Administrador autenticado com token JWT e alegação de perfil `perfil == ADMIN`.
* **Pós-condições:** Alterações no banco de dados SQLite são salvas com sucesso.
* **Fluxo Principal de Eventos:**
  1. O Administrador acessa a aba "Questões" no Painel CMS (`/admin`).
  2. O sistema exibe a tabela com as questões cadastradas.
  3. O Administrador seleciona "Nova Questão".
  4. O Administrador preenche enunciado, vincula ao tópico/disciplina, define grau de dificuldade, insere as opções de A a E, escolhe a correta e escreve o gabarito comentado.
  5. O Administrador envia o formulário via `POST /api/admin/questoes`.
  6. O backend sanitiza os textos (prevenção contra XSS) e insere o registro na tabela `questoes`.
  7. O sistema exibe notificação de sucesso (*Toast*) e atualiza a listagem.

---

## 5. Requisitos Não-Funcionais (RNF)

| ID | Categoria | Descrição | Critério de Aceitação |
| :--- | :--- | :--- | :--- |
| **RNF-01** | **Desempenho** | O tempo de resposta das requisições REST da API deve ser inferior a 200ms para rotas de leitura. | Medido via inspeção de rotas do servidor ASGI Uvicorn / FastAPI. |
| **RNF-02** | **Segurança** | As senhas armazenadas no banco SQLite devem utilizar algoritmo seguro de hash (bcrypt) com salting. | Nenhuma senha em texto claro armazenada na tabela `usuarios`. |
| **RNF-03** | **Segurança** | Todos os inputs de texto digitados por usuários ou admins devem ser sanitizados no backend contra ataques XSS (*Cross-Site Scripting*). | Execução de `html.escape` ou validador Pydantic em payloads REST. |
| **RNF-04** | **Usabilidade / UX** | A interface deve implementar diretrizes de estilo *Dark Glassmorphism*, com paleta de tons slate/indigo/ciano, tipografia *Plus Jakarta Sans* e *Fira Code*. | Verificação de CSS/Tailwind e acessibilidade visual de contraste. |
| **RNF-05** | **Compatibilidade** | O frontend React 18 deve ser completamente responsivo (*Mobile-First*), suportando navegadores modernos (Chrome, Firefox, Edge, Safari). | Layout adaptável sem quebras em telas com largura a partir de 320px. |
| **RNF-06** | **Concorrência DB** | O banco SQLite deve operar no modo WAL (*Write-Ahead Logging*) com tempo de bloqueio reduzido (*timeout*) para evitar concorrência em acessos simultâneos. | Configuração ativada no script `conexao_banco.py`. |

---

## 6. Matriz de Rastreabilidade (RU x UC x REST API)

A tabela abaixo mapeia a rastreabilidade bidirecional entre Requisitos de Usuário, Casos de Uso e Endpoints RESTful implementados no backend FastAPI.

| Requisito de Usuário | Caso de Uso UML | Módulo / Rota API RESTful | Método HTTP | Papel Exigido |
| :--- | :--- | :--- | :--- | :--- |
| **RU-AUTH-01** | `UC-02` | `/api/auth/registrar` | `POST` | Público |
| **RU-AUTH-02** | `UC-01`, `UC-03` | `/api/auth/login` | `POST` | Público |
| **RU-CONT-01** | `UC-04` | `/api/disciplinas` | `GET` | Público |
| **RU-CONT-02** | `UC-04` | `/api/disciplinas/{id}/topicos` | `GET` | Público |
| **RU-CONT-03** | `UC-05` | `/api/topicos/{id}/resumos` | `GET` | Público |
| **RU-CARD-01** | `UC-06` | `/api/topicos/{id}/flashcards` | `GET` | Público |
| **RU-EXER-01** | `UC-07` | `/api/questoes` | `GET` | Autenticado (`ESTUDANTE`/`ADMIN`) |
| **RU-EXER-02** | `UC-07`, `UC-08` | `/api/questoes/responder` | `POST` | Autenticado (`ESTUDANTE`/`ADMIN`) |
| **RU-DASH-01** | `UC-09` | `/api/aluno/estatisticas` | `GET` | Autenticado (`ESTUDANTE`/`ADMIN`) |
| **RU-ADMIN-01** | `UC-10` | `/api/admin/disciplinas` | `GET`, `POST`, `PUT`, `DELETE` | `ADMIN` |
| **RU-ADMIN-02** | `UC-11` | `/api/admin/topicos` | `GET`, `POST`, `PUT`, `DELETE` | `ADMIN` |
| **RU-ADMIN-03** | `UC-12` | `/api/admin/resumos` | `GET`, `POST`, `PUT`, `DELETE` | `ADMIN` |
| **RU-ADMIN-04** | `UC-13` | `/api/admin/flashcards` | `GET`, `POST`, `PUT`, `DELETE` | `ADMIN` |
| **RU-ADMIN-05** | `UC-14` | `/api/admin/questoes` | `GET`, `POST`, `PUT`, `DELETE` | `ADMIN` |

---

## 7. Conclusão e Aprovação

Este documento estabelece a especificação formal de requisitos de usuário e modelos comportamentais da plataforma **Study Friend**. As especificações aqui descritas servem como guia arquitetural para os componentes frontend (React/Vite) e backend (FastAPI/SQLite), garantindo rastreabilidade técnica e integridade dos processos de software de acordo com as normas **UML 2.5.1** e **ISO/IEC/IEEE 29148**.
