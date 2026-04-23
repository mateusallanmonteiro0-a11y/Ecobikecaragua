import { Link } from "react-router-dom";
import { ArrowRight, Battery, Gauge, Shield, Zap, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { Testimonials } from "@/components/Testimonials";
import { products } from "@/data/products";
import heroImg from "@/assets/hero-bike.jpg";

const Home = () => {
  const featured = products.slice(0, 3);

  // Função para enviar mensagem via WhatsApp
  const handleWhatsAppClick = () => {
    // Número do WhatsApp (SUBSTITUA PELO SEU NÚMERO)
    const phoneNumber = "5511967064102"; // ⚠️ ALTERE PARA SEU NÚMERO AQUI
    
    // Mensagem de contato geral
    const message = `*🚀 OLÁ! VI O SITE DA ECO BIKE` +
      `Estou interessado em saber mais sobre as bicicletas elétricas!%0A%0A` +
      `*💬 Informações que gostaria de receber:*%0A` +
      `• Catálogo completo de produtos%0A` +
      `• Tabela de preços e condições%0A` +
      `• Informações sobre garantia%0A` +
      `• Opções de frete e prazo de entrega%0A` +
      `• Disponibilidade de test ride%0A%0A` +
      `*📞 Pode me chamar para conversarmos!*%0A%0A` +
      `_Mensagem enviada pelo site - Seção de depoimentos_`;
    
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="relative h-[85vh] min-h-[600px] w-full">
          <img
            src={heroImg}
            alt="Pessoa pilotando moto elétrica VOLT pela cidade ao amanhecer"
            width={1920}
            height={1280}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/85" />
          <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-20 text-primary-foreground">
            <div className="max-w-3xl animate-fade-up">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-wider backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                Nova coleção 2026
              </span>
              <h1 className="mt-6 font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] text-balance">
                A cidade muda. Você também.
              </h1>
              <p className="mt-6 max-w-xl text-base md:text-lg text-white/80 leading-relaxed">
                Bicicletas, scooters e motos 100% elétricas. Design premium, autonomia real, garantia de 2 anos no motor.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link to="/loja">
                  <Button size="lg" className="h-14 rounded-full px-8 text-base bg-white text-primary hover:bg-white/90">
                    Explorar coleção <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/sobre">
                  <Button size="lg" variant="outline" className="h-14 rounded-full px-8 text-base bg-transparent border-white/30 text-white hover:bg-white/10 hover:text-white">
                    Tecnologia
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MÉTRICAS */}
      <section className="border-y border-border/60 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: Battery, label: "Autonomia até", value: "150 km" },
            { icon: Gauge, label: "Velocidade máx.", value: "110 km/h" },
            { icon: Zap, label: "Carga rápida", value: "2.5 h" },
            { icon: Shield, label: "Garantia motor", value: "2 anos" },
          ].map((m) => (
            <div key={m.label} className="flex items-center gap-4">
              <m.icon className="h-7 w-7 text-accent" strokeWidth={1.5} />
              <div>
                <div className="font-display text-2xl font-bold">{m.value}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">{m.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* DESTAQUES */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
          <div>
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Best sellers</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mt-2">Mais desejados</h2>
          </div>
          <Link to="/loja" className="group inline-flex items-center gap-2 text-sm font-medium">
            Ver todos
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="relative overflow-hidden rounded-[2rem] bg-primary text-primary-foreground p-12 md:p-20">
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
          <div className="relative max-w-2xl">
            <h2 className="font-display text-4xl md:text-6xl font-bold leading-tight">
              Frete grátis. <br />
              Em todo o Brasil.
            </h2>
            <p className="mt-6 text-lg text-primary-foreground/70">
              Receba em casa em até 7 dias úteis. Pague em até 6x sem juros, 24x com juros ou 10% off no PIX.
            </p>
            <Link to="/loja">
              <Button size="lg" className="mt-10 h-14 rounded-full px-8 bg-accent text-accent-foreground hover:bg-accent/90">
                Comprar agora <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* DEPOIMENTOS */}
      <Testimonials />

      {/* BOTÃO WHATSAPP - SEÇÃO DE CONTATO */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-green-500 to-green-600 text-white p-12 md:p-16">
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/20 blur-3xl" />
          <div className="relative flex flex-col items-center text-center">
            <div className="inline-flex items-center justify-center rounded-full bg-white/20 p-4 mb-6">
              <MessageCircle className="h-8 w-8" />
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
              Ficou alguma dúvida?
            </h2>
            <p className="text-lg text-white/90 max-w-2xl mb-8">
              Nossa equipe está pronta para te atender! Tire todas suas dúvidas sobre modelos, financiamento, entrega e muito mais.
            </p>
            <Button 
              onClick={handleWhatsAppClick}
              size="lg" 
              className="bg-white text-green-600 hover:bg-white/90 hover:text-green-700 h-14 rounded-full px-8 text-base font-semibold gap-2 shadow-lg"
            >
              <MessageCircle className="h-5 w-5" />
              Falar com especialista no WhatsApp
              <ArrowRight className="h-4 w-4" />
            </Button>
            <p className="text-sm text-white/80 mt-6">
              ⚡ Resposta rápida • Segunda a Sexta, 9h às 18h
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
