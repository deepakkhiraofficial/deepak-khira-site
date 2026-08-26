export interface Product {
    _id: string;
    name: string;
    slug: string;
    description: string;
    category: string;
    price: number;
    stock: number;
    inStock: boolean;
    images: string[];
    featured: boolean;
    status: "active" | "draft";
    rating: number;
    popularityScore: number;
  }