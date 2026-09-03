'use client'

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react'

export default function Galeria() {
  const [fotos, setFotos] = useState([])
  const [categoriaFiltro, setCategoriaFiltro] = useState('')
  const [categorias, setCategorias] = useState([])
  const [imagemPrincipal, setImagemPrincipal] = useState(null)
  const [fullscreen, setFullscreen] = useState(false)
  const [indiceAtual, setIndiceAtual] = useState(0)

  // Carregar dados iniciais
  useEffect(() => {
    async function buscarDados() {
      try {
        const [respostaFotos, respostaCategorias] = await Promise.all([
          fetch('/api/admin/fotos'),
          fetch('/api/admin/categorias')
        ])
        
        const dadosFotos = await respostaFotos.json()
        const dadosCategorias = await respostaCategorias.json()
        
        setFotos(dadosFotos)
        setCategorias(dadosCategorias)
      } catch (erro) {
        console.error('Erro ao carregar dados:', erro)
      }
    }
    
    buscarDados()
  }, [])

  // Filtrar fotos com useMemo (mais eficiente)
  const fotosFiltradas = useMemo(() => {
    if (!categoriaFiltro) return fotos
    return fotos.filter(foto => foto.categoria_id.toString() === categoriaFiltro)
  }, [fotos, categoriaFiltro])

  // Atualizar imagem principal quando o filtro OU as fotos mudarem
  useEffect(() => {
    if (fotosFiltradas.length > 0) {
      setImagemPrincipal(fotosFiltradas[0])
      setIndiceAtual(0)
    } else {
      setImagemPrincipal(null)
      setIndiceAtual(0)
    }
  }, [fotosFiltradas])

  // Navegação
  function proximaImagem() {
    if (fotosFiltradas.length === 0) return
    const indice = (indiceAtual + 1) % fotosFiltradas.length
    setIndiceAtual(indice)
    setImagemPrincipal(fotosFiltradas[indice])
  }

  function imagemAnterior() {
    if (fotosFiltradas.length === 0) return
    const indice = (indiceAtual - 1 + fotosFiltradas.length) % fotosFiltradas.length
    setIndiceAtual(indice)
    setImagemPrincipal(fotosFiltradas[indice])
  }

  function abrirFullscreen() {
    setFullscreen(true)
  }

  function fecharFullscreen() {
    setFullscreen(false)
  }

  // Navegação com teclado
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'ArrowRight') proximaImagem()
      if (e.key === 'ArrowLeft') imagemAnterior()
      if (e.key === 'Escape') {
        if (fullscreen) fecharFullscreen()
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [indiceAtual, fotosFiltradas, fullscreen])

  return (
    <div className="min-h-screen bg-[#faf8f5] pt-32 pb-20 px-6">
      <div className="container mx-auto max-w-7xl">
        
        {/* Título */}
        <div className="text-center mb-12">
          <p className="text-xs tracking-[0.3em] text-[#c9a882] uppercase mb-4">
            Galeria de fotos
          </p>
          <h1 className="text-5xl md:text-6xl font-light text-gray-800 italic">
            Nossos Trabalhos
          </h1>
        </div>

        {/* Filtro de Categorias */}
        
        <div className="flex justify-center items-center mb-12">
          <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-lg border border-[#c9a882]/30">
            <label className="text-xs tracking-[0.3em] text-[#c9a882] uppercase font-semibold">
              Filtro
            </label>
            <div className="h-6 w-px bg-[#c9a882]/30"></div>
            <select
              value={categoriaFiltro}
              onChange={(e) => {
                const novoFiltro = e.target.value
                setCategoriaFiltro(novoFiltro)
                // Resetar imediatamente
                const fotosFiltradasNovas = novoFiltro
                  ? fotos.filter(foto => foto.categoria_id.toString() === novoFiltro)
                  : fotos
                if (fotosFiltradasNovas.length > 0) {
                  setImagemPrincipal(fotosFiltradasNovas[0])
                  setIndiceAtual(0)
                } else {
                  setImagemPrincipal(null)
                  setIndiceAtual(0)
                }
              }}
              className="text-center text-sm tracking-wider text-gray-700 focus:outline-none bg-transparent cursor-pointer min-w-[270px]"
            >
              <option value="">Todas as categorias</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nome}
                </option>
              ))}
            </select>
          </div>
        </div>

        {fotosFiltradas.length === 0 ? (
          <p className="text-center text-gray-500 py-20">
            Nenhuma foto encontrada nesta categoria.
          </p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* IMAGEM PRINCIPAL (LADO ESQUERDO) */}
            <div className="relative aspect-[4/3] lg:aspect-[4/5] overflow-hidden rounded-lg bg-gray-100">
              {imagemPrincipal && (
                <>
                  <Image
                    key={imagemPrincipal.id}
                    src={imagemPrincipal.caminho}
                    alt={imagemPrincipal.titulo}
                    fill
                    className="object-cover transition-opacity duration-300"
                    priority
                  />
                  
                  {/* Botão Expandir */}
                  <button
                    onClick={abrirFullscreen}
                    className="absolute top-4 right-4 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition"
                    title="Expandir (Fullscreen)"
                  >
                    <Maximize2 className="w-5 h-5 text-gray-800" />
                  </button>

                  {/* Overlay com informações */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-white">
                    <p className="text-sm text-[#c9a882] uppercase tracking-wider mb-1">
                      {imagemPrincipal.categoria_nome}
                    </p>
                    <h3 className="text-xl font-light">
                      {imagemPrincipal.titulo}
                    </h3>
                  </div>
                </>
              )}
            </div>

            {/* GRID DE THUMBNAILS (LADO DIREITO) */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
                {fotosFiltradas.map((foto, index) => (
                  <button
                    key={foto.id}
                    onClick={() => {
                      setImagemPrincipal(foto)
                      setIndiceAtual(index)
                    }}
                    className={`relative aspect-[4/3] overflow-hidden rounded-lg transition-all duration-300 ${
                      imagemPrincipal?.id === foto.id
                        ? 'ring-2 ring-[#c9a882] scale-105'
                        : 'hover:scale-105 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={foto.caminho}
                      alt={foto.titulo}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>

              {/* Contador */}
              <div className="text-center text-sm text-gray-600">
                {indiceAtual + 1} de {fotosFiltradas.length} fotos
              </div>
            </div>

          </div>
        )}

        {/* FULLSCREEN MODAL */}
        {fullscreen && imagemPrincipal && (
          <div 
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
            onClick={fecharFullscreen}
          >
            {/* Botão Fechar */}
            <button
              onClick={fecharFullscreen}
              className="absolute top-6 right-6 text-white/80 hover:text-white transition"
            >
              <X className="w-10 h-10" />
            </button>

            {/* Botões de Navegação */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                imagemAnterior()
              }}
              className="absolute left-6 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition p-4"
            >
              <ChevronLeft className="w-12 h-12" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation()
                proximaImagem()
              }}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition p-4"
            >
              <ChevronRight className="w-12 h-12" />
            </button>

            {/* Imagem */}
            <div 
              className="relative w-full h-full max-w-7xl max-h-[90vh] p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={imagemPrincipal.caminho}
                alt={imagemPrincipal.titulo}
                fill
                className="object-contain"
                priority
              />
              
              {/* Informações */}
              <div className="absolute bottom-6 left-0 right-0 text-center text-white">
                <p className="text-sm text-[#c9a882] uppercase tracking-wider mb-2">
                  {imagemPrincipal.categoria_nome}
                </p>
                <h3 className="text-2xl font-light">
                  {imagemPrincipal.titulo}
                </h3>
                {imagemPrincipal.descricao && (
                  <p className="text-sm text-white/70 mt-2">
                    {imagemPrincipal.descricao}
                  </p>
                )}
              </div>
            </div>

            {/* Contador */}
            <div className="absolute bottom-6 right-6 text-white/70 text-sm">
              {indiceAtual + 1} / {fotosFiltradas.length}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}