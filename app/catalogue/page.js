'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function Catalogue() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    async function fetchProducts() {
      const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
      setProducts(data || [])
    }
    fetchProducts()
  }, [])

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <header className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-red-500">JTMC</Link>
        <Link href="/vendre" className="px-4 py-2 bg-red-500 rounded-lg text-sm font-medium hover:bg-red-600">
          + Vendre un fichier
        </Link>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold mb-8">Catalogue</h2>

        {products.length === 0 && (
          <div className="text-center text-gray-400 py-20">
            <p className="text-5xl mb-4">📁</p>
            <p>Aucun fichier pour l'instant.</p>
            <Link href="/vendre" className="text-red-400 mt-2 inline-block">Sois le premier à vendre !</Link>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(p => (
            <Link href={`/produit/${p.id}`} key={p.id} className="bg-gray-900 rounded-xl overflow-hidden hover:scale-105 transition-transform">
              <div className="aspect-square bg-gray-800 flex items-center justify-center text-5xl">
                {p.preview_url ? <img src={p.preview_url} className="w-full h-full object-cover" /> : '📦'}
              </div>
              <div className="p-4">
                <p className="font-medium mb-1 truncate">{p.title}</p>
                <p className="text-xs text-gray-400 mb-2">{p.formats?.join(', ')}</p>
                <p className="text-red-400 font-bold">{p.price === 0 ? 'Gratuit' : p.price + ' €'}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}