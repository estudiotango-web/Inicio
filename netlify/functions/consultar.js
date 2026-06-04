const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxCeFLeV_6TcQRPxxoTZu8zdvgjd4jh4f58mz-yhAJFCQvbriO4TzXA70eghw4EQQr-zg/exec";

exports.handler = async function(event) {
  const cuit = ((event.queryStringParameters && event.queryStringParameters.cuit) || "").replace(/\D/g, "");

  if (!cuit || cuit.length !== 11) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ok: false, error: "Ingresá un CUIT/CUIL válido de 11 dígitos." })
    };
  }

  try {
    const res = await fetch(`${APPS_SCRIPT_URL}?cuit=${cuit}`);
    const data = await res.json();
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store"
      },
      body: JSON.stringify(data)
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ok: false, error: "Error al conectar con el servidor." })
    };
  }
};
