'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))
  }, [])

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <header className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-red-500">JTMC</h1>
        <div className="flex gap-3">
          {user ? (
            <>
              <Link href="/compte" className="px-4 py-2 text-sm border border-gray-700 rounded-lg hover:border-gray-500">
                Mon compte
              </Link>
              <Link href="/vendre" className="px-4 py-2 text-sm bg-red-500 rounded-lg hover:bg-red-600">
                + Vendre
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className="px-4 py-2 text-sm border border-gray-700 rounded-lg hover:border-gray-500">
                Connexion
              </Link>
              <Link href="/register" className="px-4 py-2 text-sm bg-red-500 rounded-lg hover:bg-red-600">
                S'inscrire
              </Link>
            </>
          )}
        </div>
      </header>

      <section className="text-center py-20 px-6">
        <h2 className="text-4xl font-bold mb-4">Des fichiers 3D prêts à imprimer</h2>
        <p className="text-gray-400 mb-8">Achetez et vendez des plans STL, OBJ et 3MF — téléchargement instantané</p>
        <Link href="/catalogue" className="px-8 py-3 bg-red-500 rounded-lg text-lg font-medium hover:bg-red-600">
          Voir le catalogue →
        </Link>
      </section>

      <section className="flex justify-center gap-16 py-10 border-t border-gray-800">
        <div className="text-center">
          <p className="text-3xl font-bold">500+</p>
          <p className="text-gray-400 text-sm">Fichiers disponibles</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold">100%</p>
          <p className="text-gray-400 text-sm">Numérique</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold">🇫🇷</p>
          <p className="text-gray-400 text-sm">Créateurs français</p>
        </div>
      </section>
    </main>
  )
}