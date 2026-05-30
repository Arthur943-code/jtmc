'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Compte() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [myProducts, setMyProducts] = useState([])
  const [myPurchases, setMyPurchases] = useState([])
  const [tab, setTab] = useState('ventes')
  const router = useRouter()

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return router.push('/login')
      setUser(user)

      const { data: p } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(p)

      const { data: products } = await supabase.from('products').select('*').eq('seller_id', user.id)
      setMyProducts(products || [])

      const { data: purchases } = await supabase.from('purchases').select('*, products(title, price, formats)').eq('buyer_id', user.id)
      setMyPurchases(purchases || [])
    }
    fetchData()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (!profile) return <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">Chargement...</div>

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <header className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-red-500">JTMC</Link>
        <button onClick={handleLogout} className="px-4 py-2 text-sm border border-gray-700 rounded-lg hover:border-gray-500">
          Déconnexion
        </button>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="bg-gray-900 rounded-xl p-6 mb-8 flex items-center gap-4">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-2xl font-bold">
            {profile.username?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="text-xl font-bold">{profile.username}</p>
            <p className="text-gray-400 text-sm">{user?.email}</p>
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <button onClick={() => setTab('ventes')} className={`px-6 py-2 rounded-lg font-medium ${tab === 'ventes' ? 'bg-red-500' : 'bg-gray-800'}`}>
            Mes ventes ({myProducts.length})
          </button>
          <button onClick={() => setTab('achats')} className={`px-6 py-2 rounded-lg font-medium ${tab === 'achats' ? 'bg-red-500' : 'bg-gray-800'}`}>
            Mes achats ({myPurchases.length})
          </button>
        </div>

        {tab === 'ventes' && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Mes fichiers en vente</h2>
              <Link href="/vendre" className="px-4 py-2 bg-red-500 rounded-lg text-sm font-medium hover:bg-red-600">+ Ajouter</Link>
            </div>
            {myProducts.length === 0 ? (
              <div className="text-center text-gray-400 py-16 bg-gray-900 rounded-xl">
                <p className="text-4xl mb-4">📁</p>
                <p>Tu n'as pas encore mis de fichiers en vente.</p>
                <Link href="/vendre" className="text-red-400 mt-2 inline-block">Commencer à vendre →</Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {myProducts.map(p => (
                  <div key={p.id} className="bg-gray-900 rounded-xl p-4">
                    <p className="font-medium truncate">{p.title}</p>
                    <p className="text-gray-400 text-sm">{p.formats?.join(', ')}</p>
                    <p className="text-red-400 font-bold mt-2">{p.price === 0 ? 'Gratuit' : p.price + ' €'}</p>
                    <p className="text-gray-400 text-xs mt-1">{p.downloads} téléchargements</p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {tab === 'achats' && (
          <>
            <h2 className="text-xl font-bold mb-4">Mes achats</h2>
            {myPurchases.length === 0 ? (
              <div className="text-center text-gray-400 py-16 bg-gray-900 rounded-xl">
                <p className="text-4xl mb-4">🛒</p>
                <p>Tu n'as pas encore acheté de fichiers.</p>
                <Link href="/catalogue" className="text-red-400 mt-2 inline-block">Voir le catalogue →</Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {myPurchases.map(p => (
                  <div key={p.id} className="bg-gray-900 rounded-xl p-4">
                    <p className="font-medium truncate">{p.products?.title}</p>
                    <p className="text-gray-400 text-sm">{p.products?.formats?.join(', ')}</p>
                    <p className="text-green-400 font-bold mt-2">{p.amount} €</p>
                    <button className="mt-2 w-full bg-blue-600 text-white py-1 rounded text-sm">⬇️ Télécharger</button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}