import os
import sqlite3

# Script DDL de criação das tabelas do Study Friend no SQLite (modo WAL)
DDL_ESTRUTURA = '''
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

CREATE TABLE IF NOT EXISTS usuarios (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    nome            TEXT    NOT NULL,
    email           TEXT    NOT NULL UNIQUE,
    senha_hash      TEXT    NOT NULL,
    perfil          TEXT    NOT NULL DEFAULT 'ESTUDANTE'
                                CHECK(perfil IN ('ESTUDANTE','ADMIN')),
    data_cadastro   TEXT    DEFAULT (datetime('now','localtime'))
);

CREATE TABLE IF NOT EXISTS disciplinas (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    nome                TEXT    NOT NULL UNIQUE,
    area_conhecimento   TEXT    NOT NULL,
    icone               TEXT    DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS topicos (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    disciplina_id   INTEGER NOT NULL,
    titulo          TEXT    NOT NULL,
    ano_escolar     TEXT    NOT NULL
                            CHECK(ano_escolar IN ('1','2','3','ENEM')),
    FOREIGN KEY (disciplina_id) REFERENCES disciplinas(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS resumos (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    topico_id   INTEGER NOT NULL,
    titulo      TEXT    NOT NULL,
    conteudo    TEXT    NOT NULL,
    url_pdf     TEXT    DEFAULT NULL,
    FOREIGN KEY (topico_id) REFERENCES topicos(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS flashcards (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    topico_id   INTEGER NOT NULL,
    frente      TEXT    NOT NULL,
    verso       TEXT    NOT NULL,
    FOREIGN KEY (topico_id) REFERENCES topicos(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS questoes (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    topico_id           INTEGER NOT NULL,
    enunciado           TEXT    NOT NULL,
    opcoes              TEXT    NOT NULL,
    resposta_correta    TEXT    NOT NULL,
    gabarito_comentado  TEXT    DEFAULT NULL,
    nivel_dificuldade   TEXT    NOT NULL DEFAULT 'MEDIO'
                                    CHECK(nivel_dificuldade IN ('FACIL','MEDIO','DIFICIL')),
    FOREIGN KEY (topico_id) REFERENCES topicos(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS progresso_aluno (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id      INTEGER NOT NULL,
    questao_id      INTEGER NOT NULL,
    status_acerto   TEXT    NOT NULL
                            CHECK(status_acerto IN ('ACERTOU','ERROU')),
    data_resolucao  TEXT    DEFAULT (datetime('now','localtime')),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (questao_id) REFERENCES questoes(id) ON DELETE CASCADE,
    UNIQUE(usuario_id, questao_id)
);

CREATE INDEX IF NOT EXISTS idx_leads_email      ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_status     ON leads(status_atendimento);
CREATE INDEX IF NOT EXISTS idx_usuarios_email   ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_topicos_disciplina ON topicos(disciplina_id);
CREATE INDEX IF NOT EXISTS idx_resumos_topico   ON resumos(topico_id);
CREATE INDEX IF NOT EXISTS idx_flashcards_topico ON flashcards(topico_id);
CREATE INDEX IF NOT EXISTS idx_questoes_topico  ON questoes(topico_id);
CREATE INDEX IF NOT EXISTS idx_progresso_usuario ON progresso_aluno(usuario_id);
'''

# Conteúdo pedagógico inicial (MVP): 9 disciplinas do Ensino Médio,
# cada uma com um ícone (chave usada pelo frontend) e suas áreas separadas
# (Exatas, Humanas, Biológicas e Linguagens).
DISCIPLINAS = [
    ('Matemática', 'Exatas', 'matematica'),
    ('Física', 'Exatas', 'fisica'),
    ('Química', 'Exatas', 'quimica'),
    ('História', 'Humanas', 'historia'),
    ('Geografia', 'Humanas', 'geografia'),
    ('Filosofia', 'Humanas', 'filosofia'),
    ('Sociologia', 'Humanas', 'sociologia'),
    ('Biologia', 'Biológicas', 'biologia'),
    ('Língua Portuguesa e Literatura', 'Linguagens', 'linguagens'),
    ('Inglês', 'Linguagens', 'ingles'),
    ('Espanhol', 'Linguagens', 'espanhol'),
    ('Artes', 'Linguagens', 'artes'),
    ('Educação Física', 'Linguagens', 'educacao_fisica'),
]

TOPICOS = [
    (1, 'Funções e Gráficos', '1'),
    (1, 'Trigonometria', '2'),
    (1, 'Geometria Espacial', '2'),
    (1, 'Probabilidade e Estatística', '3'),
    (2, 'Cinemática', '1'),
    (2, 'Leis de Newton', '1'),
    (2, 'Termodinâmica', '2'),
    (2, 'Eletromagnetismo', '3'),
    (3, 'Modelos Atômicos', '1'),
    (3, 'Funções Inorgânicas', '1'),
    (3, 'Estequiometria', '2'),
    (3, 'Química Orgânica', '3'),
    (4, 'Brasil Colônia', '1'),
    (4, 'Era Vargas', '3'),
    (4, 'Guerra Fria', '3'),
    (5, 'Cartografia', '1'),
    (5, 'Geopolítica Mundial', '3'),
    (6, 'Filosofia Antiga', '1'),
    (6, 'Filosofia Moderna', '3'),
    (7, 'Cidadania e Sociedade', '1'),
    (7, 'Movimentos Sociais', '3'),
    (8, 'Citologia', '1'),
    (8, 'Genética', '3'),
    (8, 'Ecologia', '2'),
    (9, 'Figuras de Linguagem', '1'),
    (9, 'Modernismo', '3'),
    # Linguagens — novas disciplinas
    (10, 'Simple Present', '1'),
    (10, 'Interpretação de Texto', 'ENEM'),
    (11, 'Presente de Indicativo', '1'),
    (11, 'Cultura Hispânica', 'ENEM'),
    (12, 'Arte Moderna e Contemporânea', '3'),
    (12, 'Elementos da Linguagem Visual', '1'),
    (13, 'Esportes Coletivos', '1'),
    (13, 'Atividade Física e Saúde', '2'),
]

