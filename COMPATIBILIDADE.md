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

Ainda não testei:

- Firefox e WebKit.
- Celular real e teclado virtual.
- Zoom de 200% e fonte ampliada em navegador de verdade.
- Jornada só por teclado na F1, inteira, com os olhos.

Na versão anterior (F2 com Bootstrap 5.3.3) eu tinha testado 768, 954, 992 e 1200px.

## CSS próprio e peso

Os números abaixo são desta versão. Não comparam com os da primeira entrega, que era só uma home de 10 minutos.

- F1: 61 regras de CSS próprio, 422 linhas, 8.163 bytes (2.439 com gzip). Mais 3 blocos de '@media' e '@container'.
- F2: 2 regras, 16 linhas, 580 bytes. Ficam num '<style>' dentro do 'bootstrap.html'.
- Bootstrap: CSS com 232.111 bytes (30.869 com gzip) e bundle JS com 80.496 bytes (23.743 com gzip).
- Página F1, com HTML, CSS e a imagem de 480px: cerca de 18 KB.
- Página F2, com HTML, CSS, JS e a imagem de 480px: cerca de 325 KB.

As duas regras da F2:

'.navbar-marca { background-color: #1b7e32; }'

'.marca-futnoticias .btn-primary { --bs-btn-*: ... }'

A primeira continua própria porque o verde '#1b7e32' não existe nas cores do Bootstrap. A segunda troca as variáveis do botão primário por escopo, sem '!important' e sem editar o arquivo minificado.

O navegador carrega o 'bootstrap.min.css' e o bundle inteiros, mesmo usando 72 classes. Meu CSS da F2 é minúsculo, mas a página ficou umas 18 vezes mais pesada que a F1. A F2 ganhou menu recolhível, modal e grade pronta. A F1 ganhou controle e peso.

## Contraste conferido

- Branco sobre '#1b7e32': 5,15:1.
- Branco sobre '#14602a' (hover do botão): 7,67:1.
- Branco sobre '#333': 12,63:1.
- Texto '#1f1f1f' sobre branco: 16,48:1.
- Erro '#b3261e' sobre '#fdecea': 5,72:1.
- Borda dos campos '#767676' sobre branco: 4,54:1.
- Foco azul '#0b57d0' sobre branco: 6,39:1. Em fundo escuro o foco é branco.
- A borda '#ddd' dos cartões tem 1,36:1. Deixei assim porque o cartão não é um controle.

## Diferenças para a F1

- A F1 limita o conteúdo a 70rem, com a barra lateral de 18rem a partir de 56rem. Na F2 a largura segue o 'container' do Bootstrap (720, 960, 1140 ou 1320px) e não existe barra lateral. A ficha do próximo jogo fica no fim da página.
- Na F1 os cartões usam 'auto-fit' com mínimo de 14rem, sem breakpoint. Na F2 a quebra acontece nos breakpoints do Bootstrap (768 e 992px).
- A ficha de jogo da F1 usa container query. Ela fica empilhada na lateral e lado a lado na coluna principal, na mesma janela. Na F2 as fichas são 'card' comuns, porque o Bootstrap não tem isso.
- O rodapé das duas fica sempre no fim da tela. Na F1 isso vem de um 'grid' no corpo, com 'min-block-size: 100dvh'.
- O fundo da F1 é branco ('--cor-fundo'). Na F2 é o 'bg-light', que é '#f8f9fa'.
- A borda dos cartões da F1 é '#ddd'. Na F2 é a borda padrão do 'card'.
- A fonte da F1 é 'system-ui', definida por mim. Na F2 é a pilha do Bootstrap.
- O título da F1 usa 'clamp()' com piso de 2rem e teto de 3,5rem. Na F2 o 'h1' usa a classe 'h2' do Bootstrap, que tem a escala própria dele.
- O formulário da F1 mostra mensagem de erro própria, com a palavra "Erro" no HTML. Na F2 ainda não tem mensagem de erro, só a validação nativa do navegador. Isso entra no T07.
- O movimento reduzido na F1 é tratado por mim. Na F2 vem do CSS do Bootstrap.
- Só a F2 tem menu recolhível e modal.
- Os títulos e as margens da F2 seguem o reboot do Bootstrap.
