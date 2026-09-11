import axios from 'axios'

// Instância Axios configurada para se comunicar com a API FastAPI
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

// Interceptor: inclui o token JWT automaticamente em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token_study_friend')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor: redireciona para login em caso de erro 401
api.interceptors.response.use(
  (resposta) => resposta,
  (erro) => {
    if (erro.response && erro.response.status === 401) {
      localStorage.removeItem('token_study_friend')
      localStorage.removeItem('usuario_study_friend')
      window.location.href = '/#/login'
    }
    return Promise.reject(erro)
  }
)

export default api
