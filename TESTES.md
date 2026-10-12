# TESTES

## Riscos

(A preencher no T11.)

## Tarefas críticas

1. Ler a última notícia.
2. Filtrar notícias e favoritar uma delas.
3. Enviar o formulário de contato.

## Navegadores e dispositivos-alvo

(A preencher no T11: Chromium, Firefox, WebKit, perfis móveis e um celular real.)

## Matriz de responsividade

Raiz de 16px. Navegador: Chromium (modo responsivo do DevTools). Emulação não é aparelho real.

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
- Teclado virtual (celular real): Pendente. Será testado no celular real no T11.
- Aparelho: Pendente. Modelo, sistema e navegador entram no T11.

### Limites desta matriz
- O modo responsivo do DevTools não reproduz o teclado virtual nem a rolagem real do celular.
- Firefox e WebKit entram no T11.

## Roteiros manuais

(Pré-condição, passos, esperado e observado. Um por tarefa crítica.)

## Automação

(Comandos e resultados do Playwright, a partir do T11.)

## Limites

- WebKit não é o Safari real.
- Emulação de celular não é aparelho real.