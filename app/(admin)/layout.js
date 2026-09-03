import Link from 'next/link'

export const metadata = {
  title: "bySafirah - Admin",
  description: "Painel Administrativo",
};

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Menu Administrativo */}
      <nav className="bg-slate-800 text-white shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold"> bySafirah Admin</span>
            </div>
            
            <div className="flex space-x-4 flex-wrap">
              <Link 
                href="/admin" 
                className="hover:text-blue-300 transition px-3 py-2 rounded hover:bg-slate-700"
              >
                ➕ Cadastrar Foto
              </Link>
              <Link 
                href="/admin/fotos" 
                className="hover:text-blue-300 transition px-3 py-2 rounded hover:bg-slate-700"
              >
                 Gerenciar Fotos
              </Link>
              <Link 
                href="/admin/categorias" 
                className="hover:text-blue-300 transition px-3 py-2 rounded hover:bg-slate-700"
              >
                📂 Categorias
              </Link>
             
              <Link 
                href="/" 
                className="hover:text-blue-300 transition px-3 py-2 rounded hover:bg-slate-700"
              >
                 Ver Site
              </Link>

            </div>
          </div>
        </div>
      </nav>

      {/* Conteúdo */}
      <div className="py-8">
        {children}
      </div>
    </div>
  )
}