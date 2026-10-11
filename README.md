# FutNotícias

Portal mobile-first para acompanhar uma temporada de futebol. Projeto da UC15 (HTML Mobile first).

O mesmo produto evolui em etapas: protótipo sem framework, versão Bootstrap, interações em JavaScript, auditorias, tema filho de WordPress e testes automatizados.

## Objetivo

Construir, publicar e defender um portal com notícias, calendário e classificação. Funciona a partir de 320px, por teclado e por toque.

## Público

Torcedores que acompanham a temporada pelo celular.

## Três tarefas críticas

1. Ler a última notícia.
2. Filtrar notícias e favoritar uma delas.
3. Enviar o formulário de contato.

## Fora do escopo

- Login de público.
- Dados reais de clubes e jogos.
- Pagamento.
- App nativo.

## Como abrir o protótipo

```bash
git clone <https://github.com/Henrique-Missio/Projeto-UC-15.git>
cd <Projeto-UC-15>/prototipo
python3 -m http.server 8000
```

Abra `http://localhost:8000` (F1) e `http://localhost:8000/bootstrap.html` (F2). No Windows, use `python` no lugar de `python3`. No VS Code, a extensão Live Server também serve.

## Como testar

```bash
npm ci
npx playwright test
```

## Como gerar a entrega

```bash
git tag -a v1.0.0 -m "Entrega UC15"
git push origin v1.0.0
```

O protótipo é publicado no GitHub Pages a partir da pasta `prototipo/`.

## Estrutura

```text
README.md  DECISOES.md  TESTES.md  CMS.md  COMPATIBILIDADE.md
docs/evidencias/        prints, traces e relatórios
docs/relatorio-final.md
prototipo/              index.html (F1), bootstrap.html (F2), assets/, js/
wordpress/tema-filho/   tema filho do WordPress
tests/                  testes Playwright
```

## Documentação

- `DECISOES.md`: por que cada escolha foi feita.
- `COMPATIBILIDADE.md`: classes, larguras testadas, peso e diferenças entre F1 e F2.
- `TESTES.md`: plano e roteiros de teste.
- `CMS.md`: ambiente, tema, backup e rollback do WordPress.

## Licenças e autoria

- Código: MIT (arquivo `LICENSE`).
- Textos e ilustrações próprios: CC BY 4.0.
- Bootstrap 5.3.8: MIT, em `prototipo/assets/vendor/bootstrap-5.3.8/LICENSE`.
- Todo o conteúdo é fictício. Nomes de times e resultados são inventados.

## Limitações conhecidas

- O WordPress roda só localmente (WordPress Studio). Não há host externo nem HTTPS no WordPress.
- O formulário não envia dados.