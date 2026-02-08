import React, { useEffect, useState } from "react";
import CartAPI from "../api/cart_api";
import { useNavigate } from "react-router-dom";

export default function PurchaseHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();
  

  useEffect(() => {
    (async ()=> {
      try {
        const res = await CartAPI.fetchMyOrders();
        setOrders(res);
      } catch(e) {
        console.error("Failed to load orders", e);
      } finally {
        setLoading(false);
      }
    })();
  },[]);

  if (loading) return <div>Loading purchase history...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Purchase history</h1>
      {orders.length === 0 ? (
        <div>No purchases yet.</div>
      ) : (
        <div className="space-y-4">
          {orders.map(o => (
            <div key={o.id} className="border rounded p-3">
              <div className="flex justify-between">
                <div>
                  <div className="font-medium">Order #{o.id}</div>
                  <div className="muted-text">{new Date(o.createdAt).toLocaleString()}</div>
                </div>
                <div className="font-bold">€{(o.total || 0).toFixed(2)}</div>
              </div>
              <div className="mt-2">
                {o.items.map(it => (
                  <div key={it.id} className="flex justify-between text-sm border-t pt-2 mt-2">
                    <div className="font-medium">{it.productName}</div>
                    <div className="muted-text">
                    Seller: {it.productOwnerName}
                </div>
                    <div  className="price-tag">
                        {it.quantity} × €{it.productPrice.toFixed(2)} = €{it.subtotal.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}