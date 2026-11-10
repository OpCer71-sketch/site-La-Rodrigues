# Site oficial da cantora Laura Rodrigues

Site estático (HTML, CSS e JavaScript puros, sem instalação) com três páginas:

- `index.html`: página inicial (abertura, sobre, serviços, valores a combinar, galeria e Instagram)
- `curriculo.html`: trajetória, formação, experiência, repertório e formações
- `contato.html`: formatos de apresentação e **briefing em 3 etapas** (evento, atmosfera, contato),
  que abre o WhatsApp da Laura com o briefing escrito (ou o e-mail, se o WhatsApp não estiver configurado)

## Como atualizar

- **Contatos:** `js/config.js` (WhatsApp, e-mail e Instagram).
- **Fotos:** substitua os arquivos em `imagens/`, mantendo os nomes listados em `imagens/LEIA-ME.md`.
- **Currículo e repertório:** `curriculo.html`.

## Vídeos

A seção "Vídeos" da página inicial fica oculta até haver vídeos cadastrados.

1. Prepare cada vídeo (precisa do ffmpeg instalado):
   ```
   ferramentas/preparar-video.sh caminho/do/video.mp4 cerimonia-01 3
   ```
   Gera `videos/cerimonia-01.mp4` (H.264), `videos/cerimonia-01.webm` (VP9) e a capa
   `videos/capas/cerimonia-01.jpg`, com no máximo 720p e **sem metadados** (remove a localização GPS do celular).
   O último número é o segundo do vídeo usado como capa.
2. Cole o trecho que o script mostra em `js/videos-config.js` e escreva o título.
3. Para usar o YouTube no futuro: no mesmo vídeo, troque `tipo: "local"` por `tipo: "youtube"` e preencha `youtubeId`.

Mantenha cada vídeo abaixo de 25 MB. Se a soma ficar grande demais, a alternativa é Vimeo ou Bunny.net.

## Briefing por e-mail (opcional)

Por padrão, o briefing vai pelo WhatsApp. Para também receber por e-mail, crie um formulário gratuito em
formspree.io e cole o código dele (ex.: `xyzabcde`) em `formspree` no `js/config.js`.

## Segurança e privacidade

- Fontes hospedadas no próprio site (`fontes/`, licença SIL OFL): nenhuma requisição a serviços de terceiros.
- Política de segurança (CSP) em cada página: só carrega arquivos do próprio domínio.
- Fotos sem metadados (EXIF/GPS). Ao trocar uma foto, salve sem localização.

## Ver no computador

Abra `index.html` no navegador, ou rode um servidor local:

```
cd site-la-rodrigues
python3 -m http.server 8000
```

e acesse http://localhost:8000.

## Publicar

Publicado pelo GitHub Pages em https://cantoralaurarodrigues.com.br (o arquivo `CNAME` guarda o domínio).
