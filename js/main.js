(function () {
  var cfg = window.SITE_CONFIG || {};
  var temWhatsapp = /^\d{10,15}$/.test(cfg.whatsapp || "");

  function linkWhatsapp(texto) {
    var base = "https://wa.me/" + cfg.whatsapp;
    return texto ? base + "?text=" + encodeURIComponent(texto) : base;
  }

  // Preenche links e textos marcados com data-link / data-texto
  document.querySelectorAll("[data-link]").forEach(function (el) {
    var tipo = el.getAttribute("data-link");
    if (tipo === "instagram") el.href = cfg.instagram;
    if (tipo === "email") el.href = "mailto:" + cfg.email;
    if (tipo === "whatsapp") {
      if (temWhatsapp) {
        el.href = linkWhatsapp("Olá! Vim pelo site e gostaria de um orçamento.");
      } else {
        // Sem número configurado: esconde o link em vez de deixá-lo quebrado
        (el.closest("li, .contato-item") || el).remove();
      }
    }
  });
  document.querySelectorAll("[data-texto]").forEach(function (el) {
    var chave = el.getAttribute("data-texto");
    if (chave === "email") el.textContent = cfg.email;
    if (chave === "instagram") el.textContent = cfg.instagramUsuario;
  });

  // Ano no rodapé
  document.querySelectorAll("[data-ano]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // Menu no celular
  var botao = document.querySelector(".menu-botao");
  var nav = document.querySelector(".nav");
  if (botao && nav) {
    botao.addEventListener("click", function () {
      var aberto = nav.classList.toggle("aberto");
      botao.setAttribute("aria-expanded", aberto ? "true" : "false");
    });
  }

  // Foto que ainda não existe: mostra um quadro neutro com o nome do arquivo
  document.querySelectorAll(".foto img").forEach(function (img) {
    function semFoto() {
      var caixa = img.closest(".foto");
      caixa.classList.add("foto--vazia");
      caixa.setAttribute("data-arquivo", img.getAttribute("src").split("/").pop());
      img.remove();
    }
    if (img.complete && img.naturalWidth === 0) semFoto();
    else img.addEventListener("error", semFoto);
  });

  // Surgimento suave das seções
  if ("IntersectionObserver" in window) {
    var obs = new IntersectionObserver(function (itens) {
      itens.forEach(function (item) {
        if (item.isIntersecting) {
          item.target.classList.add("visivel");
          obs.unobserve(item.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll(".surgir").forEach(function (el) { obs.observe(el); });
  } else {
    document.querySelectorAll(".surgir").forEach(function (el) { el.classList.add("visivel"); });
  }
})();
