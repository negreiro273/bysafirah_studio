'use client'

import Link from 'next/link'

export default function AdminNav() {
  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    window.location.href = '/admin/login'
  }

  return (
    <nav className="bg-gradient-to-r from-[#d4b896] via-[#c9a882] to-[#b8956f] text-white shadow-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold">📸 bySafirah Admin</span>
          </div>
          
          <div className="flex space-x-4 flex-wrap items-center">
            <Link 
              href="/admin" 
              className="hover:text-yellow-100 transition px-3 py-2 rounded hover:bg-white/10 text-sm"
            >
              ➕ Cadastrar Foto
            </Link>
            <Link 
              href="/admin/fotos" 
              className="hover:text-yellow-100 transition px-3 py-2 rounded hover:bg-white/10 text-sm"
            >
               Gerenciar Fotos
            </Link>
            <Link 
              href="/admin/categorias" 
              className="hover:text-yellow-100 transition px-3 py-2 rounded hover:bg-white/10 text-sm"
            >
              📂 Categorias
            </Link>
           
            <Link 
              href="/" 
              className="hover:text-yellow-100 transition px-3 py-2 rounded hover:bg-white/10 text-sm"
            >
               Ver Site
            </Link>
            
            {/* Botão Logout */}
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 transition px-3 py-2 rounded text-sm font-semibold"
            >
               Sair
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}