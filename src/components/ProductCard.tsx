import { Link } from "react-router-dom";
import { Product } from "@/data/products";
import { formatBRL } from "@/contexts/CartContext";
import { ArrowUpRight } from "lucide-react";

export const ProductCard = ({ product }: { product: Product }) => (
  <Link
    to={`/produto/${product.id}`}
    className="group relative flex flex-col overflow-hidden rounded-3xl bg-card shadow-soft transition-all duration-500 ease-smooth hover:shadow-elevated hover:-translate-y-1"
  >
    <div className="relative aspect-square overflow-hidden bg-secondary/40">
      {product.badge && (
        <span className="absolute left-4 top-4 z-10 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
          {product.badge}
        </span>
      )}
      <img
        src={product.image}
        alt={product.name}
        loading="lazy"
        width={1280}
        height={1280}
        className="h-full w-full object-cover transition-transform duration-700 ease-smooth group-hover:scale-105"
      />
      <div className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-background/80 backdrop-blur opacity-0 group-hover:opacity-100 transition-opacity">
        <ArrowUpRight className="h-4 w-4" />
      </div>
    </div>
    <div className="flex flex-col gap-2 p-6">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">{product.category}</span>
      <h3 className="font-display text-xl font-semibold">{product.name}</h3>
      <p className="text-sm text-muted-foreground line-clamp-1">{product.tagline}</p>
      <div className="mt-3 flex items-baseline gap-2">
        {product.oldPrice && (
          <span className="text-sm text-muted-foreground line-through">{formatBRL(product.oldPrice)}</span>
        )}
        <span className="font-display text-2xl font-bold">{formatBRL(product.price)}</span>
      </div>
      <span className="text-xs text-muted-foreground">ou 6x sem juros · até 24x</span>
    </div>
  </Link>
);
