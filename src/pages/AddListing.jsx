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
const [files, setFiles] = useState([]);

const handleFiles = (e) => {
  const chosen = Array.from(e.target.files).slice(0, 5); // limit to 5
  setFiles(chosen);
};

const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
}


const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try{
        const formData  = new FormData();
        formData.append('name', form.name);
        formData.append('description', form.description);
        formData.append('price', Number(form.price));
        formData.append('category', form.category);
        formData.append('condition', form.condition);
        files.forEach((file) => {
            formData.append('images', file);
        });
        await AxiosHelper.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
        });
        navigate('/')
    }catch(err){
        setError('Failed to create listing')
    }finally{
        setLoading(false)
    }
};


return (
    <div className="max-w-xl mx-auto card">
        <h1 className="text-2xl font-bold mb-4">Add New Listing</h1>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="label">Photos (up to 5)</label>
                <input type="file" accept="image/*" multiple onChange={handleFiles} />
                {files.length > 0 && <div className="text-sm mt-1">{files.length} file(s) selected</div>}
            </div>

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