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
 
/* ---------- Aviso para quem está editando ---------- */
if (document.querySelector('a[href*="wa.me/5500000000000"]')) {
  console.warn("Número de WhatsApp DEMONSTRATIVO em uso. Troque 5500000000000 pelo número real em index.html.");
}
 