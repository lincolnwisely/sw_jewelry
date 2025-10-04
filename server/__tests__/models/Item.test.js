const Item = require('../../models/Item');

describe('Item Model', () => {
  describe('Item Creation', () => {
    it('should create an item with valid data', () => {
      const itemData = {
        id: 'test-ring-001',
        title: 'Test Ring',
        description: 'A beautiful test ring',
        price: 100,
        inStock: 5,
        category: 'rings',
        tags: ['gold', 'elegant'],
        images: ['image1.jpg', 'image2.jpg']
      };

      const item = new Item(itemData);

      expect(item.title).toBe('Test Ring');
      expect(item.category).toBe('rings');
      expect(item.price).toBe(100);
      expect(item.tags).toEqual(['gold', 'elegant']);
    });

    it('should set default values', () => {
      const item = new Item({
        id: 'test-001',
        title: 'Test Item',
        description: 'Test',
        price: 50,
        inStock: 10,
        category: 'rings'
      });

      expect(item.tags).toEqual([]);
      expect(item.createdAt).toBeInstanceOf(Date);
      expect(item.updatedAt).toBeInstanceOf(Date);
    });

    it('should support both image formats', () => {
      const legacyItem = new Item({
        id: 'legacy-001',
        title: 'Legacy Item',
        description: 'Test',
        price: 50,
        inStock: 10,
        category: 'rings',
        image: 'legacy.jpg'
      });

      const newItem = new Item({
        id: 'new-001',
        title: 'New Item',
        description: 'Test',
        price: 50,
        inStock: 10,
        category: 'rings',
        images: ['new1.jpg', 'new2.jpg']
      });

      expect(legacyItem.image).toBe('legacy.jpg');
      expect(newItem.images).toEqual(['new1.jpg', 'new2.jpg']);
    });
  });

  describe('Validation', () => {
    it('should validate required fields', () => {
      const item = new Item({
        title: 'Test Item'
        // Missing required fields
      });

      const errors = item.validate();

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(e => e.includes('ID'))).toBe(true);
      expect(errors.some(e => e.includes('Description'))).toBe(true);
      expect(errors.some(e => e.includes('Price'))).toBe(true);
      expect(errors.some(e => e.includes('Stock'))).toBe(true);
      expect(errors.some(e => e.includes('Category'))).toBe(true);
    });

    it('should validate category', () => {
      const item = new Item({
        id: 'test-001',
        title: 'Test',
        description: 'Test',
        price: 100,
        inStock: 5,
        category: 'invalid-category',
        tags: []
      });

      const errors = item.validate();

      expect(errors.some(e => e.includes('Invalid category'))).toBe(true);
    });

    it('should validate price is non-negative', () => {
      const item = new Item({
        id: 'test-001',
        title: 'Test',
        description: 'Test',
        price: -10,
        inStock: 5,
        category: 'rings',
        tags: [],
        image: 'test.jpg'
      });

      const errors = item.validate();

      expect(errors.some(e => e.includes('Price must be a non-negative'))).toBe(true);
    });

    it('should validate stock is non-negative', () => {
      const item = new Item({
        id: 'test-001',
        title: 'Test',
        description: 'Test',
        price: 100,
        inStock: -5,
        category: 'rings',
        tags: [],
        image: 'test.jpg'
      });

      const errors = item.validate();

      expect(errors.some(e => e.includes('Stock must be a non-negative'))).toBe(true);
    });

    it('should validate tags is an array', () => {
      const item = new Item({
        id: 'test-001',
        title: 'Test',
        description: 'Test',
        price: 100,
        inStock: 5,
        category: 'rings',
        tags: 'not-an-array',
        image: 'test.jpg'
      });

      const errors = item.validate();

      expect(errors.some(e => e.includes('Tags must be an array'))).toBe(true);
    });

    it('should require at least one image', () => {
      const item = new Item({
        id: 'test-001',
        title: 'Test',
        description: 'Test',
        price: 100,
        inStock: 5,
        category: 'rings',
        tags: []
        // No image or images
      });

      const errors = item.validate();

      expect(errors.some(e => e.includes('At least one image'))).toBe(true);
    });

    it('should pass validation with valid data', () => {
      const item = new Item({
        id: 'test-001',
        title: 'Test Ring',
        description: 'A test ring',
        price: 100,
        inStock: 5,
        category: 'rings',
        tags: ['gold'],
        image: 'test.jpg'
      });

      const errors = item.validate();

      expect(errors).toEqual([]);
    });
  });

  describe('Business Logic', () => {
    it('should calculate discounted price', () => {
      const item = new Item({
        id: 'test-001',
        title: 'Test',
        description: 'Test',
        price: 100,
        inStock: 5,
        category: 'rings',
        tags: [],
        image: 'test.jpg'
      });

      expect(item.calculateDiscountedPrice(20)).toBe(80);
      expect(item.calculateDiscountedPrice(50)).toBe(50);
      expect(item.calculateDiscountedPrice(0)).toBe(100);
    });

    it('should check if item is low stock', () => {
      const lowStockItem = new Item({
        id: 'test-001',
        title: 'Test',
        description: 'Test',
        price: 100,
        inStock: 3,
        category: 'rings',
        tags: [],
        image: 'test.jpg'
      });

      const normalStockItem = new Item({
        id: 'test-002',
        title: 'Test',
        description: 'Test',
        price: 100,
        inStock: 10,
        category: 'rings',
        tags: [],
        image: 'test.jpg'
      });

      expect(lowStockItem.isLowStock()).toBe(true);
      expect(normalStockItem.isLowStock()).toBe(false);
    });

    it('should check if item is out of stock', () => {
      const outOfStockItem = new Item({
        id: 'test-001',
        title: 'Test',
        description: 'Test',
        price: 100,
        inStock: 0,
        category: 'rings',
        tags: [],
        image: 'test.jpg'
      });

      const inStockItem = new Item({
        id: 'test-002',
        title: 'Test',
        description: 'Test',
        price: 100,
        inStock: 5,
        category: 'rings',
        tags: [],
        image: 'test.jpg'
      });

      expect(outOfStockItem.isOutOfStock()).toBe(true);
      expect(inStockItem.isOutOfStock()).toBe(false);
    });

    it('should get correct stock status', () => {
      const outOfStock = new Item({ inStock: 0, price: 100, category: 'rings', id: '1', title: 'T', description: 'T', image: 'test.jpg' });
      const lowStock = new Item({ inStock: 3, price: 100, category: 'rings', id: '2', title: 'T', description: 'T', image: 'test.jpg' });
      const inStock = new Item({ inStock: 10, price: 100, category: 'rings', id: '3', title: 'T', description: 'T', image: 'test.jpg' });

      expect(outOfStock.getStockStatus()).toBe('out_of_stock');
      expect(lowStock.getStockStatus()).toBe('low_stock');
      expect(inStock.getStockStatus()).toBe('in_stock');
    });

    it('should get primary image from both formats', () => {
      const legacyItem = new Item({
        id: 'test-001',
        title: 'Test',
        description: 'Test',
        price: 100,
        inStock: 5,
        category: 'rings',
        image: 'legacy.jpg'
      });

      const newItem = new Item({
        id: 'test-002',
        title: 'Test',
        description: 'Test',
        price: 100,
        inStock: 5,
        category: 'rings',
        images: ['new1.jpg', 'new2.jpg']
      });

      expect(legacyItem.getPrimaryImage()).toBe('legacy.jpg');
      expect(newItem.getPrimaryImage()).toBe('new1.jpg');
    });
  });

  describe('Update Method', () => {
    it('should update allowed fields', () => {
      const item = new Item({
        id: 'test-001',
        title: 'Original Title',
        description: 'Original',
        price: 100,
        inStock: 5,
        category: 'rings',
        tags: [],
        image: 'test.jpg'
      });

      item.update({
        title: 'Updated Title',
        price: 150,
        inStock: 10
      });

      expect(item.title).toBe('Updated Title');
      expect(item.price).toBe(150);
      expect(item.inStock).toBe(10);
    });

    it('should not update id field', () => {
      const item = new Item({
        id: 'test-001',
        title: 'Test',
        description: 'Test',
        price: 100,
        inStock: 5,
        category: 'rings',
        tags: [],
        image: 'test.jpg'
      });

      item.update({ id: 'different-id' });

      expect(item.id).toBe('test-001');
    });

    it('should update updatedAt timestamp', () => {
      const item = new Item({
        id: 'test-001',
        title: 'Test',
        description: 'Test',
        price: 100,
        inStock: 5,
        category: 'rings',
        tags: [],
        image: 'test.jpg'
      });

      const originalUpdatedAt = item.updatedAt;

      // Wait a tiny bit
      setTimeout(() => {
        item.update({ price: 150 });
        expect(item.updatedAt).not.toBe(originalUpdatedAt);
      }, 10);
    });
  });

  describe('toObject Method', () => {
    it('should convert to database object', () => {
      const item = new Item({
        id: 'test-001',
        title: 'Test Ring',
        description: 'Test',
        price: 100,
        inStock: 5,
        category: 'rings',
        tags: ['gold'],
        image: 'test.jpg'
      });

      const obj = item.toObject();

      expect(obj).toHaveProperty('id');
      expect(obj).toHaveProperty('title');
      expect(obj).toHaveProperty('price');
      expect(obj).toHaveProperty('createdAt');
      expect(obj).toHaveProperty('updatedAt');
    });
  });
});
