/* ════════════════════════════════════════════
   CONFIG
════════════════════════════════════════════ */
// CAMBIO A: URL de reserva
const RESERVA_URL = "https://estudiotango-web.github.io/Inicio/turnos.html";

const API = "https://script.google.com/macros/s/AKfycbw0HjM7_HzP3aX6Ye2AMGF21QtUyefO8CQf_hjiNHHBOp3e77-g5RjkZD9llRHheWTC/exec";
const TURNO_URL = "#";
let ultimoCuitConsultado = "";

document.getElementById("year").textContent = new Date().getFullYear();

/* ════════════════════════════════════════════
   DETECCIÓN DE MOBILE
════════════════════════════════════════════ */
function isMobile() {
  return window.innerWidth <= 860;
}

/* ════════════════════════════════════════════
   STICKY SEARCH BAR
════════════════════════════════════════════ */
var stickyBar  = document.getElementById("sticky-search-bar");
var searchCard = document.getElementById("search-card");

var userHasScrolled = false;
window.addEventListener("scroll", function () { userHasScrolled = true; }, { once: true, passive: true });

function updateStickyBar() {
  if (!isMobile()) return;
  if (!userHasScrolled) return;
  var rect = searchCard.getBoundingClientRect();
  if (rect.bottom < 0) {
    stickyBar.classList.add("visible");
  } else {
    stickyBar.classList.remove("visible");
  }
}

window.addEventListener("scroll", updateStickyBar, { passive: true });
window.addEventListener("resize", updateStickyBar, { passive: true });

/* Sincronizar inputs */
var cuitMain   = document.getElementById("cuit");
var cuitSticky = document.getElementById("cuit-sticky");

cuitMain.addEventListener("input", function (e) {
  var v = e.target.value.replace(/\D/g, "").slice(0, 11);
  e.target.value = v;
  cuitSticky.value = v;
});
cuitSticky.addEventListener("input", function (e) {
  var v = e.target.value.replace(/\D/g, "").slice(0, 11);
  e.target.value = v;
  cuitMain.value = v;
});

/* Enter en ambos inputs */
cuitMain.addEventListener("keydown",   function (e) { if (e.key === "Enter") consultar(); });
cuitSticky.addEventListener("keydown", function (e) { if (e.key === "Enter") consultarSticky(); });

/* Desde el sticky bar */
function consultarSticky() {
  cuitMain.value = cuitSticky.value;
  document.getElementById("search-card").scrollIntoView({ behavior: "smooth", block: "start" });
  setTimeout(function () { consultar(); }, 350);
}

/* ════════════════════════════════════════════
   MODO RESULTADO EN MOBILE
════════════════════════════════════════════ */
function activarModoResultado() {
  if (!isMobile()) return;
  document.body.classList.add("modo-resultado");
  var mh = document.getElementById("resultado-mobile-header");
  if (mh) mh.style.display = "flex";
  stickyBar.classList.remove("visible");
}

function cerrarResultado() {
  document.body.classList.remove("modo-resultado");
  var mh = document.getElementById("resultado-mobile-header");
  if (mh) mh.style.display = "none";
  document.getElementById("resultado").innerHTML = "";
  window.scrollTo({ top: 0, behavior: "smooth" });
  setTimeout(function () { cuitMain.focus(); }, 400);
}

/* ════════════════════════════════════════════
   GOOGLE ADS — Conversiones
════════════════════════════════════════════ */
function trackConversion(eventName, value) {
  /* Descomentar y completar con IDs reales */
  // if(typeof gtag !== 'undefined') { ... }
}

// CAMBIO B: reservarTurno() simplificada — redirige a RESERVA_URL
function reservarTurno() {
  window.location.href = RESERVA_URL;
}

