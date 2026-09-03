import { NextResponse } from 'next/server'
import db from '../../../../lib/db'
import { unlink } from 'fs/promises'
import path from 'path'

// GET - Listar todas as fotos
export async function GET() {
  try {
    const fotos = db.prepare(`
      SELECT fotos.*, categorias.nome as categoria_nome 
      FROM fotos 
      INNER JOIN categorias ON fotos.categoria_id = categorias.id 
      ORDER BY fotos.created_at DESC
    `).all()
    
    return NextResponse.json(fotos)
  } catch (error) {
    console.error('Erro ao buscar fotos:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar fotos' },
      { status: 500 }
    )
  }
}

// DELETE - Excluir uma foto
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

    // Buscar a foto para pegar o caminho do arquivo
    const foto = db.prepare('SELECT * FROM fotos WHERE id = ?').get(id)

    if (!foto) {
      return NextResponse.json(
        { error: 'Foto não encontrada' },
        { status: 404 }
      )
    }

    // Deletar o arquivo físico da pasta public/images
    try {
      const caminhoAbsoluto = path.join(process.cwd(), 'public', foto.caminho)
      await unlink(caminhoAbsoluto)
    } catch (erro) {
      console.warn('Não foi possível deletar o arquivo físico:', erro)
    }

    // Deletar do banco de dados
    db.prepare('DELETE FROM fotos WHERE id = ?').run(id)

    return NextResponse.json({ sucesso: true })
  } catch (error) {
    console.error('Erro ao excluir foto:', error)
    return NextResponse.json(
      { error: 'Erro ao excluir foto' },
      { status: 500 }
    )
  }
}