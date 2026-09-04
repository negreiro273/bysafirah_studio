import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  try {
    const cookieStore = await cookies()
    
    // Remover cookie de sessão
    cookieStore.delete('admin_auth')
    
    return NextResponse.json({ sucesso: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao fazer logout' },
      { status: 500 }
    )
  }
}