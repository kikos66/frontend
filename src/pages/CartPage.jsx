import { useCart } from '../context/CartContext'

export default function CartPage(){
    const { cart, removeFromCart, clearCart } = useCart()


    if(cart.length === 0) return <div className="card">Your cart is empty</div>


    const total = cart.reduce((s, i) => s + (i.price || 0), 0)


    return (
        <div className="card">
            <h1 className="text-2xl font-bold text-primary mb-4">Your Cart</h1>
            <ul>
                {cart.map(item => (
                <li key={item.id} className="flex justify-between py-2 border-b">
                    <div>{item.name}</div>
                    <div className="flex items-center gap-3">
                        <div>${item.price?.toFixed(2) ?? '—'}</div>
                        <button className="text-sm text-red-600" onClick={()=>removeFromCart(item.id)}>Remove</button>
                    </div>
                </li>
                ))}
            </ul>
            <div className="mt-4 flex justify-between items-center">
                <strong>Total: ${total.toFixed(2)}</strong>
                <div>
                    <button className="btn-primary mr-2">Checkout</button>
                    <button className="text-sm" onClick={()=>clearCart()}>Clear</button>
                </div>
            </div>
        </div>
    )
}