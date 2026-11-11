import React, { useState } from 'react'
import { ProvedorAutenticacao } from './contextos/AutenticacaoContexto'
import Navbar from './components/Navbar'
import Toast from './components/Toast'

import Inicio from './pages/Inicio'
import HubDisciplinas from './pages/HubDisciplinas'
import PaginaTopicos from './pages/PaginaTopicos'
import VisualizadorResumos from './pages/VisualizadorResumos'
import ModuloFlashcards from './pages/ModuloFlashcards'
import BancoExercicios from './pages/BancoExercicios'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Registrar from './pages/Registrar'
import AdminCMS from './pages/AdminCMS'
import { ProvedorIdioma } from './i18n/IdiomaContexto'
import { ProvedorTema } from './contextos/TemaContexto'

function ConteudoInterno() {
  const [pagina, setPagina] = useState('inicio')
  const [parametros, setParametros] = useState({})
  const [toast, setToast] = useState({ mensagem: '', tipo: 'sucesso', visivel: false })

  const navegar = (novaPagina, novosParametros = {}) => {
    setPagina(novaPagina)
    setParametros(novosParametros)
    const movimentoReduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: movimentoReduzido ? 'auto' : 'smooth' })
  }

  const exibirToast = (mensagem, tipo = 'sucesso') => {
    setToast({ mensagem, tipo, visivel: true })
  }

  const renderPagina = () => {
    switch (pagina) {
      case 'inicio':
        return <Inicio aoNavegar={navegar} />
      case 'disciplinas':
        return <HubDisciplinas aoNavegar={navegar} />
      case 'topicos':
        return (
          <PaginaTopicos
            disciplinaId={parametros.disciplinaId}
            disciplinaNome={parametros.disciplinaNome}
            area={parametros.area}
            disciplinaIcone={parametros.icone}
            aoNavegar={navegar}
          />
        )
      case 'resumos':
        return (
          <VisualizadorResumos
            topicoId={parametros.topicoId}
            topicoTitulo={parametros.topicoTitulo}
            disciplinaNome={parametros.disciplinaNome}
            origem={parametros.origem}
            aoNavegar={navegar}
          />
        )
      case 'flashcards':
        return (
          <ModuloFlashcards
            topicoId={parametros.topicoId}
            topicoTitulo={parametros.topicoTitulo}
            disciplinaNome={parametros.disciplinaNome}
            origem={parametros.origem}
            aoNavegar={navegar}
          />
        )
      case 'exercicios':
        return (
          <BancoExercicios
            aoNavegar={navegar}
            topicoIdFiltro={parametros.topicoId}
            disciplinaNomeFiltro={parametros.disciplinaNome}
            origem={parametros.origem}
          />
        )
      case 'dashboard':
        return <Dashboard aoNavegar={navegar} />
      case 'login':
        return <Login aoNavegar={navegar} />
      case 'registrar':
        return <Registrar aoNavegar={navegar} />
      case 'admin':
        return <AdminCMS aoNavegar={navegar} />
      default:
        return <Inicio aoNavegar={navegar} />
    }
  }

  return (
    <div className="min-h-screen flex flex-col text-tinta">
      <Navbar pagina={pagina} aoNavegar={navegar} />
      <main className="flex-1 pb-16 pt-[calc(env(safe-area-inset-top)+6.5rem)] lg:pt-32">
        {renderPagina()}
      </main>
      <Toast
        mensagem={toast.mensagem}
        tipo={toast.tipo}
        visivel={toast.visivel}
        aoFechar={() => setToast((prev) => ({ ...prev, visivel: false }))}
      />
    </div>
  )
}

export default function App() {
  return (
    <ProvedorTema>
      <ProvedorIdioma>
        <ProvedorAutenticacao>
          <ConteudoInterno />
        </ProvedorAutenticacao>
      </ProvedorIdioma>
    </ProvedorTema>
  )
}
