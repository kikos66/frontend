import React, { useEffect, useState } from 'react';
import CartAPI from '../api/cart_api';
import AxiosHelper from '../api/axios_helper';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function CartPage() {
 const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [checkoutResult, setCheckoutResult] = useState(null);
  const [error, setError] = useState(null);
  const nav = useNavigate();

  const checkout = async () => {
    if (!cart.length) return alert('Cart is empty');
    setLoading(true);
    setError(null);
    try {
        const payload = cart.map(i => ({
        productId: i.productId,
        quantity: i.quantity
        }));
        const res = await CartAPI.checkout(payload);
        setCheckoutResult(res);
        clearCart();
    } catch (e) {
        setError(e.response?.data || 'Checkout failed');
    } finally {
        setLoading(false);
    }
    };

  const total = cart.reduce((s, it) => s + (it.quantity * (it.price || 0)), 0);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {cart.length === 0 ? (
        <div className="muted-text">Your cart is empty.</div>
      ) : (
        <div className="space-y-3">
          {cart.map((it, idx) => (
            <div key={`${it.productId}-${idx}`} className="flex items-center gap-4 border rounded p-3">
              <img src={it.image ? `/images/products/${it.image}` : '/placeholder.png'} alt="" className="w-20 h-20 object-cover rounded" />
              <div className="flex-1">
                <div className="font-medium">{it.name}</div>
                <div className="price-tag">€{(it.price || 0).toFixed(2)}</div>
              </div>
              <div className="flex items-center gap-2">
                <input
                    type="number"
                    min="1"
                    value={it.quantity}
                    onChange={e => updateQuantity(it.productId, Number(e.target.value))}
                    className="input-field w-20"
                />
                <button onClick={() => removeFromCart(it.productId)}>Remove</button>
              </div>
            </div>
          ))}
          <div className="flex justify-between items-center mt-4">
            <div className="text-xl font-bold">Total: €{total.toFixed(2)}</div>
            <div>
              <button className="btn-primary mr-2" onClick={() => nav('/')}>Continue shopping</button>
              <button className="btn-secondary" onClick={checkout} disabled={loading}>
                {loading ? 'Processing...' : 'Checkout (simulate)'}
              </button>
            </div>
          </div>
          {error && <div className="text-red-600 mt-2">{error}</div>}
        </div>
      )}

      {checkoutResult && (
        <div className="mt-6 p-4 border rounded bg-green-50">
          <h2 className="font-semibold">Purchase result</h2>
          <div>Total: €{checkoutResult.total.toFixed(2)}</div>
          <div className="mt-2">
            {checkoutResult.items.map(it => (
              <div key={it.productId} className="text-sm">
                {it.quantity} × {it.name} — €{it.subtotal.toFixed(2)}
              </div>
            ))}
          </div>
          <div className="mt-2">{checkoutResult.message}</div>
        </div>
      )}
    </div>
  );
}