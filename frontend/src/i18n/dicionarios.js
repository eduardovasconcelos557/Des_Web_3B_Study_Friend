// Dicionários de idioma do frontend (pt-BR, en-US, es-MX).
// O português (pt-BR) é a fonte da verdade; conteúdo do banco permanece em PT-BR.

export const IDIOMAS = [
  { codigo: 'pt-BR', bandeira: '🇧🇷', rotulo: 'Português (Brasil)' },
  { codigo: 'en-US', bandeira: '🇨🇦', rotulo: 'English (United States)' },
  { codigo: 'es-MX', bandeira: '🇲🇽', rotulo: 'Español (México)' },
]

const ptBR = {
  // Navbar
  'navbar.disciplinas': 'Disciplinas',
  'navbar.exercicios': 'Exercícios',
  'navbar.dashboard': 'Dashboard',
  'navbar.admin': 'Admin',
  'navbar.entrar': 'Entrar',
  'navbar.cadastrar': 'Cadastrar',
  'navbar.sair': 'Sair',
  'navbar.menu': 'Menu',
  'idioma.selecionar': 'Idioma',

  // Comum
  'comum.carregando': 'Carregando...',
  'comum.todos': 'Todos',
  'comum.topico': 'tópico',
  'comum.topicos': 'tópicos',
  'comum.disciplina': 'disciplina',
  'comum.disciplinas': 'disciplinas',

  // Início
  'inicio.tagline': 'Ensino Médio · ENEM · Vestibulares',
  'inicio.titulo': 'Estude com resumos, flashcards e exercícios de todas as matérias.',
  'inicio.subtitulo': 'Conteúdo organizado por disciplina e ano escolar, com acompanhamento de desempenho.',
  'inicio.explorarDisciplinas': 'Explorar disciplinas',
  'inicio.bancoQuestoes': 'Banco de questões',
  'inicio.materiaSingular': 'matéria do Ensino Médio',
  'inicio.materiaPlural': 'matérias do Ensino Médio',
  'inicio.organizadasPorArea': ', organizadas por área de conhecimento.',

  // Tópicos
  'topicos.titulo': 'Tópicos',
  'topicos.ano1': '1º Ano',
  'topicos.ano2': '2º Ano',
  'topicos.ano3': '3º Ano',
  'topicos.enem': 'ENEM',
  'topicos.nenhum': 'Nenhum tópico encontrado para este filtro.',
  'topicos.resumos': 'Resumos',
  'topicos.flashcards': 'Flashcards',
  'topicos.questoes': 'Questões',

  // Resumos
  'resumos.erro': 'Erro ao carregar resumos.',
  'resumos.nenhum': 'Nenhum resumo disponível para este tópico.',
  'resumos.mapaMental': 'Mapa mental (PDF)',

  // Flashcards
  'flashcards.nenhum': 'Nenhum flashcard disponível para este tópico.',
  'flashcards.contador': '{atual} de {total}',
  'flashcards.pergunta': 'Pergunta',
  'flashcards.resposta': 'Resposta',
  'flashcards.cliqueVer': 'Clique para ver a resposta',
  'flashcards.cliqueVoltar': 'Clique para voltar',
  'flashcards.anterior': 'Anterior',
  'flashcards.proximo': 'Próximo',

  // Exercícios
  'exercicios.tituloBanco': 'Banco de Exercícios',
  'exercicios.tituloTopico': 'Exercícios — {nome}',
  'exercicios.topicoFallback': 'Tópico',
  'exercicios.subAutenticado': 'Resolva as questões e acompanhe seu progresso.',
  'exercicios.subDesautenticado': 'Faça login para salvar seu progresso.',
  'exercicios.facil': 'Fácil',
  'exercicios.medio': 'Médio',
  'exercicios.dificil': 'Difícil',
  'exercicios.nenhuma': 'Nenhuma questão encontrada.',
  'exercicios.correto': 'Correto.',
  'exercicios.incorreto': 'Incorreto.',
  'exercicios.respostaCorreta': ' Resposta correta: {letra}.',

  // Dashboard
  'dashboard.acessoTitulo': 'Acesse seu dashboard',
  'dashboard.acessoTexto': 'Faça login para acompanhar seu desempenho.',
  'dashboard.titulo': 'Meu desempenho',
  'dashboard.ola': 'Olá, {nome}.',
  'dashboard.erro': 'Erro ao carregar estatísticas.',
  'dashboard.vazio': 'Você ainda não resolveu nenhuma questão.',
  'dashboard.comecar': 'Começar agora',
  'dashboard.cardQuestoes': 'Questões',
  'dashboard.cardAcertos': 'Acertos',
  'dashboard.cardErros': 'Erros',
  'dashboard.cardTaxa': 'Taxa de acerto',
  'dashboard.porDisciplina': 'Por disciplina',

  // Login
  'login.titulo': 'Entrar',
  'login.subtitulo': 'Acesse sua conta para salvar seu progresso.',
  'login.email': 'E-mail',
  'login.senha': 'Senha',
  'login.placeholderEmail': 'seu@email.com',
  'login.placeholderSenha': 'Mínimo 6 caracteres',
  'login.entrando': 'Entrando...',
  'login.entrar': 'Entrar',
  'login.semConta': 'Não tem conta?',
  'login.cadastreSe': 'Cadastre-se',
  'login.erro': 'Falha ao entrar.',

  // Cadastro
  'registrar.titulo': 'Criar conta',
  'registrar.subtitulo': 'Comece a estudar gratuitamente.',
  'registrar.nome': 'Nome completo',
  'registrar.placeholderNome': 'Seu nome',
  'registrar.criando': 'Criando conta...',
  'registrar.criar': 'Criar conta',
  'registrar.jaTemConta': 'Já tem conta?',
  'registrar.erro': 'Falha ao cadastrar.',

  // Admin CMS
  'admin.restritoTitulo': 'Acesso restrito',
  'admin.restritoTexto': 'Apenas administradores podem acessar o CMS.',
  'admin.titulo': 'Admin',
  'admin.subtitulo': 'Gerencie o conteúdo pedagógico.',
  'admin.aba.disciplinas': 'Disciplinas',
  'admin.aba.topicos': 'Tópicos',
  'admin.aba.resumos': 'Resumos',
  'admin.aba.flashcards': 'Flashcards',
  'admin.aba.questoes': 'Questões',
  'admin.confirmExcluir': 'Tem certeza que deseja excluir?',
  'admin.excluido': 'Item excluído com sucesso.',
  'admin.nenhum': 'Nenhum registro encontrado.',
  'admin.acoes': 'Ações',
  'admin.excluir': 'Excluir',

  // Colunas do CMS
  'admin.col.id': 'ID',
  'admin.col.nome': 'Nome',
  'admin.col.titulo': 'Título',
  'admin.col.area_conhecimento': 'Área',
  'admin.col.icone': 'Ícone',
  'admin.col.ano_escolar': 'Ano escolar',
  'admin.col.disciplina': 'Disciplina',
  'admin.col.disciplina_id': 'ID da disciplina',
  'admin.col.topico': 'Tópico',
  'admin.col.topico_id': 'ID do tópico',
  'admin.col.url_pdf': 'URL do PDF',
  'admin.col.conteudo': 'Conteúdo',
  'admin.col.frente': 'Frente',
  'admin.col.verso': 'Verso',
  'admin.col.nivel_dificuldade': 'Dificuldade',
  'admin.col.enunciado': 'Enunciado',
  'admin.col.opcoes': 'Opções',
  'admin.col.alternativa': 'Alternativa',
  'admin.col.alternativa_correta': 'Gabarito',
  'admin.col.gabarito_comentado': 'Comentário',

  // Autenticação (erros de fallback)
  'auth.falhaLogin': 'Falha no login.',
  'auth.falhaRegistrar': 'Falha ao cadastrar.',
}

