# Site oficial da cantora La Rodrigues

Site estático (HTML, CSS e JavaScript puros, sem instalação) com três páginas:

- `index.html`: página inicial (abertura, sobre, serviços, valores a combinar, galeria e Instagram)
- `curriculo.html`: trajetória, formação, experiência, repertório e formações
- `contato.html`: contatos e formulário de orçamento, que abre o WhatsApp com a mensagem pronta
  (ou o e-mail, se o WhatsApp não estiver configurado)

## O que falta preencher

1. **Contatos:** edite `js/config.js` (WhatsApp, e-mail, Instagram).
2. **Fotos:** coloque as fotos em `imagens/`, com os nomes listados em `imagens/LEIA-ME.md`.
3. **Currículo:** troque os trechos entre colchetes `[...]` em `curriculo.html`
   (procure pelos comentários `TROCAR`).
4. **Nome artístico:** se não for "La Rodrigues", troque em todos os `.html`.

## Ver no computador

Abra `index.html` no navegador, ou rode um servidor local:

```
cd site-la-rodrigues
python3 -m http.server 8000
```

e acesse http://localhost:8000.

## Publicar

Por ser estático, pode ir para GitHub Pages, Netlify, Vercel ou qualquer hospedagem:
basta enviar o conteúdo deste repositório.
