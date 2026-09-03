import { NextResponse } from 'next/server'
import db from '../../../../lib/db';

// GET - Listar todas as categorias
export async function GET() {
  try {
    const categorias = db.prepare('SELECT * FROM categorias ORDER BY nome ASC').all()
    return NextResponse.json(categorias)
  } catch (error) {
    console.error('Erro ao buscar categorias:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar categorias' },
      { status: 500 }
    )
  }
}

// POST - Criar nova categoria
export async function POST(request) {
  try {
    const body = await request.json()
    const { nome, descricao } = body

    if (!nome) {
      return NextResponse.json(
        { error: 'Nome é obrigatório' },
        { status: 400 }
      )
    }

    // Verificar se já existe
    const existe = db.prepare('SELECT id FROM categorias WHERE nome = ?').get(nome.trim())

    if (existe) {
      return NextResponse.json(
        { error: 'Já existe uma categoria com este nome' },
        { status: 400 }
      )
    }

    const result = db.prepare(`
      INSERT INTO categorias (nome, descricao) 
      VALUES (?, ?)
    `).run(nome.trim(), descricao?.trim() || null)

    const novaCategoria = db.prepare('SELECT * FROM categorias WHERE id = ?').get(result.lastInsertRowid)

    return NextResponse.json(novaCategoria)
  } catch (error) {
    console.error('Erro ao criar categoria:', error)
    return NextResponse.json(
      { error: 'Erro ao criar categoria' },
      { status: 500 }
    )
  }
}

// DELETE - Excluir categoria
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID não informado' },
        { status: 400 }
      )
    }

    // Verificar se há fotos usando esta categoria
    const fotosCount = db.prepare('SELECT COUNT(*) as count FROM fotos WHERE categoria_id = ?').get(id)

    if (fotosCount.count > 0) {
      return NextResponse.json(
        { error: 'Não é possível excluir: existem fotos usando esta categoria' },
        { status: 400 }
      )
    }

    db.prepare('DELETE FROM categorias WHERE id = ?').run(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao excluir categoria:', error)
    return NextResponse.json(
      { error: 'Erro ao excluir categoria' },
      { status: 500 }
    )
  }
}