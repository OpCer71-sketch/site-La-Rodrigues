# Site oficial da cantora Laura Rodrigues

Site estático (HTML, CSS e JavaScript puros, sem instalação) com três páginas:

- `index.html`: página inicial (abertura, sobre, serviços, valores a combinar, galeria e Instagram)
- `curriculo.html`: trajetória, formação, experiência, repertório e formações
- `contato.html`: contatos e formulário de orçamento, que abre o WhatsApp com a mensagem pronta
  (ou o e-mail, se o WhatsApp não estiver configurado)

## Como atualizar

- **Contatos:** `js/config.js` (WhatsApp, e-mail e Instagram).
- **Fotos:** substitua os arquivos em `imagens/`, mantendo os nomes listados em `imagens/LEIA-ME.md`.
- **Currículo e repertório:** `curriculo.html`.

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
