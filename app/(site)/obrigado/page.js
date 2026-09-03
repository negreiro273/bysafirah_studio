import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

export default function Obrigado() {
  return (
    <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center px-6 pt-20">
      <div className="text-center max-w-md bg-white p-10 rounded-2xl shadow-lg">
        <div className="flex justify-center mb-6">
          <CheckCircle className="w-20 h-20 text-[#c9a882]" />
        </div>
        <h1 className="text-3xl font-light text-gray-800 italic mb-4">
          Mensagem Enviada com Sucesso!
        </h1>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Obrigada pelo seu contato, Safirah irá analisar sua mensagem e retornará em breve com todas as informações.
        </p>
        <Link 
          href="/" 
          className="inline-block bg-[#c9a882] text-white px-8 py-3 text-sm tracking-widest hover:bg-[#b8956f] transition duration-300 uppercase rounded-lg"
        >
          Voltar para Home
        </Link>
      </div>
    </div>
  )
}