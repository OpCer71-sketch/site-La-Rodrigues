#!/usr/bin/env bash
# Prepara um vídeo para o site: MP4 (H.264 + AAC), WebM (VP9 + Opus) e capa JPG.
# Uso:  ferramentas/preparar-video.sh caminho/do/video-original.mov nome-do-video [segundo-da-capa]
# Ex.:  ferramentas/preparar-video.sh ~/Downloads/IMG_1234.MOV cerimonia-01 3
# Gera: videos/cerimonia-01.mp4, videos/cerimonia-01.webm e videos/capas/cerimonia-01.jpg
# Requer o ffmpeg instalado (Linux: sudo apt install ffmpeg | Windows/Mac: ffmpeg.org).
set -euo pipefail

if [ $# -lt 2 ]; then
  echo "Uso: $0 video-original nome-do-video [segundo-da-capa]" >&2
  exit 1
fi
ORIGEM="$1"
NOME="$(echo "$2" | tr '[:upper:]' '[:lower:]' | tr -c 'a-z0-9-\n' '-')"
CAPA_SEG="${3:-2}"
PASTA="$(cd "$(dirname "$0")/.." && pwd)/videos"
mkdir -p "$PASTA/capas"

# Lado maior com no máximo 1280 px (720p), mantendo a proporção (serve para vídeo deitado ou em pé)
ESCALA="scale='if(gt(iw,ih),min(1280,iw),-2)':'if(gt(iw,ih),-2,min(1280,ih))'"

echo "> MP4 (H.264, CRF 26)..."
ffmpeg -hide_banner -loglevel error -y -i "$ORIGEM" \
  -map 0:v:0 -map 0:a:0? -map_metadata -1 -map_chapters -1 \
  -vf "$ESCALA,fps=30" -c:v libx264 -preset slow -crf 26 -profile:v high -pix_fmt yuv420p \
  -c:a aac -b:a 128k -ac 2 -movflags +faststart \
  "$PASTA/$NOME.mp4"

echo "> WebM (VP9, CRF 34)..."
ffmpeg -hide_banner -loglevel error -y -i "$ORIGEM" \
  -map 0:v:0 -map 0:a:0? -map_metadata -1 -map_chapters -1 \
  -vf "$ESCALA,fps=30" -c:v libvpx-vp9 -crf 34 -b:v 0 -row-mt 1 -deadline good -cpu-used 2 \
  -c:a libopus -b:a 96k \
  "$PASTA/$NOME.webm"

echo "> Capa (JPG)..."
ffmpeg -hide_banner -loglevel error -y -ss "$CAPA_SEG" -i "$ORIGEM" -frames:v 1 -map_metadata -1 \
  -vf "scale='if(gt(iw,ih),min(1280,iw),-2)':'if(gt(iw,ih),-2,min(1280,ih))'" -q:v 4 \
  "$PASTA/capas/$NOME.jpg"

TAM_MP4=$(du -m "$PASTA/$NOME.mp4" | cut -f1)
echo
echo "Pronto:"
ls -lh "$PASTA/$NOME.mp4" "$PASTA/$NOME.webm" "$PASTA/capas/$NOME.jpg" | awk '{print "  " $5 "  " $NF}'
if [ "$TAM_MP4" -gt 25 ]; then
  echo "ATENÇÃO: o MP4 passou de 25 MB. Corte o vídeo ou aumente o CRF (ex.: 28)." >&2
fi
cat <<CONFIG

Cole em js/videos-config.js, dentro de window.SITE_VIDEOS = [ ... ]:
  {
    id: "$NOME",
    titulo: "TÍTULO DO VÍDEO",
    descricao: "",
    poster: "videos/capas/$NOME.jpg",
    tipo: "local",
    src: "videos/$NOME.mp4",
    srcWebm: "videos/$NOME.webm",
    legendas: null,
    youtubeId: null,
  },
CONFIG
