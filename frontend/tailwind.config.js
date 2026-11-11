/** @type {import('tailwindcss').Config} */

// Cores semânticas: os valores mudam entre tema claro e escuro (ver index.css)
const cor = (variavel) => `rgb(var(${variavel}) / <alpha-value>)`

export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        fundo: cor('--c-fundo'),
        superficie: cor('--c-superficie'),
        elevada: cor('--c-elevada'),
        borda: cor('--c-borda'),
        tinta: cor('--c-tinta'),
        suave: cor('--c-suave'),
        marca: cor('--c-marca'),
        'marca-forte': cor('--c-marca-forte'),
        'marca-texto': cor('--c-marca-texto'),
        roxo: cor('--c-roxo'),
        'roxo-texto': cor('--c-roxo-texto'),
        estrela: cor('--c-estrela'),
        'estrela-viva': cor('--c-estrela-viva'),
        'estrela-contorno': cor('--c-estrela-contorno'),
        sucesso: cor('--c-sucesso'),
        erro: cor('--c-erro'),
        'area-exatas': cor('--c-area-exatas'),
        'area-biologicas': cor('--c-area-biologicas'),
        'area-humanas': cor('--c-area-humanas'),
        'area-linguagens': cor('--c-area-linguagens'),
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Sora', '"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        cartao: '0 1px 2px rgb(var(--c-sombra) / 0.06), 0 4px 16px -6px rgb(var(--c-sombra) / 0.10)',
        'cartao-hover': '0 2px 4px rgb(var(--c-sombra) / 0.06), 0 14px 32px -12px rgb(var(--c-sombra) / 0.22)',
      },
    },
  },
  plugins: [],
}
