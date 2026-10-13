# DECISOES

Aqui eu registro o porquê. O que foi feito, com classes, larguras e medidas, está no 'COMPATIBILIDADE.md'. Cada decisão aponta para a seção de origem.

## D-01: Estrutura de pastas (T00)

- Contexto: a F1 e a F2 eram dois arquivos soltos ('home-f1.html' e 'home-f2.html').
- Decisão: mover para 'prototipo/index.html' (F1) e 'prototipo/bootstrap.html' (F2), como a estrutura esperada pede. O CSS da F1 saiu do '<style>' e foi para 'prototipo/assets/styles.css'.
- Consequência: o histórico do Git guarda a versão antiga. Os links e os caminhos dos assets mudaram.
- Origem: 'COMPATIBILIDADE.md', seção "Versões e arquivos".

## D-02: O 'h1' fica no destaque (T01)

- Contexto: na F1 o 'h1' era o nome do site, dentro do cabeçalho. No Bootstrap o 'navbar-brand' é um link, não um título.
- Opções: manter o 'h1' no cabeçalho da F1 e diferir da F2, ou mover o 'h1' para o destaque nas duas.
- Decisão: 'h1' no destaque ("Bem-vindo ao portal de Futebol") nas duas versões. A marca virou link.
- Consequência: a hierarquia 'h1' > 'h2' > 'h3' é igual na F1 e na F2.
- Origem: 'COMPATIBILIDADE.md', seção "Hierarquia".

## D-03: Fallback e melhoria progressiva (T01)

- Recurso escolhido: o formulário e as tabelas.
- Piso: sem CSS, o conteúdo está inteiro no HTML. Sem JavaScript, a navegação por âncoras funciona. A mensagem de erro de cada campo existe no HTML com o atributo `hidden`. O CSS a mostra em `:user-invalid`. O `aria-describedby` é ligado por JS na T07, só quando o campo é inválido. Feito na T07, ver D-15.
- Melhoria: o CSS acrescenta grade, container query e estados.
- Conferido em 11/10/2026: a ordem de leitura sem CSS segue a ordem do HTML.

## D-04: Tokens e unidades (T02)

- Tokens em `:root`, nomeados pelo papel: `--cor-marca`, `--cor-superficie-escura`, `--cor-foco`, `--cor-foco-invertido`, `--cor-erro`, `--cor-desabilitado-*`, `--espaco-1` a `--espaco-4`, `--texto-*`, `--entrelinha-*`, `--espessura-*`, `--duracao`.
- Unidades:
  - 'rem' para a escala de espaço e de texto;
  - 'em' no padding dos botões e das células, que acompanha a fonte do próprio componente;
  - `px` só no `:root`: borda de 1px (`--borda`) e os tokens `--espessura-borda` (2px) e `--espessura-foco` (3px). Exceção justificada: a WCAG 2.2 pede foco visível e espesso, e isso não é tamanho de texto. O `outline-offset` e o `translateY` ficaram em `rem`;
  - 'ch' no limite de 65 caracteres dos parágrafos;
  - 'clamp(2rem, 1.5rem + 2vw, 3.5rem)' no 'h1', com piso de 2rem como fallback.
- O que eu converti: 10px e 15px viraram 1rem, 20px virou 1rem na horizontal e 1.5rem na vertical, 40px virou 2.5rem, 800px virou 70rem.
- Zero ID e zero '!important' no CSS próprio.
- Contraste AA, par a par (calculado): texto/fundo 16,48:1. Branco/marca 5,15:1. Branco/superfície escura 12,63:1. Foco/fundo 6,39:1. Borda do controle/fundo 4,54:1. Erro/fundo 6,54:1. Todos acima de 4,5:1 (texto) e 3:1 (componente). Detalhes em "Contraste conferido" no `COMPATIBILIDADE.md`.
- Origem das medidas: 'COMPATIBILIDADE.md', seções "CSS próprio e peso" e "Contraste conferido".

