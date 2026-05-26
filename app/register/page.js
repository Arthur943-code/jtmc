'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [message, setMessage] = useState('')

  async function handleRegister() {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) return setMessage(error.message)
    await supabase.from('profiles').insert({ id: data.user.id, username })
    setMessage('Compte créé ! Vérifie ton email.')
  }

  return (
    <main className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="bg-gray-900 p-8 rounded-xl w-full max-w-md">
        <h1 className="text-2xl font-bold text-white mb-6">Créer un compte</h1>
        <input className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg mb-3" placeholder="Nom d'utilisateur" onChange={e => setUsername(e.target.value)} />
        <input className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg mb-3" placeholder="Email" onChange={e => setEmail(e.target.value)} />
        <input className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg mb-6" placeholder="Mot de passe" type="password" onChange={e => setPassword(e.target.value)} />
        <button onClick={handleRegister} className="w-full bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600">S'inscrire</button>
        {message && <p className="text-green-400 mt-4 text-center">{message}</p>}
        <p className="text-gray-400 text-center mt-4">Déjà un compte ? <Link href="/login" className="text-red-400">Connexion</Link></p>
      </div>
    </main>
  )
}