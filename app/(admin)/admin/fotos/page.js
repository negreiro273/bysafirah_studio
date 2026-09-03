'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function GerenciarFotos() {
  const [fotos, setFotos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [categoriaFiltro, setCategoriaFiltro] = useState('')
  const [selecionadas, setSelecionadas] = useState(new Set())
  const [mensagem, setMensagem] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [excluindo, setExcluindo] = useState(false)

  useEffect(() => {
    Promise.all([
      buscarFotos(),
      buscarCategorias()
    ])
  }, [])

  async function buscarFotos() {
    try {
      const resposta = await fetch('/api/admin/fotos')
      const dados = await resposta.json()
      setFotos(dados)
    } catch (erro) {
      console.error('Erro ao buscar fotos:', erro)
      setMensagem('❌ Erro ao carregar as fotos')
    } finally {
      setCarregando(false)
    }
  }

  async function buscarCategorias() {
    try {
      const resposta = await fetch('/api/admin/categorias')
      const dados = await resposta.json()
      setCategorias(dados)
    } catch (erro) {
      console.error('Erro ao buscar categorias:', erro)
    }
  }

  // Toggle de uma única foto
  function toggleFoto(id) {
    const novasSelecionadas = new Set(selecionadas)
    if (novasSelecionadas.has(id)) {
      novasSelecionadas.delete(id)
    } else {
      novasSelecionadas.add(id)
    }
    setSelecionadas(novasSelecionadas)
  }

  // Selecionar todas as fotos visíveis (filtradas)
  function selecionarTodas() {
    if (selecionadas.size === fotosFiltradas.length) {
      setSelecionadas(new Set()) // Desmarcar todas
    } else {
      const todasIds = new Set(fotosFiltradas.map(f => f.id))
      setSelecionadas(todasIds) // Marcar todas
    }
  }

  // Excluir fotos selecionadas
  async function excluirSelecionadas() {
    if (selecionadas.size === 0) return

    const confirmacao = confirm(
      `Tem certeza que deseja excluir ${selecionadas.size} foto(s) selecionada(s)?\n\nEsta ação não pode ser desfeita.`
    )

    if (!confirmacao) return

    setExcluindo(true)
    setMensagem('')

    const idsParaExcluir = Array.from(selecionadas)
    let sucesso = 0
    let erros = 0

    // Excluir todas em paralelo
    const promises = idsParaExcluir.map(async (id) => {
      try {
        const resposta = await fetch(`/api/admin/fotos?id=${id}`, {
          method: 'DELETE',
        })
        if (resposta.ok) {
          sucesso++
        } else {
          erros++
        }
      } catch (erro) {
        console.error(`Erro ao excluir foto ${id}:`, erro)
        erros++
      }
    })

    await Promise.all(promises)

    setMensagem(`✅ ${sucesso} foto(s) excluída(s) com sucesso!${erros > 0 ? ` (${erros} falharam)` : ''}`)
    setSelecionadas(new Set())
    buscarFotos()
    setExcluindo(false)

    setTimeout(() => setMensagem(''), 4000)
  }

  // Excluir uma única foto
  async function excluirFoto(id, titulo) {
    if (!confirm(`Tem certeza que deseja excluir a foto "${titulo}"?\nEsta ação não pode ser desfeita.`)) return

    try {
      const resposta = await fetch(`/api/admin/fotos?id=${id}`, {
        method: 'DELETE',
      })

      const dados = await resposta.json()

      if (resposta.ok) {
        setMensagem('✅ Foto excluída com sucesso!')
        setSelecionadas(prev => {
          const novo = new Set(prev)
          novo.delete(id)
          return novo
        })
        buscarFotos()
        setTimeout(() => setMensagem(''), 3000)
      } else {
        setMensagem(`❌ Erro: ${dados.error}`)
      }
    } catch (erro) {
      setMensagem('❌ Erro ao excluir foto')
    }
  }

  // Filtrar fotos pela categoria selecionada
  const fotosFiltradas = categoriaFiltro
    ? fotos.filter(foto => foto.categoria_id.toString() === categoriaFiltro)
    : fotos

  const todasSelecionadas = fotosFiltradas.length > 0 && selecionadas.size === fotosFiltradas.length

  return (
    <div className="container mx-auto max-w-7xl px-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">
          📸 Gerenciar Fotos Cadastradas
        </h2>
        <Link 
          href="/admin" 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Cadastrar Novas Fotos
        </Link>
      </div>

      {/* Filtros e Ações */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[250px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🔍 Filtrar por Categoria
            </label>
            <select
              value={categoriaFiltro}
              onChange={(e) => {
                setCategoriaFiltro(e.target.value)
                setSelecionadas(new Set()) // Limpa seleção ao mudar filtro
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todas as categorias</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nome}
                </option>
              ))}
            </select>
          </div>

          {categoriaFiltro && (
            <button
              onClick={() => {
                setCategoriaFiltro('')
                setSelecionadas(new Set())
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              🗑️ Limpar Filtro
            </button>
          )}

          <div className="text-sm text-gray-600 pb-2">
            Mostrando <span className="font-bold text-blue-600">{fotosFiltradas.length}</span> de{' '}
            <span className="font-bold">{fotos.length}</span> foto(s)
          </div>
        </div>

        {/* Barra de Seleção */}
        <div className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={selecionarTodas}
              className={`px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2 ${
                todasSelecionadas
                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              }`}
            >
              {todasSelecionadas ? (
                <>☑️ Desmarcar Todas</>
              ) : (
                <>☐ Selecionar Todas ({fotosFiltradas.length})</>
              )}
            </button>

            {selecionadas.size > 0 && (
              <span className="text-sm font-semibold text-blue-600">
                {selecionadas.size} selecionada(s)
              </span>
            )}
          </div>

          {selecionadas.size > 0 && (
            <button
              onClick={excluirSelecionadas}
              disabled={excluindo}
              className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {excluindo ? (
                <>⏳ Excluindo...</>
              ) : (
                <>🗑️ Excluir {selecionadas.size} Selecionada(s)</>
              )}
            </button>
          )}
        </div>
      </div>

      {mensagem && (
        <div className={`mb-6 p-4 rounded-lg text-center ${
          mensagem.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {mensagem}
        </div>
      )}

      {carregando ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Carregando fotos...</p>
        </div>
      ) : fotosFiltradas.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow">
          {categoriaFiltro ? (
            <>
              <p className="text-gray-500 text-lg mb-2">
                Nenhuma foto encontrada nesta categoria.
              </p>
              <button
                onClick={() => {
                  setCategoriaFiltro('')
                  setSelecionadas(new Set())
                }}
                className="text-blue-600 hover:underline"
              >
                Ver todas as fotos →
              </button>
            </>
          ) : (
            <>
              <p className="text-gray-500 text-lg">Nenhuma foto cadastrada ainda.</p>
              <Link href="/admin" className="text-blue-600 hover:underline mt-2 inline-block">
                Cadastrar primeira foto →
              </Link>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {fotosFiltradas.map((foto) => {
            const estaSelecionada = selecionadas.has(foto.id)
            return (
              <div 
                key={foto.id} 
                className={`bg-white rounded-xl shadow-lg overflow-hidden transition ${
                  estaSelecionada 
                    ? 'ring-4 ring-blue-500 shadow-blue-200' 
                    : 'hover:shadow-xl'
                }`}
              >
                {/* Imagem com Checkbox */}
                <div className="relative aspect-[4/3]">
                  <Image
                    src={foto.caminho}
                    alt={foto.titulo}
                    fill
                    className="object-cover"
                  />
                  
                  {/* Checkbox no canto superior esquerdo */}
                  <div className="absolute top-2 left-2">
                    <button
                      onClick={() => toggleFoto(foto.id)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition ${
                        estaSelecionada
                          ? 'bg-blue-600 text-white'
                          : 'bg-white/90 text-gray-600 hover:bg-white'
                      }`}
                      title={estaSelecionada ? 'Desmarcar' : 'Selecionar'}
                    >
                      {estaSelecionada ? '✓' : ''}
                    </button>
                  </div>

                  {foto.destaque === 1 && (
                    <div className="absolute top-2 right-2 bg-yellow-400 text-xs px-2 py-1 rounded-full font-semibold">
                      ⭐ Destaque
                    </div>
                  )}
                </div>

                {/* Informações */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 truncate" title={foto.titulo}>
                    {foto.titulo}
                  </h3>
                  <p className="text-sm text-blue-600 mt-1">
                    📂 {foto.categoria_nome}
                  </p>
                  {foto.descricao && (
                    <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                      {foto.descricao}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">
                    📅 {new Date(foto.created_at).toLocaleDateString('pt-BR')}
                  </p>

                  {/* Botão Excluir Individual */}
                  <button
                    onClick={() => excluirFoto(foto.id, foto.titulo)}
                    className="mt-3 w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition text-sm font-semibold flex items-center justify-center gap-2"
                  >
                    ️ Excluir Foto
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}