'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock } from 'lucide-react'

export default function Login() {
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)
  const router = useRouter()

  async function handleSubmit(e) {
    e.preventDefault()
    setCarregando(true)
    setErro('')

    try {
      const resposta = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senha }),
      })

      const dados = await resposta.json()

      if (resposta.ok) {
        router.push('/admin')
        router.refresh()
      } else {
        setErro(dados.error || 'Senha incorreta')
      }
    } catch (erro) {
      setErro('Erro ao conectar. Tente novamente.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#c9a882] to-[#b8956f] flex items-center justify-center px-6">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#c9a882] rounded-full mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-light text-gray-800 italic mb-2">
            bySafirah Admin
          </h1>
          <p className="text-gray-600 text-sm">
            Área restrita - Digite a senha para acessar
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs tracking-[0.2em] text-gray-700 uppercase mb-2 font-semibold">
              Senha
            </label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              placeholder="Digite a senha de acesso"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#c9a882] focus:bg-white transition"
            />
          </div>

          {erro && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm text-center">
              {erro}
            </div>
          )}

          <button
            type="submit"
            disabled={carregando}
            className="w-full bg-[#c9a882] text-white py-3 tracking-widest hover:bg-[#b8956f] transition duration-300 uppercase text-sm font-semibold rounded-lg disabled:opacity-50"
          >
            {carregando ? 'Entrando...' : 'Acessar Painel'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <a 
            href="/" 
            className="text-xs text-gray-500 hover:text-[#c9a882] transition"
          >
            ← Voltar para o site
          </a>
        </div>
      </div>
    </div>
  )
}