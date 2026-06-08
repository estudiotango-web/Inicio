/* ════════════════════════════════════════════
   CONFIG
════════════════════════════════════════════ */
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

function reservarTurno() {
  trackConversion("reserva_consulta", 0);

  if (!ultimoCuitConsultado) {
    alert("Primero realizá una consulta.");
    return;
  }

  const mensaje =
`Hola, solicito una reunión virtual con un asesor.

Mi CUIT/CUIL es: ${ultimoCuitConsultado}`;

  window.open(
    `https://wa.me/5493435020970?text=${encodeURIComponent(mensaje)}`,
    "_blank"
  );
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
function fmtD(d){ return (!d || d === 0) ? "Sin atraso" : d + " días"; }
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
      "&callback=" + callbackName;

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
    diagRating = "ALTO POTENCIAL DE RECUPERACIÓN";
    diagDesc   = "Tu perfil presenta condiciones favorables. La regularización profesional puede liberar el acceso al crédito en el menor tiempo posible.";
    urgMsg     = 'Tu perfil <em>tiene solución</em>. El primer paso es una consulta profesional.';
    urgSub     = 'En 30 minutos evaluamos tu caso en detalle y definimos el camino concreto para limpiar tu historial crediticio.';
  } else if (peor <= 4) {
    diagClass  = "moderado";
    diagIcon   = '<i class="ti ti-chart-line" style="color:#E2C16A" aria-hidden="true"></i>';
    diagRating = "POTENCIAL MODERADO";
    diagDesc   = "Existen registros que requieren atención. Con la estrategia adecuada es posible mejorar tu perfil crediticio de manera concreta.";
    urgMsg     = 'Estos registros <em>tienen solución</em>, pero cada mes que pasa suma más daño a tu historial.';
    urgSub     = 'Una consulta profesional permite definir exactamente qué acciones tomar y en qué orden para salir del Veraz y regularizar tu situación.';
  } else {
    diagClass  = "requiere";
    diagIcon   = '<i class="ti ti-eye" style="color:#E8705F" aria-hidden="true"></i>';
    diagRating = "REQUIERE ANÁLISIS PROFESIONAL";
    diagDesc   = "Tu situación presenta complejidades que ameritan un análisis detallado para definir el mejor camino de recuperación crediticia.";
    urgMsg     = 'Tu situación es compleja, pero <em>tiene salida</em>. Necesitás una estrategia clara y profesional.';
    urgSub     = 'No todos los casos son iguales. En la consulta analizamos tu situación específica y te decimos exactamente qué es posible hacer.';
  }

  var html = "";

  html += '<article class="diagnostico-card ' + diagClass + ' anim-in" style="animation-delay:.05s" aria-label="Diagnóstico financiero preliminar">'
    + '<div class="diag-header">' + diagIcon + '<div><div class="diag-pre">Diagnóstico preliminar</div></div></div>'
    + '<h2 class="diag-rating">' + diagRating + '</h2>'
    + '<p class="diag-desc">' + diagDesc + '</p>'
    + '</article>';

  html += '<section class="cta-urgencia ' + diagClass + ' anim-in cta-urgencia-desktop" style="animation-delay:.09s" aria-label="Próximos pasos">'
    + '<p class="cta-urg-msg">' + urgMsg + '</p>'
    + '<p class="cta-urg-sub">' + urgSub + '</p>'
    + '<button class="btn-reservar" onclick="reservarTurno()" aria-label="Reservar consulta profesional videollamada 30 minutos">'
    + '<span class="btn-reservar-label">Reservar consulta profesional</span>'
    + '<span class="btn-reservar-meta">Videollamada · 30 min · Con asesor</span>'
    + '</button>'
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

  html += '<section class="cta-card anim-in cta-card-desktop" style="animation-delay:.3s" aria-label="Próximos pasos">'
    + '<p>Ya tenés el diagnóstico. El siguiente paso es hablar con un asesor que pueda leer tu caso en detalle y diseñar un plan <strong>concreto y personalizado</strong> para recuperar tu perfil financiero y salir del Veraz.</p>'
    + '<div class="cta-btns">'
    + '<button class="btn-primary" onclick="reservarTurno()">Reservar videollamada con asesor</button>'
    + '<button class="btn-secondary-link" onclick="reservarTurno()">Prefiero que me contacten</button>'
    + '</div>'
    + '<p class="cta-note">Videollamada de 30 minutos. Evaluación individual y confidencial de tu situación crediticia.</p>'
    + '</section>';

  res.innerHTML = html;
}
