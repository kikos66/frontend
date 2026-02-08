import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import AxiosHelper from '../api/axios_helper'
import useAuth from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import CommentAPI from '../api/comment_api';
import CommentList from '../Components/CommentList';

export default function ProductPage(){
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [files, setFiles] = useState([])
  const [comments, setComments] = useState([])
  const { addToCart } = useCart()
  const { currentUser, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [selectedQty, setSelectedQty] = useState(1);

  const isOwner = isAuthenticated && currentUser?.id === product?.owner?.id

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  useEffect(() => {
    (async () => {
      try {
        const res = await AxiosHelper.get(`/products/${id}`);
        setProduct(res.data);
        setSelectedIndex(0);
      } catch (e) {
        setError('Product not found');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  useEffect(() => {
    (async () => {
      if (!id) return;
      try {
        const data = await CommentAPI.fetchComments(id);
        setComments(data);
      } catch (e) {
        console.error("Failed to load comments", e);
      }
    })();
  }, [id]);

  const handleFiles = (e) => {
    const chosen = Array.from(e.target.files).slice(0, 5 - (product?.images?.length || 0))
    setFiles(chosen)
  }

  const upload = async () => {
    if(files.length===0) return;
    const fd = new FormData();
    files.forEach(f => fd.append('images', f));
    try {
      const res = await AxiosHelper.post(`/products/${id}/images`, fd, { headers: {'Content-Type': 'multipart/form-data'} })
      setProduct(res.data);
      setFiles([]);
      setSelectedIndex(0);
    } catch(e) {
      alert('Upload failed: ' + (e.response?.data || e.message));
    }
  }

  const handleDeleteProduct = async () => {
    if (!confirm("Delete this product?")) return;
    try {
      await AxiosHelper.delete(`/products/${product.id}`);
      navigate('/');
    } catch (e) {
      alert('Delete failed');
      console.error(e);
    }
  }

  const onAddToCart = () => {
    if (!product) return;
    addToCart(product);
    alert('Added to cart');
  }

  const images = product?.images || []

  const prevImage = () => setSelectedIndex(i => Math.max(0, i - 1))
  const nextImage = () => setSelectedIndex(i => Math.min(images.length - 1, i + 1))
  const openLightbox = (index) => { setSelectedIndex(index); setLightboxOpen(true) }

  if(loading) return <div>Loading...</div>
  if(error) return <div>{error}</div>
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">{product.name}</h1>
          {product.owner && (
            <Link to={`/profile/${product.owner.id}`} className="flex items-center gap-3">
              <img
                src={product.owner.profilePicture ? `/images/profiles/${product.owner.profilePicture}` : "/placeholder.png"}
                alt={product.owner.username}
                className="w-10 h-10 rounded-full object-cover border"
                title={`View ${product.owner.username}`}
              />
              <div className="muted-text">{product.owner.username}</div>
            </Link>
          )}
        </div>

        {/* Stock & add-to-cart */}
        <div className="flex items-center gap-4 mb-4">
          <div>
            <div className="muted-text">In stock</div>
            <div className="font-medium">{product.quantity ?? 0}</div>
          </div>

          {!isOwner && (product.quantity ?? 0) > 0 && (
            <div className="flex items-center gap-2">
              <label className="label">Quantity</label>
              <select
                className="input-field"
                value={selectedQty}
                onChange={(e) => setSelectedQty(Number(e.target.value))}
              >
                {Array.from({ length: Math.min(product.quantity ?? 0, 10) }, (_, i) => i + 1)
                  .map(n => <option key={n} value={n}>{n}</option>)}
              </select>

              <button
                className="btn-primary ml-2"
                onClick={() => {
                  addToCart(product, selectedQty);
                  alert('Added to cart');
                }}
              >
              Add to cart
            </button>
            </div>
          )}

          {(!isOwner && (product.quantity ?? 0) === 0) && (
            <div className="text-red-600">Out of stock</div>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        {/* gallery + description */}
        <div className="md:col-span-3">
          {/* main image area */}
          <div className="relative mb-3 bg-gray-100 h-96 flex items-center justify-center overflow-hidden">
            {images.length ? (
              <>
                <img
                  src={`/images/products/${images[selectedIndex].filename}`}
                  alt={product.name}
                  className="w-full h-full object-contain cursor-zoom-in"
                  onClick={() => openLightbox(selectedIndex)}
                />

                {/* prev/next */}
                <button
                  onClick={prevImage}
                  disabled={selectedIndex === 0}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow"
                  aria-label="Previous"
                >
                  ‹
                </button>
                <button
                  onClick={nextImage}
                  disabled={selectedIndex === images.length - 1}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow"
                  aria-label="Next"
                >
                  ›
                </button>
              </>
            ) : (
              <img
                src="/placeholder_image.png"
                alt="No image available"
                className="w-full h-full object-contain opacity-70"
              />
            )}
          </div>

          {/* thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 mb-3">
              {images.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedIndex(idx)}
                  className={`w-20 h-20 overflow-hidden rounded border ${idx === selectedIndex ? 'ring-2 ring-offset-2 ring-army-600' : 'border-gray-200'}`}
                >
                  <img src={`/images/products/${img.filename}`} alt={`thumb-${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <p className="mt-3">{product.description}</p>
          <div className="price-tag">€{product.price?.toFixed(2)}</div>

          <CommentList productId={product.id} currentUser={currentUser} />
        </div>

        {/* right column: meta + upload (owner) */}
        <div className="p-4">
          <div className="mb-4">
            <div className="muted-text">Category</div>
            <div className="font-medium">{product.category}</div>
          </div>

          <div className="mb-4">
            <div className="muted-text">Condition</div>
            <div className="font-medium">{product.condition}</div>
          </div>

          <div className="mb-4">
            <div className="muted-text">Seller</div>
            <div className="font-medium">{product.owner?.username}</div>
          </div>

          {isOwner && (
            <>
              <label className="label">Add photos (max 5 total)</label>
              <input className="link-muted" type="file" accept="image/*" multiple onChange={handleFiles} />
              <div className="mt-2">
                <button className="btn-primary mr-2" onClick={upload}>Upload</button>
              </div>
              <div className="mt-2">
                <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  onClick={handleDeleteProduct}>Delete</button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* simple lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <img
            src={`/images/products/${images[selectedIndex].filename}`}
            alt="lightbox"
            className="max-h-full max-w-full object-contain"
          />
        </div>
      )}
    </div>
  )
}