## D-05: Estados da interface (T02)

- Normal, hover, foco, ativo e desabilitado estão no '.btn' e no '.nav__link'.
- Inválido está no '.campo__controle:user-invalid', com borda, fundo e a mensagem "Erro:" em texto. Não depende só de cor.
- O foco nunca é removido. Fica azul no fundo claro e branco nos fundos escuros (a variável '--cor-foco' muda dentro de '.cabecalho', '.destaque' e '.rodape').
- Evidência dos 6 estados em `docs/evidencias/`: `t02-estado-normal.png`, `t02-estado-hover.png`, `t02-estado-ativo.png`, `t02-estado-foco.png`, `t02-estado-desabilitado.png` e `t02-estado-invalido.png`.
- Declaração riscada (DevTools, `:hover` forçado): em `.btn`, o `background-color` (`styles.css:476`) é riscado porque `.btn:hover` (`styles.css:489`) tem especificidade maior (pseudo-classe soma ao seletor). Evidência: `docs/evidencias/t02-declaracao-riscada.png`.

## D-06: Menu, grade e breakpoint (T03 e T05)

- Menu: Flexbox com 'flex-wrap', 'gap' e 'flex: 1 1 10rem' em cada item. Em 320px os links ficam um por linha, que também é bom para o toque.
- Notícias: 'repeat(auto-fit, minmax(min(100%, 14rem), 1fr))'. Não precisa de breakpoint.
- Tabelas: rolagem horizontal só dentro do 'div' que as envolve. Esse 'div' recebe foco por teclado e tem nome.
- Breakpoint em 56rem. Motivo: a barra lateral de 18rem só entra quando a coluna principal ainda comporta dois cartões de 14rem. Efeito colateral: entre 896px e cerca de 1064px os cartões passam de 3 para 2 colunas.
- A ficha de jogo usa container query ('container: ficha / inline-size', 'min-width: 22rem'). A grade `.fichas` (Grid auto-fit, mínimo 16rem) põe até duas fichas por linha. O arranjo de cada ficha depende da largura do slot, não da janela: empilhada abaixo de 22rem, times lado a lado a partir de 22rem. Na lateral (18rem) fica sempre empilhada. Na coluna principal, lado a lado em janelas de 384 a 559px, 752 a 895px e a partir de 1080px (raiz de 16px; valores calculados, conferir no DevTools).
- Origem: 'COMPATIBILIDADE.md', seção "Larguras testadas".
- Testes T03 (320px): sem rolagem horizontal da página (`scrollWidth <= clientWidth`) com palavra longa em título e na ficha, lista vazia e 20 cards. Tab segue a ordem visual. Evidência: `docs/evidencias/t03-320px-sem-overflow.png`, `t03-texto-longo.png` e `t03-20-itens.png`.
- Palavras longas: `overflow-wrap: anywhere` e `min-inline-size: 0` nos títulos, nos cards e na ficha. Na ficha, dentro da container query, as colunas usam `minmax(0, auto) auto minmax(0, auto)`: nome longo encolhe até 0 em vez de estourar.

## D-07: Movimento (T04)

- Gradiente só no destaque, com `background-color: #333` antes dele.
- Ponto mais claro do gradiente: verde `#1b7e32` com texto branco, 5,15:1 (medido no DevTools).
- `transform` só em três lugares: hover do cartão (`translateY(-.25rem)`), clique do botão (`translateY(.125rem)`) e clique dos links do menu (1px, `translateY(.0625rem)`).
- `transition` por propriedade, 160ms. Nenhum `transition: all`.
- Com `prefers-reduced-motion: reduce`, transição e deslocamento saem. Borda e cor continuam mudando.
- Resultado do jogo em texto ("Vitória", "Empate", "Agendado" para jogo futuro), não só cor.
- Evidência: `docs/evidencias/t04-reduced-motion-reduce.png`, `t04-computed-card.png`, `t04-reduced-motion-no-preference.png`.
- Limite: a emulação do DevTools não é o ajuste real do sistema.

