import React from 'react';
import { Product } from '../types';
import { Plus } from 'lucide-react';

interface ProductListProps {
  products: Product[];
  title: string;
  onAddToCart: (productId: number) => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, title, onAddToCart }) => {
  return (
    <section id="products" className="py-20">
      <div className="max-w-7xl mx-auto px-4">
        <h3 className="text-4xl font-heading text-ch-primary text-center mb-12 border-b-2 border-ch-secondary/50 pb-3">
          {title}
        </h3>

        <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-2 gap-8">
          {products.map((product) => (
            <div key={product.id} className="group bg-ch-bg-medium rounded-xl overflow-hidden border border-gray-800 shadow-xl flex flex-col justify-between hover:-translate-y-2 hover:shadow-neon transition-all duration-300">
              <div className="relative overflow-hidden">
                <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-48 object-cover transform group-hover:scale-110 transition duration-500"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/400x300/181818/F500FF?text=Produkt' }}
                />
                <span className="absolute top-2 left-2 bg-ch-primary/90 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                    {product.icon} {product.category}
                </span>
              </div>
              
              <div className="p-4 flex-grow flex flex-col justify-between">
                <div>
                  <h4 className="text-xl font-heading text-ch-tertiary mb-1 group-hover:text-ch-secondary transition-colors">{product.name}</h4>
                  <p className="text-sm text-ch-gray mb-3">{product.description}</p>
                </div>
                <div className="mt-4">
                  <p className="text-3xl font-bold text-ch-secondary mb-3">{product.price.toFixed(2)} zł</p>
                  <button 
                    onClick={() => onAddToCart(product.id)}
                    className="w-full bg-ch-secondary text-ch-bg-dark py-2 rounded-lg font-bold hover:bg-[#59b2cc] transition duration-300 transform hover:scale-[1.02] active:scale-95 shadow-cyan-glow/50 flex items-center justify-center gap-2"
                  >
                    <Plus size={18} /> Dodaj do Koszyka
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductList;