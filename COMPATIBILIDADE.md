# COMPATIBILIDADE: F1 (sem framework) e F2 (Bootstrap local)

## Versões e arquivos

O projeto é a home do FutNotícias.

- A F1 está em 'prototipo/index.html'. Foi feita só com HTML e CSS próprio, em 'prototipo/assets/styles.css'.
- A F2 está em 'prototipo/bootstrap.html' e usa o Bootstrap 5.3.8. Antes eu usava o 5.3.3. Troquei pela versão fixada nas aulas.
- O Bootstrap é local, em 'prototipo/assets/vendor/bootstrap-5.3.8/': 'bootstrap.min.css', 'bootstrap.bundle.min.js' (já inclui o Popper), os dois arquivos '.map' e o 'LICENSE' (MIT). Não mexi nos arquivos minificados.
- As ilustrações são minhas, em 'prototipo/assets/img/estadio-480.svg', 'estadio-960.svg' e 'estadio-1440.svg'. Licença CC BY 4.0.
- Os arquivos antigos 'home-f1.html' e 'home-f2.html' viraram esses dois. A F1 anterior continua no histórico do Git.

## Hierarquia

As duas versões têm a mesma estrutura:

- link "Pular para o conteúdo";
- cabeçalho com a marca e a navegação (Home, Notícias, Calendário, Classificação e Contato);
- um 'main' com o destaque (o 'h1' agora está aqui, junto da frase e da imagem);
- "Últimas Notícias" com a ficha do último resultado e três cartões;
- "Calendário" e "Classificação", cada uma com uma tabela;
- "Contato", com o formulário;
- "Em campo", com a ficha do próximo jogo;
- rodapé.
- F1 não tem Home no menu.
- As duas tem Notícias favoritas e Lances da rodada.

Os títulos seguem 'h1' > 'h2' > 'h3', sem pular nível. Todos os links apontam para um destino que existe. Não sobrou nenhum 'href="#"'.

O que mudou em relação à versão anterior:

- O 'h1' saiu do cabeçalho e foi para o destaque. A marca virou um link. No Bootstrap o 'navbar-brand' não é título, então fiz igual nas duas.
- Os textos dos cartões e do destaque continuam iguais. Acrescentei o terceiro cartão ("Treino aberto"), as seções novas e a palavra "Vitória" no cartão do resultado.
- Os links agora são cinco, não três.

## Classes principais da F2

- 'marca-futnoticias', 'd-flex', 'flex-column', 'min-vh-100' e 'bg-light' no corpo. As três do meio empurram o rodapé para baixo.
- 'flex-grow-1' no 'main'.
- 'navbar', 'navbar-expand-md', 'navbar-marca', 'collapse' e 'navbar-collapse' no menu. O menu fica recolhido abaixo de 768px.
- 'container', 'my-4', 'mb-5' nas seções.
- 'row', 'g-3', 'col-12', 'col-md-6' e 'col-lg-4' nos cartões. Um por linha até 767px, dois a partir de 768px e três a partir de 992px.
- 'card', 'card-body', 'p-3' e 'h-100'. O 'h-100' iguala a altura.
- 'table', 'table-sm', 'table-responsive' e 'caption-top' nas tabelas.
- 'form-label', 'form-control' e 'btn' no formulário.
- 'modal', 'modal-dialog' e 'modal-fullscreen-sm-down' no segundo componente.
- 'text-white', 'text-center', 'bg-dark', 'py-5', 'py-2' e 'm-0' para cor, alinhamento e espaços.

No total a página usa 72 classes diferentes do Bootstrap, mais 2 minhas ('navbar-marca' e 'marca-futnoticias'). Antes eram 21.

## Larguras testadas

Testei as duas páginas nestas larguras: 320, 375, 575, 576, 767, 768, 769, 954, 991, 992, 1199, 1200 e 1400px.

