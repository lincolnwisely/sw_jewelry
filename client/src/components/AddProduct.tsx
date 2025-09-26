import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateProduct } from '../hooks/useInventoryMutations';
import ImageUpload from './ImageUpload';
import { getCategoriesArray } from '../constants/categories';

const AddProduct: React.FC = () => {
  const navigate = useNavigate();
  const createProductMutation = useCreateProduct();
  const categories = getCategoriesArray();

  const [formData, setFormData] = useState({
    id: '',
    title: '',
    description: '',
    price: '',
    category: categories.length > 0 ? categories[0].name : 'rings',
    inStock: '',
    tags: '',
    materials: '',
  });

  const [images, setImages] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.id.trim()) newErrors.id = 'Product ID is required';
    if (!formData.title.trim()) newErrors.title = 'Product title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Valid price is required';
    if (!formData.inStock || parseInt(formData.inStock) < 0) newErrors.inStock = 'Stock quantity is required';
    if (images.length === 0) newErrors.images = 'At least one image is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const productData = {
        id: formData.id.trim(),
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        category: formData.category,
        inStock: parseInt(formData.inStock),
        images: images,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        materials: formData.materials.split(',').map(material => material.trim()).filter(Boolean),
      };

      await createProductMutation.mutateAsync(productData);
      navigate('/admin/inventory');
    } catch (error) {
      console.error('Error creating product:', error);
      setErrors({ submit: 'Failed to create product. Please try again.' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <button
            onClick={() => navigate('/admin/inventory')}
            className="text-gray-600 hover:text-gray-800"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
        </div>
        <p className="text-gray-600">Create a new jewelry item for your inventory</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="id" className="block text-sm font-medium text-gray-700 mb-1">
                Product ID *
              </label>
              <input
                type="text"
                id="id"
                name="id"
                value={formData.id}
                onChange={handleInputChange}
                placeholder="e.g., ring-025"
                className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black ${
                  errors.id ? 'border-red-300' : ''
                }`}
              />
              {errors.id && <p className="mt-1 text-sm text-red-600">{errors.id}</p>}
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
              >
                {categories.map(category => (
                  <option key={category.name} value={category.name}>
                    {category.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Product Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Elegant Silver Ring with Blue Stone"
                className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black ${
                  errors.title ? 'border-red-300' : ''
                }`}
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>

            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Detailed description of the jewelry piece..."
                className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black ${
                  errors.description ? 'border-red-300' : ''
                }`}
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Pricing & Stock</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Price ($) *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="0.00"
                className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black ${
                  errors.price ? 'border-red-300' : ''
                }`}
              />
              {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
            </div>

            <div>
              <label htmlFor="inStock" className="block text-sm font-medium text-gray-700 mb-1">
                Stock Quantity *
              </label>
              <input
                type="number"
                id="inStock"
                name="inStock"
                min="0"
                value={formData.inStock}
                onChange={handleInputChange}
                placeholder="1"
                className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black ${
                  errors.inStock ? 'border-red-300' : ''
                }`}
              />
              {errors.inStock && <p className="mt-1 text-sm text-red-600">{errors.inStock}</p>}
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Images *</h2>
          <ImageUpload
            onUploadComplete={setImages}
            maxImages={5}
            existingImages={images}
          />
          {errors.images && <p className="mt-2 text-sm text-red-600">{errors.images}</p>}
        </div>

        {/* Additional Details */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="materials" className="block text-sm font-medium text-gray-700 mb-1">
                Materials
              </label>
              <input
                type="text"
                id="materials"
                name="materials"
                value={formData.materials}
                onChange={handleInputChange}
                placeholder="e.g., sterling silver, blue topaz"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
              />
              <p className="mt-1 text-xs text-gray-500">Separate multiple materials with commas</p>
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="e.g., elegant, vintage, statement"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
              />
              <p className="mt-1 text-xs text-gray-500">Separate multiple tags with commas</p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-600">{errors.submit}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin/inventory')}
            disabled={createProductMutation.isPending}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={createProductMutation.isPending}
            className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2"
          >
            {createProductMutation.isPending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Creating...
              </>
            ) : (
              'Create Product'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;