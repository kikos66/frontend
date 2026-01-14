import { Link } from 'react-router-dom'
import { useCart } from './context/CartContext'

export default function ProductCard({ product }){
    const { addToCart } = useCart()
    return (
        <div className="card">
            <div className="h-48 bg-gray-100 flex items-center justify-center mb-3">Image</div>
            <h3 className="font-semibold">{product.name}</h3>
            <p className="text-sm text-gray-600">{product.description}</p>
            <div className="mt-3 flex items-center justify-between">
                <div className="font-bold">${product.price?.toFixed?.(2) ?? '—'}</div>
                <div className="flex space-x-2">
                    <Link to={`/products/${product.id}`} className="text-sm underline">Details</Link>
                    <button className="btn-primary text-sm" onClick={()=>addToCart(product)}>Add</button>
                </div>
            </div>
        </div>
    )
}
