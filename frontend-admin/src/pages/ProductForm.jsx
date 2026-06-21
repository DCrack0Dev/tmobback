import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    description: '',
    price: '',
    stock: '',
    specifications: {},
    is_featured: false,
    images: []
  });
  const [specKey, setSpecKey] = useState('');
  const [specValue, setSpecValue] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(id ? true : false);

  useEffect(() => {
    if (id) {
      const loadProduct = async () => {
        const response = await api.get(`/products/${id}`);
        setFormData({
          ...response.data,
          price: response.data.price.toString(),
          stock: response.data.stock.toString(),
          specifications: response.data.specifications || {}
        });
        setLoading(false);
      };
      loadProduct();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock)
    };

    if (id) {
      await api.put(`/products/${id}`, data);
    } else {
      const response = await api.post('/products', data);
      if (imageFiles.length > 0) {
        const formDataImg = new FormData();
        imageFiles.forEach(file => formDataImg.append('images', file));
        await api.post(`/products/${response.data.id}/images`, formDataImg, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
    }
    navigate('/products');
  };

  const addSpec = () => {
    if (specKey && specValue) {
      setFormData(prev => ({
        ...prev,
        specifications: { ...prev.specifications, [specKey]: specValue }
      }));
      setSpecKey('');
      setSpecValue('');
    }
  };

  const removeSpec = (key) => {
    setFormData(prev => {
      const specs = { ...prev.specifications };
      delete specs[key];
      return { ...prev, specifications: specs };
    });
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">{id ? 'Edit Product' : 'Add Product'}</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block font-medium mb-1">Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Brand</label>
            <input
              type="text"
              required
              value={formData.brand}
              onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Price</label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Stock</label>
            <input
              type="number"
              required
              value={formData.stock}
              onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block font-medium mb-1">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="w-full border rounded px-3 py-2"
            rows={4}
          />
        </div>

        <div className="mb-6">
          <label className="block font-medium mb-1">Specifications</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Key"
              value={specKey}
              onChange={(e) => setSpecKey(e.target.value)}
              className="border rounded px-3 py-2"
            />
            <input
              type="text"
              placeholder="Value"
              value={specValue}
              onChange={(e) => setSpecValue(e.target.value)}
              className="border rounded px-3 py-2 flex-1"
            />
            <button
              type="button"
              onClick={addSpec}
              className="bg-slate-600 text-white px-4 py-2 rounded"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(formData.specifications).map(([key, value]) => (
              <span key={key} className="bg-slate-100 px-3 py-1 rounded flex items-center gap-2">
                {key}: {value}
                <button
                  type="button"
                  onClick={() => removeSpec(key)}
                  className="text-red-500 hover:text-red-700"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>

        {!id && (
          <div className="mb-6">
            <label className="block font-medium mb-1">Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setImageFiles(Array.from(e.target.files))}
              className="w-full border rounded px-3 py-2"
            />
          </div>
        )}

        <div className="mb-6 flex items-center gap-2">
          <input
            type="checkbox"
            id="featured"
            checked={formData.is_featured}
            onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
          />
          <label htmlFor="featured" className="font-medium">Featured Product</label>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-800 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            {id ? 'Update Product' : 'Create Product'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="bg-slate-200 hover:bg-slate-300 px-6 py-2 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