const enUS = {
  // Navbar
  'navbar.disciplinas': 'Subjects',
  'navbar.exercicios': 'Exercises',
  'navbar.dashboard': 'Dashboard',
  'navbar.admin': 'Admin',
  'navbar.entrar': 'Log in',
  'navbar.cadastrar': 'Sign up',
  'navbar.sair': 'Log out',
  'navbar.menu': 'Menu',
  'idioma.selecionar': 'Language',

  // Comum
  'comum.carregando': 'Loading...',
  'comum.todos': 'All',
  'comum.topico': 'topic',
  'comum.topicos': 'topics',
  'comum.disciplina': 'subject',
  'comum.disciplinas': 'subjects',

  // Início
  'inicio.tagline': 'High School · ENEM · College Entrance Exams',
  'inicio.titulo': 'Study with summaries, flashcards and exercises for every subject.',
  'inicio.subtitulo': 'Content organized by subject and school year, with performance tracking.',
  'inicio.explorarDisciplinas': 'Explore subjects',
  'inicio.bancoQuestoes': 'Question bank',
  'inicio.materiaSingular': 'high school subject',
  'inicio.materiaPlural': 'high school subjects',
  'inicio.organizadasPorArea': ', organized by knowledge area.',

  // Tópicos
  'topicos.titulo': 'Topics',
  'topicos.ano1': '1st Year',
  'topicos.ano2': '2nd Year',
  'topicos.ano3': '3rd Year',
  'topicos.enem': 'ENEM',
  'topicos.nenhum': 'No topics found for this filter.',
  'topicos.resumos': 'Summaries',
  'topicos.flashcards': 'Flashcards',
  'topicos.questoes': 'Questions',

  // Resumos
  'resumos.erro': 'Error loading summaries.',
  'resumos.nenhum': 'No summary available for this topic.',
  'resumos.mapaMental': 'Mind map (PDF)',

  // Flashcards
  'flashcards.nenhum': 'No flashcards available for this topic.',
  'flashcards.contador': '{atual} of {total}',
  'flashcards.pergunta': 'Question',
  'flashcards.resposta': 'Answer',
  'flashcards.cliqueVer': 'Click to see the answer',
  'flashcards.cliqueVoltar': 'Click to go back',
  'flashcards.anterior': 'Previous',
  'flashcards.proximo': 'Next',

  // Exercícios
  'exercicios.tituloBanco': 'Exercise Bank',
  'exercicios.tituloTopico': 'Exercises — {nome}',
  'exercicios.topicoFallback': 'Topic',
  'exercicios.subAutenticado': 'Solve the questions and track your progress.',
  'exercicios.subDesautenticado': 'Log in to save your progress.',
  'exercicios.facil': 'Easy',
  'exercicios.medio': 'Medium',
  'exercicios.dificil': 'Hard',
  'exercicios.nenhuma': 'No questions found.',
  'exercicios.correto': 'Correct.',
  'exercicios.incorreto': 'Incorrect.',
  'exercicios.respostaCorreta': ' Correct answer: {letra}.',

  // Dashboard
  'dashboard.acessoTitulo': 'Access your dashboard',
  'dashboard.acessoTexto': 'Log in to track your performance.',
  'dashboard.titulo': 'My performance',
  'dashboard.ola': 'Hello, {nome}.',
  'dashboard.erro': 'Error loading statistics.',
  'dashboard.vazio': 'You have not solved any questions yet.',
  'dashboard.comecar': 'Start now',
  'dashboard.cardQuestoes': 'Questions',
  'dashboard.cardAcertos': 'Correct',
  'dashboard.cardErros': 'Wrong',
  'dashboard.cardTaxa': 'Accuracy rate',
  'dashboard.porDisciplina': 'By subject',

  // Login
  'login.titulo': 'Log in',
  'login.subtitulo': 'Access your account to save your progress.',
  'login.email': 'E-mail',
  'login.senha': 'Password',
  'login.placeholderEmail': 'you@email.com',
  'login.placeholderSenha': 'Minimum 6 characters',
  'login.entrando': 'Logging in...',
  'login.entrar': 'Log in',
  'login.semConta': "Don't have an account?",
  'login.cadastreSe': 'Sign up',
  'login.erro': 'Failed to log in.',

  // Cadastro
  'registrar.titulo': 'Create account',
  'registrar.subtitulo': 'Start studying for free.',
  'registrar.nome': 'Full name',
  'registrar.placeholderNome': 'Your name',
  'registrar.criando': 'Creating account...',
  'registrar.criar': 'Create account',
  'registrar.jaTemConta': 'Already have an account?',
  'registrar.erro': 'Failed to sign up.',

  // Admin CMS
  'admin.restritoTitulo': 'Restricted access',
  'admin.restritoTexto': 'Only administrators can access the CMS.',
  'admin.titulo': 'Admin',
  'admin.subtitulo': 'Manage the educational content.',
  'admin.aba.disciplinas': 'Subjects',
  'admin.aba.topicos': 'Topics',
  'admin.aba.resumos': 'Summaries',
  'admin.aba.flashcards': 'Flashcards',
  'admin.aba.questoes': 'Questions',
  'admin.confirmExcluir': 'Are you sure you want to delete this?',
  'admin.excluido': 'Item deleted successfully.',
  'admin.nenhum': 'No records found.',
  'admin.acoes': 'Actions',
  'admin.excluir': 'Delete',

  // Colunas do CMS
  'admin.col.id': 'ID',
  'admin.col.nome': 'Name',
  'admin.col.titulo': 'Title',
  'admin.col.area_conhecimento': 'Area',
  'admin.col.icone': 'Icon',
  'admin.col.ano_escolar': 'School year',
  'admin.col.disciplina': 'Subject',
  'admin.col.disciplina_id': 'Subject ID',
  'admin.col.topico': 'Topic',
  'admin.col.topico_id': 'Topic ID',
  'admin.col.url_pdf': 'PDF URL',
  'admin.col.conteudo': 'Content',
  'admin.col.frente': 'Front',
  'admin.col.verso': 'Back',
  'admin.col.nivel_dificuldade': 'Difficulty',
  'admin.col.enunciado': 'Question text',
  'admin.col.opcoes': 'Options',
  'admin.col.alternativa': 'Option',
  'admin.col.alternativa_correta': 'Answer key',
  'admin.col.gabarito_comentado': 'Commentary',

  // Autenticação (erros de fallback)
  'auth.falhaLogin': 'Failed to log in.',
  'auth.falhaRegistrar': 'Failed to sign up.',
}

