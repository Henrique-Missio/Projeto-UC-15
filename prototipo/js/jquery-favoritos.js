/*
 * jquery-favoritos.js (T08)
 * Contador de favoritos com jQuery 4.0.0. Usado SÓ em bootstrap.html (F2).
 *
 * PAPEL: OBSERVADOR. Este script NÃO alterna aria-pressed e NÃO grava nada.
 * Quem muda o estado do favorito é o favoritos.js nativo (T07), carregado pelo main.js
 * nas duas páginas. Aqui o jQuery só LÊ o estado e mostra o total.
 * Motivo: dois códigos mudando o mesmo aria-pressed se anulariam (clique vira liga + desliga).
 *
 * Contrato com o HTML:
 *   #lista-noticias          : container das notícias (já existe; recebe a delegação).
 *   button[data-favorito]    : botão de cada notícia, com aria-pressed (do T07).
 *   [data-total-favoritos]   : número do contador (dentro de um role="status").
 */
(function ($) {
  'use strict'; // modo estrito: erros bobos viram exceção.

  // Namespace do evento. .off('.favoritos') remove só os handlers deste módulo.
  var NS = '.favoritos';

  // Seletor do botão observado. Constante: definido em um lugar só.
  var SEL_BOTAO = 'button[data-favorito]';

  // Referências ao DOM, buscadas uma vez.
  var $lista = $('#lista-noticias');        // container que recebe a delegação.
  var $total = $('[data-total-favoritos]'); // número exibido.

  // Página sem a lista (ex.: index.html): não faz nada, sem erro no console.
  if ($lista.length === 0) { return; }

  /*
   * Recalcula o total a partir do DOM (aria-pressed="true").
   * Fonte única da verdade: o estado que o favoritos.js nativo já mantém.
   * Também cobre favoritos restaurados do localStorage no carregamento.
   */
  function atualizarTotal() {
    var n = $lista.find(SEL_BOTAO + '[aria-pressed="true"]').length;
    $total.text(n); // .text(): nunca interpreta HTML.
  }

  /*
   * Handler do clique (delegação: roda para qualquer botão que case com SEL_BOTAO,
   * inclusive clique no <span> interno e itens criados depois).
   * setTimeout 0: espera o handler nativo terminar de trocar o aria-pressed.
   * Sem isso, a ordem dos listeners decidiria se leio o estado antigo ou o novo.
   */
  function aoClicar() {
    setTimeout(atualizarTotal, 0);
  }

  // Observador de mudanças no DOM. Guardado aqui para poder ser desligado em desmontar().
  var observador = null;

  /* Desmontagem: remove os handlers com o namespace .favoritos e desliga o observador. */
  function desmontar() {
    $lista.off(NS);
    if (observador) {
      observador.disconnect();
      observador = null;
    }
  }

  /*
   * Montagem idempotente: desmonta antes, então montar 2x não duplica handler nem observador.
   * Delegação: 1 listener no container cobre itens dinâmicos.
   */
  function montar() {
    desmontar();
    $lista.on('click' + NS, SEL_BOTAO, aoClicar);

    // MutationObserver (nativo): avisa quando QUALQUER código muda o aria-pressed ou
    // acrescenta/remove cards. Cobre o que o clique não cobre: o favoritos.js nativo
    // restaura os favoritos do localStorage no carregamento, sem clique e em momento
    // que o jQuery não controla. Sem isso o contador voltava a 0 ao recarregar a página.
    // attributeFilter: só olha o aria-pressed. subtree: olha todos os cards dentro da lista.
    observador = new MutationObserver(atualizarTotal);
    observador.observe($lista[0], {
      attributes: true,
      attributeFilter: ['aria-pressed'],
      childList: true,
      subtree: true
    });

    atualizarTotal();
  }

  // $(fn): roda quando o DOM está pronto. A contagem inicial pode sair cedo demais
  // (os módulos do main.js ainda estão baixando), mas o observador acima corrige
  // o total assim que o favoritos.js restaurar o estado.
  $(function () { montar(); });

  // Exposto só para teste manual no console (T08: "montar duas vezes").
  // Uso: FavoritosJQ.montar(); FavoritosJQ.montar(); clique: o total sobe de 1 em 1.
  window.FavoritosJQ = { montar: montar, desmontar: desmontar };

})(jQuery);