RESUMOS = [
    # Matemática
    (1, 'Função Afim', '- Define-se função afim como f(x) = ax + b.\n- O coeficiente **a** é o coeficiente angular (taxa de variação).\n- O coeficiente **b** é o coeficiente linear (ponto onde a reta corta o eixo y).\n- A raiz da função ocorre quando f(x) = 0, ou seja, x = -b/a.\n- Função crescente quando a > 0; decrescente quando a < 0.', None),
    (2, 'Razões Trigonométricas', '- No triângulo retângulo, seno = cateto oposto / hipotenusa.\n- Cosseno = cateto adjacente / hipotenusa.\n- Tangente = cateto oposto / cateto adjacente.\n- O ciclo trigonométrico divide-se em 4 quadrantes.\n- Ângulos notáveis: 30°, 45° e 60°.', None),
    (3, 'Geometria Espacial - Sólidos', '- Prisma: poliedro com duas bases paralelas e congruentes.\n- Pirâmide: poliedro com uma base e faces laterais triangulares.\n- Cilindro: superfície curva formada por uma reta que se move paralelamente a uma circunferência.\n- Cone: superfície curva formada por retas que passam por um ponto e uma circunferência.\n- Esfera: conjunto de pontos equidistantes de um centro.', None),
    (4, 'Probabilidade e Estatística', '- Probabilidade: medida da chance de um evento ocorrer (0 a 1).\n- Estatística descritiva: organiza e resume dados (média, mediana, moda).\n- Média aritmética: soma de todos os valores dividida pela quantidade.\n- Mediana: valor central de um conjunto ordenado.\n- Moda: valor que mais se repete em um conjunto de dados.', None),
    # Física
    (5, 'Movimento Retilíneo Uniforme (MRU)', '- No MRU a velocidade é constante e a aceleração é nula.\n- Equação horária: S = S0 + v*t.\n- O gráfico S x t é uma reta crescente ou decrescente.\n- O gráfico v x t é uma reta paralela ao eixo do tempo.', None),
    (6, 'Leis de Newton', '- 1ª Lei (Inércia): corpo em repouso ou movimento retilíneo uniforme permanece assim se a resultante for nula.\n- 2ª Lei (Força): F = m*a, a aceleração é diretamente proporcional à força e inversamente proporcional à massa.\n- 3ª Lei (Ação e Reação): a toda ação corresponde uma reação de mesma intensidade e sentido oposto.\n- Força é uma grandeza vetorial medida em Newtons (N).', None),
    (7, 'Termodinâmica', '- Temperatura: medida da agitação térmica das moléculas.\n- Calor: transferência de energia entre corpos de temperaturas diferentes.\n- Lei Zero da Termodinâmica: corpos em equilíbrio térmico estão à mesma temperatura.\n- 1ª Lei: a energia não se cria nem se destrói, apenas se transforma (conservação da energia).\n- 2ª Lei: o calor flui espontaneamente do corpo mais quente para o mais frio.', None),
    (8, 'Eletromagnetismo', '- Elétrons: partículas com carga negativa que orbitam o núcleo.\n- Campo elétrico: região ao redor de uma carga onde se manifesta força elétrica.\n- Corrente elétrica: fluxo ordenado de elétrons por um condutor.\n- Lei de Ohm: V = R*I, tensão é produto da resistência pela corrente.\n- Magnetismo: propriedade de materiais que atraem ou repelem outros materiais magnéticos.', None),
    # Química
    (9, 'Modelos Atômicos', '- Modelo de Thomson: átomo como "pudim de passas" com elétrons dispersos.\n- Modelo de Rutherford: núcleo denso e positivo com elétrons ao redor.\n- Modelo de Bohr: elétrons em órbitas circulares com níveis de energia quantizados.\n- Modelo quântico: elétrons em nuvens de probabilidade (orbitais).\n- Número atômico (Z) = número de prótons; número de massa (A) = prótons + nêutrons.', None),
    (10, 'Funções Inorgânicas', '- Ácidos: liberam H⁺ em solução (ex.: HCl, H₂SO₄).\n- Bases: liberam OH⁻ em solução (ex.: NaOH, Ca(OH)₂).\n- Sais: formados por reação ácido-base (ex.: NaCl, CaCO₃).\n- Óxidos: compostos de oxigênio com outro elemento.\n- Hidrólise: reação de um composto com água.', None),
    (11, 'Estequiometria', '- Mol: unidade que representa 6,02 × 10²³ partículas (constante de Avogadro).\n- Massa molar: massa de um mol de substância, em g/mol.\n- Reação estequiométrica: proporção fixa entre reagentes e produtos.\n- Reagente limitante: reagente que se esgota primeiro e limita a quantidade de produto.\n- Rendimento: relação entre o produto obtido e o teórico (× 100%).', None),
    (12, 'Química Orgânica', '- Compostos orgânicos contêm carbono (exceto CO, CO₂ e carbonatos).\n- Hidrocarbonetos: compostos de carbono e hidrogênio (alcenos, alcinos, aromáticos).\n- Grupo funcional: arranjo de átomos que define as propriedades da molécula.\n- Isomeria: compostos com mesma fórmula molecular, mas estrutura diferente.\n- Reações orgânicas: substituição, adição, eliminação e oxidação.', None),
    # História
    (13, 'Brasil Colônia', '- O período colonial vai de 1500 até 1822.\n- Economia baseada no extrativismo (pau-brasil) e na cana-de-açúcar.\n- Uso intensivo da mão de obra escravizada.\n- As capitanias hereditárias foram a primeira divisão administrativa.\n- A escravidão e o mercantilismo marcam toda a estrutura social.', None),
    (14, 'Era Vargas', '- Getúlio Vargas governou de 1930 a 1945 e de 1951 a 1954.\n- Estado Novo (1937-1945): regime autoritário com censura e partido único.\n- Criação da CLT e direitos trabalhistas.\n- Industrialização acelerada com a Segunda Guerra Mundial.\n- Populismo e manipulação das massas trabalhadoras.', None),
    (15, 'Guerra Fria', '- Conflito ideológico EUA (capitalismo) × URSS (comunismo) após 1945.\n- Nunca houve confronto direto entre as duas potências.\n- Corrida armamentista e corrida espacial.\n- Guerra por procuração: conflitos indiretos (Coreia, Vietnam, Afeganistão).\n- Queda do Muro de Berlim em 1989 marcou o fim simbólico da Guerra Fria.', None),
    # Geografia
    (16, 'Cartografia', '- Cartografia: ciência de elaborar e interpretar mapas.\n- Escala: relação entre distância no mapa e distância real.\n- Projeção cartográfica: representação da superfície esférica em plano.\n- Elementos do mapa: título, legenda, escala, rosa dos ventos, coordenadas.\n- Coordenadas geográficas: latitude (N/S) e longitude (L/W).', None),
    (17, 'Geopolítica Mundial', '- Geopolítica: estudo da relação entre poder político e espaço geográfico.\n- Potências mundiais: EUA, China, Rússia, União Europeia.\n- Conflitos territoriais: Oriente Médio, fronteiras africanas.\n- Globalização: integração econômica, política e cultural mundial.\n- Blocos econômicos: ONU, Mercosul, UE, BRICS.', None),
    # Filosofia
    (18, 'Filosofia Antiga', '- Sócrates: método socrático (perguntas e respostas) para buscar a verdade.\n- Platão: mundo das ideias vs. mundo sensível; alegoria da caverna.\n- Aristóteles: lógica formal, ética das virtudes, classificação dos seres.\n- Estoicismo: virtude e autocontrole como caminho para a felicidade.\n- Epicurismo: busca do prazer moderado e ausência de dor.', None),
    (19, 'Filosofia Moderna', '- René Descartes: "Penso, logo existo" — racionalismo.\n- John Locke: empirismo — o conhecimento vem da experiência.\n- Immanuel Kant: síntese entre racionalismo e empirismo.\n- Friedrich Nietzsche: crítica à moral cristã e o "além do homem".\n- Karl Marx: materialismo histórico e luta de classes.', None),
    # Sociologia
    (20, 'Cidadania e Sociedade', '- Cidadania: conjunto de direitos e deveres do cidadão perante o Estado.\n- Direitos civis: liberdade, igualdade, propriedade.\n- Direitos políticos: voto, candidatura, participação política.\n- Direitos sociais: educação, saúde, moradia, trabalho.\n- Democracia: governo do povo, pelo povo e para o povo.', None),
    (21, 'Movimentos Sociais', '- Movimentos sociais: organizações coletivas que buscam mudanças na sociedade.\n- Movimento operário: luta por direitos trabalhistas no século XIX.\n- Movimento feminista: igualdade de gênero e direitos da mulher.\n- Movimento ambientalista: preservação do meio ambiente.\n- Movimento negro: combate ao racismo e busca de igualdade racial.', None),
    # Biologia
    (22, 'Organelas Celulares', '- Mitocôndrias: responsáveis pela respiração celular (produção de ATP).\n- Ribossomos: síntese de proteínas.\n- Retículo endoplasmático: transporte e síntese de lipídios e proteínas.\n- Complexo de Golgi: secreção e empacotamento de moléculas.\n- Lisossomos: digestão intracelular.', None),
    (23, 'Genética', '- DNA: molécula que armazena informações genéticas.\n- Gene: segmento de DNA que codifica uma proteína.\n- Alelos: formas alternativas de um gene.\n- Genófeno: conjunto total de genes de um organismo.\n- Leis de Mendel: segregação e segregação independente dos caracteres.', None),
    (24, 'Ecologia', '- Ecologia: estudo das relações entre seres vivos e o ambiente.\n- Ecossistema: conjunto de seres vivos e fatores abióticos de uma área.\n- Cadeia alimentar: sequência de organismos que se alimentam uns dos outros.\n- Biodiversidade: variedade de seres vivos em um ecossistema.\n- Desequilíbrio ecológico: perturbações que afetam a estabilidade do ecossistema.', None),
    # Língua Portuguesa
    (25, 'Principais Figuras de Linguagem', '- Metáfora: comparação implícita.\n- Metonímia: substituição por relação de proximidade.\n- Hipérbole: exagero proposital.\n- Ironia: afirmação com sentido oposto.\n- Personificação: atribuição de características humanas a seres inanimados.', None),
    (26, 'Modernismo', '- Semana de Arte Moderna de 1922 em São Paulo.\n- Quebra de padrões estéticos tradicionais.\n- Influência do futurismo, cubismo e dadaísmo europeus.\n- Temas: nacionalismo, humor, crítica social.\n- Principais autores: Mário de Andrade, Oswald de Andrade, Anita Malfatti.', None),
    # Inglês
    (27, 'Simple Present', '- Simple Present é o tempo verbal usado para ações habituais, fatos e verdades gerais.\n- Estrutura afirmativa: Sujeito + verbo no infinitivo (3ª pessoa singular acrescenta -s/-es).\n- Exemplos: "She studies every day" / "They play soccer."\n- Negativa: Sujeito + do/does + not + verbo base.\n- Interrogativa: Do/Does + sujeito + verbo base + ?', None),
    (28, 'Interpretação de Texto', '- Reading: leitura global (skimming) e leitura de detalhes (scanning).\n- Skimming: identificar ideia geral rapidamente.\n- Scanning: localizar informações específicas (datas, nomes, números).\n- Inferências: deduzir significado pelo contexto e por palavras cognatas.\n- Cognatos: palavras parecidas com o português (ex.: "history" = história).', None),
    # Espanhol
    (29, 'Presente de Indicativo', '- Presente de Indicativo: expressa ações habituais, atuais e fatos gerais.\n- Verbos regulares em -ar: hablo, hablas, habla, hablamos, habláis, hablan.\n- Verbos regulares em -er: como, comes, come, comemos, coméis, comen.\n- Verbos regulares em -ir: vivo, vives, vive, vivimos, vivís, viven.\n- Verbos irregulares importantes: ser, estar, tener, ir, hacer.', None),
    (30, 'Cultura Hispânica', '- Cultura hispânica: conjunto de tradições, língua e costumes dos países de língua espanhola.\n- Espanha: flamenco, touradas, tapas, festas tradicionais (San Fermín).\n- América Latina: música (salsa, tango, cumbia), literatura (García Márquez), culinária.\n- A Semana Santa e o Día de los Muertos são festividades marcantes.\n- O espanhol hoje é a 2ª língua mais falada do mundo por nativos.', None),
    # Artes
    (31, 'Arte Moderna e Contemporânea', '- Arte Moderna (séc. XIX ao XX): quebra com a tradição acadêmica.\n- Movimentos: Impressionismo, Expressionismo, Cubismo, Surrealismo e Abstração.\n- No Brasil: Semana de Arte Moderna de 1922.\n- Arte Contemporânea: arte conceitual, instalações, performance e arte digital.\n- Foco em processos, ideias e crítica social, não apenas na técnica.', None),
    (32, 'Elementos da Linguagem Visual', '- Ponto: menor elemento da composição; base de todo desenho.\n- Linha: traço que define contornos e direções.\n- Forma: contorno de objetos (orgânica ou geométrica).\n- Cor: tem três propriedades principais — matiz, saturação e brilho.\n- Textura: característica da superfície (real ou visual).', None),
    # Educação Física
    (33, 'Esportes Coletivos', '- Esportes coletivos: práticas com cooperação e oposição entre equipes.\n- Exemplos: futebol, basquete, vôlei e handebol.\n- Demandam trabalho em equipe, comunicação e respeito às regras.\n- Desenvolvem condicionamento físico, tática e estratégia.\n- Promovem inclusão, fair play e espírito esportivo.', None),
    (34, 'Atividade Física e Saúde', '- Atividade física regular traz benefícios ao corpo e à mente.\n- Saúde cardiovascular: reduz risco de doenças do coração.\n- Controle de peso, fortalecimento muscular e ósseo.\n- Bem-estar mental: reduz estresse, ansiedade e melhora o sono.\n- Recomendação: ao menos 150 minutos de atividade moderada por semana.', None),
]