- Nenhuma largura teve rolagem horizontal na página. A rolagem só aparece dentro das tabelas, em tela estreita.
- Console sem erro e sem aviso nas duas páginas.
- F1, cartões: 1 coluna em 320 e 375px, 2 em 575 e 576px, 3 em 767, 768 e 769px. Em 954 e 991px voltam a 2, porque a barra lateral entra em 56rem (896px) e a coluna fica mais estreita. Em 1199px voltam a 3.
- F2, cartões: um por linha em 767px. Em 768px ficam dois por linha. Em 992px ficam os três lado a lado.
- F2, menu: o botão aparece em 767px e some em 768px.
- F2, teclado: Enter abre e fecha o menu, e 'aria-expanded' muda. O modal abre, fecha com Esc e devolve o foco ao botão que abriu.
- Imagem principal: o navegador escolheu 'estadio-480.svg' em 320 e 375px e 'estadio-960.svg' de 575px em diante. Não testei a de 1440px, que depende de tela com densidade 2x.
- Em 160px de largura (zoom de 400% numa janela de 640px) a F1 ainda ganha 30px de rolagem horizontal.
- Zoom de 200% e fonte ampliada: testados em navegador de verdade no T05 (ver 'TESTES.md', matriz de responsividade).

Ainda não testei:

- Firefox e WebKit.
- Celular real e teclado virtual.
- Jornada só por teclado na F1, inteira, com os olhos.

Na versão anterior (F2 com Bootstrap 5.3.3) eu tinha testado 768, 954, 992 e 1200px.

## CSS próprio e peso

Os números abaixo são desta versão, depois da T09. Medi o CSS sem comentários e sem linhas em branco. Não comparam com os da primeira entrega, que era só uma home de 10 minutos.

- F1: 105 regras de CSS próprio, 918 linhas, 12.461 bytes. Mais 5 blocos de '@media' e '@container'.
- F2: 17 regras, 151 linhas, 5916 bytes. Ficam num '<style>' dentro do 'bootstrap.html'. Não há '@media' nem '@container'.
- Bootstrap: CSS com 232.111 bytes (30.869 com gzip) e bundle JS com 80.496 bytes (23.743 com gzip).
- JavaScript próprio: 7 arquivos em 'prototipo/js/', carregados como módulos nas duas páginas.
- Página F1, com HTML, CSS, JS e a imagem de 480px: [84,6] KB transferidos, cache desligado.
- Página F2, com HTML, CSS, JS e a imagem de 480px: [376] KB transferidos, cache desligado.
- A F2 usa 80 classes diferentes do Bootstrap, mais 7 minhas: 'navbar-marca', 'marca-futnoticias', 'btn-favorito', 'so-com-js', 'trilho', 'trilho__faixa' e 'trilho__item'. Antes da T07 eram 72 do Bootstrap e 2 minhas.

As 17 regras da F2 são:

- 'navbar-marca': o verde '#1b7e32' não existe nas cores do Bootstrap.
- 'btn-primary' com escopo: troca as variáveis '--bs-btn-*' do botão primário.
- 'aria-invalid' do campo: aponta para '--bs-form-invalid-border-color'.
- Modo sem JavaScript: esconde busca, favoritos e trilho.
- Botão favorito: o ícone ☆/★ e o estado pressionado, por variáveis '--bs-btn-*'. São 3 regras.
- Trilho: o layout, a faixa, o item, o estado de arraste, o foco e o botão 'aria-disabled'. São 6 regras. O Bootstrap não tem 'scroll-snap' nem arraste.
- Margem de rolagem: 'scroll-margin-block-start' em '[id]' (T09, foco não encoberto). É 1 regra.
- Alvos de 44 px (T09): variáveis '--bs-btn-padding-y' em '.btn', '--bs-navbar-brand-padding-y' e '--bs-navbar-toggler-padding-y' em '.navbar' e 'padding-block' em '.form-control'. São 3 regras. O Bootstrap entrega 38 a 40 px; a meta do projeto é 44 px.

