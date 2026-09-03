'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function CategoriasAdmin() {
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [categorias, setCategorias] = useState([])
  const [mensagem, setMensagem] = useState('')

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
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setMensagem('')

    try {
      const resposta = await fetch('/api/admin/categorias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, descricao }),
      })

      const dados = await resposta.json()

      if (resposta.ok) {
        setMensagem('✅ Categoria cadastrada com sucesso!')
        setNome('')
        setDescricao('')
        buscarCategorias()
      } else {
        setMensagem(`❌ Erro: ${dados.error}`)
      }
    } catch (erro) {
      setMensagem('❌ Erro ao cadastrar categoria')
    }
  }

  async function excluirCategoria(id) {
    if (!confirm('Tem certeza que deseja excluir esta categoria?')) return

    try {
      const resposta = await fetch(`/api/admin/categorias?id=${id}`, {
        method: 'DELETE',
      })

      if (resposta.ok) {
        setMensagem('✅ Categoria excluída!')
        buscarCategorias()
      } else {
        const dados = await resposta.json()
        setMensagem(`❌ Erro: ${dados.error}`)
      }
    } catch (erro) {
      setMensagem(' Erro ao excluir categoria')
    }
  }

  return (
    <div className="container mx-auto max-w-6xl px-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-8">
        Gerenciar Categorias
      </h2>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Formulário */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-xl font-semibold mb-6 text-gray-700">
            Nova Categoria
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome da Categoria *
              </label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: Casamento"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição (opcional)
              </label>
              <textarea
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: Fotos de casamentos..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Cadastrar Categoria
            </button>

            {mensagem && (
              <div className="p-4 rounded-lg bg-gray-100 text-center">
                {mensagem}
              </div>
            )}
          </form>
        </div>

        {/* Lista */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-xl font-semibold mb-6 text-gray-700">
            Categorias Cadastradas
          </h3>

          {categorias.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Nenhuma categoria cadastrada ainda.
            </p>
          ) : (
            <ul className="space-y-3">
              {categorias.map((cat) => (
                <li
                  key={cat.id}
                  className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <div>
                    <p className="font-semibold text-gray-800">{cat.nome}</p>
                    {cat.descricao && (
                      <p className="text-sm text-gray-500">{cat.descricao}</p>
                    )}
                  </div>
                  <button
                    onClick={() => excluirCategoria(cat.id)}
                    className="text-red-500 hover:text-red-700 font-medium"
                  >
                    Excluir
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}