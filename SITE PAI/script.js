/* ==========================================================
   SCRIPT DA LANDING PAGE
   O número do WhatsApp fica nos links do index.html (procure "wa.me").
   Aqui ficam apenas: menu do celular, ano do rodapé, barra de
   WhatsApp e animação de entrada. A página funciona sem este
   arquivo, exceto o menu recolhível do celular.
   ========================================================== */
 
// Marca que o JavaScript está ativo (o CSS usa isso para recolher o menu no celular)
document.documentElement.classList.add("js");
 
/* ---------- Menu do celular (botão com aria-expanded) ---------- */
const botaoMenu = document.querySelector(".menu-toggle");
const menu = document.getElementById("menu");
const telaPequena = window.matchMedia("(max-width: 900px)");
 
function definirMenu(aberto) {
  if (!botaoMenu || !menu) return;
  menu.classList.toggle("is-open", aberto);
  botaoMenu.setAttribute("aria-expanded", String(aberto));
}
if (botaoMenu && menu) {
  botaoMenu.addEventListener("click", function () {
    definirMenu(botaoMenu.getAttribute("aria-expanded") !== "true");
  });
  menu.addEventListener("click", function (e) {
    if (e.target.closest("a")) definirMenu(false);          // fecha ao escolher um link
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && menu.classList.contains("is-open")) {
      definirMenu(false);
      botaoMenu.focus();                                      // devolve o foco ao botão
    }
  });
  telaPequena.addEventListener("change", function () { definirMenu(false); });
}
 
/* ---------- Ano do rodapé ---------- */
const ano = document.getElementById("ano");
if (ano) ano.textContent = new Date().getFullYear();
 
/* ---------- Barra de WhatsApp: some quando o botão principal ou o contato estão visíveis ---------- */
const barra = document.querySelector(".wa-bar");
const alvos = document.querySelectorAll("[data-esconde-barra]");
if (barra && alvos.length && "IntersectionObserver" in window) {
  const visiveis = new Set();
  const vigia = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (e) {
      if (e.isIntersecting) visiveis.add(e.target); else visiveis.delete(e.target);
    });
    barra.classList.toggle("is-hidden", visiveis.size > 0);
  });
  alvos.forEach(function (el) { vigia.observe(el); });
}
 
/* ---------- Animação de entrada (nunca esconde conteúdo se algo falhar) ---------- */
const itens = document.querySelectorAll("[data-reveal]");
const semMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (!semMovimento && "IntersectionObserver" in window && itens.length) {
  try {
    const mostrarTudo = function () { itens.forEach(function (el) { el.classList.add("is-visible"); }); };
    const revelador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-visible"); revelador.unobserve(e.target); }
      });
    }, { threshold: 0.1 });
    itens.forEach(function (el) { el.classList.add("reveal"); revelador.observe(el); });
    setTimeout(mostrarTudo, 2500);                            // segurança extra
  } catch (erro) {
    itens.forEach(function (el) { el.classList.remove("reveal"); });
  }
}
 /* ---------- Carrossel de fotos do hero ---------- */
const carrossel = document.querySelector(".carousel");
if (carrossel) {
  const trilho = carrossel.querySelector(".carousel-track");
  const slides = Array.from(trilho.children);
  const reduzMovimento = window.matchMedia("(prefers-reduced-motion: reduce)");
  const INTERVALO = 5000;               // tempo entre fotos, em milissegundos
  let atual = 0, parado = reduzMovimento.matches, emPausa = false, naTela = true;

  const icone = function (d) { return '<svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="' + d + '"/></svg>'; };
  const botao = function (classe, rotulo, d) {
    const b = document.createElement("button");
    b.type = "button"; b.className = classe; b.setAttribute("aria-label", rotulo); b.innerHTML = icone(d);
    return b;
  };

  // Controles são criados aqui: ao adicionar ou remover fotos no HTML, nada mais precisa mudar
  const controles = document.createElement("div"); controles.className = "carousel-controls";
  const caixaPontos = document.createElement("div"); caixaPontos.className = "carousel-dots";
 

  const pontos = slides.map(function (slide, i) {
    slide.setAttribute("role", "group");
    slide.setAttribute("aria-roledescription", "slide");
    slide.setAttribute("aria-label", (i + 1) + " de " + slides.length);
    const p = document.createElement("button");
    p.type = "button"; p.className = "carousel-dot"; p.setAttribute("aria-label", "Ir para a foto " + (i + 1));
    p.addEventListener("click", function () { parado = true; atualizarPausa(); ir(i); });
    caixaPontos.appendChild(p);
    return p;
  });
 controles.appendChild(caixaPontos);
 carrossel.appendChild(controles);

  function atualizarPontos() {
    pontos.forEach(function (p, i) { p.setAttribute("aria-current", String(i === atual)); });
  }
  function atualizarPausa() {
    trilho.setAttribute("aria-live", parado ? "polite" : "off");
  }
  function ir(i) {
    atual = (i + slides.length) % slides.length;
    trilho.scrollTo({ left: atual * trilho.clientWidth, behavior: reduzMovimento.matches ? "auto" : "smooth" });
    atualizarPontos();
  }

  trilho.addEventListener("touchstart", function () { parado = true; atualizarPausa(); }, { passive: true });
  trilho.addEventListener("scroll", function () {          // mantém as bolinhas certas ao deslizar com o dedo
    const i = Math.round(trilho.scrollLeft / trilho.clientWidth);
    if (i !== atual) { atual = i; atualizarPontos(); }
  }, { passive: true });

  // Rotação automática: para ao passar o mouse, ao focar, fora da tela, em outra aba ou se o usuário pausar
  carrossel.addEventListener("mouseenter", function () { emPausa = true; });
  carrossel.addEventListener("mouseleave", function () { emPausa = false; });
  carrossel.addEventListener("focusin", function () { emPausa = true; });
  carrossel.addEventListener("focusout", function () { emPausa = false; });
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (e) { naTela = e[0].isIntersecting; }).observe(carrossel);
  }
  setInterval(function () {
    if (!parado && !emPausa && naTela && !document.hidden) ir(atual + 1);
  }, INTERVALO);

  atualizarPontos();
  atualizarPausa();
}
/* ---------- Aviso para quem está editando ---------- */
if (document.querySelector('a[href*="wa.me/5500000000000"]')) {
  console.warn("Número de WhatsApp DEMONSTRATIVO em uso. Troque 5500000000000 pelo número real em index.html.");
}
 