Nenhuma usa '!important' e nenhuma edita o arquivo minificado.

O navegador carrega o 'bootstrap.min.css' e o bundle inteiros, mesmo usando 80 classes. A F2 ganhou menu recolhível, modal e grade pronta. A F1 ganhou controle e peso menor. O CSS do trilho existe nas duas páginas, porque o Bootstrap não traz um equivalente.

## Contraste conferido

- Branco sobre '#1b7e32': 5,15:1.
- Branco sobre '#14602a' (hover do botão): 7,67:1.
- Branco sobre '#333': 12,63:1.
- Texto '#1f1f1f' sobre branco: 16,48:1.
- Erro '#b3261e' sobre '#fdecea': 5,72:1.
- Borda dos campos '#767676' sobre branco: 4,54:1.
- Foco azul '#0b57d0' sobre branco: 6,39:1. Em fundo escuro o foco é branco.
- A borda '#ddd' dos cartões tem 1,36:1. Deixei assim porque o cartão não é um controle.
- Links do menu da F2 ('nav-link', branco sobre '#1b7e32'): 5,15:1. Medido no DevTools. O tema escuro do Bootstrap 5.3.8 mantém o link em branco pleno.
- Legenda das tabelas da F2 ('caption'): 6,58:1. Medido no DevTools.
- Badge 'text-bg-success' (branco sobre '#198754'): 4,53:1. Passa por pouco. Medido no DevTools.
- Botão 'btn-outline-secondary' (cinza '#6c757d' sobre '#f8f9fa'): 4,45:1, calculado. Reprovou. Troquei por 'btn-outline-dark' ('#212529' sobre '#f8f9fa'), cerca de 14,6:1, calculado.
- Botão 'btn-secondary' do modal (branco sobre '#6c757d'): 4,69:1, calculado.

## JavaScript: diferenças entre F1 e F2 (T07)

**Menu na F1.** Escrevi o menu com JavaScript nativo (`menu.js`): um botão hambúrguer com `aria-expanded` e `aria-controls`. O Esc fecha o menu e devolve o foco ao botão. Sem JavaScript, o botão fica escondido e a lista de links fica sempre visível, então a navegação funciona.

**Menu na F2.** Usei o componente `navbar` do Bootstrap, com `collapse`. Ele depende do `bootstrap.bundle.min.js`. Sem JavaScript, abaixo de 768px o menu fica recolhido e o botão não abre nada, então os links ficam inacessíveis. Aceito essa limitação e a registro como diferença real entre as duas versões.

**Formulário.** Os dois arquivos usam o mesmo `formulario.js` e os mesmos ids (`form-contato`, `<campo>-erro`, `contato-status`). Na F1 o erro tem estilo próprio, por `aria-invalid` e `:user-invalid`. Na F2 uso as classes `text-danger` e `small` e uma regra local para `aria-invalid`, que lê a variável `--bs-form-invalid-border-color` do Bootstrap. Sem JavaScript, as duas versões usam a validação nativa do navegador.

**Busca, favoritos e trilho.** Os três existem nas duas versões e usam os mesmos módulos JavaScript ('filtro.js', 'favoritos.js', 'trilho.js'). Na F2 troquei as classes próprias por classes do Bootstrap ('form-control', 'alert', 'btn', 'visually-hidden', 'img-fluid'). O Bootstrap não tem 'scroll-snap' nem estilo para 'aria-pressed', então o trilho e o botão de favorito pressionado têm CSS local no '<style>', por variáveis '--bs-btn-*'.

**Modal na F2.** O botão "Revisar antes de enviar" abre o modal do Bootstrap. Ele também depende do `bootstrap.bundle`. Sem JavaScript, o botão não faz nada. Não o escondi, porque a classe `js` vem do meu `main.js` e o modal depende de outro script.

**Erro 404 ao enviar.** Na F2 o formulário tinha `method="post"` e devolvia 404 numa página estática. Removi o `method`. O `formulario.js` cancela o envio com `preventDefault`, e nenhuma requisição sai.

