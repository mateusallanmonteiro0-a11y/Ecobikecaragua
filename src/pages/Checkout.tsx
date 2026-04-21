import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart, formatBRL } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, CreditCard, QrCode, Lock, CheckCircle2, Copy, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useMercadoPago } from "@/hooks/useMercadoPago";
import { maskCPF, maskPhone, maskCEP, maskCardNumber, maskCardExp, maskCVV } from "@/lib/masks";

const callPayment = async (body: unknown) => {
  const resp = await fetch("/.netlify/functions/create-payment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await resp.json().catch(() => ({}));
  if (!resp.ok) throw new Error(data?.error || `HTTP ${resp.status}`);
  return data;
};

type PaymentMethod = "pix" | "card";

const onlyDigits = (v: string) => v.replace(/\D/g, "");

// ⚠️ CONFIGURE SEU EMAIL FIXO AQUI ⚠️
const FIXED_EMAIL = "seuemail@seudominio.com"; // ALTERE PARA SEU EMAIL

const Checkout = () => {
  const { items, total, clear } = useCart();
  const navigate = useNavigate();
  const { mp, error: mpError } = useMercadoPago();

  const [method, setMethod] = useState<PaymentMethod>("pix");
  const [submitting, setSubmitting] = useState(false);

  // dados do cliente
  const [name, setName] = useState("");
  const [customerEmail, setCustomerEmail] = useState(""); // Email que o cliente DIGITA (apenas para registro)
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");
  const [cep, setCep] = useState("");
  const [city, setCity] = useState("");
  const [addr, setAddr] = useState("");

  // cartão
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExp, setCardExp] = useState(""); // MM/AA
  const [cardCvv, setCardCvv] = useState("");
  const [installments, setInstallments] = useState("1");

  // resultado
  const [pixResult, setPixResult] = useState<{ qr_code: string; qr_code_base64: string } | null>(null);
  const [success, setSuccess] = useState(false);


// Rola pro topo quando aparece o QR Code do PIX ou a tela de sucesso
  useEffect(() => {
    if (pixResult || success) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [pixResult, success]);

  
  // Função para enviar email de confirmação para o email fixo
  const sendConfirmationEmail = async (orderData: any) => {
    try {
      const response = await fetch("/.netlify/functions/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: FIXED_EMAIL, // Email fixo que vai receber
          customerEmail: customerEmail, // Email do cliente (para registro)
          customerName: name,
          customerPhone: phone,
          items: items,
          total: finalTotal,
          paymentMethod: method,
          installments: method === "card" ? installments : "1x à vista",
          address: { cep, city, addr }
        }),
      });
      
      if (!response.ok) {
        console.error("Erro ao enviar email");
      }
    } catch (error) {
      console.error("Erro ao enviar email:", error);
    }
  };

  const pixDiscount = method === "pix" ? total * 0.1 : 0;
  const finalTotal = useMemo(() => Math.max(0, total - pixDiscount), [total, pixDiscount]);

  // opções de parcelamento: 1x-6x sem juros, 7x-24x com juros (2,99% a.m. - Tabela Price)
  const installmentOptions = useMemo(() => {
    const monthlyRate = 0.0299;
    const freeUntil = 6;
    return Array.from({ length: 24 }, (_, i) => {
      const n = i + 1;
      if (n <= freeUntil) {
        const value = finalTotal / n;
        return { n, label: `${n}x de ${formatBRL(value)} sem juros` };
      }
      // Tabela Price: PMT = PV * i / (1 - (1+i)^-n)
      const value = (finalTotal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -n));
      return { n, label: `${n}x de ${formatBRL(value)} com juros` };
    });
  }, [finalTotal]);

  const handlePix = async () => {
    // Usa o email fixo para o pagamento
    const data = await callPayment({
      type: "pix",
      amount: finalTotal,
      description: `Pedido Eco Bike Caraguá - ${items.length} item(s)`,
      payer: {
        email: FIXED_EMAIL, // Email fixo para recebimento
        first_name: name.split(" ")[0] || name,
        last_name: name.split(" ").slice(1).join(" ") || "Cliente",
        identification: { type: "CPF", number: onlyDigits(cpf) },
      },
    });
    if (!data?.qr_code) throw new Error("QR Code não retornado");
    setPixResult({ qr_code: data.qr_code, qr_code_base64: data.qr_code_base64 });
    
    // Envia email de confirmação
    await sendConfirmationEmail({});
  };

  const handleCard = async () => {
    if (!mp) throw new Error("SDK do Mercado Pago ainda carregando, tente novamente");

    const [expMonth, expYearShort] = cardExp.split("/");
    if (!expMonth || !expYearShort) throw new Error("Validade inválida (use MM/AA)");
    const expYear = `20${expYearShort}`;

    // 1) Identifica bandeira
    const bin = onlyDigits(cardNumber).slice(0, 8);
    const methods = await mp.getPaymentMethods({ bin });
    const pm = methods?.results?.[0];
    if (!pm) throw new Error("Bandeira do cartão não reconhecida");

    // 2) Tokeniza
    const tokenResp = await mp.createCardToken({
      cardNumber: onlyDigits(cardNumber),
      cardholderName: cardName,
      cardExpirationMonth: expMonth,
      cardExpirationYear: expYear,
      securityCode: cardCvv,
      identificationType: "CPF",
      identificationNumber: onlyDigits(cpf),
    });
    if (!tokenResp?.id) throw new Error("Falha ao validar cartão");

    // 3) Cria pagamento usando email fixo
    const data = await callPayment({
      type: "card",
      amount: finalTotal,
      description: `Pedido Eco Bike Caraguá - ${items.length} item(s)`,
      token: tokenResp.id,
      installments: Number(installments),
      payment_method_id: pm.id,
      issuer_id: pm.issuer?.id ? String(pm.issuer.id) : undefined,
      payer: { email: FIXED_EMAIL, identification: { type: "CPF", number: onlyDigits(cpf) } }, // Email fixo
    });

    if (data.status === "approved") {
      await sendConfirmationEmail({}); // Envia email de confirmação
      setSuccess(true);
      clear();
    } else if (data.status === "in_process" || data.status === "pending") {
      await sendConfirmationEmail({}); // Envia mesmo em análise
      toast.info("Pagamento em análise. Você receberá uma confirmação por e-mail.");
      setSuccess(true);
      clear();
    } else {
      throw new Error(`Pagamento recusado: ${data.status_detail ?? data.status}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      if (method === "pix") await handlePix();
      else await handleCard();
    } catch (err) {
      toast.error((err as Error).message || "Erro ao processar pagamento");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (mpError) toast.error("SDK pagamento: " + mpError);
  }, [mpError]);

  // ----- TELAS -----
  if (success) {
    return (
      <section className="mx-auto max-w-2xl px-6 py-24 text-center">
        <CheckCircle2 className="mx-auto h-20 w-20 text-accent" strokeWidth={1.5} />
        <h1 className="mt-8 font-display text-4xl font-bold">Pedido confirmado!</h1>
        <p className="mt-4 text-muted-foreground">
          Recebemos seu pedido. Em breve você receberá uma confirmação por e-mail.
        </p>
        <Link to="/loja">
          <Button className="mt-10 h-12 rounded-full px-8">Continuar comprando</Button>
        </Link>
      </section>
    );
  }

  if (pixResult) {
    return (
      <section className="mx-auto max-w-xl px-6 py-16">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-center">Escaneie para pagar</h1>
        <p className="mt-3 text-center text-muted-foreground">
          Abra o app do seu banco, vá em PIX → Ler QR Code.
        </p>
        <div className="mt-10 rounded-3xl border border-border bg-card p-6 md:p-10 text-center">
          <img
            src={`data:image/png;base64,${pixResult.qr_code_base64}`}
            alt="QR Code PIX"
            className="mx-auto h-64 w-64"
          />
          <div className="mt-6 text-2xl font-display font-bold">{formatBRL(finalTotal)}</div>
          <p className="text-xs text-muted-foreground mt-1">10% de desconto PIX já aplicado</p>

          <div className="mt-8 text-left">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">PIX Copia e Cola</Label>
            <div className="mt-2 flex gap-2">
              <Input readOnly value={pixResult.qr_code} className="font-mono text-xs" />
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(pixResult.qr_code);
                  toast.success("Código copiado!");
                }}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <p className="mt-8 text-xs text-muted-foreground">
            Após o pagamento, a confirmação chega em segundos.
          </p>
        </div>
        <button
          onClick={() => setPixResult(null)}
          className="mt-6 mx-auto block text-sm text-muted-foreground hover:text-primary"
        >
          ← Voltar ao checkout
        </button>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="font-display text-3xl font-bold">Seu carrinho está vazio</h1>
        <Link to="/loja">
          <Button className="mt-8 h-12 rounded-full px-8">Ir à loja</Button>
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar
      </button>

      <h1 className="font-display text-4xl md:text-5xl font-bold mb-12">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid gap-12 lg:grid-cols-[1fr_400px]">
        <div className="space-y-10">
          {/* Dados pessoais */}
          <div>
            <h2 className="font-display text-xl font-semibold mb-6">Dados pessoais</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label htmlFor="name">Nome completo *</Label>
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                  className="mt-2 h-12 rounded-xl" 
                  placeholder="Digite seu nome completo"
                />
              </div>
              <div>
                <Label htmlFor="customerEmail">Seu e-mail *</Label>
                <Input 
                  id="customerEmail" 
                  type="email" 
                  value={customerEmail} 
                  onChange={(e) => setCustomerEmail(e.target.value)} 
                  required 
                  className="mt-2 h-12 rounded-xl" 
                  placeholder="seu@email.com"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Seu e-mail será registrado para identificação do pedido
                </p>
              </div>
              <div>
                <Label htmlFor="cpf">CPF *</Label>
                <Input 
                  id="cpf" 
                  value={cpf} 
                  onChange={(e) => setCpf(maskCPF(e.target.value))} 
                  placeholder="000.000.000-00" 
                  inputMode="numeric" 
                  required 
                  className="mt-2 h-12 rounded-xl" 
                />
              </div>
              <div>
                <Label htmlFor="phone">Telefone *</Label>
                <Input 
                  id="phone" 
                  value={phone} 
                  onChange={(e) => setPhone(maskPhone(e.target.value))} 
                  placeholder="(00) 00000-0000" 
                  inputMode="numeric" 
                  required 
                  className="mt-2 h-12 rounded-xl" 
                />
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div>
            <h2 className="font-display text-xl font-semibold mb-6">Endereço de entrega</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="cep">CEP *</Label>
                <Input 
                  id="cep" 
                  value={cep} 
                  onChange={(e) => setCep(maskCEP(e.target.value))} 
                  placeholder="00000-000" 
                  inputMode="numeric" 
                  required 
                  className="mt-2 h-12 rounded-xl" 
                />
              </div>
              <div>
                <Label htmlFor="city">Cidade *</Label>
                <Input 
                  id="city" 
                  value={city} 
                  onChange={(e) => setCity(e.target.value)} 
                  required 
                  className="mt-2 h-12 rounded-xl" 
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="addr">Endereço completo *</Label>
                <Input 
                  id="addr" 
                  value={addr} 
                  onChange={(e) => setAddr(e.target.value)} 
                  required 
                  className="mt-2 h-12 rounded-xl" 
                  placeholder="Rua, número, complemento, bairro"
                />
              </div>
            </div>
          </div>

          {/* Pagamento */}
          <div>
            <h2 className="font-display text-xl font-semibold mb-6">Forma de pagamento</h2>
            <RadioGroup value={method} onValueChange={(v) => setMethod(v as PaymentMethod)} className="grid gap-3">
              {[
                { value: "pix" as const, icon: QrCode, label: "PIX", desc: "10% de desconto · QR Code na hora" },
                { value: "card" as const, icon: CreditCard, label: "Cartão de crédito", desc: "Até 6x sem juros · 24x com juros" },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-center gap-4 rounded-2xl border p-4 cursor-pointer transition-all ${
                    method === opt.value ? "border-primary bg-secondary/40" : "border-border"
                  }`}
                >
                  <RadioGroupItem value={opt.value} id={opt.value} />
                  <opt.icon className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="font-medium">{opt.label}</div>
                    <div className="text-xs text-muted-foreground">{opt.desc}</div>
                  </div>
                </label>
              ))}
            </RadioGroup>

            {method === "card" && (
              <div className="mt-4 grid gap-4 sm:grid-cols-2 p-4 rounded-2xl bg-secondary/40">
                <div className="sm:col-span-2">
                  <Label>Número do cartão</Label>
                  <Input
                    placeholder="0000 0000 0000 0000"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(maskCardNumber(e.target.value))}
                    inputMode="numeric"
                    required
                    className="mt-2 h-12 rounded-xl bg-background"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label>Nome impresso no cartão</Label>
                  <Input
                    placeholder="NOME COMO NO CARTÃO"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value.toUpperCase())}
                    required
                    className="mt-2 h-12 rounded-xl bg-background"
                  />
                </div>
                <div>
                  <Label>Validade</Label>
                  <Input
                    placeholder="MM/AA"
                    value={cardExp}
                    onChange={(e) => setCardExp(maskCardExp(e.target.value))}
                    inputMode="numeric"
                    required
                    className="mt-2 h-12 rounded-xl bg-background"
                  />
                </div>
                <div>
                  <Label>CVV</Label>
                  <Input
                    placeholder="000"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(maskCVV(e.target.value))}
                    inputMode="numeric"
                    required
                    className="mt-2 h-12 rounded-xl bg-background"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label>Parcelamento</Label>
                  <Select value={installments} onValueChange={setInstallments}>
                    <SelectTrigger className="mt-2 h-12 rounded-xl bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-72">
                      {installmentOptions.map((opt) => (
                        <SelectItem key={opt.n} value={String(opt.n)}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Resumo */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl border border-border bg-card p-6 space-y-5">
            <h3 className="font-display text-lg font-semibold">Resumo do pedido</h3>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {items.map(({ product, qty }) => (
                <div key={product.id} className="flex gap-3">
                  <img src={product.image} alt={product.name} className="h-14 w-14 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{product.name}</div>
                    <div className="text-xs text-muted-foreground">Qtd: {qty}</div>
                  </div>
                  <div className="text-sm font-medium">{formatBRL(product.price * qty)}</div>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatBRL(total)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Frete</span><span className="text-accent font-medium">Grátis</span></div>
              {pixDiscount > 0 && (
                <div className="flex justify-between text-accent">
                  <span>Desconto PIX (10%)</span><span>− {formatBRL(pixDiscount)}</span>
                </div>
              )}
              <div className="flex items-baseline justify-between pt-3 border-t border-border">
                <span className="font-semibold">Total</span>
                <span className="font-display text-2xl font-bold">{formatBRL(finalTotal)}</span>
              </div>
            </div>
            <Button type="submit" disabled={submitting} className="w-full h-12 rounded-full text-base">
              {submitting ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processando...</>
              ) : method === "pix" ? "Gerar QR Code PIX" : "Pagar com cartão"}
            </Button>
            <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Lock className="h-3 w-3" /> Pagamento processado por Mercado Pago
            </p>
          </div>
        </aside>
      </form>
    </section>
  );
};

export default Checkout;
