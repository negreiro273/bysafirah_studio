import { NextResponse } from 'next/server'
import db from '../../../../lib/db'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(request) {
  try {
    const formData = await request.formData()
    
    const titulo = formData.get('titulo')
    const descricao = formData.get('descricao') || ''
    const categoriaId = parseInt(formData.get('categoriaId'))
    const destaque = formData.get('destaque') === 'true' ? 1 : 0
    
    // Pegar todos os arquivos
    const arquivos = formData.getAll('imagens')

    if (!arquivos || arquivos.length === 0) {
      return NextResponse.json(
        { error: 'Nenhuma imagem enviada' },
        { status: 400 }
      )
    }

    if (!categoriaId || isNaN(categoriaId)) {
      return NextResponse.json(
        { error: 'Categoria inválida' },
        { status: 400 }
      )
    }

    // Verificar se a categoria existe
    const categoriaExiste = db.prepare('SELECT id FROM categorias WHERE id = ?').get(categoriaId)

    if (!categoriaExiste) {
      return NextResponse.json(
        { error: 'Categoria não encontrada' },
        { status: 400 }
      )
    }

    // Garantir que a pasta existe
    const imagesDir = path.join(process.cwd(), 'public', 'images')
    await mkdir(imagesDir, { recursive: true })

    let sucesso = 0
    const erros = []

    // Processar cada arquivo
    for (let i = 0; i < arquivos.length; i++) {
      const arquivo = arquivos[i]
      
      try {
        // Gerar nome único
        const timestamp = Date.now() + i
        const extensao = arquivo.name.split('.').pop()
        const nomeArquivo = `foto-${timestamp}.${extensao}`
        const caminhoRelativo = `/images/${nomeArquivo}`
        const caminhoAbsoluto = path.join(imagesDir, nomeArquivo)

        // Ler e salvar arquivo
        const bytes = await arquivo.arrayBuffer()
        const buffer = Buffer.from(bytes)
        await writeFile(caminhoAbsoluto, buffer)

        // Gerar título com número sequencial se houver múltiplos arquivos
        const tituloFinal = arquivos.length > 1 ? `${titulo} (${i + 1})` : titulo

        // Salvar no banco - GARANTIR que todos os valores são tipos válidos
        db.prepare(`
          INSERT INTO fotos (titulo, descricao, categoria_id, caminho, destaque)
          VALUES (?, ?, ?, ?, ?)
        `).run(
          String(tituloFinal),           // Garantir string
          String(descricao),             // Garantir string
          Number(categoriaId),           // Garantir número
          String(caminhoRelativo),       // Garantir string
          Number(destaque)               // Garantir número (0 ou 1)
        )

        sucesso++
      } catch (erro) {
        console.error(`Erro ao processar ${arquivo.name}:`, erro)
        erros.push(arquivo.name)
      }
    }

    if (sucesso === 0) {
      return NextResponse.json(
        { error: 'Nenhuma foto pôde ser cadastrada', erros },
        { status: 500 }
      )
    }

    return NextResponse.json({
      sucesso: true,
      quantidade: sucesso,
      total: arquivos.length,
      erros: erros.length > 0 ? erros : undefined
    })

  } catch (error) {
    console.error('Erro no upload:', error)
    return NextResponse.json(
      { error: 'Erro ao fazer upload das imagens' },
      { status: 500 }
    )
  }
}