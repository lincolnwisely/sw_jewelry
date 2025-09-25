import React, { useState, useCallback } from 'react';
import { uploadMultipleToCloudinary } from '../config/cloudinary';

interface ImageUploadProps {
  onUploadComplete: (urls: string[]) => void;
  onUploadStart?: () => void;
  maxImages?: number;
  existingImages?: string[];
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onUploadComplete,
  onUploadStart,
  maxImages = 5,
  existingImages = [],
  className = ''
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>(existingImages);
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = useCallback(async (files: FileList) => {
    if (!files || files.length === 0) return;

    // Check if adding these files would exceed the limit
    const totalImages = uploadedUrls.length + files.length;
    if (totalImages > maxImages) {
      alert(`Maximum ${maxImages} images allowed. You can upload ${maxImages - uploadedUrls.length} more.`);
      return;
    }

    setUploading(true);
    onUploadStart?.();

    try {
      const newUrls = await uploadMultipleToCloudinary(files);
      const allUrls = [...uploadedUrls, ...newUrls];
      setUploadedUrls(allUrls);
      onUploadComplete(allUrls);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload images. Please try again.');
    } finally {
      setUploading(false);
    }
  }, [uploadedUrls, maxImages, onUploadComplete, onUploadStart]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  }, [handleFiles]);

  const removeImage = useCallback((indexToRemove: number) => {
    const newUrls = uploadedUrls.filter((_, index) => index !== indexToRemove);
    setUploadedUrls(newUrls);
    onUploadComplete(newUrls);
  }, [uploadedUrls, onUploadComplete]);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive
            ? 'border-black bg-gray-50'
            : uploading
            ? 'border-gray-300 bg-gray-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="image-upload"
          multiple
          accept="image/*"
          onChange={handleInputChange}
          disabled={uploading || uploadedUrls.length >= maxImages}
          className="hidden"
        />

        {uploading ? (
          <div className="space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
            <p className="text-gray-600">Uploading images...</p>
          </div>
        ) : (
          <div className="space-y-2">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="text-gray-600">
              <label htmlFor="image-upload" className="cursor-pointer font-medium text-black hover:text-gray-700">
                Click to upload
              </label>
              {' '}or drag and drop
            </div>
            <p className="text-xs text-gray-500">
              PNG, JPG, GIF up to 10MB each
              {uploadedUrls.length < maxImages && ` (${maxImages - uploadedUrls.length} remaining)`}
            </p>
          </div>
        )}
      </div>

      {/* Image Preview Grid */}
      {uploadedUrls.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {uploadedUrls.map((url, index) => (
            <div key={url} className="relative group">
              <img
                src={url}
                alt={`Upload ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg border border-gray-200"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
              {index === 0 && (
                <div className="absolute bottom-1 left-1 bg-black text-white text-xs px-1 py-0.5 rounded">
                  Primary
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;