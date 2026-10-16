# TESTES

## Riscos

- Menu mobile sem estado acessível (`aria-expanded`).
- Filtro sem contagem ou sem estado vazio.
- Favorito sem `aria-pressed`.
- Formulário sem erro em texto ou sem resultado.
- Overflow horizontal em 320px.

## Tarefas críticas

1. Ler a última notícia.
2. Filtrar notícias e favoritar uma delas.
3. Enviar o formulário de contato.

## Navegadores e dispositivos-alvo

- Motores: Chromium, Firefox, WebKit.
- Perfis móveis emulados: Pixel 7 e iPhone 14.
- Celular real: A21s, Android 12, Chrome 155.0.8059.79.
- Servidor: `http-server` servindo `prototipo/`, porta 4173.

## Matriz de responsividade

- Teclado virtual (celular real): Observado no A21s: Teclado não cobriu nenhum campo ou botão.
- Aparelho: A21s, Android 12, Chrome 155.0.8059.79.

### Larguras (um pixel antes e no ponto)
- 320: sem overflow, menu em uma coluna, fichas empilhadas. Observado: confere. `scrollWidth <= clientWidth` deu `true`.
- 383 / 384: ficha empilhada, depois times lado a lado. Observado: confere. Em 383 a ficha está empilhada. Em 384 os times ficam lado a lado.
- 559 / 560: uma ficha por linha, depois duas empilhadas. Observado: confere. A mudança de uma para duas fichas por linha ocorre em 560.
- 671 / 672: imagem de 639px, depois 640px (máximo). Observado: confere. Medido em Computed: 639px em 671 e 640px em 672.
- 735 / 736: 2 cartões, depois 3. Observado: confere. Em 736 aparecem 3 colunas de cartões.
- 751 / 752: fichas empilhadas, depois lado a lado. Observado: confere. A mudança ocorre em 752.
- 895 / 896: uma coluna, depois duas com a lateral. Observado: confere. A lateral "Em campo" aparece em 896. Print: `t05-895-896.png`.
- 1063 / 1064: 2 cartões, depois 3. Observado: confere. A mudança ocorre em 1064, como diz o D-06.
- 1079 / 1080: fichas empilhadas, depois lado a lado. Observado: confere. A mudança ocorre em 1080.
- Em todas as larguras: sem rolagem horizontal da página e nenhum conteúdo suprimido.

### Condições
- Zoom 200% (janela de 1280px, equivale a 640px). Método: zoom do navegador, DevTools fechado. Observado: sem rolagem horizontal, nada cortado, menu e formulário usáveis. Print: `t05-zoom-200.png`.
- Fonte ampliada ("Muito grande"): Observado: o texto cresce junto, nada é cortado e não há rolagem horizontal da página.
- Paisagem (844 × 390): Observado: nada some, o menu continua usável e o formulário funciona. Print: `t05-paisagem.png`.
- Teclado virtual (celular real): Funcionando
- Aparelho: A21s, Android 12, Chrome 155.0.8059.79.

### Limites desta matriz
- O modo responsivo do DevTools não reproduz o teclado virtual nem a rolagem real do celular. Esses pontos foram conferidos no A21s.
- Firefox e WebKit rodam na suíte Playwright (ver Automação).

## Roteiros manuais

### Roteiro 1: ler a última notícia
- Pré-condição: `index.html` aberta, JS ligado.
- Passos: 
    - 1) Tab até "Pular para o conteúdo" e Enter. 
    - 2) Abrir o menu e ir a "Notícias". 
    - 3) Ler a primeira notícia.
- Esperado: foco visível em todo passo. Conteúdo legível em 320px.
- Observado: Passou. Passo 1 (Tab) no PC. Passos 2 e 3 no A21s.

### Roteiro 2: filtrar e favoritar
- Pré-condição: `index.html` aberta.
- Passos: 
    1) Digitar "reforço" na busca. 
    2) Conferir "1 resultado". 
    3) Ativar "Favoritar" com Enter. 
    4) Conferir o contador.
- Esperado: botão pressionado. Contador sobe para 1.
- Observado: Passou

### Roteiro 3: enviar o contato
- Pré-condição: `index.html` aberta.
- Passos: 
    1) Enviar vazio. 
    2) Ler os erros. 
    3) Preencher com dados fictícios. 
    4) Enviar.
- Esperado: erros em texto, depois mensagem de resultado. A tela avisa que nada é enviado.
- Observado: Passou

### Celular real
- Aparelho: A21s
- Sistema: Android 12
- Navegador: Chrome 155.0.8059.79
- Roteiros 1, 2 e 3: passaram.
- Diferença para a emulação: nenhuma.

## Automação

### Como rodar
```bash
npm ci
npx playwright install
npx playwright test
npx playwright show-report
```

### Resultado
- 55 testes (11 specs x 5 projetos)
- 15/10/2026: 25 passaram em 10,7 s.
- Evidência: `docs/evidencias/t11-suite-verde.png`.

### Mutação intencional
- Mudança: comentei a linha do `aria-expanded` em `prototipo/js/menu.js`.
- Resultado: 5 testes de menu falharam (um por projeto).
- Evidência: `docs/evidencias/t11-mutacao-falha.png`, `docs/evidencias/t11-mutacao-falha-geral.png`.
- Reversão: `git restore prototipo/js/menu.js`. Voltou a 25 verdes.
- Evidência: `docs/evidencias/t11-mutacao-revertida.png`.

### Como reproduzir a falha
1. `npm ci` e `npx playwright install`.
2. Em `prototipo/js/menu.js`, comente a linha do `aria-expanded`.
3. `npx playwright test -g menu`. Esperado: 5 falhas.
4. `git restore prototipo/js/menu.js`. Rode de novo. Esperado: verde.

### Emulado, navegador de marca e aparelho real
- Emulado: Pixel 7 e iPhone 14. O Playwright simula tela, toque e user agent sobre o motor do desktop.
- Motor do Playwright: Chromium, Firefox e WebKit em builds do Playwright. Não são o Chrome, o Firefox e o Safari instalados.
- Navegador de marca: Chrome, Edge ou Safari instalados, com atualização e extensões próprias. Nesta suíte não rodam.
- Aparelho real: A21s com Chrome. Único ambiente com toque, teclado virtual e rolagem reais.

### Dados e arquivos
- `playwright-report/` e `test-results/` ficam no `.gitignore`.
- Os testes usam só dados fictícios. Nenhum cookie, token ou dado pessoal.

## Limites

- WebKit não é o Safari real.
- Emulação de celular não é aparelho real.
- Perfil emulado não testa toque real, teclado virtual nem desempenho.
- Leitor de tela não é automatizado. Fica no roteiro manual.
- Os testes da bootstrap.html rodam com movimento reduzido, porque o Bootstrap ignora cliques durante a animação. A animação normal não é testada.