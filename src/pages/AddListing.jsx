import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AxiosHelper from '../api/axios_helper'

export default function AddListing(){
    const navigate = useNavigate()
    const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'jackets',
    condition: 'new'
})
const [loading, setLoading] = useState(false)
const [error, setError] = useState(null)

const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
}


const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try{
        await AxiosHelper.post('/products', {
        ...form,
        price: Number(form.price)
    })
        navigate('/')
    }catch(err){
        setError('Failed to create listing')
    }finally{
        setLoading(false)
    }
}


return (
    <div className="max-w-xl mx-auto card">
        <h1 className="text-2xl font-bold mb-4">Add New Listing</h1>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="label">Name</label>
                <input name="name" value={form.name} onChange={handleChange} required className="input-field w-full" />
            </div>


            <div>
                <label className="label">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} required className="input-field w-full" />
            </div>


            <div>
                <label className="label">Price</label>
                <input type="number" min="0" step="0.01" name="price" value={form.price} onChange={handleChange} required className="input-field w-full" />
            </div>


            <div className="flex gap-3">
                <div className="w-1/2">
                    <label className="label">Category</label>
                    <select name="category" value={form.category} onChange={handleChange} className="input-field w-full">
                        <option value="jackets">Jackets</option>
                        <option value="packs">Packs</option>
                        <option value="boots">Boots</option>
                        <option value="accessories">Accessories</option>
                    </select>
                </div>


                <div className="w-1/2">
                    <label className="label">Condition</label>
                    <select name="condition" value={form.condition} onChange={handleChange} className="input-field w-full">
                        <option value="new">New</option>
                        <option value="used">Used</option>
                        <option value="refurbished">Refurbished</option>
                    </select>
                </div>
            </div>
            <button disabled={loading} className="btn-primary w-full">
                {loading ? 'Saving...' : 'Create Listing'}
            </button>
        </form>
    </div>
    )
}