## D-08: Bootstrap 5.3.8 (T06)

- Origem: pacote oficial 'bootstrap@5.3.8' do npm. Arquivos copiados sem alteração: CSS, bundle JS, os dois '.map' e o 'LICENSE' (MIT).
- Tamanhos: CSS 232.111 bytes (30.869 gzip). Bundle 80.496 bytes (23.743 gzip).
- Substitui a versão 5.3.3 da primeira entrega, que foi removida.
- Os '.map' ficam junto para o DevTools não avisar de mapa faltando.
- Customização: variáveis '--bs-btn-*' no escopo '.marca-futnoticias .btn-primary'. Sem '!important' e sem editar o minificado.
- Menu: 'navbar-expand-md' com 'data-bs-theme="dark"'. Não usei 'navbar-dark', que está depreciado na 5.3.

## D-09: Segundo componente: modal (T06)

- Escolhi o modal "Revisar antes de enviar", no formulário. Já vem com alvo único, 'aria-labelledby', botão de fechar, Esc e foco devolvido.
- Limite: hoje o modal só mostra um aviso. Ele não lê os campos do formulário. Isso fica para o T07.
- Fica no fim do 'body', fora do 'container'.
- Evidência: `docs/evidencias/t06-ids-unicos.png`, `t06-menu-767-aberto.png`, `t06-menu-768.png`, `t06-modal-aberto.png`, `t06-modal-foco-devolvido.png`, `t06-offline.png` e `t06-contraste-menu.png`.

## D-10: Verde fora das cores do Bootstrap (T06)

- Contexto: o verde '#1b7e32' não existe nas cores do Bootstrap.
- Decisão: uma classe própria ('.navbar-marca') com o verde, em vez de usar um 'bg-*' do framework.
- Consequência: 2 regras próprias na F2, 18 linhas, 587 bytes.
- Origem: 'COMPATIBILIDADE.md', seção "CSS próprio e peso".

## D-11: Bootstrap contra CSS próprio (T06)

- A F1 gasta 8.163 bytes de CSS próprio (61 regras). A F2 gasta 587 bytes (2 regras).
- O Bootstrap custa 232.111 bytes de CSS e 80.496 de JS. A página F2 fica umas 18 vezes mais pesada que a F1 (cerca de 325 KB contra 18 KB).
- Ganho: grade, menu recolhível, modal e estados prontos. Perda: peso e controle fino.
- A comparação não é justa por linhas de CSS. A F2 também escreve menos CSS porque a F1 tem container query e tokens que o Bootstrap não oferece.
- Origem: 'COMPATIBILIDADE.md', seções "CSS próprio e peso" e "Diferenças para a F1".

## D-12: Verificação de segredos antes do merge (T00 e T02)

- Comando da spec: `git log -p | grep -i -E "senha|token|key"`. Gera falso positivo. Casa com "token" (tokens de CSS) e com `key` no source map do Bootstrap 5.3.8.
- Comandos usados no lugar:
  - `git grep -n -i -E "(senha|password|secret|api[_-]?key)[\"']? *[:=]"`
  - `git log --all --name-only --pretty=format: | sort -u | grep -i -E "\.env|\.sql|\.zip|wp-config|\.pem"`
- Resultado em 12/10/2026: nenhum segredo. O único achado do `git grep` foi `bootstrap.bundle.min.js.map` (nomes de código do Bootstrap). O segundo comando saiu vazio.
- Os `.map` do Bootstrap ficam no repositório. São inofensivos e servem para depurar no DevTools.

## D-13: Imagem principal em SVG com srcset (T05)

