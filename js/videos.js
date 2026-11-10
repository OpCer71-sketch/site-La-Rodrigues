/*
 * Galeria de vídeos: cards com capa + player em janela (modal).
 * Os vídeos vêm de js/videos-config.js. Nada é baixado antes do clique:
 * o <video> (ou o iframe do YouTube) só é criado quando a pessoa escolhe assistir.
 */
(function () {
  var lista = document.querySelector("[data-videos]");
  if (!lista) return;
  var secao = lista.closest("section");
  var videos = (window.SITE_VIDEOS || []).filter(function (v) {
    return v && v.titulo && ((v.tipo === "youtube" && v.youtubeId) || (v.tipo !== "youtube" && v.src));
  });
  if (!videos.length) return; // a seção continua oculta
  secao.hidden = false;

  function idYoutube(id) { return String(id).replace(/[^A-Za-z0-9_-]/g, ""); }
  function capa(v) {
    if (v.poster) return v.poster;
    if (v.tipo === "youtube") return "https://i.ytimg.com/vi/" + idYoutube(v.youtubeId) + "/hqdefault.jpg";
    return "";
  }

  // ---------- Cards ----------
  videos.forEach(function (v, i) {
    var item = document.createElement("li");
    item.className = "video-item";

    var botao = document.createElement("button");
    botao.type = "button";
    botao.className = "video-card";
    botao.setAttribute("aria-label", "Assistir vídeo: " + v.titulo);
    botao.setAttribute("aria-haspopup", "dialog");

    var url = capa(v);
    if (url) {
      var img = document.createElement("img");
      img.src = url;
      img.alt = "";
      img.loading = "lazy";
      img.decoding = "async";
      botao.appendChild(img);
    }
    var play = document.createElement("span");
    play.className = "video-play";
    play.setAttribute("aria-hidden", "true");
    botao.appendChild(play);
    botao.addEventListener("click", function () { abrir(i, botao); });

    var titulo = document.createElement("h3");
    titulo.className = "video-titulo";
    titulo.textContent = v.titulo;

    item.appendChild(botao);
    item.appendChild(titulo);
    if (v.descricao) {
      var desc = document.createElement("p");
      desc.className = "video-desc";
      desc.textContent = v.descricao;
      item.appendChild(desc);
    }
    lista.appendChild(item);
  });

  // ---------- Janela do player ----------
  var modal = document.createElement("dialog");
  modal.className = "video-modal";
  modal.setAttribute("aria-labelledby", "video-modal-titulo");
  modal.innerHTML =
    '<div class="video-modal-caixa">' +
    '  <div class="video-modal-topo">' +
    '    <h2 class="video-modal-titulo" id="video-modal-titulo"></h2>' +
    '    <button type="button" class="video-modal-fechar" aria-label="Fechar vídeo">Fechar <span aria-hidden="true">×</span></button>' +
    "  </div>" +
    '  <div class="video-modal-player"></div>' +
    "</div>";
  document.body.appendChild(modal);
  var areaPlayer = modal.querySelector(".video-modal-player");
  var tituloModal = modal.querySelector(".video-modal-titulo");
  var origem = null;

  function criarPlayer(v) {
    if (v.tipo === "youtube") {
      var iframe = document.createElement("iframe");
      iframe.src = "https://www.youtube-nocookie.com/embed/" + idYoutube(v.youtubeId) + "?rel=0&modestbranding=1";
      iframe.title = v.titulo;
      iframe.allow = "accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen";
      iframe.allowFullscreen = true;
      iframe.referrerPolicy = "strict-origin-when-cross-origin";
      iframe.className = "video-iframe";
      return iframe;
    }
    var video = document.createElement("video");
    video.controls = true;
    video.preload = "metadata";
    video.playsInline = true;
    video.setAttribute("playsinline", "");
    if (v.poster) video.poster = v.poster;
    if (v.srcWebm) {
      var webm = document.createElement("source");
      webm.src = v.srcWebm;
      webm.type = "video/webm";
      video.appendChild(webm);
    }
    var mp4 = document.createElement("source");
    mp4.src = v.src;
    mp4.type = "video/mp4";
    video.appendChild(mp4);
    if (v.legendas) {
      var trilha = document.createElement("track");
      trilha.kind = "captions";
      trilha.src = v.legendas;
      trilha.srclang = "pt-BR";
      trilha.label = "Português";
      video.appendChild(trilha);
    }
    video.appendChild(document.createTextNode("Seu navegador não suporta vídeos HTML5."));
    return video;
  }

  function abrir(i, botao) {
    var v = videos[i];
    origem = botao;
    tituloModal.textContent = v.titulo;
    areaPlayer.textContent = "";
    var player = criarPlayer(v);
    areaPlayer.appendChild(player);
    modal.showModal();
    modal.classList.remove("video-modal--vertical");
    if (player.tagName === "VIDEO") {
      // Vídeo gravado em pé: janela mais estreita, sem faixas pretas largas
      player.addEventListener("loadedmetadata", function () {
        modal.classList.toggle("video-modal--vertical", player.videoHeight > player.videoWidth);
      });
      player.focus();
      // Começa a tocar porque a pessoa clicou em "assistir" (com som, sem autoplay na página)
      var p = player.play();
      if (p && p.catch) p.catch(function () {});
    }
  }

  function fechar() { if (modal.open) modal.close(); }

  modal.addEventListener("close", function () {
    areaPlayer.textContent = ""; // para o vídeo e libera a memória
    if (origem) origem.focus();
  });
  modal.querySelector(".video-modal-fechar").addEventListener("click", fechar);
  // Clique no fundo escurecido fecha
  modal.addEventListener("click", function (e) { if (e.target === modal) fechar(); });
})();
