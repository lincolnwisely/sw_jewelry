// To-Do: Create Item.js class for consistency 
// implement business logic (calculate discounted price, etc., )
// 

class Item {
    constructor(itemData) {
      this.title = itemData.title;
      this.category = itemData.category;
      this.id = itemData.id;
      this.inStock = itemData.inStock;
      this.image = itemData.image;
      this.price = itemData.price;
      this.tags = itemData.tags;
      this.description = itemData.description;

     "category",
        "description",
        "id",
        "image",
        "inStock",
        "price",
        "tags",
        "title"

      // ... etc
    }

    validate() { /* validation logic */ }
    calculateDiscountedPrice() { /* business logic */ }
  }