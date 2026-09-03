'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Camera, Heart, PartyPopper, Video, Smartphone, Star, MessageCircle, Mail, Globe } from 'lucide-react'

export default function Home() {
  // Estados do formulário
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    tipo: '',
    dataEvento: '',
    mensagem: ''
  })
  const [enviando, setEnviando] = useState(false)
  const [mensagemStatus, setMensagemStatus] = useState('')

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setEnviando(true)
    setMensagemStatus('')

    try {
      const resposta = await fetch('/api/contato', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const dados = await resposta.json()

      if (resposta.ok) {
        setMensagemStatus('✅ Mensagem enviada com sucesso! Entraremos em contato em breve.')
        setFormData({ nome: '', email: '', tipo: '', dataEvento: '', mensagem: '' })
      } else {
        setMensagemStatus(`❌ Erro: ${dados.error}`)
      }
    } catch (erro) {
      setMensagemStatus('❌ Erro ao enviar mensagem. Tente novamente.')
    } finally {
      setEnviando(false)
      setTimeout(() => setMensagemStatus(''), 5000)
    }
  }

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      
      {/* ========== HERO SECTION ========== */}
      <section className="relative h-screen w-full overflow-hidden">
        <Image 
          src="https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=1920&q=80"
          alt="Fotógrafa profissional"
          fill
          className="object-cover brightness-50"
          priority
        />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
          <h1 className="text-6xl md:text-8xl font-serif italic text-white mb-6 tracking-wide">
            bysafirah
          </h1>

          <div className="flex items-center gap-4 mb-8">
            <div className="h-px w-20 md:w-32 bg-gradient-to-r from-transparent to-[#c9a882]"></div>
            <Camera className="w-6 h-6 text-[#c9a882]" />
            <div className="h-px w-20 md:w-32 bg-gradient-to-l from-transparent to-[#c9a882]"></div>
          </div>

          <h2 className="text-2xl md:text-4xl font-light tracking-[0.3em] text-white uppercase mb-2">
            Transformando Momentos
          </h2>

          <h3 className="text-3xl md:text-5xl font-serif italic text-[#c9a882] mb-10">
            em memórias
          </h3>

          <p className="text-xs md:text-sm tracking-[0.3em] mb-10 uppercase text-white/80">
            Fotografia & Filmagem com propósito e amor
          </p>

          <div className="flex gap-4 flex-wrap justify-center">
            <Link 
              href="/galeria" 
              className="bg-[#c9a882] text-white px-8 py-3 text-sm tracking-widest hover:bg-[#b8956f] transition duration-300 uppercase"
            >
              Ver Portfólio
            </Link>
            <Link 
              href="#contato" 
              className="border-2 border-white text-white px-8 py-3 text-sm tracking-widest hover:bg-white hover:text-black transition duration-300 uppercase"
            >
              Entre em Contato
            </Link>
          </div>
        </div>
      </section>

      {/* ========== SOBRE MIM ========== */}
      <section id="sobre" className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-[4/5] overflow-hidden rounded-lg">
              <Image 
                src="/images/foto5.png" 
                alt="Sobre bysafirah"
                fill
                className="object-cover"
              />
            </div>
            
            <div>
              <p className="text-sm tracking-[0.3em] text-[#c9a882] uppercase mb-4">
                Sobre Mim
              </p>
              <h2 className="text-4xl md:text-5xl font-light text-gray-800 mb-2">
                Prazer, eu sou
              </h2>
              <h3 className="text-4xl md:text-5xl italic text-[#c9a882] mb-6">
                bysafirah ♡
              </h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Sou fotógrafa e videomaker apaixonada por contar histórias reais através da imagem. 
                Acredito que cada olhar, cada detalhe e cada gesto carregam significado — e é isso 
                que me inspira todos os dias.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                Meu objetivo é eternizar momentos de forma leve, autêntica e emocionante.
              </p>
              <Link 
                href="/sobre" 
                className="inline-block border-2 border-[#c9a882] text-[#c9a882] px-8 py-3 text-sm tracking-widest hover:bg-[#c9a882] hover:text-white transition duration-300 uppercase"
              >
                Me Conhecer Melhor
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========== PORTFÓLIO ========== */}
      <section id="portfolio" className="py-20 px-6 bg-[#faf8f5]">
        <div className="container mx-auto max-w-6xl">
          <p className="text-sm tracking-[0.3em] text-[#c9a882] uppercase text-center mb-4">
            Portfólio
          </p>
          <h2 className="text-4xl md:text-5xl font-light text-center text-gray-800 mb-12 italic">
            Nossos Trabalhos
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
            {[
              { nome: 'Casamentos', img: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80' },
              { nome: 'Ensaios', img: 'https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?w=400&q=80' },
              { nome: 'Família', img: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400&q=80' },
              { nome: 'Eventos', img: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&q=80' },
              { nome: 'Filmagem', img: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&q=80' },
              { nome: 'Conteúdo', img: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&q=80' },
            ].map((cat, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="relative aspect-[4/5] overflow-hidden rounded-lg mb-3">
                  <Image 
                    src={cat.img} 
                    alt={cat.nome}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-110"
                  />
                </div>
                <p className="text-center text-sm tracking-widest uppercase text-gray-700">
                  {cat.nome}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link 
              href="/galeria" 
              className="inline-block border-2 border-[#c9a882] text-[#c9a882] px-8 py-3 text-sm tracking-widest hover:bg-[#c9a882] hover:text-white transition duration-300 uppercase"
            >
              Ver Todas as Fotos
            </Link>
          </div>
        </div>
      </section>

      {/* ========== SERVIÇOS ========== */}
      <section id="servicos" className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <p className="text-sm tracking-[0.3em] text-[#c9a882] uppercase text-center mb-4">
            Serviços
          </p>
          <h2 className="text-4xl md:text-5xl font-light text-center text-gray-800 mb-12 italic">
            O que Oferecemos
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              { 
                icon: <Camera className="w-10 h-10" />,
                nome: 'Ensaios',
                desc: 'Ensaios individuais, de casal, gestante, família e infantil.' 
              },
              { 
                icon: <Heart className="w-10 h-10" />,
                nome: 'Casamentos',
                desc: 'Cobertura completa do seu grande dia com olhar atento aos detalhes.' 
              },
              { 
                icon: <PartyPopper className="w-10 h-10" />,
                nome: 'Eventos',
                desc: 'Aniversários, confraternizações e eventos corporativos com fotos naturais.' 
              },
              { 
                icon: <Video className="w-10 h-10" />,
                nome: 'Filmagem',
                desc: 'Vídeos institucionais, eventos, cobertura e conteúdo para redes sociais.' 
              },
              { 
                icon: <Smartphone className="w-10 h-10" />,
                nome: 'Conteúdo',
                desc: 'Produção de fotos e vídeos para marcas e redes sociais com estratégia.' 
              },
            ].map((servico, index) => (
              <div 
                key={index} 
                className="border border-gray-200 p-6 text-center hover:border-[#c9a882] transition duration-300 group"
              >
                <div className="text-[#c9a882] flex justify-center mb-4 group-hover:scale-110 transition">
                  {servico.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 uppercase tracking-wider">
                  {servico.nome}
                </h3>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  {servico.desc}
                </p>
                <Link 
                  href="#contato" 
                  className="text-xs tracking-widest text-[#c9a882] uppercase hover:text-[#b8956f] transition"
                >
                  Solicitar Orçamento →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== DEPOIMENTOS ========== */}
      <section id="depoimento" className="py-20 px-6 bg-gray-900 text-white">
        <div className="container mx-auto max-w-6xl">
          <p className="text-sm tracking-[0.3em] text-[#c9a882] uppercase text-center mb-4">
            Depoimentos
          </p>
          <h2 className="text-4xl md:text-5xl font-light text-center mb-12 italic">
            O que dizem sobre nós
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                texto: '"A Safira tem um olhar único! Conseguiu registrar cada emoção do nosso casamento de forma incrível e inesquecível."',
                autor: 'JULIANA & PEDRO'
              },
              {
                texto: '"As fotos do ensaio ficaram perfeitas! Ela é dedicada, atenciosa e tem um talento incrível. Superou todas as nossas expectativas."',
                autor: 'LARISSA M.'
              },
              {
                texto: '"Profissional dedicada, atenciosa e muito talentosa! Super indico para qualquer ocasião."',
                autor: 'CARLA SOUZA'
              },
            ].map((dep, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4 text-[#c9a882]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 italic mb-4 leading-relaxed">
                  {dep.texto}
                </p>
                <p className="text-sm tracking-widest text-[#c9a882] uppercase">
                  {dep.autor}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== BASTIDORES ========== */}
      <section className="py-20 px-6 bg-[#faf8f5]">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
            <div>
              <p className="text-sm tracking-[0.3em] text-[#c9a882] uppercase mb-4">
                Bastidores
              </p>
              <h2 className="text-4xl md:text-5xl font-light text-gray-800 mb-6 italic">
                Um pouquinho do que<br />acontece por trás das câmeras.
              </h2>
              <Link 
                href="/galeria" 
                className="inline-block border-2 border-[#c9a882] text-[#c9a882] px-8 py-3 text-sm tracking-widest hover:bg-[#c9a882] hover:text-white transition duration-300 uppercase"
              >
                Ver Mais
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=400&q=80',
                'https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?w=400&q=80',
                'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&q=80',
                'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=400&q=80',
              ].map((img, index) => (
                <div key={index} className="relative aspect-square overflow-hidden rounded-lg">
                  <Image 
                    src={img} 
                    alt="Bastidores"
                    fill
                    className="object-cover hover:scale-110 transition duration-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========== CONTATO ========== */}
      <section id="contato" className="py-20 px-6 bg-white scroll-mt-24">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-light text-gray-800 mb-4 italic">
                Vamos Conversar?
              </h2>
              <p className="text-gray-600 mb-8">
                Será um prazer registrar o seu momento!
              </p>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  
                          {/* WhatsApp com Link e Mensagem Pré-definida */}
                          <a 
                            href="https://wa.me/5565992163241?text=Olá,%20Gostaria%20de%20conhecer%20um%20pouco%20mais%20do%20seu%20trabalho...!" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-4 group"
                          >
                            <div className="w-12 h-12 bg-[#c9a882] rounded-full flex items-center justify-center text-white group-hover:bg-[#b8956f] transition duration-300">
                              <MessageCircle className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-xs tracking-widest text-gray-500 uppercase">WhatsApp</p>
                              <p className="text-gray-800 group-hover:text-[#c9a882] transition duration-300">
                                (65) 99216-3241
                              </p>
                            </div>
                          </a>

                </div>

                <div className="flex items-center gap-4">
          
                  <div>
                    {/* E-mail com Link (opcional, mas recomendado) */}
                    <a 
                      href="mailto:safirahnogueira6@gmail.com" 
                      className="flex items-center gap-4 group"
                    >
                      <div className="w-12 h-12 bg-[#c9a882] rounded-full flex items-center justify-center text-white group-hover:bg-[#b8956f] transition duration-300">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs tracking-widest text-gray-500 uppercase">E-mail</p>
                        <p className="text-gray-800 group-hover:text-[#c9a882] transition duration-300">
                          safirahnogueira6@gmail.com
                        </p>
                      </div>
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
           
                  <div>
                        {/* Instagram com Link */}
                          <a 
                            href="https://instagram.com/by.safirah" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-4 group"
                          >
                            <div className="w-12 h-12 bg-[#c9a882] rounded-full flex items-center justify-center text-white group-hover:bg-[#b8956f] transition duration-300">
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                              </svg>
                            </div>
                            <div>
                              <p className="text-xs tracking-widest text-gray-500 uppercase">Instagram</p>
                              <p className="text-gray-800 group-hover:text-[#c9a882] transition duration-300">
                                @by.safirah
                              </p>
                            </div>
                          </a>
                  </div>
                </div>
              </div>
            </div>

              {/* FORMULÁRIO FUNCIONAL */}
          <form 
              action="https://formsubmit.co/hello.bysafirah@gmail.com" 
              method="POST"
              className="space-y-5"
            >
              {/* Configurações ocultas do FormSubmit */}
              <input type="hidden" name="_subject" value="Novo contato do site bySafirah!" />
              <input type="hidden" name="_captcha" value="true" />
              <input type="hidden" name="_template" value="table" />
              <input type="hidden" name="_next" value="http://localhost:3000/obrigado" />

              {/* Nome */}
              <div>
                <label className="block text-xs tracking-[0.2em] text-gray-700 uppercase mb-2 font-semibold">
                  Nome *
                </label>
                <input
                  type="text"
                  name="Nome"
                  placeholder="Seu nome completo"
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded focus:outline-none focus:border-[#c9a882] transition"
                />
              </div>

              {/* E-mail */}
              <div>
                <label className="block text-xs tracking-[0.2em] text-gray-700 uppercase mb-2 font-semibold">
                  E-mail *
                </label>
                <input
                  type="email"
                  name="Email"
                  placeholder="seuemail@exemplo.com"
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded focus:outline-none focus:border-[#c9a882] transition"
                />
              </div>

              {/* Tipo de Evento e Data */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs tracking-[0.2em] text-gray-700 uppercase mb-2 font-semibold">
                    Tipo de Ensaio / Evento
                  </label>
                  <input
                    type="text"
                    name="Evento"
                    placeholder="Ex: Casamento, Ensaio..."
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded focus:outline-none focus:border-[#c9a882] transition"
                  />
                </div>

                <div>
                  <label className="block text-xs tracking-[0.2em] text-gray-700 uppercase mb-2 font-semibold">
                    Data do Evento
                  </label>
                  <input
                    type="date"
                    name="Data"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded focus:outline-none focus:border-[#c9a882] transition"
                  />
                </div>
              </div>

              {/* Mensagem */}
              <div>
                <label className="block text-xs tracking-[0.2em] text-gray-700 uppercase mb-2 font-semibold">
                  Mensagem *
                </label>
                <textarea
                  name="mensagem"
                  placeholder="Conte-nos sobre o seu evento..."
                  rows={5}
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded focus:outline-none focus:border-[#c9a882] transition resize-none"
                ></textarea>
              </div>

              {/* Botão Enviar */}
              <button
                type="submit"
                className="w-full bg-[#c9a882] text-white py-3 tracking-widest hover:bg-[#b8956f]
                            transition duration-300 uppercase text-sm font-semibold"
              >
                Enviar Mensagem
              </button>
            </form>


          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="bg-gray-900 text-white py-8 px-6">
        <div className="container mx-auto max-w-6xl text-center">
          <p className="text-sm text-gray-400">
            © 2026 bysafirah. Todos os direitos reservados.
          </p>
        </div>
      </footer>

    </div>
  )
}