FLASHCARDS = [
    # Matemática
    (1, 'O que é uma função afim?', 'É uma função do tipo f(x) = ax + b, com a e b reais e a diferente de zero.'),
    (1, 'Quando a função afim é crescente?', 'Quando o coeficiente angular a é maior que zero (a > 0).'),
    (1, 'Qual a fórmula da raiz da função afim?', 'x = -b/a, valor de x que torna f(x) = 0.'),
    (2, 'O que é o seno de um ângulo agudo?', 'É a razão entre o cateto oposto e a hipotenusa.'),
    (2, 'Quais os valores de sen 30°, 45° e 60°?', '1/2, √2/2 e √3/2, respectivamente.'),
    (3, 'O que é um prisma na geometria espacial?', 'Um poliedro com duas bases paralelas e congruentes conectadas por faces laterais.'),
    (4, 'O que é a média aritmética?', 'É a soma de todos os valores dividida pela quantidade de elementos.'),
    (4, 'O que é a moda de um conjunto de dados?', 'É o valor que mais se repete no conjunto.'),
    # Física
    (5, 'O que caracteriza o MRU?', 'Velocidade constante e aceleração nula, com S = S0 + v*t.'),
    (6, 'O que diz a 1ª Lei de Newton?', 'Um corpo em repouso ou movimento retilíneo uniforme permanece assim quando a resultante de forças é nula.'),
    (6, 'Como se calcula a força na 2ª Lei de Newton?', 'F = m × a, onde F é a força, m a massa e a a aceleração.'),
    (7, 'O que afirma a 1ª Lei da Termodinâmica?', 'A energia não se cria nem se destrói, apenas se transforma.'),
    (8, 'O que é a Lei de Ohm?', 'V = R × I: a tensão elétrica é igual ao produto da resistência pela corrente.'),
    # Química
    (9, 'Quem propôs o modelo atômico com núcleo denso?', 'Ernesto Rutherford, em 1911.'),
    (10, 'O que caracteriza um ácido?', 'A liberação de íons H⁺ (prótons) em solução aquosa.'),
    (10, 'O que caracteriza uma base?', 'A liberação de íons OH⁻ (hidroxila) em solução aquosa.'),
    (11, 'O que é um mol?', 'É a quantidade de物质 que contém 6,02 × 10²³ partículas (constante de Avogadro).'),
    (12, 'O que define um composto orgânico?', 'A presença de carbono na sua molécula (exceto CO, CO₂ e carbonatos).'),
    # História
    (13, 'O que eram as capitanias hereditárias?', 'A primeira divisão administrativa do Brasil Colônia, doada a nobres portugueses.'),
    (14, 'O que foi o Estado Novo?', 'Regime autoritário de Getúlio Vargas (1937-1945) com censura e partido único.'),
    (15, 'O que foi a Guerra Fria?', 'Conflito ideológico entre EUA (capitalismo) e URSS (comunismo) sem confronto direto.'),
    (15, 'Quando caiu o Muro de Berlim?', 'Em 9 de novembro de 1989, marcando o fim simbólico da Guerra Fria.'),
    # Geografia
    (16, 'O que é escala cartográfica?', 'A relação entre a distância no mapa e a distância real no terreno.'),
    (17, 'O que é geopolítica?', 'Estudo da relação entre poder político e espaço geográfico.'),
    # Filosofia
    (18, 'O que é o método socrático?', 'Um método de investigação baseado em perguntas e respostas para chegar à verdade.'),
    (18, 'O que é a alegoria da caverna?', 'Uma metáfora de Platão sobre a dificuldade de acessar o conhecimento verdadeiro.'),
    (19, 'O que significa "Penso, logo existo"?', 'Frase de Descartes que afirma a existência do sujeito pensante como base do conhecimento.'),
    # Sociologia
    (20, 'O que é cidadania?', 'Conjunto de direitos e deveres do indivíduo perante a sociedade e o Estado.'),
    (20, 'Quais são os direitos sociais?', 'Educação, saúde, moradia, trabalho e previdência social.'),
    (21, 'O que é um movimento social?', 'Organização coletiva que busca mudanças políticas, sociais ou culturais na sociedade.'),
    # Biologia
    (22, 'Qual organela produz ATP?', 'A mitocôndria, por meio da respiração celular.'),
    (23, 'O que é um gene?', 'Um segmento de DNA que codifica a informação para uma proteína.'),
    (23, 'O que são alelos?', 'Formas alternativas de um mesmo gene que determinam variações de um caráter.'),
    (24, 'O que estuda a ecologia?', 'As relações entre seres vivos e o ambiente em que vivem.'),
    (24, 'O que é uma cadeia alimentar?', 'Sequência de organismos onde cada um se alimenta do anterior.'),
    # Língua Portuguesa
    (25, 'O que é metáfora?', 'Uma figura de linguagem baseada em comparação implícita.'),
    (26, 'O que foi a Semana de Arte Moderna?', 'Evento de 1922 em São Paulo que marcou o início do Modernismo no Brasil.'),
    (26, 'Quais são os principais autores modernistas?', 'Mário de Andrade, Oswald de Andrade e Anita Malfatti.'),
    # Inglês
    (27, 'Como se forma a 3ª pessoa do singular no Simple Present?', 'Acrescenta-se -s, -es ou -ies ao verbo (ex.: go → goes, study → studies).'),
    (27, 'Para que serve o Simple Present?', 'Descrever ações habituais, rotinas e verdades gerais.'),
    (28, 'O que é skimming na leitura em inglês?', 'É a leitura rápida para captar a ideia geral de um texto.'),
    (28, 'O que são palavras cognatas?', 'Palavras parecidas com o português e de significado semelhante (ex.: "history" = história).'),
    # Espanhol
    (29, 'Conjugue o verbo "hablar" no presente do indicativo.', 'Hablo, hablas, habla, hablamos, habláis, hablan.'),
    (29, 'Quais verbos são irregulares no presente do indicativo?', 'Ser, estar, ir, tener e hacer, entre outros.'),
    (30, 'O que é o "Día de los Muertos"?', 'Festividade mexicana que homenageia entes queridos que já faleceram.'),
    (30, 'Cite um gênero musical hispânico.', 'Salsa, tango ou cumbia, por exemplo.'),
    # Artes
    (31, 'O que marcou a arte moderna no Brasil?', 'A Semana de Arte Moderna de 1922, em São Paulo.'),
    (31, 'O que caracteriza a arte contemporânea?', 'Foco em conceitos e processos, com instalações, performances e crítica social.'),
    (32, 'Quais são os elementos básicos da linguagem visual?', 'Ponto, linha, forma, cor e textura.'),
    # Educação Física
    (33, 'Cite exemplos de esportes coletivos.', 'Futebol, basquete, vôlei e handebol.'),
    (33, 'Por que os esportes coletivos são importantes?', 'Desenvolvem cooperação, comunicação, tática e respeito às regras.'),
    (34, 'Qual a recomendação de atividade física semanal?', 'Pelo menos 150 minutos de atividade moderada por semana.'),
    (34, 'Cite um benefício da atividade física.', 'Reduz o risco de doenças cardiovasculares e melhora o bem-estar mental.'),
]

