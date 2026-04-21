export const Footer = () => (
  <footer className="border-t border-border/60 bg-secondary/40 mt-24">
    <div className="mx-auto max-w-7xl px-6 py-16 grid gap-12 md:grid-cols-4">
      <div className="md:col-span-2">
        <div className="font-display text-2xl font-bold">Eco Bike <span className="text-muted-foreground font-light">Caraguá</span></div>
        <p className="mt-4 max-w-sm text-sm text-muted-foreground leading-relaxed">
          Mobilidade elétrica premium em Caraguatatuba. Bicicletas, scooters e motos elétricas para o litoral norte e todo o Brasil.
        </p>
      </div>
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider mb-4">Loja</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>Urbanas</li>
          <li>Off-road</li>
          <li>Compactas</li>
          <li>Cruiser</li>
        </ul>
      </div>
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider mb-4">Suporte</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>Garantia 2 anos</li>
          <li>Frete grátis Brasil</li>
          <li>Pagamento via PIX</li>
          <li>contato@ecobikecaragua.com.br</li>
          <li>Caraguatatuba — SP</li>
        </ul>
      </div>
    </div>
    <div className="border-t border-border/60 px-6 py-6 text-center text-xs text-muted-foreground">
      © 2026 Eco Bike Caraguá — Todos os direitos reservados
    </div>
  </footer>
);
