/**
 * trilho.js — Galeria/trilho horizontal (T07, item 4)
 *
 * Três formas de navegar (alternativa ao arraste, exigência WCAG 2.2):
 *  1. Botões Anterior/Próximo (teclado, mouse, toque).
 *  2. Setas do teclado: a faixa tem tabindex="0" e rola nativamente.
 *  3. Arraste com Pointer Events (mouse, toque e caneta num só código).
 *
 * Por que Pointer Events e não touchstart + click:
 *  um único conjunto de eventos cobre todos os dispositivos
 *  e evita disparo duplicado (touch + mouse emulado).
 *
 * CSS necessário na faixa (ver T07-ganchos.md):
 *  overflow-x:auto; scroll-snap-type:x mandatory;
 *  touch-action: pan-y pinch-zoom  → o navegador cuida da rolagem vertical e do zoom;
 *  o movimento horizontal chega até este script.
 *
 * Ganchos no HTML:
 *  #trilho-faixa                     contêiner rolável (tabindex=0, role=region, aria-label)
 *  button[data-trilho="anterior"]    botão voltar
 *  button[data-trilho="proximo"]     botão avançar
 */

// Distância mínima (px) para considerar "arraste" e não um clique com tremor.
const LIMITE_ARRASTE = 6;

export function iniciarTrilho(signal) {
  const faixa = document.getElementById('trilho-faixa');
  if (!faixa) return;

  const botaoAnterior = document.querySelector('[data-trilho="anterior"]');
  const botaoProximo = document.querySelector('[data-trilho="proximo"]');

  // Respeita prefers-reduced-motion: sem rolagem animada se o usuário pediu menos movimento.
  const menosMovimento = window.matchMedia('(prefers-reduced-motion: reduce)');

  /** Rola uma "página" inteira (100% da largura visível = uma imagem). O snap alinha no item. direcao: -1 ou +1. */
  function passo(direcao) {
    faixa.scrollBy({
      left: direcao * faixa.clientWidth,
      behavior: menosMovimento.matches ? 'auto' : 'smooth',
    });
  }

  /**
   * Marca os botões nas pontas com aria-disabled (e não disabled):
   * disabled tira o foco do botão que acabou de ser clicado.
   */
  function atualizarBotoes() {
    const maximo = faixa.scrollWidth - faixa.clientWidth;
    const noInicio = faixa.scrollLeft <= 1;
    const noFim = faixa.scrollLeft >= maximo - 1;
    botaoAnterior?.setAttribute('aria-disabled', String(noInicio));
    botaoProximo?.setAttribute('aria-disabled', String(noFim));
  }

  botaoAnterior?.addEventListener(
    'click',
    () => {
      if (botaoAnterior.getAttribute('aria-disabled') !== 'true') passo(-1);
    },
    { signal }
  );
  botaoProximo?.addEventListener(
    'click',
    () => {
      if (botaoProximo.getAttribute('aria-disabled') !== 'true') passo(1);
    },
    { signal }
  );

  // 'passive' avisa o navegador que não chamamos preventDefault: rolagem mais fluida.
  faixa.addEventListener('scroll', atualizarBotoes, { signal, passive: true });
  window.addEventListener('resize', atualizarBotoes, { signal });

  // ---------------- Arraste com Pointer Events ----------------
  let pressionado = false; // ponteiro está apertado na faixa
  let arrastando = false; // passou do limite: virou arraste
  let idPonteiro = null; // evita misturar dois dedos
  let inicioX = 0;
  let inicioScroll = 0;

  faixa.addEventListener(
    'pointerdown',
    (e) => {
      // Mouse: só botão principal. Toque/caneta: button vale 0.
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      pressionado = true;
      arrastando = false;
      idPonteiro = e.pointerId;
      inicioX = e.clientX;
      inicioScroll = faixa.scrollLeft;
      // NÃO capturamos aqui: capturar já no pointerdown redireciona o clique
      // para a faixa e quebra links/botões dentro dos cards.
    },
    { signal }
  );

  faixa.addEventListener(
    'pointermove',
    (e) => {
      if (!pressionado || e.pointerId !== idPonteiro) return;
      const deslocamento = e.clientX - inicioX;

      // Só vira arraste depois do limite. Aí sim capturamos o ponteiro:
      // o movimento continua chegando mesmo se o dedo/mouse sair da faixa.
      if (!arrastando && Math.abs(deslocamento) > LIMITE_ARRASTE) {
        arrastando = true;
        faixa.setPointerCapture(e.pointerId);
        // Desliga o snap durante o arraste; senão a faixa "briga" com o dedo.
        faixa.classList.add('is-arrastando');
      }
      if (arrastando) faixa.scrollLeft = inicioScroll - deslocamento;
    },
    { signal }
  );

  /** Fim do gesto: serve para pointerup (soltou) e pointercancel (sistema tomou o gesto). */
  function encerrar(e) {
    if (!pressionado || e.pointerId !== idPonteiro) return;
    pressionado = false;
    faixa.classList.remove('is-arrastando'); // snap volta e alinha no card mais próximo
    if (faixa.hasPointerCapture(e.pointerId)) faixa.releasePointerCapture(e.pointerId);
    // 'arrastando' fica true até o click que vem logo depois ser tratado abaixo.
  }
  faixa.addEventListener('pointerup', encerrar, { signal });
  faixa.addEventListener('pointercancel', encerrar, { signal });

  // Depois de um arraste o navegador ainda dispara 'click'.
  // Fase de captura (true): cancelamos antes de chegar a links dentro dos cards.
  faixa.addEventListener(
    'click',
    (e) => {
      if (arrastando) {
        e.preventDefault();
        e.stopPropagation();
        arrastando = false;
      }
    },
    { signal, capture: true }
  );

  atualizarBotoes();
}