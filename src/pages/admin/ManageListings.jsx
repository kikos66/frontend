import React, { useEffect, useState } from "react";
import AxiosHelper from "../../api/axios_helper";
import { useNavigate } from "react-router-dom";

export default function ManageListings() {
  const [listings, setListings] = useState([]);
  const nav = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(()=> {
    (async ()=> {
      const res = await AxiosHelper.get("/products");
      setListings(res.data.content);
    })();
  },[]);

  const deleteListing = async (id) => {
    if (!confirm("Delete listing?")) return;
    await AxiosHelper.delete(`/products/${id}`);
    setListings(prev => prev.filter(p => p.id !== id));
  };

  const filteredListings = listings.filter(l =>
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (l.owner?.username || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="card max-w-5xl mx-auto">
      <h1 className="text-xl font-bold mb-3">Manage Listings</h1>
      <input
        type="text"
        placeholder="Search by name of the product..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="input-field w-full border p-2 rounded mb-4"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredListings.map(p => (
          <div key={p.id} className="border rounded p-3">
            <div className="font-medium">{p.name}</div>
            <div className="muted-text">{p.category} · €{p.price}</div>
            <div className="mt-2 flex gap-2">
              <button className="btn-primary" onClick={() => nav(`/products/${p.id}`)}>Open</button>
              <button className="bg-red-600 text-white px-3 py-1 rounded" onClick={() => deleteListing(p.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}