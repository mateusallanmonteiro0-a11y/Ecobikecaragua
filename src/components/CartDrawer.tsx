import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart, formatBRL } from "@/contexts/CartContext";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";

export const CartDrawer = () => {
  const { items, isOpen, setOpen, remove, setQty, total } = useCart();
  const navigate = useNavigate();

  const goToCheckout = () => {
    setOpen(false);
    navigate("/checkout");
  };

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="font-display text-2xl">Seu carrinho</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-secondary">
              <ShoppingBag className="h-7 w-7 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">Seu carrinho está vazio</p>
            <Button variant="outline" onClick={() => setOpen(false)}>Continuar comprando</Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto -mx-6 px-6 py-4 space-y-4">
              {items.map(({ product, qty }) => (
                <div key={product.id} className="flex gap-4 rounded-2xl bg-secondary/40 p-3">
                  <img src={product.image} alt={product.name} className="h-20 w-20 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{product.name}</h4>
                    <p className="text-xs text-muted-foreground mb-2">{product.category}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 rounded-full border border-border bg-background">
                        <button onClick={() => setQty(product.id, qty - 1)} className="grid h-7 w-7 place-items-center hover:bg-secondary rounded-l-full">
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-6 text-center text-sm">{qty}</span>
                        <button onClick={() => setQty(product.id, qty + 1)} className="grid h-7 w-7 place-items-center hover:bg-secondary rounded-r-full">
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <span className="font-semibold text-sm">{formatBRL(product.price * qty)}</span>
                    </div>
                  </div>
                  <button onClick={() => remove(product.id)} className="text-muted-foreground hover:text-destructive p-1">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-4 space-y-4">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-muted-foreground">Total</span>
                <span className="font-display text-2xl font-bold">{formatBRL(total)}</span>
              </div>
              <p className="text-xs text-muted-foreground">Frete grátis para todo Brasil · Pagamento via PIX, cartão ou boleto</p>
              <Button onClick={goToCheckout} className="w-full h-12 rounded-full text-base">
                Finalizar compra
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};