/* ════════════════════════════════════════════
   LOADER
════════════════════════════════════════════ */
(function initLoader() {
  var lc   = document.getElementById("loader-canvas");
  var lctx = lc.getContext("2d");
  var lparts = [];

  function resizeLC() { lc.width = window.innerWidth; lc.height = window.innerHeight; }
  resizeLC();

  for (var i = 0; i < 35; i++) {
    lparts.push({
      x: Math.random() * lc.width, y: Math.random() * lc.height,
      r: Math.random() * .9 + .2,
      vx: (Math.random() - .5) * .18,
      vy: (Math.random() - .5) * .18 - (Math.random() * .08),
      a: Math.random() * .5 + .1
    });
  }

  function animLoader() {
    lctx.clearRect(0, 0, lc.width, lc.height);
    lparts.forEach(function (p) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = lc.width;  if (p.x > lc.width)  p.x = 0;
      if (p.y < 0) p.y = lc.height; if (p.y > lc.height) p.y = 0;
      lctx.beginPath(); lctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      lctx.fillStyle = "rgba(201,168,76," + p.a + ")"; lctx.fill();
    });
    requestAnimationFrame(animLoader);
  }
  animLoader();

  var msgs   = ["lm0", "lm1", "lm2"];
  var curMsg = 0;
  setTimeout(function rotateLMsg() {
    document.getElementById(msgs[curMsg]).classList.remove("active");
    curMsg = (curMsg + 1) % msgs.length;
    document.getElementById(msgs[curMsg]).classList.add("active");
    if (curMsg !== 0) setTimeout(rotateLMsg, 800);
  }, 800);

  setTimeout(function () { document.getElementById("loader").classList.add("hide"); }, 2500);
})();

