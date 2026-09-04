import { NextResponse } from 'next/server'
import { query } from '../../../../lib/db.js'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(request) {
  try {
    const formData = await request.formData()
    const titulo = formData.get('titulo')
    const descricao = formData.get('descricao') || ''
    const categoriaId = parseInt(formData.get('categoriaId'))
    const destaque = formData.get('destaque') === 'true' ? 1 : 0
    const arquivos = formData.getAll('imagens')

    if (!arquivos || arquivos.length === 0) {
      return NextResponse.json({ error: 'Nenhuma imagem enviada' }, { status: 400 })
    }

    const imagesDir = path.join(process.cwd(), 'public', 'images')
    await mkdir(imagesDir, { recursive: true })

    let sucesso = 0

    for (let i = 0; i < arquivos.length; i++) {
      const arquivo = arquivos[i]
      const timestamp = Date.now() + i
      const extensao = arquivo.name.split('.').pop()
      const nomeArquivo = `foto-${timestamp}.${extensao}`
      const caminhoRelativo = `/images/${nomeArquivo}`
      const caminhoAbsoluto = path.join(imagesDir, nomeArquivo)

      const bytes = await arquivo.arrayBuffer()
      const buffer = Buffer.from(bytes)
      await writeFile(caminhoAbsoluto, buffer)

      const tituloFinal = arquivos.length > 1 ? `${titulo} (${i + 1})` : titulo

      await query(
        'INSERT INTO fotos (titulo, descricao, categoria_id, caminho, destaque) VALUES ($1, $2, $3, $4, $5)',
        [tituloFinal, descricao, categoriaId, caminhoRelativo, destaque]
      )
      sucesso++
    }

    return NextResponse.json({ sucesso: true, quantidade: sucesso })
  } catch (error) {
    console.error('Erro no upload:', error)
    return NextResponse.json({ error: 'Erro ao fazer upload' }, { status: 500 })
  }
}