QUESTOES = [
    # Matemática
    (1, 'Seja f(x) = 2x + 4. Qual é a raiz da função?',
     '["x = 2", "x = -2", "x = 4", "x = 0", "x = -4"]',
     'B', 'Basta resolver 2x + 4 = 0, logo 2x = -4 e x = -2.', 'FACIL'),
    (1, 'Dada a função afim f(x) = -3x + 9, classifique-a:',
     '["Crescente", "Decrescente", "Constante", "Nula", "Impossível definir"]',
     'B', 'Como o coeficiente angular a = -3 é menor que zero, a função é decrescente.', 'FACIL'),
    (2, 'Em um triângulo retângulo, o cateto oposto mede 3 e a hipotenusa mede 5. Qual o seno do ângulo?',
     '["3/5", "4/5", "3/4", "5/3", "1/2"]',
     'A', 'Seno é a razão entre cateto oposto e hipotenusa: 3/5.', 'MEDIO'),
    (3, 'Qual é a fórmula do volume de um cilindro?',
     '["V = πr²h", "V = πr³", "V = 2πrh", "V = ½πr²h", "V = πd²h"]',
     'A', 'O volume do cilindro é área da base (πr²) vezes a altura (h).', 'FACIL'),
    (4, 'Em um conjunto de dados {2, 5, 5, 7, 8}, qual é a moda?',
     '["5", "2", "7", "5,4", "8"]',
     'A', 'A moda é o valor que mais se repete: 5 aparece duas vezes.', 'FACIL'),
    # Física
    (5, 'Um carro em MRU percorre 120 km em 2 horas. Qual sua velocidade?',
     '["30 km/h", "60 km/h", "120 km/h", "240 km/h", "90 km/h"]',
     'B', 'v = ΔS/Δt = 120/2 = 60 km/h.', 'FACIL'),
    (6, 'Um corpo de massa 10 kg é submetido a uma força de 50 N. Qual sua aceleração?',
     '["5 m/s²", "10 m/s²", "50 m/s²", "0,5 m/s²", "500 m/s²"]',
     'A', 'Pela 2ª Lei de Newton: a = F/m = 50/10 = 5 m/s².', 'FACIL'),
    (7, 'Na 1ª Lei da Termodinâmica, o que acontece com a energia total de um sistema isolado?',
     '["Aumenta", "Diminui", "Permanece constante", "Se anula", "Varia aleatoriamente"]',
     'C', 'A energia total de um sistema isolado é sempre conservada (constante).', 'MEDIO'),
    (8, 'Um resistor de 10 Ω é percorrido por uma corrente de 2 A. Qual a tensão nos seus terminais?',
     '["5 V", "20 V", "0,2 V", "12 V", "8 V"]',
     'B', 'V = R × I = 10 × 2 = 20 V (Lei de Ohm).', 'FACIL'),
    # Química
    (9, 'Qual modelo atômico propôs que os elétrons orbitam o núcleo em órbitas fixas?',
     '["Thomson", "Rutherford", "Bohr", "Dalton", "Quântico"]',
     'C', 'O modelo de Bohr (1913) propõe órbitas circulares com níveis de energia quantizados.', 'FACIL'),
    (10, 'Qual substância é um ácido?',
     '["NaOH", "HCl", "NaCl", "CaCO₃", "H₂O"]',
     'B', 'HCl (ácido clorídrico) libera H⁺ em solução, caracterizando-se como ácido.', 'FACIL'),
    (11, 'Quantos moléculas existem em 2 mol de água (H₂O)?',
     '["6,02 × 10²³", "12,04 × 10²³", "3,01 × 10²³", "18 g", "2 mol"]',
     'B', '2 mol × 6,02 × 10²³ = 12,04 × 10²³ moléculas.', 'MEDIO'),
    (12, 'Qual é o grupo funcional presente no etanol (C₂H₅OH)?',
     '["Carbonila", "Hidroxila", "Carboxila", "Amina", "Éter"]',
     'B', 'O etanol possui o grupo hidroxila (-OH), caracterizando-se como álcool.', 'MEDIO'),
    # História
    (13, 'Qual foi o primeiro ciclo econômico do Brasil Colônia?',
     '["Cana-de-açúcar", "Café", "Ouro", "Pau-brasil", "Borracha"]',
     'D', 'O extrativismo do pau-brasil foi o primeiro ciclo econômico (1500).', 'FACIL'),
    (14, 'Qual regime político foi instaurado por Getúlio Vargas em 1937?',
     '["República Liberal", "Estado Novo", "Império", "Democracia", "Comunismo"]',
     'B', 'O Estado Novo (1937-1945) foi um regime autoritário liderado por Vargas.', 'FACIL'),
    (15, 'Quais são os dois blocos opostos da Guerra Fria?',
     '["EUA e Inglaterra", "URSS e China", "EUA e URSS", "França e Alemanha", "Japão e EUA"]',
     'C', 'A Guerra Fria opôs os EUA (capitalismo) à URSS (comunismo).', 'FACIL'),
    # Geografia
    (16, 'O que a latitude indica em um mapa?',
     '["Distância do Meridiano de Greenwich", "Distância do Equador", "Altitude", "Temperatura", "População"]',
     'B', 'A latitude indica a distância angular ao norte ou ao sul do Equador.', 'FACIL'),
    (17, 'Qual bloco econômico reúne Brasil, Rússia, Índia, China e África do Sul?',
     '["Mercosul", "OTAN", "BRICS", "G7", "União Europeia"]',
     'C', 'Os BRICS são Brasil, Rússia, Índia, China e África do Sul.', 'MEDIO'),
    # Filosofia
    (18, 'Quem formulou a frase "Penso, logo existo"?',
     '["Sócrates", "Platão", "Aristóteles", "Descartes", "Nietzsche"]',
     'D', 'René Descartes formulou "Cogito, ergo sum" (Penso, logo existo).', 'FACIL'),
    (19, 'Qual filósofo é considerado o pai do empirismo?',
     '["Kant", "Descartes", "Locke", "Hegel", "Marx"]',
     'C', 'John Locke é considerado o pai do empirismo, defendendo que o conhecimento vem da experiência.', 'MEDIO'),
    # Sociologia
    (20, 'Qual é um exemplo de direito social?',
     '["Voto", "Liberdade de expressão", "Educação", "Propriedade", "Igualdade perante a lei"]',
     'C', 'Educação é um direito social, garantido a todos os cidadãos.', 'FACIL'),
    (21, 'Qual movimento social lutou pelo fim da escravidão no Brasil?',
     '["Movimento feminista", "Abolicionismo", "Movimento operário", "Movimento negro contemporâneo", "Movimento ambientalista"]',
     'B', 'O movimento abolicionista lutou pelo fim da escravatura no século XIX.', 'FACIL'),
    # Biologia
    (22, 'Qual organela é responsável pela digestão intracelular?',
     '["Mitocôndria", "Ribossomo", "Lisossomo", "Núcleo", "Complexo de Golgi"]',
     'C', 'Os lisossomos realizam a digestão intracelular de partículas e organelas velhas.', 'MEDIO'),
    (23, 'Qual lei de Mendel descreve a segregação independente dos caracteres?',
     '["1ª Lei", "2ª Lei", "3ª Lei", "4ª Lei", "5ª Lei"]',
     'B', 'A 2ª Lei de Mendel (segregação independente) afirma que caracteres diferentes se distribuem independentemente.', 'MEDIO'),
    (24, 'O que é biodiversidade?',
     '["Poluição do ar", "Variedade de seres vivos em um ecossistema", "Desmatamento", "Aquecimento global", "Cadeia alimentar"]',
     'B', 'Biodiversidade é a variedade de espécies de seres vivos em um determinado ambiente.', 'FACIL'),
    # Língua Portuguesa
    (25, 'Em "Seus olhos eram dois poços escuros", temos um exemplo de:',
     '["Metonímia", "Metáfora", "Hipérbole", "Ironia", "Aliteração"]',
     'B', 'Trata-se de uma comparação implícita entre os olhos e poços: metáfora.', 'FACIL'),
    (26, 'Em que ano ocorreu a Semana de Arte Moderna?',
     '["1910", "1915", "1922", "1930", "1945"]',
     'C', 'A Semana de Arte Moderna ocorreu em fevereiro de 1922, em São Paulo.', 'FACIL'),
    # Inglês
    (27, 'Complete com o Simple Present: She ___ (to study) English every day.',
     '["studies", "study", "studied", "studying", "has studied"]',
     'A', 'Na 3ª pessoa do singular, acrescenta-se -es/-s: "she studies".', 'FACIL'),
    (27, 'Qual frase está correta no Simple Present?',
     '["They plays soccer", "They play soccer", "They playing soccer", "They played soccer", "They have play soccer"]',
     'B', 'Com "they", o verbo fica no infinitivo sem o -s: "they play".', 'FACIL'),
    (28, 'Em qual técnica de leitura o estudante busca informações específicas?',
     '["Skimming", "Scanning", "Translating", "Rethinking", "Outlining"]',
     'B', 'O scanning é a leitura de varredura para localizar dados específicos no texto.', 'MEDIO'),
    # Espanhol
    (29, 'Conjugue o verbo "comer" para a 3ª pessoa do singular no presente do indicativo.',
     '["Como", "Comes", "Come", "Comemos", "Comen"]',
     'C', 'Na 3ª pessoa do singular, "comer" vira "come".', 'FACIL'),
    (29, 'Qual destes verbos é irregular no presente do indicativo em espanhol?',
     '["Hablar", "Comer", "Vivir", "Ser", "Cantar"]',
     'D', 'O verbo "ser" é um dos irregulares mais usados no presente.', 'MEDIO'),
    (30, 'Qual festividade hispânica homenageia os entes queridos falecidos?',
     '["Carnaval", "Día de los Muertos", "San Fermín", "La Tomatina", "Semana Santa"]',
     'B', 'O Día de los Muertos, celebrado em 1 e 2 de novembro, homenageia os mortos.', 'FACIL'),
    # Artes
    (31, 'Qual evento marcou o início do modernismo no Brasil?',
     '["Semana de Arte Moderna de 1922", "Movimento tropicalista", "Bienal de São Paulo", "Semana de 30", "Semana de 1900"]',
     'A', 'A Semana de Arte Moderna de 1922, em São Paulo, rompeu com o academicismo.', 'FACIL'),
    (32, 'Qual é o menor elemento da linguagem visual?',
     '["A linha", "A forma", "O ponto", "A cor", "A textura"]',
     'C', 'O ponto é o elemento mais simples e a base de toda composição visual.', 'FACIL'),
    # Educação Física
    (33, 'Qual destes é um esporte coletivo?',
     '["Natação", "Atletismo", "Handebol", "Ginástica", "Xadrez"]',
     'C', 'O handebol é uma modalidade coletiva disputada entre duas equipes.', 'FACIL'),
    (34, 'Qual é a recomendação mínima de atividade física moderada por semana para adultos?',
     '["30 minutos por mês", "150 minutos", "500 minutos", "15 minutos", "30 minutos por ano"]',
     'B', 'A OMS recomenda pelo menos 150 minutos de atividade moderada por semana.', 'MEDIO'),
]


