import { NextResponse } from 'next/server'
import { query } from '../../../../lib/db.js'
import { unlink } from 'fs/promises'
import path from 'path'

// GET - Listar
export async function GET() {
  try {
    const res = await query(`
      SELECT fotos.*, categorias.nome as categoria_nome 
      FROM fotos 
      INNER JOIN categorias ON fotos.categoria_id = categorias.id 
      ORDER BY fotos.created_at DESC
    `)
    return NextResponse.json(res.rows)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar fotos' }, { status: 500 })
  }
}

// DELETE - Excluir
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    // Buscar caminho para apagar o arquivo físico
    const res = await query('SELECT caminho FROM fotos WHERE id = $1', [id])
    if (res.rows.length > 0) {
      const foto = res.rows[0]
      try {
        const caminhoAbsoluto = path.join(process.cwd(), 'public', foto.caminho)
        await unlink(caminhoAbsoluto)
      } catch (e) { console.warn('Arquivo físico não encontrado', e) }
    }

    await query('DELETE FROM fotos WHERE id = $1', [id])
    return NextResponse.json({ sucesso: true })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao excluir' }, { status: 500 })
  }
}