const esMX = {
  // Navbar
  'navbar.disciplinas': 'Asignaturas',
  'navbar.exercicios': 'Ejercicios',
  'navbar.dashboard': 'Panel',
  'navbar.admin': 'Admin',
  'navbar.entrar': 'Iniciar sesión',
  'navbar.cadastrar': 'Registrarse',
  'navbar.sair': 'Salir',
  'navbar.menu': 'Menú',
  'idioma.selecionar': 'Idioma',

  // Comum
  'comum.carregando': 'Cargando...',
  'comum.todos': 'Todos',
  'comum.topico': 'tema',
  'comum.topicos': 'temas',
  'comum.disciplina': 'asignatura',
  'comum.disciplinas': 'asignaturas',

  // Início
  'inicio.tagline': 'Educación Media · ENEM · Exámenes de admisión',
  'inicio.titulo': 'Estudia con resúmenes, flashcards y ejercicios de todas las materias.',
  'inicio.subtitulo': 'Contenido organizado por asignatura y grado escolar, con seguimiento de desempeño.',
  'inicio.explorarDisciplinas': 'Explorar asignaturas',
  'inicio.bancoQuestoes': 'Banco de preguntas',
  'inicio.materiaSingular': 'materia de educación media',
  'inicio.materiaPlural': 'materias de educación media',
  'inicio.organizadasPorArea': ', organizadas por área de conocimiento.',

  // Tópicos
  'topicos.titulo': 'Temas',
  'topicos.ano1': '1º Año',
  'topicos.ano2': '2º Año',
  'topicos.ano3': '3º Año',
  'topicos.enem': 'ENEM',
  'topicos.nenhum': 'No se encontraron temas para este filtro.',
  'topicos.resumos': 'Resúmenes',
  'topicos.flashcards': 'Flashcards',
  'topicos.questoes': 'Preguntas',

  // Resumos
  'resumos.erro': 'Error al cargar los resúmenes.',
  'resumos.nenhum': 'No hay resúmenes disponibles para este tema.',
  'resumos.mapaMental': 'Mapa mental (PDF)',

  // Flashcards
  'flashcards.nenhum': 'No hay flashcards disponibles para este tema.',
  'flashcards.contador': '{atual} de {total}',
  'flashcards.pergunta': 'Pregunta',
  'flashcards.resposta': 'Respuesta',
  'flashcards.cliqueVer': 'Haz clic para ver la respuesta',
  'flashcards.cliqueVoltar': 'Haz clic para volver',
  'flashcards.anterior': 'Anterior',
  'flashcards.proximo': 'Siguiente',

  // Exercícios
  'exercicios.tituloBanco': 'Banco de Ejercicios',
  'exercicios.tituloTopico': 'Ejercicios — {nome}',
  'exercicios.topicoFallback': 'Tema',
  'exercicios.subAutenticado': 'Resuelve las preguntas y sigue tu progreso.',
  'exercicios.subDesautenticado': 'Inicia sesión para guardar tu progreso.',
  'exercicios.facil': 'Fácil',
  'exercicios.medio': 'Medio',
  'exercicios.dificil': 'Difícil',
  'exercicios.nenhuma': 'No se encontraron preguntas.',
  'exercicios.correto': 'Correcto.',
  'exercicios.incorreto': 'Incorrecto.',
  'exercicios.respostaCorreta': ' Respuesta correcta: {letra}.',

  // Dashboard
  'dashboard.acessoTitulo': 'Accede a tu panel',
  'dashboard.acessoTexto': 'Inicia sesión para ver tu desempeño.',
  'dashboard.titulo': 'Mi desempeño',
  'dashboard.ola': 'Hola, {nome}.',
  'dashboard.erro': 'Error al cargar las estadísticas.',
  'dashboard.vazio': 'Aún no has resuelto ninguna pregunta.',
  'dashboard.comecar': 'Empezar ahora',
  'dashboard.cardQuestoes': 'Preguntas',
  'dashboard.cardAcertos': 'Aciertos',
  'dashboard.cardErros': 'Errores',
  'dashboard.cardTaxa': 'Tasa de acierto',
  'dashboard.porDisciplina': 'Por asignatura',

  // Login
  'login.titulo': 'Iniciar sesión',
  'login.subtitulo': 'Accede a tu cuenta para guardar tu progreso.',
  'login.email': 'Correo electrónico',
  'login.senha': 'Contraseña',
  'login.placeholderEmail': 'tu@email.com',
  'login.placeholderSenha': 'Mínimo 6 caracteres',
  'login.entrando': 'Iniciando sesión...',
  'login.entrar': 'Iniciar sesión',
  'login.semConta': '¿No tienes cuenta?',
  'login.cadastreSe': 'Regístrate',
  'login.erro': 'No se pudo iniciar sesión.',

  // Cadastro
  'registrar.titulo': 'Crear cuenta',
  'registrar.subtitulo': 'Empieza a estudar gratis.',
  'registrar.nome': 'Nombre completo',
  'registrar.placeholderNome': 'Tu nombre',
  'registrar.criando': 'Creando cuenta...',
  'registrar.criar': 'Crear cuenta',
  'registrar.jaTemConta': '¿Ya tienes cuenta?',
  'registrar.erro': 'No se pudo crear la cuenta.',

  // Admin CMS
  'admin.restritoTitulo': 'Acceso restringido',
  'admin.restritoTexto': 'Solo los administradores pueden acceder al CMS.',
  'admin.titulo': 'Admin',
  'admin.subtitulo': 'Gestiona el contenido educativo.',
  'admin.aba.disciplinas': 'Asignaturas',
  'admin.aba.topicos': 'Temas',
  'admin.aba.resumos': 'Resúmenes',
  'admin.aba.flashcards': 'Flashcards',
  'admin.aba.questoes': 'Preguntas',
  'admin.confirmExcluir': '¿Seguro que deseas eliminar esto?',
  'admin.excluido': 'Elemento eliminado correctamente.',
  'admin.nenhum': 'No se encontraron registros.',
  'admin.acoes': 'Acciones',
  'admin.excluir': 'Eliminar',

  // Colunas do CMS
  'admin.col.id': 'ID',
  'admin.col.nome': 'Nombre',
  'admin.col.titulo': 'Título',
  'admin.col.area_conhecimento': 'Área',
  'admin.col.icone': 'Ícono',
  'admin.col.ano_escolar': 'Grado escolar',
  'admin.col.disciplina': 'Asignatura',
  'admin.col.disciplina_id': 'ID de asignatura',
  'admin.col.topico': 'Tema',
  'admin.col.topico_id': 'ID de tema',
  'admin.col.url_pdf': 'URL del PDF',
  'admin.col.conteudo': 'Contenido',
  'admin.col.frente': 'Anverso',
  'admin.col.verso': 'Reverso',
  'admin.col.nivel_dificuldade': 'Dificultad',
  'admin.col.enunciado': 'Enunciado',
  'admin.col.opcoes': 'Opciones',
  'admin.col.alternativa': 'Opción',
  'admin.col.alternativa_correta': 'Respuesta correcta',
  'admin.col.gabarito_comentado': 'Comentario',

  // Autenticação (erros de fallback)
  'auth.falhaLogin': 'No se pudo iniciar sesión.',
  'auth.falhaRegistrar': 'No se pudo crear la cuenta.',
}

