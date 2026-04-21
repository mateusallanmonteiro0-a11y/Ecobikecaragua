import { Battery, Cpu, Recycle, ShieldCheck } from "lucide-react";

const About = () => (
  <section className="mx-auto max-w-5xl px-6 py-24">
    <span className="text-xs uppercase tracking-wider text-muted-foreground">Tecnologia</span>
    <h1 className="mt-2 font-display text-5xl md:text-7xl font-bold leading-[0.95] text-balance">
      Engenharia que silencia ruas.
    </h1>
    <p className="mt-8 max-w-2xl text-lg text-muted-foreground leading-relaxed">
      Cada Eco Bike Caraguá é projetada do zero para 2026: motores brushless eficientes, baterias de íons de lítio
      com BMS inteligente, conectividade nativa e materiais recicláveis. Mobilidade sem concessões, do litoral à serra.
    </p>

    <div className="mt-20 grid gap-px bg-border rounded-3xl overflow-hidden md:grid-cols-2">
      {[
        { icon: Battery, title: "Baterias Samsung 21700", desc: "Células premium com até 1500 ciclos de vida útil e BMS de proteção térmica." },
        { icon: Cpu, title: "Motor brushless de alta eficiência", desc: "Torque instantâneo, manutenção mínima e até 92% de eficiência energética." },
        { icon: ShieldCheck, title: "Garantia real de 2 anos", desc: "Cobertura completa no motor e bateria. Assistência técnica em todo o Brasil." },
        { icon: Recycle, title: "Materiais sustentáveis", desc: "Quadros em alumínio reciclado e embalagem 100% livre de plástico." },
      ].map((f) => (
        <div key={f.title} className="bg-card p-10">
          <f.icon className="h-7 w-7 text-accent" strokeWidth={1.5} />
          <h3 className="mt-6 font-display text-xl font-semibold">{f.title}</h3>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
        </div>
      ))}
    </div>
  </section>
);

export default About;
