import { useParams, Link, Navigate } from "react-router-dom";
import { getProduct } from "@/data/products";
import { useCart, formatBRL } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Battery, Gauge, Zap, Weight, Cpu, Clock, Check, ArrowLeft, ShieldCheck, Truck, MessageCircle } from "lucide-react";
import { useState } from "react";

const ProductDetail = () => {
  const { id } = useParams();
  const product = id ? getProduct(id) : undefined;
  const { add } = useCart();
  const [qty, setQty] = useState(1);

  if (!product) return <Navigate to="/loja" replace />;

  const specIcons = [
    { icon: Battery, label: "Autonomia", value: product.specs.range },
    { icon: Gauge, label: "Velocidade máx.", value: product.specs.speed },
    { icon: Zap, label: "Bateria", value: product.specs.battery },
    { icon: Cpu, label: "Motor", value: product.specs.motor },
    { icon: Weight, label: "Peso", value: product.specs.weight },
    { icon: Clock, label: "Carga", value: product.specs.charge },
  ];

  // Função para enviar informações da bike via WhatsApp
  const handleWhatsAppClick = () => {
    // Número do WhatsApp (substitua pelo seu número com DDD)
    const phoneNumber = "5512999987654";
    
    // Pega a URL base do site (funciona no Netlify)
    const baseUrl = window.location.origin;
    
    // Constrói a URL completa da imagem
    const imageFullUrl = `${baseUrl}${product.image}`;
    
   

const message = `*🛵 NOVA CONSULTA - BICICLETA ELÉTRICA*%0A%0A` +
  `📸 *Foto do produto:*%0A${imageFullUrl}%0A%0A` +  // Link em linha separada
  `*🏷️ Nome:* ${product.name}%0A` +
  // ... resto igual

      
      `*💰 Valor:* ${formatBRL(product.price)}%0A` +
      `*⭐ Categoria:* ${product.category}%0A` +
      `*📝 Tagline:* ${product.tagline}%0A` +
      `*🔄 Quantidade de interesse:* ${qty} unidade(s)%0A` +
      `*💵 Valor total:* ${formatBRL(product.price * qty)}%0A%0A` +
      `*🔧 Especificações Técnicas:*%0A` +
      `• Autonomia: ${product.specs.range}%0A` +
      `• Velocidade máx: ${product.specs.speed}%0A` +
      `• Bateria: ${product.specs.battery}%0A` +
      `• Motor: ${product.specs.motor}%0A` +
      `• Peso: ${product.specs.weight}%0A` +
      `• Tempo de carga: ${product.specs.charge}%0A%0A` +
      `*✨ Destaques:*%0A` +
      product.highlights.map(h => `• ${h}`).join('%0A') + `%0A%0A` +
      `*📝 Descrição:* ${product.description.substring(0, 150)}...%0A%0A` +
      `_*Mensagem enviada automaticamente do site*_`;
    
    // Criar o link do WhatsApp
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    
    // Abrir o WhatsApp em uma nova guia
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <Link to="/loja" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8">
        <ArrowLeft className="h-4 w-4" /> Voltar à loja
      </Link>

      <div className="grid gap-12 lg:grid-cols-2">
        {/* Imagem */}
        <div className="relative overflow-hidden rounded-[2rem] bg-secondary/40 aspect-square">
          {product.badge && (
            <span className="absolute left-6 top-6 z-10 rounded-full bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground">
              {product.badge}
            </span>
          )}
          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
        </div>

        {/* Info */}
        <div>
          <span className="text-xs uppercase tracking-wider text-muted-foreground">{product.category}</span>
          <h1 className="font-display text-4xl md:text-5xl font-bold mt-2">{product.name}</h1>
          <p className="mt-3 text-lg text-muted-foreground">{product.tagline}</p>

          <div className="mt-8 flex items-baseline gap-3">
            {product.oldPrice && (
              <span className="text-lg text-muted-foreground line-through">{formatBRL(product.oldPrice)}</span>
            )}
            <span className="font-display text-4xl font-bold">{formatBRL(product.price)}</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            ou 12x de {formatBRL(product.price / 12)} sem juros · 10% off no PIX
          </p>

          <p className="mt-8 text-base leading-relaxed">{product.description}</p>

          <ul className="mt-6 space-y-2">
            {product.highlights.map((h) => (
              <li key={h} className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-accent" /> {h}
              </li>
            ))}
          </ul>

          {/* Quantidade + CTAs */}
          <div className="mt-10 space-y-4">
            <div className="flex gap-3">
              <div className="flex items-center rounded-full border border-border bg-background">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="grid h-12 w-12 place-items-center">−</button>
                <span className="w-10 text-center font-medium">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="grid h-12 w-12 place-items-center">+</button>
              </div>
              <Button
                size="lg"
                className="flex-1 h-12 rounded-full text-base"
                onClick={() => add(product, qty)}
              >
                Adicionar ao carrinho
              </Button>
            </div>
            
            {/* Botão do WhatsApp */}
            <Button
              size="lg"
              variant="outline"
              className="w-full h-12 rounded-full text-base border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700 gap-2"
              onClick={handleWhatsAppClick}
            >
              <MessageCircle className="h-5 w-5" />
              Solicitar informações via WhatsApp
            </Button>
          </div>

          {/* Garantias */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 rounded-2xl border border-border p-4">
              <ShieldCheck className="h-5 w-5 text-accent" />
              <div>
                <div className="text-sm font-medium">Garantia 2 anos</div>
                <div className="text-xs text-muted-foreground">no motor</div>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-border p-4">
              <Truck className="h-5 w-5 text-accent" />
              <div>
                <div className="text-sm font-medium">Frete grátis</div>
                <div className="text-xs text-muted-foreground">todo Brasil</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Specs */}
      <div className="mt-24">
        <h2 className="font-display text-3xl font-bold mb-8">Especificações</h2>
        <div className="grid gap-px bg-border rounded-3xl overflow-hidden md:grid-cols-3">
          {specIcons.map((s) => (
            <div key={s.label} className="bg-card p-6 flex items-center gap-4">
              <s.icon className="h-6 w-6 text-muted-foreground" strokeWidth={1.5} />
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</div>
                <div className="font-display text-xl font-semibold">{s.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductDetail;
