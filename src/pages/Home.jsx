import React, { useEffect, useState } from 'react'
import ProductCard from '../ProductCard'
import AxiosHelper from '../api/axios_helper';
import { useLocation, useNavigate } from 'react-router-dom'

function useQuery(){
    return new URLSearchParams(useLocation().search)
}

function Home() {
    const q = useQuery()
    const search = q.get('search') || ''
    const nav = useNavigate();

    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [page, setPage] = useState(0);
    const [last, setLast] = useState(false);

    // filters
    const [category, setCategory] = useState('')
    const [condition, setCondition] = useState('')
    const [minPrice, setMinPrice] = useState('')
    const [maxPrice, setMaxPrice] = useState('')

    useEffect(() => {
        fetchProducts(page === 0);
    }, [page, search, category, condition, minPrice, maxPrice]);

    const fetchProducts = async (reset = false) => {
        setLoading(true);
        try {
            const params = new URLSearchParams()
            if (search) params.append("search", search)
            if (category) params.append("category", category)
            if (condition) params.append("condition", condition)
            if (minPrice) params.append("minPrice", minPrice)
            if (maxPrice) params.append("maxPrice", maxPrice)

            params.append("page", page);
            params.append("size", 9);

            const res = await AxiosHelper.get(`/products?${params.toString()}`);
            setProducts(prev =>
                reset ? res.data.content : [...prev, ...res.data.content]
            );
            setLast(res.data.last);
            console.log("Page:", reset ? 0 : page, "Received:", res.data.content.length);
            setError(null);
        } catch(e) {
            setError("Could not load products")
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        setProducts([]);
        setLast(false);
        setPage(0);
    }, [search, category, condition, minPrice, maxPrice]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Filters - left column */}
            <aside className="md:col-span-1 card">
                <h3 className="font-semibold mb-3">Filters</h3>
                <form onSubmit={(e) => e.preventDefault()} className="space-y-3">
                    <div>
                        <label className="label">Category</label>
                        <select value={category} onChange={(e)=>setCategory(e.target.value)} className="input-field mt-2 w-full">
                            <option value="">Any</option>
                            <option value="jackets">Jackets</option>
                            <option value="packs">Packs</option>
                            <option value="boots">Boots</option>
                            <option value="accessories">Accessories</option>
                        </select>
                    </div>


                    <div>
                        <label className="label">Condition</label>
                            <select value={condition} onChange={(e)=>setCondition(e.target.value)} className="input-field mt-2 w-full">
                            <option value="">Any</option>
                            <option value="new">New</option>
                            <option value="used">Used</option>
                            <option value="refurbished">Refurbished</option>
                        </select>
                    </div>


                    <div className="flex space-x-2">
                        <div className="w-1/2">
                            <label className="label">Min</label>
                            <input value={minPrice} onChange={(e)=>setMinPrice(e.target.value)} className="input-field mt-2 w-full" type="number" min="0" />
                        </div>
                        <div className="w-1/2">
                            <label className="label">Max</label>
                            <input value={maxPrice} onChange={(e)=>setMaxPrice(e.target.value)} className="input-field mt-2 w-full" type="number" min="0" />
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button type="button" className="link-muted"
                            onClick={()=>{nav('/'); setCategory(''); setCondition(''); setMinPrice(''); setMaxPrice('')}}>Reset
                        </button>
                    </div>
                </form>
            </aside>


            {/* Products - main area */}
            <section className="md:col-span-3">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold text-primary">Listings</h1>
                    <div className="muted-text">{products.length} items</div>
                </div>


                {loading && <div>Loading products...</div>}
                {error && <div className="text-red-500 mb-2">{error}</div>}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map(p => <ProductCard key={p.id} product={p} />)}
                </div>
                {!last && (
                    <button
                        className="btn-secondary mt-4"
                        disabled={loading}
                        onClick={() => setPage(p => p + 1)}
                    >
                        {loading ? "Loading..." : "Load more listings"}
                    </button>
                )}
            </section>
            
        </div>
    )
}

export default Home