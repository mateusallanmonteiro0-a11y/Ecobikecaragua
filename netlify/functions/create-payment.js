// Netlify Function: cria pagamentos no Mercado Pago (PIX e Cartão)
// Endpoint: /.netlify/functions/create-payment

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: corsHeaders, body: "ok" };
  }
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const accessToken = process.env.MP_ACCESS_TOKEN;
    if (!accessToken) {
      return {
        statusCode: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({ error: "MP_ACCESS_TOKEN não configurado no Netlify" }),
      };
    }

    const body = JSON.parse(event.body || "{}");

    if (!body || typeof body.amount !== "number" || body.amount <= 0) {
      return {
        statusCode: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Valor inválido" }),
      };
    }
    if (!body.payer?.email) {
      return {
        statusCode: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({ error: "E-mail do pagador é obrigatório" }),
      };
    }

    // Sanitiza CPF
    const rawCpf = body.payer.identification?.number ?? "";
    const cpfDigits = String(rawCpf).replace(/\D/g, "");
    if (cpfDigits.length !== 11) {
      return {
        statusCode: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({ error: "CPF inválido. Informe os 11 dígitos do CPF." }),
      };
    }

    const payer = {
      ...body.payer,
      identification: { type: "CPF", number: cpfDigits },
    };

    const paymentData = {
      transaction_amount: Number(body.amount.toFixed(2)),
      description: body.description ?? "Pedido Eco Bike Caraguá",
      payer,
    };

    if (body.type === "pix") {
      paymentData.payment_method_id = "pix";
    } else if (body.type === "card") {
      paymentData.token = body.token;
      paymentData.installments = Number(body.installments) || 1;
      paymentData.payment_method_id = body.payment_method_id;
      if (body.issuer_id) paymentData.issuer_id = body.issuer_id;
    } else {
      return {
        statusCode: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Tipo de pagamento inválido" }),
      };
    }

    const idempotencyKey =
      (globalThis.crypto && globalThis.crypto.randomUUID && globalThis.crypto.randomUUID()) ||
      `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    const mpResp = await fetch("https://api.mercadopago.com/v1/payments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-Idempotency-Key": idempotencyKey,
      },
      body: JSON.stringify(paymentData),
    });

    const mpJson = await mpResp.json();

    if (!mpResp.ok) {
      console.error("Mercado Pago error:", mpJson);
      return {
        statusCode: mpResp.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({
          error: mpJson.message ?? "Falha ao criar pagamento",
          details: mpJson,
        }),
      };
    }

    return {
      statusCode: 201,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({
        id: mpJson.id,
        status: mpJson.status,
        status_detail: mpJson.status_detail,
        qr_code: mpJson.point_of_interaction?.transaction_data?.qr_code ?? null,
        qr_code_base64: mpJson.point_of_interaction?.transaction_data?.qr_code_base64 ?? null,
        ticket_url: mpJson.point_of_interaction?.transaction_data?.ticket_url ?? null,
      }),
    };
  } catch (err) {
    console.error("create-payment exception:", err);
    return {
      statusCode: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ error: err.message || "Erro interno" }),
    };
  }
};
