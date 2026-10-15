# Relatório final: FutNotícias (Projeto UC15)

> Estado: T09 concluída. A seção 6 (entrega) é da T12.
> A seção 6 (entrega) é da T12.

## 1. Visão geral

Auditoria de acessibilidade (WCAG 2.2 AA), SEO e desempenho das duas versões da home:

- **F1** (`prototipo/index.html`): HTML e CSS próprios.
- **F2** (`prototipo/bootstrap.html`): Bootstrap 5.3.8 local, com jQuery 4.0.0 só no contador de favoritos (T08).

## 2. Desempenho (laboratório)

### 2.1 Perfil de medição

- Ferramenta: DevTools, aba Desempenho, gravação com recarga. Insights de LCP, CLS e INP.
- Rede e cache: 4G Rápido, cache desligado, perfil móvel (conforme a SPEC).
- Navegador e versão: Microsoft Edge 155.0.4283.45.
- Servidor local, sem compressão. O GitHub Pages comprime; o peso de lá será menor.
- Execuções: 3 por página. O valor da tabela é a mediana. Só uma execução de cada página tem print em `docs/evidencias/`.
- Uma primeira rodada, feita com cache ativo e sem limite de rede, fugiu do perfil e foi descartada.

### 2.2 ANTES

| Métrica | F1 (`index.html`) | F2 (`bootstrap.html`) |
| :--- | :--- | :--- |
| LCP | 0,45 s | 0,86 s |
| CLS | 0 | 0 |
| INP | 16 ms | 15 ms |

Referências do Core Web Vitals: LCP bom até 2,5 s. CLS bom até 0,1. INP bom até 200 ms.

- **INP, F1:** 3 ms de atraso da entrada, 1 ms de processamento e 13 ms de atraso da apresentação. Interação medida: Favoritar e Menu.
- **INP, F2:** 2 ms, 1 ms e 13 ms. Interação medida: Favoritar e Menu.
- O INP real é a pior interação de uma sessão. Interações testadas: Favoritar e Menu.
- **LCP:** elemento medido: Imagem. A F2 baixa mais bytes (Bootstrap e jQuery) e ficou mais lenta, coerente com o peso. Com 1 gravação, a diferença ainda não é conclusiva.
- **Evidência:** `docs/evidencias/t09-cls-index-antes.png` e `t09-cls-bootstrap-antes.png`.

### 2.3 CLS

Hipótese inicial: o `main.js` adiciona a classe `js` depois do carregamento, e o CSS `html:not(.js)` mostraria ou esconderia elementos tarde, deslocando a página.

Resultado: **hipótese não confirmada.** As duas gravações mostram CLS 0 e "Sem turnos de layout". Nenhuma correção aplicada para CLS.

### 2.4 Insights do painel (candidatos a correção)

- Solicitações que bloqueiam a renderização: `styles.css` (economia estimada de 199 ms) na F1 e `bootstrap.min.css` (210 ms) na F2. São CSS necessário ao primeiro desenho. Não vou adiar.
- Latência do documento: economia de 17,7 kB (F1) e 23,8 kB (F2). É falta de compressão do servidor local. O GitHub Pages resolve.
- Cascata de módulos: `main.js` baixa e só depois `menu.js`, `filtro.js`, `favoritos.js`, `trilho.js` e `formulario.js`. Candidato: `modulepreload`. Decisão: aplicado (ver 2.5).

### 2.5 DEPOIS

Correção aplicada: `<link rel="modulepreload">` para os 5 módulos do `main.js` (`menu.js`, `filtro.js`, `favoritos.js`, `trilho.js` e `formulario.js`), no `<head>` de `index.html` e `bootstrap.html`. Mesmo perfil do ANTES (4G Rápido, cache desligado).

Motivo: no ANTES, o navegador baixava o `main.js` e só então descobria os outros módulos, um depois do outro. O `modulepreload` avisa os módulos no HTML, e o download começa em paralelo.

Efeito esperado: menos espera em cascata no carregamento do JavaScript.

