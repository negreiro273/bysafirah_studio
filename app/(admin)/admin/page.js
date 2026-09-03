'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Admin() {
  const [titulo, setTitulo] = useState('')
  const [descricao, setDescricao] = useState('')
  const [categoriaId, setCategoriaId] = useState('')
  const [destaque, setDestaque] = useState(false)
  const [arquivos, setArquivos] = useState([])
  const [carregando, setCarregando] = useState(false)
  const [mensagem, setMensagem] = useState('')
  const [categorias, setCategorias] = useState([])
  const [progresso, setProgresso] = useState(0)

  useEffect(() => {
    buscarCategorias()
  }, [])

  async function buscarCategorias() {
    try {
      const resposta = await fetch('/api/admin/categorias')
      const dados = await resposta.json()
      setCategorias(dados)
    } catch (erro) {
      console.error('Erro ao buscar categorias:', erro)
      setMensagem('⚠️ Não foi possível carregar as categorias')
    }
  }

  function handleFileChange(e) {
    const arquivosSelecionados = Array.from(e.target.files)
    setArquivos(arquivosSelecionados)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setCarregando(true)
    setMensagem('')
    setProgresso(0)

    if (arquivos.length === 0) {
      setMensagem('Por favor, selecione pelo menos uma imagem!')
      setCarregando(false)
      return
    }

    if (!categoriaId) {
      setMensagem('Por favor, selecione uma categoria!')
      setCarregando(false)
      return
    }

    try {
      // Criar FormData para enviar múltiplos arquivos
      const formData = new FormData()
      formData.append('titulo', titulo)
      formData.append('descricao', descricao)
      formData.append('categoriaId', categoriaId)
      formData.append('destaque', destaque.toString())
      
      // Adicionar todos os arquivos
      arquivos.forEach((arquivo, index) => {
        formData.append('imagens', arquivo)
      })

      const resposta = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      const dados = await resposta.json()

      if (resposta.ok) {
        setMensagem(`✅ ${dados.sucesso} foto(s) cadastrada(s) com sucesso!`)
        setTitulo('')
        setDescricao('')
        setCategoriaId('')
        setDestaque(false)
        setArquivos([])
        setProgresso(100)
      } else {
        setMensagem(`❌ Erro: ${dados.error}`)
      }
    } catch (erro) {
      setMensagem('❌ Erro ao cadastrar fotos')
      console.error(erro)
    } finally {
      setCarregando(false)
      setTimeout(() => setProgresso(0), 2000)
    }
  }

  return (
    <div className="container mx-auto max-w-4xl px-6">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          📸 Cadastrar Múltiplas Fotos
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título Base *
            </label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: Ensaio Fotográfico - Casamento"
            />
            <p className="text-xs text-gray-500 mt-1">
              Este título será usado como base para todas as fotos
            </p>
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição (opcional)
            </label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: Fotos do ensaio realizado no dia..."
            />
          </div>

          {/* Categoria */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoria *
            </label>
            {categorias.length === 0 ? (
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-sm text-orange-800">
                  ⚠️ Nenhuma categoria cadastrada.
                </p>
                <Link 
                  href="/admin/categorias" 
                  className="text-sm text-blue-600 hover:underline mt-1 inline-block"
                >
                  → Cadastrar primeira categoria
                </Link>
              </div>
            ) : (
              <select
                value={categoriaId}
                onChange={(e) => setCategoriaId(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selecione uma categoria</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nome}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Destaque */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="destaque"
              checked={destaque}
              onChange={(e) => setDestaque(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="destaque" className="ml-2 text-sm text-gray-700">
              Marcar como destaque (aparece na home)
            </label>
          </div>

          {/* Upload Múltiplo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selecionar Múltiplas Imagens *
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                required
                className="hidden"
                id="file-input"
              />
              <label 
                htmlFor="file-input"
                className="cursor-pointer block"
              >
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="mt-2 text-sm text-gray-600">
                  Clique para selecionar ou arraste as imagens aqui
                </p>
                <p className="text-xs text-gray-500">
                  Você pode selecionar várias imagens de uma vez (Ctrl+clique ou Shift+clique)
                </p>
              </label>
            </div>

            {arquivos.length > 0 && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800 font-semibold">
                  📁 {arquivos.length} arquivo(s) selecionado(s):
                </p>
                <ul className="mt-2 text-xs text-gray-600 space-y-1 max-h-32 overflow-y-auto">
                  {arquivos.map((arquivo, index) => (
                    <li key={index} className="flex items-center">
                      <span className="mr-2"></span>
                      {arquivo.name} ({(arquivo.size / 1024 / 1024).toFixed(2)} MB)
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Barra de Progresso */}
          {progresso > 0 && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progresso}%` }}
              ></div>
            </div>
          )}

          {/* Botão */}
          <button
            type="submit"
            disabled={carregando}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {carregando ? '🔄 Cadastrando fotos...' : `📸 Cadastrar ${arquivos.length} foto(s)`}
          </button>

          {/* Mensagem */}
          {mensagem && (
            <div className={`p-4 rounded-lg text-center ${
              mensagem.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {mensagem}
            </div>
          )}
        </form>
      </div>
    </div>
  )
}