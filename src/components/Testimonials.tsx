import { Star, BadgeCheck } from "lucide-react";
import avatar1 from "@/assets/FB_IMG_1776744213937.jpg";
import avatar2 from "@/assets/FB_IMG_1776739633796.jpg";
import avatar3 from "@/assets/FB_IMG_1776744264115.jpg";



type Review = {
  name: string;
  city: string;
  avatar: string;
  rating: number;
  date: string;
  product: string;
  text: string;
};

// Fotos do Unsplash — licença gratuita para uso comercial (https://unsplash.com/license)
const reviews: Review[] = [
  {
    name: "Rafael Mendes",
    city: "São Paulo, SP",
    avatar: avatar1,
    rating: 5,
    date: "há 2 semanas",
    product: "Volt Urban Pro",
    text: "Chegou em 4 dias, embalada igual relógio suíço. Já fiz mais de 200 km e a autonomia bate o que eles prometem. Suporte respondeu no WhatsApp em minutos quando tive uma dúvida do app. Recomendo demais!",
  },
  {
    name: "Juliana Carvalho",
    city: "Belo Horizonte, MG",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=faces",
    rating: 5,
    date: "há 1 mês",
    product: "Volt City One",
    text: "Comprei pra ir trabalhar e troquei o carro por ela de vez. Economia absurda de combustível e estacionamento. Design lindo, todo mundo pergunta onde comprei. Paguei no PIX com 10% off ❤️",
  },
  {
    name: "Antônio Ferreira",
    city: "Caraguatatuba, SP",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=faces",
    rating: 5,
    date: "há 1 semana",
    product: "Volt Café Racer",
    text: "Aqui em Caraguá, andar de moto elétrica na orla é outra experiência. Silenciosa, bonita e a bateria aguenta tranquilo o passeio até Maresias. Atendimento da loja foi nota 10, tirou todas as dúvidas antes da compra.",
  },
  {
    name: "Beatriz Oliveira",
    city: "Salvador, BA",
    avatar: avatar2,
    rating: 5,
    date: "há 5 dias",
    product: "Volt Mini Fold",
    text: "Mora em apartamento e precisava de algo prático — essa dobrável é perfeita. Subo no elevador sem problema e carrego dentro de casa. Bateria removível ajuda muito 👏",
  },
  {
    name: "Marcos Pereira",
    city: "Rio de Janeiro, RJ",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces",
    rating: 5,
    date: "há 2 meses",
    product: "Volt Trail RX",
    text: "Levei pra trilha em Petrópolis e essa moto é outro nível. Suspensão impecável, sem barulho de motor pra atrapalhar a natureza. Já indiquei pros amigos do grupo de off-road.",
  },
  {
    name: "Patrícia Lima",
    city: "Florianópolis, SC",
    avatar: avatar3,
    rating: 4,
    date: "há 3 dias",
    product: "Volt Smart Red",
    text: "Chegou tudo certinho e bem antes do prazo. Bike linda, super confortável e a cestinha é uma fofura. Tirei uma estrela só porque o manual veio em inglês, mas o resto é nota 1000!",
  },
];

const Stars = ({ count }: { count: number }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < count ? "fill-accent text-accent" : "text-muted-foreground/30"}`}
      />
    ))}
  </div>
);

export const Testimonials = () => (
  <section className="mx-auto max-w-7xl px-6 pb-24">
    <div className="mb-12 text-center">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">Avaliações reais</span>
      <h2 className="font-display text-4xl md:text-5xl font-bold mt-2">
        Quem comprou, aprovou
      </h2>
      <div className="mt-4 inline-flex items-center gap-3 rounded-full border border-border bg-card px-5 py-2">
        <Stars count={5} />
        <span className="text-sm font-medium">4.9 / 5</span>
        <span className="text-sm text-muted-foreground">· mais de 2.300 avaliações</span>
      </div>
    </div>

    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {reviews.map((r) => (
        <article
          key={r.name}
          className="flex flex-col gap-4 rounded-3xl bg-card border border-border p-6 shadow-soft transition-all duration-300 hover:shadow-elevated hover:-translate-y-1"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <img
                src={r.avatar}
                alt={`Foto de ${r.name}`}
                loading="lazy"
                width={56}
                height={56}
                className="h-14 w-14 rounded-full object-cover"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold">{r.name}</span>
                  <BadgeCheck className="h-4 w-4 text-accent" />
                </div>
                <div className="text-xs text-muted-foreground">{r.city}</div>
              </div>
            </div>
            <Stars count={r.rating} />
          </div>

          <p className="text-sm leading-relaxed text-foreground/90">"{r.text}"</p>

          <div className="mt-auto flex items-center justify-between border-t border-border/60 pt-3 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">{r.product}</span>
            <span>{r.date}</span>
          </div>
        </article>
      ))}
    </div>
  </section>
);
