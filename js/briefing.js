/*
 * Briefing em etapas da página de contato.
 * - 4 etapas com barra de progresso, botões Anterior/Próximo e validação em tempo real.
 * - Envio: Formspree (se configurado em js/config.js) e/ou WhatsApp com o briefing escrito.
 */
(function () {
  var form = document.getElementById("briefing");
  if (!form) return;

  var cfg = window.SITE_CONFIG || {};
  var temWhatsapp = /^\d{10,15}$/.test(cfg.whatsapp || "");
  var temFormspree = /^[A-Za-z0-9]{4,20}$/.test(cfg.formspree || "");

  var etapas = Array.prototype.slice.call(form.querySelectorAll(".etapa"));
  var indicadores = form.querySelectorAll("[data-indicador]");
  var barra = form.querySelector(".briefing-barra-preenchida");
  var status = document.getElementById("briefing-status");
  var btnAnterior = form.querySelector("[data-anterior]");
  var btnProximo = form.querySelector("[data-proximo]");
  var btnEnviar = form.querySelector("[data-enviar]");
  var sucesso = document.getElementById("briefing-sucesso");
  var atual = 0;
  var enviando = false;

  form.classList.add("briefing--js");
  if (!temWhatsapp) {
    var nota = form.querySelector("[data-nota-envio]");
    if (nota) nota.textContent = "Campos com * são obrigatórios. Ao enviar, o seu briefing é preparado em um e-mail para a Laura.";
  }

  // ---------- Etapas ----------
  function mostrarEtapa(n, focar) {
    atual = n;
    etapas.forEach(function (et, i) { et.hidden = i !== n; });
    indicadores.forEach(function (li, i) {
      li.classList.toggle("atual", i === n);
      li.classList.toggle("concluida", i < n);
      if (i === n) li.setAttribute("aria-current", "step"); else li.removeAttribute("aria-current");
    });
    barra.style.width = ((n + 1) / etapas.length) * 100 + "%";
    btnAnterior.hidden = n === 0;
    btnProximo.hidden = n === etapas.length - 1;
    btnEnviar.hidden = n !== etapas.length - 1;
    status.textContent = "Etapa " + (n + 1) + " de " + etapas.length + ": " + etapas[n].getAttribute("data-nome");
    if (focar) {
      var titulo = etapas[n].querySelector(".etapa-titulo");
      form.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
      titulo.focus({ preventScroll: true });
    }
  }

  // ---------- Campos "Outro" ----------
  function atualizarOutros() {
    form.querySelectorAll("[data-outro-de]").forEach(function (caixa) {
      var origem = caixa.getAttribute("data-outro-de");
      var ativo;
      var sel = document.getElementById(origem);
      if (sel && sel.tagName === "SELECT") {
        ativo = sel.value === "Outro";
      } else {
        var chk = form.querySelector('input[name="' + origem + '"][value="Outro"]');
        ativo = !!(chk && chk.checked);
      }
      caixa.hidden = !ativo;
      var campo = caixa.querySelector("input");
      // O "qual?" é obrigatório só para o tipo de evento
      if (origem === "b-tipo") campo.required = ativo;
      if (!ativo) limparErro(campo);
    });
  }

  // ---------- Máscara do WhatsApp: (99) 99999-9999 ----------
  function mascaraTelefone(v) {
    var d = v.replace(/\D/g, "").slice(0, 11);
    if (d.length <= 2) return d.length ? "(" + d : "";
    if (d.length <= 6) return "(" + d.slice(0, 2) + ") " + d.slice(2);
    if (d.length <= 10) return "(" + d.slice(0, 2) + ") " + d.slice(2, 6) + "-" + d.slice(6);
    return "(" + d.slice(0, 2) + ") " + d.slice(2, 7) + "-" + d.slice(7);
  }
  form.querySelectorAll('[data-mascara="telefone"]').forEach(function (el) {
    el.addEventListener("input", function () { el.value = mascaraTelefone(el.value); });
  });

  // ---------- Validação ----------
  function hoje() {
    var d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  var campoData = document.getElementById("b-data");
  if (campoData) campoData.min = hoje();

  function erroDoCampo(el) {
    var v = (el.value || "").trim();
    if (el.required && !v) {
      if (el.tagName === "SELECT") return "Escolha uma opção.";
      return "Este campo é obrigatório.";
    }
    if (!v) return "";
    if (el.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return "Confira o e-mail. Exemplo: nome@gmail.com";
    if (el.getAttribute("data-mascara") === "telefone") {
      var n = v.replace(/\D/g, "").length;
      if (n < 10 || n > 11) return "Informe o WhatsApp com DDD. Exemplo: (35) 99999-9999";
    }
    if (el.type === "number") {
      var num = Number(v);
      if (!Number.isInteger(num) || num < 1) return "Informe um número inteiro, por exemplo 120.";
      if (num > 5000) return "Confira o número de convidados.";
    }
    if (el.type === "date" && v < hoje()) return "A data precisa ser hoje ou uma data futura.";
    return "";
  }

  function caixaErro(el) {
    var ids = (el.getAttribute("aria-describedby") || "").split(/\s+/);
    for (var i = 0; i < ids.length; i++) {
      if (ids[i].indexOf("erro-") === 0) return document.getElementById(ids[i]);
    }
    return null;
  }
  function mostrarErro(el, msg) {
    var caixa = caixaErro(el);
    if (msg) el.setAttribute("aria-invalid", "true"); else el.removeAttribute("aria-invalid");
    var campo = el.closest(".campo, .grupo");
    if (campo) campo.classList.toggle("campo--erro", !!msg);
    if (caixa) caixa.textContent = msg;
  }
  function limparErro(el) { if (el) mostrarErro(el, ""); }

  function validarCampo(el) {
    var msg = erroDoCampo(el);
    mostrarErro(el, msg);
    return !msg;
  }
  function validarGrupo(g) {
    var min = Number(g.getAttribute("data-minimo") || 0);
    var marcados = g.querySelectorAll("input:checked").length;
    var msg = marcados < min ? "Marque pelo menos uma opção." : "";
    mostrarErro(g, msg);
    return !msg;
  }

  function validarEtapa(n) {
    var et = etapas[n];
    var primeiroInvalido = null;
    et.querySelectorAll("input, select, textarea").forEach(function (el) {
      if (el.type === "checkbox" || el.closest("[hidden]")) return;
      el.dataset.tocado = "1";
      if (!validarCampo(el) && !primeiroInvalido) primeiroInvalido = el;
    });
    et.querySelectorAll(".grupo[data-minimo]").forEach(function (g) {
      g.dataset.tocado = "1";
      if (!validarGrupo(g) && !primeiroInvalido) primeiroInvalido = g.querySelector("input");
    });
    if (primeiroInvalido) {
      primeiroInvalido.focus();
      status.textContent = "Há campos a corrigir nesta etapa.";
      return false;
    }
    return true;
  }

  // Validação em tempo real: depois que o campo foi visitado
  form.addEventListener("focusout", function (e) {
    var el = e.target;
    if (!el.matches("input, select, textarea") || el.type === "checkbox") return;
    if ((el.value || "").trim() || el.dataset.tocado) {
      el.dataset.tocado = "1";
      validarCampo(el);
    }
  });
  form.addEventListener("input", function (e) {
    var el = e.target;
    if (el.dataset && el.dataset.tocado && el.type !== "checkbox") validarCampo(el);
  });
  form.addEventListener("change", function (e) {
    var el = e.target;
    atualizarOutros();
    if (el.type === "checkbox") {
      var g = el.closest(".grupo[data-minimo]");
      if (g && g.dataset.tocado) validarGrupo(g);
    } else if (el.tagName === "SELECT") {
      el.dataset.tocado = "1";
      validarCampo(el);
    }
  });

  // ---------- Navegação ----------
  btnProximo.addEventListener("click", function () {
    if (validarEtapa(atual)) mostrarEtapa(atual + 1, true);
  });
  btnAnterior.addEventListener("click", function () {
    mostrarEtapa(atual - 1, true);
  });

  // ---------- Montagem da mensagem ----------
  function valor(nome) {
    var el = form.elements[nome];
    return el ? (el.value || "").trim() : "";
  }
  function marcados(nome) {
    var lista = [];
    form.querySelectorAll('input[name="' + nome + '"]:checked').forEach(function (c) {
      if (c.value === "Outro") {
        var extra = valor(nome + "_outro");
        lista.push(extra ? "Outro (" + extra + ")" : "Outro");
      } else {
        lista.push(c.value);
      }
    });
    return lista.join(", ");
  }
  function comOutro(nome) {
    var v = valor(nome);
    if (v === "Outro" && valor(nome + "_outro")) return "Outro (" + valor(nome + "_outro") + ")";
    return v;
  }
  function dataBR(v) {
    if (!v) return "";
    var p = v.split("-");
    return p[2] + "/" + p[1] + "/" + p[0];
  }

  function dadosBriefing() {
    return [
      ["1. Sobre o evento", [
        ["Tipo de evento", comOutro("tipo")],
        ["Data", dataBR(valor("data")) || "a definir"],
        ["Cidade e local", valor("local")],
        ["Convidados", valor("convidados")],
      ]],
      ["2. O momento e a atmosfera", [
        ["Momentos com música ao vivo", marcados("momentos")],
        ["Clima", comOutro("clima")],
        ["Música especial", valor("musica_especial")],
      ]],
      ["3. Preferências musicais", [
        ["Estilos preferidos", marcados("estilos")],
        ["Não gostaria de ouvir", valor("evitar")],
        ["Acompanhamento", marcados("instrumentos")],
      ]],
      ["4. Contato", [
        ["Nome", valor("nome")],
        ["E-mail", valor("email")],
        ["WhatsApp", valor("whatsapp")],
        ["Como conheceu a Laura", comOutro("origem")],
        ["Detalhes extras", valor("detalhes")],
      ]],
    ];
  }

  function textoBriefing(negrito) {
    var b = negrito ? "*" : "";
    var linhas = ["Olá, Laura! Preenchi o briefing no seu site:"];
    dadosBriefing().forEach(function (bloco) {
      linhas.push("", b + bloco[0] + b);
      bloco[1].forEach(function (par) {
        if (par[1]) linhas.push(par[0] + ": " + par[1]);
      });
    });
    return linhas.join("\n");
  }

  function linkWhatsapp() {
    return "https://wa.me/" + cfg.whatsapp + "?text=" + encodeURIComponent(textoBriefing(true));
  }
  function linkEmail() {
    return "mailto:" + cfg.email +
      "?subject=" + encodeURIComponent("Briefing - " + comOutro("tipo") + " - " + valor("nome")) +
      "&body=" + encodeURIComponent(textoBriefing(false));
  }

  function enviarFormspree() {
    var dados = { _subject: "Novo briefing: " + comOutro("tipo") + " - " + valor("nome"), _replyto: valor("email") };
    dadosBriefing().forEach(function (bloco) {
      bloco[1].forEach(function (par) { dados[par[0]] = par[1] || "-"; });
    });
    return fetch("https://formspree.io/f/" + cfg.formspree, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(dados),
    }).then(function (r) { if (!r.ok) throw new Error("Formspree " + r.status); });
  }

  function mostrarSucesso(viaWhatsapp, link) {
    var texto = sucesso.querySelector("[data-sucesso-whatsapp]");
    var botao = sucesso.querySelector("[data-sucesso-link]");
    if (viaWhatsapp) {
      texto.textContent = "O seu briefing foi aberto no WhatsApp. Se a conversa não abriu, toque no botão abaixo e depois em enviar.";
      botao.textContent = "Abrir no WhatsApp";
      botao.href = link;
      botao.hidden = false;
    } else if (link) {
      texto.textContent = "O seu briefing foi preparado em um e-mail. Se ele não abriu, toque no botão abaixo.";
      botao.textContent = "Abrir e-mail";
      botao.href = link;
      botao.removeAttribute("target");
      botao.hidden = false;
    } else {
      texto.textContent = "Recebemos o seu briefing.";
      botao.hidden = true;
    }
    form.hidden = true;
    sucesso.hidden = false;
    sucesso.focus({ preventScroll: true });
    sucesso.scrollIntoView({ behavior: "auto", block: "start" });
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    // Enter em um campo antes da última etapa = avançar
    if (atual < etapas.length - 1) {
      if (validarEtapa(atual)) mostrarEtapa(atual + 1, true);
      return;
    }
    if (enviando || !validarEtapa(atual)) return;

    var link = temWhatsapp ? linkWhatsapp() : linkEmail();
    // O WhatsApp abre aqui, ainda dentro do clique, para o navegador não bloquear.
    // Se mesmo assim for bloqueado, a tela de confirmação tem o botão para abrir.
    if (temWhatsapp) window.open(link, "_blank", "noopener");

    if (temFormspree) {
      enviando = true;
      btnEnviar.disabled = true;
      btnEnviar.textContent = "Enviando...";
      enviarFormspree()
        .then(function () { mostrarSucesso(temWhatsapp, temWhatsapp ? link : null); })
        .catch(function () {
          // Se o e-mail falhar, o WhatsApp/e-mail continua como caminho garantido
          if (!temWhatsapp) window.location.href = link;
          mostrarSucesso(temWhatsapp, link);
        })
        .then(function () {
          enviando = false;
          btnEnviar.disabled = false;
          btnEnviar.textContent = "Enviar briefing";
        });
      return;
    }
    if (!temWhatsapp) window.location.href = link;
    mostrarSucesso(temWhatsapp, link);
  });

  sucesso.querySelector("[data-novo-briefing]").addEventListener("click", function () {
    form.reset();
    form.querySelectorAll("[data-tocado]").forEach(function (el) { delete el.dataset.tocado; });
    form.querySelectorAll("[aria-invalid]").forEach(limparErro);
    form.querySelectorAll(".grupo[data-minimo]").forEach(limparErro);
    atualizarOutros();
    sucesso.hidden = true;
    form.hidden = false;
    mostrarEtapa(0, true);
  });

  // Link "Assista às apresentações" só aparece se houver vídeos cadastrados
  var linkVideos = document.querySelector("[data-link-videos]");
  if (linkVideos && (window.SITE_VIDEOS || []).length) linkVideos.hidden = false;

  atualizarOutros();
  mostrarEtapa(0, false);
})();
