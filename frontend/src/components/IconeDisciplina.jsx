const ICONES = {
  matematica: (
    <>
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <path d="M8 6h8" />
      <path d="M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01M8 20h.01M12 20h.01M16 20h.01" />
    </>
  ),
  fisica: (
    <>
      <circle cx="12" cy="12" r="2" />
      <ellipse cx="12" cy="12" rx="11" ry="4.5" />
      <ellipse cx="12" cy="12" rx="11" ry="4.5" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="11" ry="4.5" transform="rotate(120 12 12)" />
    </>
  ),
  quimica: (
    <>
      <path d="M10 2v6.5L5.5 20a2 2 0 0 0 1.8 2h9.4a2 2 0 0 0 1.8-2L14 8.5V2" />
      <path d="M8.5 2h7" />
      <path d="M7 15h10" />
    </>
  ),
  historia: (
    <>
      <path d="M7 3h10" />
      <path d="M7 21h10" />
      <path d="M6 3a6 6 0 0 0 3 5.2L12 12l-3 3.8A6 6 0 0 0 6 21" />
      <path d="M18 3a6 6 0 0 1-3 5.2L12 12l3 3.8a6 6 0 0 1 3 5.2" />
    </>
  ),
  geografia: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </>
  ),
  filosofia: (
    <>
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5A6.8 6.8 0 0 0 18.5 7a6.5 6.5 0 0 0-13 0c0 1.8.7 3.3 1.5 4.5.8.8 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
    </>
  ),
  sociologia: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  biologia: (
    <>
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </>
  ),
  linguagens: (
    <>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </>
  ),
  ingles: (
    <>
      <path d="M5 3a2 2 0 0 0-2 2c0 1 1 1.5 1 3s-1 2-1 3a2 2 0 0 0 2 2 5 5 0 0 0 5-4" />
      <path d="M19 3a2 2 0 0 1 2 2c0 1-1 1.5-1 3s1 2 1 3a2 2 0 0 1-2 2 5 5 0 0 1-5-4" />
      <path d="M9 4h6v16H9z" transform="rotate(45 12 12)" />
    </>
  ),
  espanhol: (
    <>
      <circle cx="12" cy="9" r="3.2" />
      <path d="M12 12.2v9" />
      <path d="M12 15.5c-2.8 1.6-4.5 3.2-5 5" />
      <path d="M12 15.5c2.8 1.6 4.5 3.2 5 5" />
    </>
  ),
  artes: (
    <>
      <path d="M12 3a9 9 0 1 0 .01 0Z" />
      <path d="M12 8v4" />
      <path d="M12 16h.01" />
      <path d="M8 10h.01M16 10h.01" />
    </>
  ),
  educacao_fisica: (
    <>
      <circle cx="12" cy="5.5" r="2.5" />
      <path d="M12 8v5" />
      <path d="M12 13l-3.5 5H6" />
      <path d="M12 13l3.5 5H18" />
      <path d="M12 8l-3.5 1.2M12 8l3.5 1.2" />
    </>
  ),
}

export default function IconeDisciplina({ icone, tamanho = 24, className = '' }) {
  return (
    <svg
      width={tamanho}
      height={tamanho}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {ICONES[icone] || ICONES.linguagens}
    </svg>
  )
}