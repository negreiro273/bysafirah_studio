import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request) {
  try {
    const body = await request.json()
    const { senha } = body

    console.log('🔐 Tentativa de login recebida')
    console.log('📋 Senha enviada pelo usuário:', senha)
    console.log('📋 ADMIN_PASSWORD:', process.env.ADMIN_PASSWORD)
    console.log('📋 SENHA_DE_ADMINISTRADOR:', process.env.SENHA_DE_ADMINISTRADOR)
    
    // Aceita ambos os nomes de variável
    const senhaCorreta = process.env.SENHA_DE_ADMINISTRADOR || process.env.ADMIN_PASSWORD
    
    console.log('📋 Senha correta configurada:', senhaCorreta)
    console.log('📋 Senhas são iguais?', senha === senhaCorreta)

    if (senha === senhaCorreta) {
      const cookieStore = await cookies()
      
      cookieStore.set('admin_auth', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      })

      console.log('✅ Login bem-sucedido!')
      return NextResponse.json({ sucesso: true })
    } else {
      console.log('❌ Senha incorreta!')
      return NextResponse.json(
        { error: 'Senha incorreta' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error(' Erro no login:', error)
    return NextResponse.json(
      { error: 'Erro ao fazer login' },
      { status: 500 }
    )
  }
}