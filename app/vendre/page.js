'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Vendre() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('')
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return setMessage('Tu dois être connecté pour vendre.')

    let file_url = null
    let preview_url = null

    if (file) {
      const { data } = await supabase.storage.from('files-3d').upload(`${user.id}/${file.name}`, file)
      file_url = data?.path
    }

    if (preview) {
      const { data } = await supabase.storage.from('previews').upload(`${user.id}/${preview.name}`, preview)
      const { data: url } = supabase.storage.from('previews').getPublicUrl(data?.path)
      preview_url = url.publicUrl
    }

    const { error } = await supabase.from('products').insert({
      seller_id: user.id,
      title,
      description,
      price: parseFloat(price) || 0,
      category,
      formats: file ? [file.name.split('.').pop().toUpperCase()] : [],
      file_url,
      preview_url
    })

    if (error) return setMessage('Erreur : ' + error.message)
    setMessage('Fichier mis en vente !')
    setTimeout(() => router.push('/catalogue'), 1500)
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <header className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <h1 className="text-2xl font-bold text-red-500">JTMC — Vendre un fichier</h1>
      </header>

      <div className="max-w-xl mx-auto px-6 py-10">
        <h2 className="text-xl font-bold mb-6">Mettre en vente un fichier 3D</h2>

        <input className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg mb-3" placeholder="Titre du fichier" onChange={e => setTitle(e.target.value)} />
        <textarea className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg mb-3 h-28" placeholder="Description" onChange={e => setDescription(e.target.value)} />
        
        <select className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg mb-3" onChange={e => setCategory(e.target.value)}>
          <option value="">Catégorie</option>
          <option value="deco">Décoration</option>
          <option value="jeux">Jeux & Figurines</option>
          <option value="maison">Maison</option>
          <option value="tech">Tech</option>
          <option value="bijoux">Bijoux</option>
        </select>

        <input className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg mb-3" placeholder="Prix en € (0 = gratuit)" type="number" onChange={e => setPrice(e.target.value)} />

        <div className="mb-3">
          <p className="text-gray-400 text-sm mb-2">Image d'aperçu (JPG, PNG)</p>
          <input type="file" accept="image/*" className="text-gray-300" onChange={e => setPreview(e.target.files[0])} />
        </div>

        <div className="mb-6">
          <p className="text-gray-400 text-sm mb-2">Fichier 3D (STL, OBJ, 3MF)</p>
          <input type="file" accept=".stl,.obj,.3mf" className="text-gray-300" onChange={e => setFile(e.target.files[0])} />
        </div>

        <button onClick={handleSubmit} disabled={loading} className="w-full bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600 disabled:opacity-50">
          {loading ? 'Upload en cours...' : 'Mettre en vente'}
        </button>

        {message && <p className="text-green-400 mt-4 text-center">{message}</p>}
      </div>
    </main>
  )
}