/*
 * Vídeos do site. Para adicionar, copie o modelo abaixo para dentro dos colchetes.
 * A seção "Vídeos" da página inicial só aparece quando houver pelo menos um vídeo.
 *
 * Vídeo no próprio site (tipo: "local"):
 *   1. Prepare os arquivos com o script ferramentas/preparar-video.sh
 *      (gera o .mp4, o .webm e a capa em videos/ e videos/capas/).
 *   2. Cadastre aqui:
 *   {
 *     id: "cerimonia-01",
 *     titulo: "Entrada da noiva",
 *     descricao: "Aliança Eterna · Igreja Matriz de São Lourenço",   // opcional
 *     poster: "videos/capas/cerimonia-01.jpg",
 *     tipo: "local",
 *     src: "videos/cerimonia-01.mp4",
 *     srcWebm: "videos/cerimonia-01.webm",      // opcional
 *     legendas: null,                           // opcional: "videos/cerimonia-01.vtt"
 *     youtubeId: null,
 *   },
 *
 * Quando o canal do YouTube existir, basta trocar no mesmo vídeo:
 *     tipo: "youtube",
 *     youtubeId: "dQw4w9WgXcQ",   // o código que aparece em youtube.com/watch?v=CODIGO
 * (o poster pode continuar o mesmo; se ficar vazio, usa a capa do YouTube)
 */
window.SITE_VIDEOS = [
];
