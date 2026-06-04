const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw0HjM7_HzP3aX6Ye2AMGF21QtUyefO8CQf_hjiNHHBOp3e77-g5RjkZD9llRHheWTC/exec";

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
    const res = await fetch(`${APPS_SCRIPT_URL}?cuit=${cuit}&origen=estudiotango.netlify.app/`); 
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