def obter_caminho_banco():
    """Retorna o caminho absoluto do arquivo de banco SQLite."""
    caminho_base = os.path.dirname(os.path.abspath(__file__))
    pasta_db = os.path.join(caminho_base, 'db')
    os.makedirs(pasta_db, exist_ok=True)
    return os.path.join(pasta_db, 'landing.db')


def _gerar_hash_senha(senha: str) -> str:
    """Gera o hash bcrypt da senha para o usuário admin padrão."""
    import bcrypt
    return bcrypt.hashpw(senha.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def _migrar_disciplinas_icone(cursor):
    """Adiciona a coluna 'icone' na tabela disciplinas (bancos antigos)."""
    colunas = [linha['name'] for linha in cursor.execute('PRAGMA table_info(disciplinas)').fetchall()]
    if 'icone' not in colunas:
        cursor.execute('ALTER TABLE disciplinas ADD COLUMN icone TEXT DEFAULT NULL')


def semear_dados(cursor):
    """Insere o conteúdo pedagógico (incremental e idempotente) e o admin padrão.

    Ao contrário da versão original (que só semeava bancos vazios), esta versão
    faz *upsert* de disciplinas e insere apenas os tópicos/resumos/flashcards/
    questões que ainda não existem — permitindo enriquecer bancos já criados
    (ex.: adicionar novas matérias de Linguagens) sem duplicar conteúdos.
    """
    # 1) Disciplinas: atualiza área de conhecimento e ícone (nome é UQ).
    for nome, area, icone in DISCIPLINAS:
        cursor.execute('SELECT id FROM disciplinas WHERE nome = ?', (nome,))
        linha = cursor.fetchone()
        if linha is None:
            cursor.execute(
                'INSERT INTO disciplinas (nome, area_conhecimento, icone) VALUES (?, ?, ?)',
                (nome, area, icone)
            )
        else:
            cursor.execute(
                'UPDATE disciplinas SET area_conhecimento = ?, icone = ? WHERE id = ?',
                (area, icone, linha['id'])
            )

    # Mapeia o ordinal das disciplinas (ordem da lista) para o id real no banco.
    ids_disciplinas = {}
    for ordem, (nome, _area, _icone) in enumerate(DISCIPLINAS, start=1):
        cursor.execute('SELECT id FROM disciplinas WHERE nome = ?', (nome,))
        ids_disciplinas[ordem] = cursor.fetchone()['id']

    # 2) Tópicos: insere apenas os que faltam, mantendo o ordinal (posição) como chave.
    ids_topicos = {}
    for posicao, (disciplina_ordem, titulo, ano) in enumerate(TOPICOS, start=1):
        cursor.execute(
            'SELECT id FROM topicos WHERE disciplina_id = ? AND titulo = ? AND ano_escolar = ?',
            (ids_disciplinas[disciplina_ordem], titulo, ano)
        )
        linha = cursor.fetchone()
        if linha is None:
            cursor.execute(
                'INSERT INTO topicos (disciplina_id, titulo, ano_escolar) VALUES (?, ?, ?)',
                (ids_disciplinas[disciplina_ordem], titulo, ano)
            )
            ids_topicos[posicao] = cursor.lastrowid
        else:
            ids_topicos[posicao] = linha['id']

    # 3) Resumos: insere apenas conteúdos ainda não registrados no tópico.
    for topico_posicao, titulo, conteudo, url_pdf in RESUMOS:
        cursor.execute(
            'SELECT id FROM resumos WHERE topico_id = ? AND titulo = ?',
            (ids_topicos[topico_posicao], titulo)
        )
        if cursor.fetchone() is None:
            cursor.execute(
                'INSERT INTO resumos (topico_id, titulo, conteudo, url_pdf) VALUES (?, ?, ?, ?)',
                (ids_topicos[topico_posicao], titulo, conteudo, url_pdf)
            )

    # 4) Flashcards: insere apenas cartas ainda não registradas no tópico.
    for topico_posicao, frente, verso in FLASHCARDS:
        cursor.execute(
            'SELECT id FROM flashcards WHERE topico_id = ? AND frente = ?',
            (ids_topicos[topico_posicao], frente)
        )
        if cursor.fetchone() is None:
            cursor.execute(
                'INSERT INTO flashcards (topico_id, frente, verso) VALUES (?, ?, ?)',
                (ids_topicos[topico_posicao], frente, verso)
            )

    # 5) Questões: insere apenas enunciados ainda não registrados no tópico.
    for topico_posicao, enunciado, opcoes, resposta, comentario, nivel in QUESTOES:
        cursor.execute(
            'SELECT id FROM questoes WHERE topico_id = ? AND enunciado = ?',
            (ids_topicos[topico_posicao], enunciado)
        )
        if cursor.fetchone() is None:
            cursor.execute(
                '''INSERT INTO questoes
                   (topico_id, enunciado, opcoes, resposta_correta, gabarito_comentado, nivel_dificuldade)
                   VALUES (?, ?, ?, ?, ?, ?)''',
                (ids_topicos[topico_posicao], enunciado, opcoes, resposta, comentario, nivel)
            )

    # Usuário administrador padrão para gerenciamento do CMS
    hash_admin = _gerar_hash_senha('admin123')
    cursor.execute(
        "INSERT OR IGNORE INTO usuarios (nome, email, senha_hash, perfil) VALUES (?, ?, ?, 'ADMIN')",
        ('Administrador', 'admin@studyfriend.com', hash_admin),
    )


def inicializar_banco():
    """Cria as tabelas do Study Friend e insere o conteúdo inicial."""
    caminho_banco = obter_caminho_banco()
    conexao = sqlite3.connect(caminho_banco)
    conexao.row_factory = sqlite3.Row
    conexao.execute('PRAGMA journal_mode = WAL')
    conexao.execute('PRAGMA foreign_keys = ON')
    cursor = conexao.cursor()

    cursor.executescript(DDL_ESTRUTURA)
    _migrar_disciplinas_icone(cursor)
    semear_dados(cursor)
    conexao.commit()
    conexao.close()
    print("Banco SQLite do Study Friend criado/verificado com sucesso.")


if __name__ == "__main__":
    inicializar_banco()