- Contexto: a SPEC pede `srcset` e `sizes` coerentes com o slot. As imagens do projeto são SVG (`estadio-480.svg`, `estadio-960.svg`, `estadio-1440.svg`).
- Decisão: manter SVG e usar `srcset` com descritores `w` mesmo assim.
- Motivo: SVG é vetor e escala sem perda, então o ganho de peso é pequeno. O `srcset` demonstra a técnica. Com imagem raster (WebP ou JPG), cada arquivo teria a largura real em pixels.
- `sizes="(min-width: 42rem) 40rem, calc(100vw - 2rem)"`: 40rem é o `max-inline-size` da imagem e 2rem é o padding horizontal do destaque. O ponto 42rem é 40rem mais 2rem.
- Sem `loading="lazy"`: é a imagem principal (candidata a LCP) e leva `fetchpriority="high"`. A página não tem outra imagem abaixo da dobra.
- Sem `picture`: não há recorte diferente por tamanho de tela.
- Consequência: se as imagens virarem raster, só os arquivos mudam. O HTML continua igual.
- Vale para as duas páginas: a F1 ('index.html') e a F2 ('bootstrap.html') usam os mesmos três SVG. Só o 'sizes' muda. Na F1 ele segue o padding de 2rem do destaque. Na F2 segue o container do Bootstrap: 1200px ou mais, 960px. 992px ou mais, 936px. 768px ou mais, 696px. 576px ou mais, 516px. Abaixo disso, a janela menos 1,5rem.

## D-14: Contraste dos componentes do Bootstrap (T06)

- Medi no DevTools os pares que o Bootstrap traz por padrão: links do menu, legenda das tabelas e badge de sucesso.
- Passaram: links do menu 5,15:1, legenda 6,58:1 e badge 4,53:1 (por pouco).
- Reprovou: 'btn-outline-secondary' ('#6c757d') sobre o 'bg-light' ('#f8f9fa'), 4,45:1. O DevTools não mostra a razão quando o fundo do botão é transparente, então calculei à mão.
- Decisão: trocar por 'btn-outline-dark'. Mantém o contorno e não pede CSS próprio.
- Consequência: a F2 continua com 2 regras próprias e 72 classes.
- Origem: 'COMPATIBILIDADE.md', seção "Contraste conferido".
- Na T07 entrou uma terceira, a do aria-invalid. Ver D-15.

## D-15: JavaScript nativo (T07)

**Como carrego o JS.** Uso `<script type="module" src="js/main.js">`. O módulo é adiado sozinho, como o `defer`, e não bloqueia a leitura do HTML. O custo é que módulos não abrem por `file://`, então sempre testo por servidor HTTP.

**Melhoria progressiva.** O `main.js` põe a classe `js` no `<html>`. Todo o CSS que só vale com JavaScript depende dela. O menu hambúrguer só aparece com `.js`. A busca, os botões Favoritar e o Anterior/Próximo somem com `html:not(.js)`. Os itens inteiros (contador, link e seção de favoritos) usam a classe `so-com-js`. Sem JS, a lista de notícias aparece completa, o menu é visível e o formulário usa a validação nativa. Evidência: `docs/evidencias/t07-sem-js.png`.

**Delegação de evento.** Os favoritos usam um único listener na lista, com `closest('button[data-favorito]')`. Assim o clique no `span` ou no ícone dentro do botão funciona, e itens criados depois do listener também. O filtro lê `lista.children` a cada digitação, então itens novos entram na busca sem código extra.

**Consentimento dos favoritos.** Só gravo no `localStorage` depois de a pessoa clicar em "Aceitar". Sem consentimento, o favorito vive em memória e some ao recarregar. Se ela recusa, apago os favoritos que já estavam salvos. Registro a própria escolha (`aceito` ou `recusado`) no `localStorage` para não perguntar toda vez. Reconheço o limite: gravar "recusado" também é gravar. A alternativa seria perguntar de novo a cada visita. Todo acesso ao `localStorage` fica em `try/catch`, porque ele pode estar bloqueado. Nesse caso o favorito funciona só em memória, sem erro no console.

**Texto do usuário.** Todo texto dinâmico entra por `textContent` ou `createElement`, nunca por `innerHTML`. Testei a busca com `<b>x</b>` e nada quebra.

