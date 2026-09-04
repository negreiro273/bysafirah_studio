import { NextResponse } from 'next/server'
import { query } from '../../../../lib/db.js'

// GET - Listar
export async function GET() {
  try {
    const res = await query('SELECT * FROM categorias ORDER BY nome ASC')
    return NextResponse.json(res.rows)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar categorias' }, { status: 500 })
  }
}

// POST - Criar
export async function POST(request) {
  try {
    const { nome, descricao } = await request.json()
    const res = await query(
      'INSERT INTO categorias (nome, descricao) VALUES ($1, $2) RETURNING *', 
      [nome, descricao]
    )
    return NextResponse.json(res.rows[0])
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar categoria' }, { status: 500 })
  }
}

// DELETE - Excluir
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    await query('DELETE FROM categorias WHERE id = $1', [id])
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao excluir' }, { status: 500 })
  }
}