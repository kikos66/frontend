import React, { useEffect, useState } from 'react'
import ProductCard from '../ProductCard'
import axios from 'axios'
import { useLocation, useNavigate } from 'react-router-dom'

function useQuery(){
    return new URLSearchParams(useLocation().search)
}

function Home() {
    const q = useQuery()
    const initialSearch = q.get('q') || ''
    const navigate = useNavigate()


    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)


    // filters
    const [search, setSearch] = useState(initialSearch)
    const [category, setCategory] = useState('')
    const [condition, setCondition] = useState('')
    const [minPrice, setMinPrice] = useState('')
    const [maxPrice, setMaxPrice] = useState('')

    useEffect(()=>{
        const fetchProducts = async () => {
            setLoading(true)
            setError(null)
            try{
                const params = new URLSearchParams()
                if(search) params.append('search', search)
                if(category) params.append('category', category)
                if(condition) params.append('condition', condition)
                if(minPrice) params.append('minPrice', minPrice)
                if(maxPrice) params.append('maxPrice', maxPrice)


                const res = await axios.get(`http://localhost:8080/api/products?${params.toString()}`)
                console.log('API response', res.data)
                setProducts(Array.isArray(res.data) ? res.data : [])
            }catch(err){ setError('Could not load products') }
            finally{ setLoading(false) }
        }
    fetchProducts()
    }, [search, category, condition, minPrice, maxPrice])

    const handleApplyFilters = (e) => {
    e?.preventDefault()
        const params = new URLSearchParams()
        if(search) params.append('q', search)
        if(category) params.append('category', category)
        navigate(`/?${params.toString()}`)
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Filters - left column */}
            <aside className="md:col-span-1 card">
                <h3 className="font-semibold mb-3">Filters</h3>
                <form onSubmit={handleApplyFilters} className="space-y-3">
                    <div>
                        <label className="label">Search</label>
                        <input value={search} onChange={(e)=>setSearch(e.target.value)} className="input-field mt-2 w-full" placeholder="e.g. parka, backpack" />
                    </div>


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
                        <button className="my-button" type="submit">Apply</button>
                        <button type="button" className="text-sm" onClick={()=>{setSearch(''); setCategory(''); setCondition(''); setMinPrice(''); setMaxPrice('')}}>Reset</button>
                    </div>
                </form>
            </aside>


            {/* Products - main area */}
            <section className="md:col-span-3">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold text-primary">Listings</h1>
                    <div className="text-sm text-gray-600">{products.length} items</div>
                </div>


                {loading ? (
                <div>Loading products...</div>
                ) : error ? (
                    <div className="text-red-500">{error}</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {products.map(p => <ProductCard key={p.id} product={p} />)}
                    </div>
                )}
            </section>
        </div>
    )
}

export default Home