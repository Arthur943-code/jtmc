'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams, useRouter } from 'next/navigation'

export default function Produit() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [seller, setSeller] = useState(null)
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    async function fetchData() {
      const { data: p } = await supabase.from('products').select('*').eq('id', id).single()
      setProduct(p)
      if (p) {
        const { data: s } = await supabase.from('profiles').select('username').eq('id', p.seller_id).single()
        setSeller(s)
      }
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    fetchData()
  }, [id])

  async function handleBuy() {
    console.log('handleBuy appelé', user, product)
    if (!user) return router.push('/login')
    setLoading(true)

    if (product.price === 0) {
      setMessage('✅ Fichier gratuit — téléchargement disponible !')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          title: product.title,
          price: product.price
        })
      })
      const data = await res.json()
      console.log('Réponse Stripe:', data)
      if (data.url) {
        window.location.href = data.url
      } else {
        setMessage('Erreur: ' + data.error)
      }
    } catch (err) {
      console.log('Erreur fetch:', err)
      setMessage('Erreur: ' + err.message)
    }
    setLoading(false)
  }

  if (!product) return <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">Chargement...</div>

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <header className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <h1 className="text-2xl font-bold text-red-500 cursor-pointer" onClick={() => router.push('/')}>JTMC</h1>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10 grid md:grid-cols-2 gap-10">
        <div className="aspect-square bg-gray-800 rounded-xl flex items-center justify-center text-8xl overflow-hidden">
          {product.preview_url ? <img src={product.preview_url} className="w-full h-full object-cover" /> : '📦'}
        </div>

        <div>
          <p className="text-gray-400 text-sm mb-2">{product.category} · {product.formats?.join(', ')}</p>
          <h2 className="text-2xl font-bold mb-2">{product.title}</h2>
          <p className="text-gray-400 text-sm mb-4">Par <span className="text-white">{seller?.username}</span></p>
          <p className="text-gray-300 mb-6">{product.description}</p>

          <div className="bg-gray-900 rounded-xl p-6">
            <p className="text-3xl font-bold text-red-400 mb-4">
              {product.price === 0 ? 'Gratuit' : product.price + ' €'}
            </p>
            <button onClick={handleBuy} disabled={loading} className="w-full bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600 disabled:opacity-50">
              {loading ? 'Chargement...' : product.price === 0 ? '⬇️ Télécharger gratuitement' : '💳 Acheter maintenant'}
            </button>
            {message && <p className="text-green-400 mt-4 text-center text-sm">{message}</p>}
          </div>

          <div className="mt-6 bg-gray-900 rounded-xl p-4">
            <p className="text-sm text-gray-400">✅ Téléchargement instantané après achat</p>
            <p className="text-sm text-gray-400 mt-1">✅ Compatible toutes imprimantes 3D</p>
            <p className="text-sm text-gray-400 mt-1">✅ Fichier {product.formats?.join(', ')}</p>
          </div>
        </div>
      </div>
    </main>
  )
}