/* ════════════════════════════════════════════
   CANVAS FONDO
════════════════════════════════════════════ */
(function initBgCanvas() {
  var canvas = document.getElementById("bg-canvas");
  var ctx    = canvas.getContext("2d");
  var W, H, particles;

  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  resize();
  window.addEventListener("resize", resize);

  var N = 55; particles = [];
  for (var i = 0; i < N; i++) {
    particles.push({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.4 + .3,
      vx: (Math.random() - .5) * .12,
      vy: (Math.random() - .5) * .12,
      a: Math.random() * .45 + .1
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < particles.length; i++) {
      for (var j = i + 1; j < particles.length; j++) {
        var dx   = particles[i].x - particles[j].x;
        var dy   = particles[i].y - particles[j].y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 160) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = "rgba(201,168,76," + (0.07 * (1 - dist / 160)) + ")";
          ctx.lineWidth = .4; ctx.stroke();
        }
      }
    }
    particles.forEach(function (p) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(201,168,76," + p.a + ")"; ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ════════════════════════════════════════════
   ROTADOR DE FEATURES
════════════════════════════════════════════ */
var featCur   = 0;
var featTotal = 3;
var featTimer;

function goFeat(n) {
  var slides = document.querySelectorAll(".feature-slide");
  var dots   = document.querySelectorAll(".feature-dot");
  slides[featCur].classList.remove("active");
  dots[featCur].classList.remove("active");
  dots[featCur].setAttribute("aria-selected", "false");
  featCur = n;
  slides[featCur].classList.add("active");
  dots[featCur].classList.add("active");
  dots[featCur].setAttribute("aria-selected", "true");
  clearInterval(featTimer);
  featTimer = setInterval(nextFeat, 4000);
}

function nextFeat() { goFeat((featCur + 1) % featTotal); }
featTimer = setInterval(nextFeat, 4000);

/* ════════════════════════════════════════════
   PROGRESS PANEL
════════════════════════════════════════════ */
var progTimer = null;

function startProg() {
  document.getElementById("prog-wrap").style.display = "block";
  var fill  = document.getElementById("prog-fill");
  var msgs  = ["pm0", "pm1", "pm2", "pm3"];
  var curPM = 0;
  document.getElementById(msgs[0]).classList.add("active");
  var steps = [{ p: 15, mi: 0 }, { p: 40, mi: 1 }, { p: 65, mi: 2 }, { p: 85, mi: 3 }];
  var i = 0;
  fill.style.width = "5%";
  progTimer = setInterval(function () {
    if (i < steps.length) {
      fill.style.width = steps[i].p + "%";
      document.getElementById(msgs[curPM]).classList.remove("active");
      curPM = steps[i].mi;
      document.getElementById(msgs[curPM]).classList.add("active");
      i++;
    }
  }, 800);
}

function endProg() {
  clearInterval(progTimer);
  document.getElementById("prog-fill").style.width = "100%";
  document.querySelectorAll(".prog-msg").forEach(function (m) { m.classList.remove("active"); });
  setTimeout(function () { document.getElementById("prog-wrap").style.display = "none"; }, 700);
}

/* ════════════════════════════════════════════
   HELPERS
════════════════════════════════════════════ */
const SITS = {
  1: { label: "Al día",          cls: "s1c", dot: "#4A9B6F" },
  2: { label: "Seg. especial",   cls: "s2c", dot: "#C9A84C" },
  3: { label: "Con problemas",   cls: "s3c", dot: "#BA7517" },
  4: { label: "Alto riesgo",     cls: "s4c", dot: "#C0392B" },
  5: { label: "Irrecuperable",   cls: "s5c", dot: "#A32D2D" },
  6: { label: "En quiebra",      cls: "s6c", dot: "#5A5552" }
};

function si(n)  { return SITS[n] || { label: "Situación " + n, cls: "s6c", dot: "#5A5552" }; }
function fmt(n) { return "$" + Math.round(n * 1000).toLocaleString("es-AR"); }
function fmtD(d) {
  if (d && typeof d === "number" && d > 0) return d + " días";
  return "No informa";
}
function ini(nom) {
  if (!nom) return "?";
  var p = nom.trim().split(/\s+/);
  return p.length >= 2 ? (p[0][0] + p[1][0]).toUpperCase() : nom.substring(0, 2).toUpperCase();
}
function fmtPeriodo(p) { var s = String(p); return s.length === 6 ? s.slice(0, 4) + "/" + s.slice(4) : s; }

/* ════════════════════════════════════════════
   CONSULTAR
════════════════════════════════════════════ */
async function consultar() {
  var cuit = cuitMain.value.trim().replace(/\D/g, "");
  ultimoCuitConsultado = cuit;
  var res  = document.getElementById("resultado");
  res.innerHTML = "";

  document.body.classList.remove("modo-resultado");
  var mh = document.getElementById("resultado-mobile-header");
  if (mh) mh.style.display = "none";

  if (!cuit) {
    res.innerHTML = '<div class="error-box" role="alert"><i class="ti ti-alert-circle" aria-hidden="true"></i>Ingresá tu CUIT para continuar.</div>';
    return;
  }

  trackConversion("consulta_iniciada");
  startProg();

  try {

  var json = await new Promise(function(resolve, reject) {

    const callbackName = "bcraCallback_" + Date.now();

    window[callbackName] = function(data) {
      delete window[callbackName];
      document.getElementById("script-bcra")?.remove();
      resolve(data);
    };

    const script = document.createElement("script");
    script.id = "script-bcra";

   script.src =
  API +
  "?cuit=" + encodeURIComponent(cuit) +
  "&callback=" + callbackName +
  "&origen=" + encodeURIComponent("https://estudiotango-web.github.io/Inicio/");
    script.onerror = function() {
      delete window[callbackName];
      reject(new Error("Error al conectar con el servidor."));
    };

    document.body.appendChild(script);
  });

  endProg();

    if (!json.ok) {
      var msg = json.error || "";
      var esMantenimiento = msg.toLowerCase().indexOf("mantenimiento") !== -1
                         || msg.toLowerCase().indexOf("demor")          !== -1
                         || msg.toLowerCase().indexOf("momento")        !== -1;
      if (esMantenimiento) {
        res.innerHTML = '<div class="error-mantenimiento" role="alert">'
          + '<i class="ti ti-tool error-mant-icon" aria-hidden="true"></i>'
          + '<div class="error-mant-badge">Servicio temporalmente no disponible</div>'
          + '<h3 class="error-mant-title">El BCRA está en mantenimiento</h3>'
          + '<p class="error-mant-desc">La central de deudores del Banco Central se encuentra fuera de servicio en este momento. Intentá nuevamente en unos minutos.</p>'
          + '<button class="btn-reintentar" onclick="consultar()"><i class="ti ti-refresh" style="margin-right:6px" aria-hidden="true"></i>Reintentar ahora</button>'
          + '</div>';
      } else {
        res.innerHTML = '<div class="error-box" role="alert"><i class="ti ti-alert-circle" aria-hidden="true"></i>' + msg + '</div>';
      }
      return;
    }

    trackConversion("informe_generado");
    renderizar(json);

    activarModoResultado();

    setTimeout(function () {
      document.getElementById("resultado-wrapper").scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);

  } catch (err) {
    endProg();
    res.innerHTML = '<div class="error-box" role="alert"><i class="ti ti-alert-circle" aria-hidden="true"></i>Error al conectar. Verificá tu conexión.</div>';
  }
}

/* ════════════════════════════════════════════
   RENDERIZAR
════════════════════════════════════════════ */
function renderizar(json) {
  var res = document.getElementById("resultado");
  var d   = json.actual.results;
  var h   = json.historica.results;

  var allE  = (d.periodos || []).flatMap(function (p) { return p.entidades; });
  var peor  = allE.reduce(function (m, e) { return Math.max(m, e.situacion); }, 1) || 1;
  var pi    = si(peor);
  var total = allE.reduce(function (s, e) { return s + e.monto; }, 0) || 0;
  var cant  = allE.length;

  var diagClass, diagIcon, diagRating, diagDesc, urgMsg, urgSub;

  if (peor <= 2) {
  diagClass  = "alto";
  diagIcon   = '<i class="ti ti-trending-up" style="color:#6DBF95" aria-hidden="true"></i>';
  diagRating = "PERFIL CON BAJO NIVEL DE RIESGO REGISTRADO";
  diagDesc   = "El BCRA no muestra registros críticos en este momento. Esto no descarta antecedentes en otras bases como Veraz u otros burós. Un asesor puede cruzar toda la información disponible.";
  urgMsg     = 'Este resultado es <em>un punto de partida</em>, no un diagnóstico completo.';
  urgSub     = 'El BCRA es solo una de las fuentes que usan los bancos para evaluar créditos. En 30 minutos un asesor puede ver el panorama completo y decirte exactamente en qué situación estás.';
} else if (peor <= 4) {
  diagClass  = "moderado";
  diagIcon   = '<i class="ti ti-chart-line" style="color:#E2C16A" aria-hidden="true"></i>';
  diagRating = "SE DETECTARON REGISTROS QUE REQUIEREN ATENCIÓN";
  diagDesc   = "El BCRA informa antecedentes que pueden estar afectando tu acceso al crédito. La situación real puede ser distinta: hay casos que tienen solución y otros que requieren una estrategia específica.";
  urgMsg     = 'Estos registros <em>pueden tener solución</em>, pero depende de cada caso.';
  urgSub     = 'No todos los antecedentes tienen el mismo impacto ni el mismo camino de salida. Un asesor puede analizar tu situación específica y decirte qué es posible hacer y en qué plazo.';
} else {
  diagClass  = "requiere";
  diagIcon   = '<i class="ti ti-eye" style="color:#E8705F" aria-hidden="true"></i>';
  diagRating = "SITUACIÓN COMPLEJA — REQUIERE ANÁLISIS PROFESIONAL";
  diagDesc   = "El BCRA muestra registros de alto riesgo. Este tipo de situaciones tiene salida en muchos casos, pero requiere una evaluación detallada para entender qué opciones están disponibles.";
  urgMsg     = 'Una situación compleja <em>no es una situación sin salida</em>.';
  urgSub     = 'Cada caso es distinto. Lo que determina si tiene solución no es solo lo que aparece en el BCRA, sino el conjunto de factores que un asesor puede evaluar en detalle.';
}

  var html = "";

  html += '<article class="diagnostico-card ' + diagClass + ' anim-in" style="animation-delay:.05s" aria-label="Diagnóstico financiero preliminar">'
    + '<div class="diag-header">' + diagIcon + '<div><div class="diag-pre">Diagnóstico preliminar</div></div></div>'
    + '<h2 class="diag-rating">' + diagRating + '</h2>'
    + '<p class="diag-desc">' + diagDesc + '</p>'
    + '</article>';

  // CAMBIO C: aviso BCRA + botón con nuevo texto + nota de precio
  html += '<section class="cta-urgencia ' + diagClass + ' anim-in cta-urgencia-desktop" style="animation-delay:.09s" aria-label="Próximos pasos">'
    + '<p class="cta-urg-msg">' + urgMsg + '</p>'
    + '<p class="cta-urg-sub">' + urgSub + '</p>'
    + '<div class="resultado-aviso-bcra">'
    + '<p>La información que se muestra corresponde a datos públicos de la Central de Deudores del BCRA.</p>'
    + '<p>Para determinar posibles alternativas de regularización o mejora del perfil crediticio es necesaria una evaluación profesional.</p>'
    + '</div>'
    + '<button class="btn-reservar" onclick="reservarTurno()" aria-label="Solicitar evaluación profesional">'
    + '<span class="btn-reservar-label">Solicitar evaluación profesional</span>'
    + '<span class="btn-reservar-meta">Reunión Virtual · 30 min · Con asesor</span>'
    + '</button>'
    + '<p class="cta-precio-nota">Reserva online: <strong>$10.000</strong><br>'
    + '<span>El importe se acredita a honorarios y es reembolsable si el caso no presenta alternativas viables.</span>'
    + '</p>'
    + '</section>';

  html += '<div class="result-header anim-in" style="animation-delay:.1s">'
    + '<div class="avatar" aria-hidden="true">' + ini(d.denominacion) + '</div>'
    + '<div>'
    + '<div class="rh-name">' + d.denominacion + '</div>'
    + '<div class="rh-cuit">CUIT ' + d.identificacion + '</div>'
    + '</div>'
    + '</div>';

  html += '<div class="score-strip anim-in" style="animation-delay:.15s" role="group" aria-label="Indicadores crediticios">'
    + '<div class="score-box">'
    + '<div class="score-val" style="color:' + pi.dot + '" aria-label="Situación máxima ' + peor + '">' + peor + '</div>'
    + '<div class="score-lbl">Situación máxima BCRA</div>'
    + '<div class="score-sub" style="color:' + pi.dot + '">' + pi.label + '</div>'
    + '</div>'
    + '<div class="score-box">'
    + '<div class="score-val" style="color:#E2C16A" aria-label="Exposición total ' + fmt(total) + '">' + fmt(total) + '</div>'
    + '<div class="score-lbl">Exposición total</div>'
    + '<div class="score-sub" style="color:#7A7570">' + cant + ' entidad' + (cant !== 1 ? 'es' : '') + '</div>'
    + '</div>'
    + '</div>';

  html += '<section class="sec-wrap anim-in" style="animation-delay:.2s" aria-label="Registros crediticios actuales">'
    + '<div class="sec-head"><i class="ti ti-report-money" aria-hidden="true"></i><h2 class="sec-head-title">Registros actuales detectados</h2></div>'
    + '<div class="sec-body">';

  if (d.periodos && d.periodos.length > 0) {
    d.periodos.forEach(function (periodo) {
      html += '<p class="periodo-lbl">Período ' + fmtPeriodo(periodo.periodo) + '</p>';
      periodo.entidades.forEach(function (e) {
        var info = si(e.situacion);
        html += '<article class="deuda-item">'
          + '<div class="deuda-top">'
          + '<h3 class="deuda-ent">' + e.entidad + '</h3>'
          + '<span class="badge ' + info.cls + '" aria-label="Situación crediticia ' + e.situacion + ': ' + info.label + '">Sit. ' + e.situacion + ' — ' + info.label + '</span>'
          + '</div>'
          + '<div class="deuda-grid">'
          + '<div class="ds"><div class="ds-val">' + fmt(e.monto) + '</div><div class="ds-lbl">Monto informado</div></div>'
          + '<div class="ds"><div class="ds-val" style="color:' + (e.diasAtrasoPago > 0 ? '#E8705F' : '#6DBF95') + '">' + fmtD(e.diasAtrasoPago) + '</div><div class="ds-lbl">Días de atraso</div></div>'
          + '</div>'
          + '</article>';
      });
    });
  } else {
    html += '<div class="empty-state"><i class="ti ti-circle-check" style="color:#4A9B6F" aria-hidden="true"></i><p>Sin deudas activas registradas en el BCRA</p></div>';
  }
  html += '</div></section>';

  html += '<section class="sec-wrap anim-in" style="animation-delay:.25s" aria-label="Historial crediticio últimos 24 meses">'
    + '<div class="sec-head"><i class="ti ti-history" aria-hidden="true"></i><h2 class="sec-head-title">Evolución del perfil — últimos 24 meses</h2></div>';

  if (h.periodos && h.periodos.length > 0) {
    var porEntidad = {};
    h.periodos.forEach(function (p) {
      p.entidades.forEach(function (e) {
        if (!porEntidad[e.entidad]) porEntidad[e.entidad] = [];
        porEntidad[e.entidad].push({ periodo: p.periodo, situacion: e.situacion, monto: e.monto });
      });
    });

    var entidades = Object.keys(porEntidad).sort();
    html += '<div class="sec-body" style="display:flex;flex-direction:column;gap:12px">';
    entidades.forEach(function (nombre) {
      var registros = porEntidad[nombre].sort(function (a, b) { return String(b.periodo).localeCompare(String(a.periodo)); });
      var peorEnt   = registros.reduce(function (m, r) { return Math.max(m, r.situacion); }, 1);
      var infoPeor  = si(peorEnt);
      html += '<article style="background:var(--s2);border:.5px solid var(--b1);border-radius:10px;padding:.85rem 1rem">'
        + '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;gap:8px">'
        + '<h3 style="font-size:.875rem;font-weight:600;color:var(--text);flex:1">' + nombre + '</h3>'
        + '<span class="badge ' + infoPeor.cls + '" aria-label="Situación máxima ' + peorEnt + '">Máx. Sit. ' + peorEnt + '</span>'
        + '</div>'
        + '<div style="display:flex;flex-wrap:wrap;gap:5px" role="list" aria-label="Historial por período">';
      registros.forEach(function (r) {
        var info = si(r.situacion);
        html += '<div style="background:var(--s3);border:.5px solid var(--b2);border-radius:7px;padding:7px 10px;display:flex;flex-direction:column;align-items:center;width:110px" role="listitem">'
          + '<span style="font-size:.625rem;color:var(--muted);letter-spacing:.04em;white-space:nowrap">' + fmtPeriodo(r.periodo) + '</span>'
          + '<span class="sdot" style="background:' + info.dot + ';width:8px;height:8px;flex-shrink:0;margin:4px 0" aria-hidden="true"></span>'
          + '<span style="font-size:.65rem;font-weight:600;color:' + info.dot + ';margin-bottom:4px">Sit. ' + r.situacion + '</span>'
          + '<span style="font-size:.6875rem;font-weight:600;color:var(--text);white-space:nowrap">' + fmt(r.monto) + '</span>'
          + '</div>';
      });
      html += '</div></article>';
    });
    html += '</div>';
  } else {
    html += '<div class="sec-body"><div class="empty-state"><i class="ti ti-calendar-off" aria-hidden="true"></i><p>Sin historial disponible en el BCRA</p></div></div>';
  }
  html += '</section>';

  // CAMBIO C: aviso BCRA + botón con nuevo texto + nota de precio (CTA final card)
  html += '<section class="cta-card anim-in cta-card-desktop" style="animation-delay:.3s" aria-label="Próximos pasos">'
    + '<p>Ya tenés el diagnóstico. El siguiente paso es hablar con un asesor que pueda leer tu caso en detalle y diseñar un plan <strong>concreto y personalizado</strong> para recuperar tu perfil financiero y salir del Veraz.</p>'
    + '<div class="resultado-aviso-bcra">'
    + '<p>La información que se muestra corresponde a datos públicos de la Central de Deudores del BCRA.</p>'
    + '<p>Para determinar posibles alternativas de regularización o mejora del perfil crediticio es necesaria una evaluación profesional.</p>'
    + '</div>'
    + '<div class="cta-btns">'
    + '<button class="btn-primary" onclick="reservarTurno()">Solicitar evaluación profesional</button>'
    + '<p class="cta-precio-nota">Reserva online: <strong>$10.000</strong><br>'
    + '<span>El importe se acredita a honorarios y es reembolsable si el caso no presenta alternativas viables.</span>'
    + '</p>'
    + '</div>'
    + '<p class="cta-note">Llamada 0 Videollamada de 30 minutos. Evaluación individual y confidencial de tu situación crediticia.</p>'
    + '</section>';

  res.innerHTML = html;
}

/* ════════════════════════════════════════════
   CHAT WIDGET — 
════════════════════════════════════════════ */

// URL de tu Apps Script del chat (distinto al del BCRA)
var CHAT_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyqiYHeDnYigHNES_S7FWosqsKFGYgNqVbj92sRXMxYfkKbg9Bcz2bsICnkXyI_AjyR/exec";

var chatIsOpen     = false;
var chatBusy       = false;
var chatMsgs       = [];   // historial para contexto
var chatBadgeDone  = false;

// Mostrar badge de notificación después de 10 segundos
setTimeout(function () {
  if (!chatIsOpen && !chatBadgeDone) {
    var b = document.getElementById("chat-badge");
    if (b) { b.style.display = "flex"; chatBadgeDone = true; }
  }
}, 10000);

/* ── Abrir / cerrar ── */
function chatToggle() {
  chatIsOpen = !chatIsOpen;
  var win    = document.getElementById("chat-window");
  var iconO  = document.getElementById("chat-btn-icon-open");
  var iconC  = document.getElementById("chat-btn-icon-close");
  var label  = document.getElementById("chat-btn-label");
  var badge  = document.getElementById("chat-badge");
  var btn    = document.getElementById("btn-chat-flotante");

  if (chatIsOpen) {
    win.style.display = "flex";
    btn.setAttribute("aria-expanded", "true");
    iconO.style.display = "none";
    iconC.style.display = "inline-flex";
    label.textContent   = "Cerrar";
    if (badge) badge.style.display = "none";
    if (chatMsgs.length === 0) chatInitMessages();
    setTimeout(function () { document.getElementById("chat-input").focus(); }, 120);
    chatScrollBottom();
  } else {
    win.style.display = "none";
    btn.setAttribute("aria-expanded", "false");
    iconO.style.display = "inline-flex";
    iconC.style.display = "none";
    label.textContent   = "Consulta rápida";
  }
}

/* ── Mensaje inicial y sugerencias ── */
function chatInitMessages() {
  var msgs = document.getElementById("chat-messages");
  msgs.innerHTML = "";

  // Divider fecha
  var div = document.createElement("div");
  div.className   = "chat-divider";
  div.textContent = "Hoy";
  msgs.appendChild(div);

  // Bienvenida
  chatAppend("bot", "Hola 👋 Soy el asistente de <strong>TANGO Recuperación Financiera</strong>.<br><br>Puedo ayudarte con dudas sobre tu historial crediticio, el Veraz o cómo regularizar deudas. ¿En qué te puedo ayudar?");

  // Sugerencias rápidas
  var sugg = document.createElement("div");
  sugg.className = "chat-suggestions";
  sugg.id        = "chat-suggestions";
  var opciones = [
  "¿Por qué me rechazan créditos?",
  "¿El BCRA es lo mismo que el Veraz?",
  "¿Cómo sé si tengo deudas en otras bases?",
  "¿Cuánto cuesta la consulta con un asesor?"
];
  opciones.forEach(function (txt) {
    var b = document.createElement("button");
    b.className   = "chat-sugg-btn";
    b.textContent = txt;
    b.onclick     = function () { chatUseSuggestion(txt); };
    sugg.appendChild(b);
  });
  msgs.appendChild(sugg);
  chatScrollBottom();
}

function chatUseSuggestion(txt) {
  var sugg = document.getElementById("chat-suggestions");
  if (sugg) sugg.remove();
  document.getElementById("chat-input").value = txt;
  chatSend();
}

/* ── Enviar mensaje ── */
function chatSend() {
  if (chatBusy) return;
  var input = document.getElementById("chat-input");
  var text  = input.value.trim();
  if (!text) return;

  input.value = "";
  input.style.height = "auto";

  var sugg = document.getElementById("chat-suggestions");
  if (sugg) sugg.remove();

  chatAppend("user", chatEsc(text));
  chatMsgs.push({ role: "user", content: text });

  chatBusy = true;
  document.getElementById("chat-send-btn").disabled = true;
  chatShowTyping();

  // Llamada al Apps Script via JSONP
  var cbName = "chatCb_" + Date.now();
  window[cbName] = function (data) {
    delete window[cbName];
    var s = document.getElementById("chat-script-req");
    if (s) s.remove();
    chatHideTyping();
    chatBusy = false;
    document.getElementById("chat-send-btn").disabled = false;
    if (data && data.ok && data.reply) {
      chatAppend("bot", chatFormat(data.reply), data.showCta);
      chatMsgs.push({ role: "assistant", content: data.reply });
    } else {
      chatAppend("bot", "Hubo un error al conectar. Intentá de nuevo en un momento.");
    }
    document.getElementById("chat-input").focus();
  };

  var script   = document.createElement("script");
  script.id    = "chat-script-req";
  script.src   = CHAT_SCRIPT_URL
    + "?msg="      + encodeURIComponent(text)
    + "&history="  + encodeURIComponent(JSON.stringify(chatMsgs.slice(-6)))
    + "&callback=" + cbName;
  script.onerror = function () {
    delete window[cbName];
    chatHideTyping();
    chatBusy = false;
    document.getElementById("chat-send-btn").disabled = false;
    chatAppend("bot", "No se pudo conectar. Revisá tu conexión e intentá de nuevo.");
  };
  document.body.appendChild(script);
}

/* ── Helpers de UI ── */
function chatNow() {
  var d = new Date();
  return d.getHours().toString().padStart(2, "0") + ":" + d.getMinutes().toString().padStart(2, "0");
}

function chatAppend(role, html, showCta) {
  var msgs = document.getElementById("chat-messages");
  var wrap = document.createElement("div");
  wrap.className = "chat-msg " + role;

  var bubble = document.createElement("div");
  bubble.className = "chat-bubble";
  bubble.innerHTML = html;
  wrap.appendChild(bubble);

  var time = document.createElement("div");
  time.className   = "chat-time";
  time.textContent = chatNow();
  wrap.appendChild(time);

  if (showCta) {
    var cta = document.createElement("div");
    cta.className = "chat-cta";
    cta.innerHTML =
  '<p>Si querés que un asesor revise tu caso en detalle, podés reservar una consulta. '
  + 'La reserva tiene un costo de <strong>$10.000</strong> que se descuenta de los honorarios finales '
  + 'y es reembolsable si no hay alternativas viables para tu situación. '
  + 'La reunión puede ser por videollamada, llamada o mensaje, como prefieras.</p>'
  + '<a href="' + (typeof RESERVA_URL !== "undefined" ? RESERVA_URL : "#") + '" class="chat-cta-btn" target="_blank" rel="noopener">'
  + '📅 Reservar consulta con un asesor'
  + '</a>';
      + '<p class="chat-cta-note">$10.000 · Reembolsable · Se descuenta de honorarios</p>';
    wrap.appendChild(cta);
  }

  msgs.appendChild(wrap);
  chatScrollBottom();
}

function chatShowTyping() {
  var msgs = document.getElementById("chat-messages");
  var div  = document.createElement("div");
  div.className = "chat-msg bot chat-typing";
  div.id        = "chat-typing";
  div.innerHTML = '<div class="chat-bubble"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>';
  msgs.appendChild(div);
  chatScrollBottom();
}

function chatHideTyping() {
  var t = document.getElementById("chat-typing");
  if (t) t.remove();
}

function chatScrollBottom() {
  var msgs = document.getElementById("chat-messages");
  if (msgs) msgs.scrollTop = msgs.scrollHeight;
}

function chatKeyDown(e) {
  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); chatSend(); }
}

function chatResizeInput(el) {
  el.style.height = "auto";
  el.style.height = Math.min(el.scrollHeight, 80) + "px";
}

function chatEsc(str) {
  return str.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\n/g,"<br>");
}

function chatFormat(str) {
  return str
    .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
    .replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>")
    .replace(/\n/g,"<br>");
}
