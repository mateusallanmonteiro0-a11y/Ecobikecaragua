import { useState, useMemo } from "react";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/data/products";
import { Button } from "@/components/ui/button";

const categories = ["Todas", "Urbana", "Off-road", "Cruiser", "Compacta"] as const;

const Shop = () => {
  const [active, setActive] = useState<typeof categories[number]>("Todas");

  const filtered = useMemo(
    () => (active === "Todas" ? products : products.filter((p) => p.category === active)),
    [active]
  );

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <header className="mb-12">
        <span className="text-xs uppercase tracking-wider text-muted-foreground">Coleção 2026</span>
        <h1 className="font-display text-5xl md:text-6xl font-bold mt-2">Loja</h1>
        <p className="mt-4 max-w-xl text-muted-foreground">
          Toda a linha VOLT. Filtre por categoria e descubra a sua próxima máquina elétrica.
        </p>
      </header>

      <div className="flex flex-wrap gap-2 mb-10">
        {categories.map((c) => (
          <Button
            key={c}
            onClick={() => setActive(c)}
            variant={active === c ? "default" : "outline"}
            className="rounded-full"
            size="sm"
          >
            {c}
          </Button>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  );
};

export default Shop;