Efeito medido: não conclusivo. O LCP da F1 foi de 0,45 s para 0,57 s e o INP, de 16 ms para 14 ms. Com poucas execuções, isso fica dentro da variação normal. As métricas já estavam no limite bom antes da correção.

| Métrica | F1 | F2 |
| :--- | :--- | :--- |
| LCP | 0,57 s | [0,78s] |
| CLS | 0 | [0] |
| INP | 14 ms | 13 ms |

- **Leitura (F1):** o LCP subiu de 0,45 s para 0,57 s e o INP caiu de 16 ms para 14 ms. Com 1 gravação por página, essas diferenças ficam dentro da variação normal entre gravações. **Não demonstrei ganho.** As métricas já estavam no limite bom antes e continuam.
- **Rede (F1):** no DEPOIS, `main.js`, `menu.js`, `filtro.js` e `favoritos.js` iniciam o download juntos. No ANTES, os módulos só começavam depois do `main.js`. Efeito esperado: menos espera em cascata. Efeito medido: não conclusivo.
- **Detalhamento do INP no DEPOIS, F1:** [2] ms de atraso da entrada, [0] ms de processamento e [9] ms de atraso da apresentação (INP de 14 ms). F2: [2] ms, [2] ms e [12] ms (INP de 13 ms).
- **Evidência:** `docs/evidencias/t09-cls-index-depois.png` e `t09-cls-bootstrap-depois.png`.

### 2.6 Lighthouse ANTES (limite simulado do próprio Lighthouse)

Modo Navegação, Celular, janela anônima. Foram 3 execuções por página; só a nota de 1 de cada foi registrada em print. Não calculei mediana. O Lighthouse aplica limite de rede e CPU próprio e não usa o 4G Rápido do DevTools. Estes números não são comparáveis com os da seção 2.2.

| Item | F1 | F2 |
| :--- | :--- | :--- |
| Desempenho (nota) | 99 | 83 |
| Acessibilidade (nota) | 100 | 97 |
| SEO (nota) | 100 | 100 |
| Práticas recomendadas (nota) | 100 | 100 |

- LCP e CLS do Lighthouse ficam fora desta tabela: o relatório do Lighthouse os mostra só ao passar o mouse, sem registro. Os valores de LCP e CLS do relatório são os da seção 2.2 (painel Desempenho).
- A F1 foi auditada na URL `index.html#noticia-n3`. Repetir sem o trecho `#noticia-n3`.
- Auditorias reprovadas: F1 nenhuma. F2 teve Acessibilidade 97 neste ANTES. O nome da auditoria reprovada não foi registrado.
- Limite: teste automático cobre só parte dos critérios da WCAG. A nota não prova conformidade.
- Evidência: `docs/evidencias/t09-lighthouse-index-antes.png` e `t09-lighthouse-bootstrap-antes.png`.

### 2.7 Lighthouse DEPOIS (mesmo perfil da seção 2.6)

| Item | F1 | F2 |
| :--- | :--- | :--- |
| Desempenho (nota) | 98 | 86 |
| Acessibilidade (nota) | 100 | 100 |
| SEO (nota) | 100 | 100 |
| Práticas recomendadas (nota) | 100 | 100 |

- Leitura: F1 caiu 1 ponto (99 para 98) e F2 subiu 3 (83 para 86). Em 1 execução por página, uma variação desse tamanho pode ser ruído. Não atribuo à correção.
- A F2 passou de 97 para 100 em Acessibilidade. Nenhuma alteração minha entre as duas medidas; a causa da diferença não foi identificada.
- Evidência: `docs/evidencias/t09-lighthouse-index-depois.png` e `t09-lighthouse-bootstrap-depois.png`.

## 3. Acessibilidade (WCAG 2.2)

### A-01: Foco não encoberto (preventivo)
- Critério: 2.4.11 (AA).
- Achado: nenhum elemento fixo ou sticky cobre o foco hoje. Não encontrei defeito. A regra é proteção para um cabeçalho fixo futuro e para links âncora.
- Correção: `scroll-margin-block-start` em `[id]` (`var(--espaco-4)` na F1, `2.5rem` na F2).
- Arquivos: `prototipo/assets/styles.css` e `<style>` de `prototipo/bootstrap.html`.
- Antes/depois: não há defeito mensurável.