**Busca.** Normalizo o texto (sem acento, minúsculas), então "gremio" casa com "Grêmio". O texto pesquisável exclui os botões. Sem isso, buscar "fav" casaria com todos os cards por causa do botão "Favoritar". O resultado vai para uma região `role="status"`, com "N resultados", e o estado vazio tem mensagem visível.

**Trilho.** Uso Pointer Events (`pointerdown`, `pointermove`, `pointerup`, `pointercancel`) e não `touchstart` + `click`, para não duplicar evento. Só chamo `setPointerCapture` depois que o movimento passa de 6px. Capturar já no `pointerdown` redireciona o clique para a faixa e quebra links dentro dos cards. O CSS usa `touch-action: pan-y pinch-zoom`. Os botões Anterior/Próximo e as setas do teclado (a faixa tem `tabindex="0"`) são a alternativa ao arraste, como pede a WCAG 2.2. Nas pontas uso `aria-disabled` e não `disabled`, porque `disabled` tira o foco do botão que acabou de ser clicado. Um clique logo após um arraste é cancelado na fase de captura.

**Formulário e decisão D-03.** O `aria-describedby` de cada campo não fica fixo no HTML. O `formulario.js` liga o campo à mensagem de erro só quando ele está inválido e remove quando fica válido. Um `aria-describedby` apontando para um elemento `hidden` ainda é lido por leitores de tela, o que anunciaria um erro que não existe. Desligo os balões nativos com `form.noValidate = true` só via JS, então sem JS a validação nativa continua valendo. O resultado vai para uma região `role="status"` e a tela diz que nada é enviado.

**O 404 na bootstrap.html.** O formulário tinha `method="post"`. Num servidor estático (local ou GitHub Pages) um POST para a página devolve 404. Removi o `method` e o `formulario.js` chama `preventDefault`. Evidência: `docs/evidencias/t07-network-sem-envio.png` (aba Rede vazia ao enviar).

**AbortController.** Um único `AbortController` passa o `signal` a todos os módulos. `desmontar()` chama `abort()` e remove todos os listeners de uma vez. `montar()` tem uma guarda, então chamar duas vezes não duplica handler.

**Ordem das regras no CSS.** `[hidden]` e `.card` têm a mesma especificidade (0-1-0). Quando coloquei `.card { display: flex }` depois do `[hidden]`, o filtro parou de esconder os cards. Corrigi movendo o `[hidden]` para a última regra do arquivo. Regra que sigo agora: qualquer `display` novo num elemento que o JS esconde vem antes do `[hidden]`. Pelo mesmo motivo, `.erro:not([hidden])` mostra o erro, já que `.erro` tem `display: none`.

**Evidências da T07** (em `docs/evidencias/`): `t07-menu-320-fechado.png`, `t07-menu-320-aberto.png`, `t07-filtro-resultados.png`, `t07-filtro-vazio.png`, `t07-favoritos-consentimento.png`, `t07-favoritos-secao.png`, `t07-trilho.png`, `t07-form-erros.png`, `t07-form-sucesso.png`, `t07-console-limpo.png`, `t07-network-sem-envio.png`, `t07-sem-js.png`.

- Origem: 'COMPATIBILIDADE.md', seção "JavaScript: diferenças entre F1 e F2 (T07)".

## Pendências conhecidas

- Firefox, WebKit e celular real ainda não foram testados. Entram no T11.
- Em 160px de largura a F1 tem rolagem horizontal. O critério é 320px.
- Na F2, sem JavaScript, o menu e o modal não funcionam: dependem do bundle do Bootstrap.
- Busca, favoritos e trilho existem só na F1.
- Os números de peso e de regras do 'COMPATIBILIDADE.md' foram medidos antes da T07. Preciso refazê-los.
- Os prints de T00 a T07 estão em 'docs/evidencias/'. Faltam os de T08 em diante.