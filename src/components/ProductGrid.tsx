import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import ProductCard, { Product } from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onAddToCart: (product: Product) => void;
  onProductClick: (product: Product) => void;
}

const ProductGrid = ({ 
  products, 
  categories, 
  selectedCategory, 
  onCategoryChange,
  onAddToCart, 
  onProductClick 
}: ProductGridProps) => {
  return (
    <div className="space-y-8">
      {/* Category Filter */}
      <div className="flex items-center gap-4 mb-6">
        <Filter className="h-5 w-5 text-muted-foreground" />
        <h3 className="text-lg font-semibold">Categories</h3>
      </div>
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => onCategoryChange(category)}
            className="transition-all duration-200"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="animate-fade-in">
            <ProductCard
              product={product}
              onAddToCart={onAddToCart}
              onProductClick={onProductClick}
            />
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No products found in this category.</p>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;