### A-02: Tamanho dos alvos
- Critério: 2.5.8 (AA, mínimo 24×24 px). Meta do projeto: 44 px.
- Medida: console do DevTools em 375 px, controles visíveis. O link "Pular para o conteúdo" fica oculto até receber foco e foi excluído.
- **F1:** campos seguem o critério 2.5.8. Print: `t09-alvos-index.png`.
- Correção (F2): variáveis `--bs-btn-padding-y`, `--bs-navbar-brand-padding-y`, `--bs-navbar-toggler-padding-y` e `padding-block` em `.form-control`, no `<style>` de `bootstrap.html`. Sem `!important`.
- **F2:** nenhum controle abaixo de 44 px, ou a lista. Print: `t09-alvos-bootstrap.png`.

### A-03: Jornada só por teclado
- Tab, Enter e Espaço funcionaram nas 3 tarefas críticas (ler a última notícia, filtrar e favoritar, enviar o formulário), nas duas páginas.
- Problemas encontrados: nenhum.
- Navegador: Microsoft Edge 155.0.4283.45. Limite: só teclado físico em um navegador; leitor de tela não testado.

### A-04: Árvore de acessibilidade
- Menu F1: botão `nav__toggle`, nome "Menu", `aria-expanded=false`, `aria-controls=menu-principal`. Print: `t09-index-acessibilidade-menu.png`.
- Menu F2: botão `navbar-toggler`, nome "Alternar navegação", mesmos atributos. Print: `t09-bootstrap-acessibilidade-menu.png`.
- Seção Contato (F1 e F2): função `region`, nome "Contato" por `aria-labelledby`. Prints: `t09-index-acessibilidade-formulario.png` e `t09-bootstrap-acessibilidade-formulario.png`.
- Card de notícia: F1 tem `article` sem nome acessível. Na F2 o `article` é a coluna externa; o `div.card` interno é `generic`. Não é falha da WCAG. Melhoria possível: nomear o `article` pelo `h3`. Prints: `t09-index-acessibilidade-card.png` e `t09-bootstrap-acessibilidade-card.png`.
- Campo do formulário (nome pelo `label`, `required`, `aria-describedby`): Print: `t09-index-acessibilidade-campo.png` e `t09-bootstrap-acessibilidade-card.png`.

### A-05: Verificações já registradas
- Reflow em 320 px e contraste dos estados: ver `COMPATIBILIDADE.md` ("Larguras testadas" e "Contraste conferido").
- Alternativa ao arraste do trilho: botões Anterior e Próximo.

## 4. SEO

- `title` e `meta description` únicos por página.
- `canonical` absoluta em cada página, apontando para si mesma: `https://henrique-missio.github.io/Projeto-UC-15/` e `.../bootstrap.html`. As duas versões têm o mesmo conteúdo; mantê-las indexáveis é uma decisão (ver `DECISOES.md`).
- `meta robots` com `index, follow`. Não há `noindex`.
- Links com `href` real. Nenhum `href="#"`.
- Conteúdo no celular: mesmo HTML e mesmos textos do desktop. Só o menu fica recolhido em tela estreita.
- Limite: o site ainda não está publicado (T12). SEO não verificado na URL real.

## 5. Limites

- Laboratório não é campo. Sem dados reais de usuários (CrUX).
- Emulação não é aparelho real. Celular real: [PREENCHER na T11].
- Servidor local sem compressão. Repetir as medidas de peso no GitHub Pages.
- Número de execuções: ver 2.1.
- Este relatório não promete conformidade, ranking de busca nem ganho de desempenho em outros aparelhos.

## 6. Entrega (T12)

- URL: [PREENCHER]
- Tag: [PREENCHER]
- Commit: [PREENCHER]
- Resultado da suíte: [PREENCHER]