**Carregamento.** Nos dois arquivos o `main.js` entra como `type="module"`. Na F2 ele vem depois do `bootstrap.bundle` (que usa `defer`). Os módulos de busca, favoritos, trilho e menu saem sozinhos quando não encontram seus elementos, então não geram erro no console.

## jQuery na F2 (T08)

Só a F2 usa jQuery. A F1 não carrega o jQuery e não mudou.

- Versão: jQuery 4.0.0, build completo, local em 'prototipo/assets/vendor/jquery-4.0.0/' ('jquery.min.js' e 'LICENSE.txt', MIT). Carrego com 'defer', antes do meu script. Não há CDN.
- Meu código fica em 'prototipo/js/jquery-favoritos.js', como script comum, não como módulo. Só a F2 o carrega.
- Uso o jQuery só para um contador: "Favoritos: N", dentro da seção de notícias. O número é o 'span' com 'data-total-favoritos'.
- O jQuery não alterna o favorito. Quem alterna é o 'favoritos.js' nativo, que as duas páginas carregam pelo 'main.js'. O jQuery só lê o 'aria-pressed' e conta. Fiz assim para o clique não ser tratado duas vezes.
- A F2 agora tem dois contadores de favoritos. O do menu é nativo ('data-contador-favoritos'). O da seção é do jQuery.
- Sem JavaScript, o parágrafo do contador fica escondido (classe 'so-com-js'), como o resto dos favoritos.
- Peso: o jQuery acrescenta 78.748 bytes (27.443 com gzip) e o meu script, 2.956 bytes (1.452 com gzip). A página da F2 deixa de ter os [376] KB medidos antes. Preciso refazer a medida.
- Contagem: passo a ter 8 arquivos próprios em 'prototipo/js/'. Sete são módulos nas duas páginas. 'jquery-favoritos.js' é só da F2.
- Não testei ainda: Firefox, WebKit e celular real com o jQuery.

## Diferenças para a F1

- A F1 limita o conteúdo a 70rem, com a barra lateral de 18rem a partir de 56rem. Na F2 a largura segue o 'container' do Bootstrap (720, 960, 1140 ou 1320px) e não existe barra lateral. A ficha do próximo jogo fica no fim da página.
- Na F1 os cartões usam 'auto-fit' com mínimo de 14rem, sem breakpoint. Na F2 a quebra acontece nos breakpoints do Bootstrap (768 e 992px).
- A ficha de jogo da F1 usa container query. Ela fica empilhada na lateral e lado a lado na coluna principal, na mesma janela. Na F2 as fichas são 'card' comuns, porque o Bootstrap não tem isso.
- O rodapé das duas fica sempre no fim da tela. Na F1 isso vem de um 'grid' no corpo, com 'min-block-size: 100dvh'.
- O fundo da F1 é branco ('--cor-fundo'). Na F2 é o 'bg-light', que é '#f8f9fa'.
- A borda dos cartões da F1 é '#ddd'. Na F2 é a borda padrão do 'card'.
- A fonte da F1 é 'system-ui', definida por mim. Na F2 é a pilha do Bootstrap.
- O título da F1 usa 'clamp()' com piso de 2rem e teto de 3,5rem. Na F2 o 'h1' usa a classe 'h2' do Bootstrap, que tem a escala própria dele.
- O formulário das duas versões mostra a mensagem de erro com a palavra "Erro", ligada pelo 'formulario.js'. Na F1 o estilo é meu. Na F2 uso 'text-danger' e uma regra local para 'aria-invalid'.
- O movimento reduzido na F1 é tratado por mim. Na F2 vem do CSS do Bootstrap.
- As duas têm menu recolhível: na F1 feito por mim, na F2 pelo Bootstrap. Só a F2 tem modal.
- Os títulos e as margens da F2 seguem o reboot do Bootstrap.
