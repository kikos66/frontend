import React, { useEffect, useState } from "react";
import CartAPI from "../api/cart_api";

export default function SalesHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    (async ()=> {
      try {
        const res = await CartAPI.fetchMySales();
        setOrders(res);
        
      } catch(e) {
        console.error("Failed to load sales", e);
      } finally {
        setLoading(false);
      }
    })();
  },[]);

  if (loading) return <div>Loading sales...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-xl font-bold mb-4">Sales history</h1>

        {orders.length === 0 ? (
        <div>No sales found.</div>
        ) : (
        <div className="space-y-4">
            {orders.map(o => (
                <div key={o.id} className="border rounded p-3">
                    <div className="flex justify-between mb-2">
                    <div>
                        <div className="font-medium">Order #{o.id}</div>
                        <div className="text-sm text-gray-500">
                        {new Date(o.createdAt).toLocaleString()}
                        </div>
                    </div>
                    <div className="font-bold">€{o.total.toFixed(2)}</div>
                    </div>

                    {o.items.map(it => (
                    <div key={it.id} className="text-sm border-t pt-2 mt-2 flex justify-between">
                        <div>
                        <div className="font-medium">{it.productName}</div>
                        <div className="text-xs text-gray-500">
                            Buyer paid: €{it.subtotal.toFixed(2)}
                        </div>
                        </div>
                        <div>
                        {it.quantity} × €{it.productPrice.toFixed(2)}
                        </div>
                    </div>
                    ))}
                </div>
            ))}
        </div>
        )}
    </div>
    );
}