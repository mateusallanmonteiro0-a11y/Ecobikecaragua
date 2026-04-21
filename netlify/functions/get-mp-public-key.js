// Netlify Function: retorna a Public Key do Mercado Pago para o SDK do front
// Endpoint: /.netlify/functions/get-mp-public-key

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: corsHeaders, body: "ok" };
  }

  const publicKey = process.env.MP_PUBLIC_KEY;
  if (!publicKey) {
    return {
      statusCode: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ error: "MP_PUBLIC_KEY não configurada no Netlify" }),
    };
  }

  return {
    statusCode: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    body: JSON.stringify({ publicKey }),
  };
};
