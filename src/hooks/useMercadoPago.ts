import { useEffect, useState } from "react";

declare global {
  interface Window {
    MercadoPago?: any;
  }
}

let cachedKey: string | null = null;
let scriptPromise: Promise<void> | null = null;

const loadScript = (): Promise<void> => {
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
    if (window.MercadoPago) return resolve();
    const s = document.createElement("script");
    s.src = "https://sdk.mercadopago.com/js/v2";
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Falha ao carregar SDK do Mercado Pago"));
    document.head.appendChild(s);
  });
  return scriptPromise;
};

export const useMercadoPago = () => {
  const [mp, setMp] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (!cachedKey) {
          const resp = await fetch("/.netlify/functions/get-mp-public-key");
          if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
          const data = await resp.json();
          if (!data?.publicKey) throw new Error("Chave pública não retornada");
          cachedKey = data.publicKey as string;
        }
        await loadScript();
        if (cancelled) return;
        const instance = new window.MercadoPago(cachedKey, { locale: "pt-BR" });
        setMp(instance);
      } catch (e) {
        if (!cancelled) setError((e as Error).message);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { mp, error };
};
