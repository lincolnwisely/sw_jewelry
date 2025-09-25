// Cloudinary configuration
export const CLOUDINARY_CONFIG = {
  cloudName: 'dpm2ubwtv',
  uploadPreset: 'sw_jewelry_uploads', // You'll need to create this preset in Cloudinary dashboard
};

// Cloudinary upload function
export const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
  formData.append('folder', 'sw_jewelry/inventory'); // Organize uploads in folders

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.secure_url; // Return the secure HTTPS URL
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image');
  }
};

// Helper function to upload multiple images
export const uploadMultipleToCloudinary = async (files: FileList): Promise<string[]> => {
  const uploadPromises = Array.from(files).map(file => uploadToCloudinary(file));
  return Promise.all(uploadPromises);
};