export const dicionarios = {
  'pt-BR': ptBR,
  'en-US': enUS,
  'es-MX': esMX,
}

// Nomes de disciplinas vindos da API → tradução por idioma (fallback: valor original)
export const NOMES_DISCIPLINAS = {
  'Artes': { 'en-US': 'Arts', 'es-MX': 'Artes' },
  'Biologia': { 'en-US': 'Biology', 'es-MX': 'Biología' },
  'Educação Física': { 'en-US': 'Physical Education', 'es-MX': 'Educación Física' },
  'Espanhol': { 'en-US': 'Spanish', 'es-MX': 'Español' },
  'Filosofia': { 'en-US': 'Philosophy', 'es-MX': 'Filosofía' },
  'Física': { 'en-US': 'Physics', 'es-MX': 'Física' },
  'Geografia': { 'en-US': 'Geography', 'es-MX': 'Geografía' },
  'História': { 'en-US': 'History', 'es-MX': 'Historia' },
  'Inglês': { 'en-US': 'English', 'es-MX': 'Inglés' },
  'Língua Portuguesa e Literatura': {
    'en-US': 'Portuguese Language and Literature',
    'es-MX': 'Lengua Portuguesa y Literatura',
  },
  'Matemática': { 'en-US': 'Mathematics', 'es-MX': 'Matemática' },
  'Química': { 'en-US': 'Chemistry', 'es-MX': 'Química' },
  'Sociologia': { 'en-US': 'Sociology', 'es-MX': 'Sociología' },
}

// Áreas do conhecimento → rótulo de exibição (chaves da API permanecem intactas)
export const ROTULOS_AREAS = {
  Exatas: { 'en-US': 'Exact Sciences', 'es-MX': 'Ciencias Exactas' },
  Humanas: { 'en-US': 'Humanities', 'es-MX': 'Humanidades' },
  'Biológicas': { 'en-US': 'Biological Sciences', 'es-MX': 'Ciencias Biológicas' },
  Linguagens: { 'en-US': 'Languages', 'es-MX': 'Lenguajes' },
  Outras: { 'en-US': 'Others', 'es-MX': 'Otras' },
}
