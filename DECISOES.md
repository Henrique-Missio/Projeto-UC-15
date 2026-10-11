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
- Piso: sem CSS, o conteúdo está inteiro no HTML. Sem JavaScript, a navegação por âncoras funciona. A mensagem de erro de cada campo existe no HTML e só aparece por CSS ('input:user-invalid ~ .erro').
- Melhoria: o CSS acrescenta grade, container query e estados.
- Pendência: a ordem de leitura sem CSS ainda precisa ser conferida por mim com os olhos.

## D-04: Tokens e unidades (T02)

- Tokens em ':root', nomeados pelo papel: '--cor-marca', '--cor-superficie-escura', '--cor-foco', '--cor-erro', '--espaco-1' a '--espaco-4', '--duracao'.
- Unidades:
  - 'rem' para a escala de espaço e de texto;
  - 'em' no padding dos botões e das células, que acompanha a fonte do próprio componente;
  - 'px' só na borda de 1px;
  - 'ch' no limite de 65 caracteres dos parágrafos;
  - 'clamp(2rem, 1.5rem + 2vw, 3.5rem)' no 'h1', com piso de 2rem como fallback.
- O que eu converti: 10px e 15px viraram 1rem, 20px virou 1rem na horizontal e 1.5rem na vertical, 40px virou 2.5rem, 800px virou 70rem.
- Zero ID e zero '!important' no CSS próprio.
- Contraste: ver "Contraste conferido" no 'COMPATIBILIDADE.md'.
- Origem das medidas: 'COMPATIBILIDADE.md', seções "CSS próprio e peso" e "Contraste conferido".

## D-05: Estados da interface (T02)

- Normal, hover, foco, ativo e desabilitado estão no '.btn' e no '.nav__link'.
- Inválido está no '.campo__controle:user-invalid', com borda, fundo e a mensagem "Erro:" em texto. Não depende só de cor.
- O foco nunca é removido. Fica azul no fundo claro e branco nos fundos escuros (a variável '--cor-foco' muda dentro de '.cabecalho', '.destaque' e '.rodape').
- Pendência: tirar um print de cada estado e guardar em 'docs/evidencias/'.
- Pendência: registrar, com print do DevTools, uma declaração aplicada e uma riscada. Sugestão: na F2, o '.m-0' do rodapé vence o 'margin-bottom' do reboot para 'p'.

## D-06: Menu, grade e breakpoint (T03 e T05)

- Menu: Flexbox com 'flex-wrap', 'gap' e 'flex: 1 1 10rem' em cada item. Em 320px os links ficam um por linha, que também é bom para o toque.
- Notícias: 'repeat(auto-fit, minmax(min(100%, 14rem), 1fr))'. Não precisa de breakpoint.
- Tabelas: rolagem horizontal só dentro do 'div' que as envolve. Esse 'div' recebe foco por teclado e tem nome.
- Breakpoint em 56rem. Motivo: a barra lateral de 18rem só entra quando a coluna principal ainda comporta dois cartões de 14rem. Efeito colateral: entre 896px e cerca de 1064px os cartões passam de 3 para 2 colunas.
- A ficha de jogo usa container query ('container: ficha / inline-size', 'min-width: 30rem'). Mesma janela, dois arranjos: empilhada na lateral, lado a lado na coluna.
- Origem: 'COMPATIBILIDADE.md', seção "Larguras testadas".

## D-07: Movimento (T04)

- Gradiente só no destaque, com 'background-color: #333' antes dele. O ponto mais claro é o verde, com 5,15:1 contra o texto branco.
- 'transform' só no hover do cartão ('translateY(-.25rem)') e no clique do botão.
- 'transition' por propriedade, 160ms. Nenhum 'transition: all'.
- Com 'prefers-reduced-motion: reduce' a transição e o deslocamento saem. A borda e a cor continuam mudando.
- Resultado do jogo em texto ("Vitória", "Empate", "A jogar"), não só cor.

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

## D-10: Verde fora das cores do Bootstrap (T06)

- Contexto: o verde '#1b7e32' não existe nas cores do Bootstrap.
- Decisão: uma classe própria ('.navbar-marca') com o verde, em vez de usar um 'bg-*' do framework.
- Consequência: 2 regras próprias na F2, 580 bytes.
- Origem: 'COMPATIBILIDADE.md', seção "CSS próprio e peso".

## D-11: Bootstrap contra CSS próprio (T06)

- A F1 gasta 8.163 bytes de CSS próprio (61 regras). A F2 gasta 580 bytes (2 regras).
- O Bootstrap custa 232.111 bytes de CSS e 80.496 de JS. A página F2 fica umas 18 vezes mais pesada que a F1 (cerca de 325 KB contra 18 KB).
- Ganho: grade, menu recolhível, modal e estados prontos. Perda: peso e controle fino.
- A comparação não é justa por linhas de CSS. A F2 também escreve menos CSS porque a F1 tem container query e tokens que o Bootstrap não oferece.
- Origem: 'COMPATIBILIDADE.md', seções "CSS próprio e peso" e "Diferenças para a F1".

## Pendências conhecidas

- O formulário ainda não tem JavaScript. Ele não envia dados, e o botão de envio não mostra resultado. Entra no T07.
- Firefox, WebKit, celular real e zoom de 200% ainda não foram testados.
- Em 160px de largura a F1 tem rolagem horizontal. O critério é 320px.
- Faltam os prints de evidência em 'docs/evidencias/'.
- O linter de HTML reclama de 'div role="region"' nas tabelas e do 'aria-hidden' do modal. Mantive os dois: seguem o padrão ensinado na A17 e na A14.