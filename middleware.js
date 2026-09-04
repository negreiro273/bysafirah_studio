import { NextResponse } from 'next/server'

export function middleware(request) {
  const { pathname } = request.nextUrl
  
  // Verificar se está tentando acessar rotas admin (exceto login)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const adminAuth = request.cookies.get('admin_auth')?.value
    
    // Se não estiver autenticado, redirecionar para login
    if (adminAuth !== 'true') {
      const loginUrl = new URL('/admin/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
  }
  
  return NextResponse.next()
}

// Configurar em quais rotas o middleware deve rodar
export const config = {
  matcher: ['/admin/:path*'],
}