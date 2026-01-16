import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import AxiosHelper from '../api/axios_helper'
import useAuth from '../hooks/useAuth'

export default function ProductPage(){
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [files, setFiles] = useState([])
  const { isAuthenticated } = useAuth()

  useEffect(()=>{ (async ()=>{
    try{ const res = await AxiosHelper.get(`/products/${id}`); setProduct(res.data) }catch(e){ setError('Not found') } finally { setLoading(false)} })() },[id])

  const handleFiles = (e) => {
    const chosen = Array.from(e.target.files).slice(0, 5 - (product?.images?.length || 0))
    setFiles(chosen)
  }
  
  const upload = async () => {
    if(files.length===0) return
    const fd = new FormData()
    files.forEach(f => fd.append('images', f))
    try {
      const res = await AxiosHelper.post(`/products/${id}/images`, fd, { headers: {'Content-Type': 'multipart/form-data'} })
      setProduct(res.data)
      setFiles([])
    } catch(e) {
      alert('Upload failed: ' + (e.response?.data || e.message))
    }
  }

  if(loading) return <div>Loading...</div>
  if(error) return <div>{error}</div>

  const images = product.images || []
  return (
    <div className="card">
      <h1 className="text-2xl font-bold mb-3">{product.name}</h1>
      <div className="grid md:grid-cols-4 gap-4">
        <div className="md:col-span-3">
          {images.length ? (
            <img src={`/images/products/${images[0].filename}`} alt={product.name} className="w-full h-96 object-cover mb-3" />
          ) : (
            <div className="h-96 bg-gray-100 flex items-center justify-center mb-3">No image</div>
          )}

          <div className="flex space-x-2">
            {images.map(img => (
              <img key={img.id} src={`/images/products/${img.filename}`} alt="" className="w-24 h-24 object-cover" />
            ))}
          </div>
        </div>

        <div className="p-4">
          <p className="mb-4">{product.description}</p>
          <div className="font-bold text-xl mb-4">€{product.price?.toFixed(2)}</div>

          {isAuthenticated && (
            <div>
              <label className="label">Add photos (max 5 total)</label>
              <input type="file" accept="image/*" multiple onChange={handleFiles} />
              <div className="mt-2">
                <button className="btn-primary mr-2" onClick={upload}>Upload</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}