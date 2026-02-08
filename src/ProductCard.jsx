import { Link } from 'react-router-dom'
import { useCart } from './context/CartContext'

export default function ProductCard({ product }){
    const thumbnailUrl  = product.images && product.images.length ?
     `/images/products/${product.images[0].filename}` : "/placeholder_image.png";
    const { addToCart } = useCart()
    return (
        <div className="card">
            <div className="h-48 bg-gray-100 flex items-center justify-center mb-3">
                <img src={thumbnailUrl} alt={product.name} className="object-contain h-full w-full" />
            </div>
            {product.owner && (
                <div className="muted-text">by {product.owner.username}</div>
            )}
            <h3 className="font-semibold">{product.name}</h3>
            <p className="muted-text line-clamp-1">{product.description}</p>
            <div className="mt-3 flex items-center justify-between">
                {product.quantity !== undefined && (
                    <div className="muted-text">Stock: {product.quantity}</div>
                )}
                <div className="font-bold">€{product.price?.toFixed?.(2) ?? '—'}</div>
                <div className="flex space-x-2">
                    <Link to={`/products/${product.id}`} className="text-sm underline">Details</Link>
                    <button
                        className="btn-primary text-sm"
                        onClick={() => addToCart(product, 1)}
                        >
                        Add
                    </button>
                </div>
            </div>
        </div>
    )
}
