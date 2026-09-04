import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request) {
  try {
    const body = await request.json()
    const { senha } = body
    const senhaCorreta = process.env.SENHA_DE_ADMINISTRADOR || process.env.ADMIN_PASSWORD;
    
    // Verificar se a senha está correta
    if (senha === senhaCorreta) {
      const cookieStore = await cookies()
      
      // Criar cookie de sessão (válido por 7 dias)
      cookieStore.set('admin_auth', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 dias
        path: '/',
      })

      return NextResponse.json({ sucesso: true })
    } else {
      return NextResponse.json(
        { error: 'Senha incorreta' },
        { status: 401 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao fazer login' },
      { status: 500 }
    )
  }
}