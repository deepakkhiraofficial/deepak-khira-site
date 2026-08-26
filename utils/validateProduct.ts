export default function validateProduct(product: any) {
    const errors: Record<string, string> = {};
  
    if (!product.name) errors.name = "Product name is required.";
    if (!product.slug) errors.slug = "Slug is required.";
    if (!product.description) errors.description = "Description is required.";
    if (!product.category) errors.category = "Category is required.";
    if (!product.price || product.price <= 0) errors.price = "Price must be greater than 0.";
    if (product.stock < 0) errors.stock = "Stock cannot be negative.";
    if (!product.images || product.images.length === 0) errors.images = "At least one image is required.";
  
    return errors;
  }
  