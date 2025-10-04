const validCategories = ['rings', 'bracelets', 'necklaces', 'earrings', 'other'];

class Item {
  constructor(itemData = {}) {
    this.id = itemData.id;
    this.title = itemData.title;
    this.description = itemData.description;
    this.price = itemData.price;
    this.inStock = itemData.inStock;
    this.category = itemData.category;
    this.tags = itemData.tags || [];

    // Support both legacy 'image' and new 'images' array format
    this.image = itemData.image;
    this.images = itemData.images;

    this.createdAt = itemData.createdAt || new Date();
    this.updatedAt = itemData.updatedAt || new Date();
  }

  // Validate item data
  validate() {
    const errors = [];

    // Required fields validation
    if (!this.id || this.id.trim().length === 0) {
      errors.push('ID is required');
    }

    if (!this.title || this.title.trim().length === 0) {
      errors.push('Title is required');
    }

    if (!this.description || this.description.trim().length === 0) {
      errors.push('Description is required');
    }

    if (this.price === undefined || this.price === null || this.price === '') {
      errors.push('Price is required');
    } else if (this.price < 0) {
      errors.push('Price must be a non-negative number');
    }

    if (this.inStock === undefined || this.inStock === null || this.inStock === '') {
      errors.push('Stock quantity is required');
    } else if (this.inStock < 0) {
      errors.push('Stock must be a non-negative number');
    }

    if (!this.category || this.category.trim().length === 0) {
      errors.push('Category is required');
    } else if (!validCategories.includes(this.category)) {
      errors.push(`Invalid category. Must be one of: ${validCategories.join(', ')}`);
    }

    // Tags must be an array (can be empty)
    if (!Array.isArray(this.tags)) {
      errors.push('Tags must be an array');
    }

    // At least one image format is required
    if (!this.image && (!this.images || !Array.isArray(this.images) || this.images.length === 0)) {
      errors.push('At least one image is required (image or images array)');
    }

    return errors;
  }

  // Update item data safely
  update(updateData) {
    const allowedUpdates = ['title', 'description', 'price', 'inStock', 'category', 'tags', 'image', 'images'];

    allowedUpdates.forEach(field => {
      if (updateData.hasOwnProperty(field)) {
        this[field] = updateData[field];
      }
    });

    this.updatedAt = new Date();
  }

  // Business logic: Calculate discounted price
  calculateDiscountedPrice(discountPercent = 0) {
    if (discountPercent <= 0 || discountPercent >= 100) {
      return this.price;
    }
    return this.price * (1 - discountPercent / 100);
  }

  // Business logic: Check if item is low stock
  isLowStock(threshold = 5) {
    return this.inStock < threshold;
  }

  // Business logic: Check if item is out of stock
  isOutOfStock() {
    return this.inStock === 0;
  }

  // Business logic: Get stock status
  getStockStatus() {
    if (this.isOutOfStock()) return 'out_of_stock';
    if (this.isLowStock()) return 'low_stock';
    return 'in_stock';
  }

  // Get primary image (handles both formats)
  getPrimaryImage() {
    // Prefer images array if available
    if (this.images && Array.isArray(this.images) && this.images.length > 0) {
      return this.images[0];
    }
    // Fallback to legacy image field
    return this.image || null;
  }

  // Convert to database object
  toObject() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      price: this.price,
      inStock: this.inStock,
      category: this.category,
      tags: this.tags,
      image: this.image,
      images: this.images,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Item;