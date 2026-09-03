import { NextResponse } from 'next/server'
import db from '../../../lib/db'

export async function POST(request) {
  try {
    const body = await request.json()
    const { nome, email, tipo, dataEvento, mensagem } = body

    // Validação
    if (!nome || !email || !mensagem) {
      return NextResponse.json(
        { error: 'Nome, e-mail e mensagem são obrigatórios' },
        { status: 400 }
      )
    }

    // Salvar no banco
    const result = db.prepare(`
      INSERT INTO contatos (nome, email, tipo, data_evento, mensagem)
      VALUES (?, ?, ?, ?, ?)
    `).run(
      String(nome).trim(),
      String(email).trim(),
      tipo ? String(tipo).trim() : null,
      dataEvento ? String(dataEvento).trim() : null,
      String(mensagem).trim()
    )

    return NextResponse.json({
      sucesso: true,
      mensagem: 'Mensagem enviada com sucesso!',
      id: result.lastInsertRowid
    })

  } catch (error) {
    console.error('Erro ao salvar contato:', error)
    return NextResponse.json(
      { error: 'Erro ao enviar mensagem' },
      { status: 500 }
    )
  }
}