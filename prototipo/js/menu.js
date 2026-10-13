/**
 * menu.js — Menu móvel (T07, item 1)
 *
 * Aplica-se SÓ ao prototipo/index.html (F1, sem framework).
 * Na bootstrap.html o menu é do Bootstrap (T06).
 *
 * Contrato de acessibilidade:
 *  - o gatilho é um <button> real (teclado: Enter/Espaço de graça);
 *  - aria-expanded no botão diz se o menu está aberto;
 *  - aria-controls aponta para o id do menu;
 *  - Esc fecha e devolve o foco ao botão.
 *
 * Sem JS: o CSS não esconde o menu (a regra depende da classe .js),
 * então a navegação continua funcionando.
 */

// Classe que o CSS usa para mostrar o menu no mobile.
const CLASSE_ABERTO = 'is-open';

/**
 * @param {AbortSignal} signal - ao chamar abort(), TODOS os listeners abaixo saem.
 */
export function iniciarMenu(signal) {
  // Gatilho: marcado no HTML com data-menu-toggle (gancho de JS, sem id/classe de estilo).
  const botao = document.querySelector('[data-menu-toggle]');
  if (!botao) return; // página sem menu: não faz nada, console limpo.

  // O id do menu vem do próprio aria-controls: uma fonte de verdade só.
  const menu = document.getElementById(botao.getAttribute('aria-controls') ?? '');
  if (!menu) return;

  /** Aplica o estado em um lugar só: classe visual + atributo ARIA. */
  function definirEstado(aberto, devolverFoco = false) {
    menu.classList.toggle(CLASSE_ABERTO, aberto);
    botao.setAttribute('aria-expanded', String(aberto));
    // Esc: o foco volta ao botão para quem usa teclado não se perder.
    if (devolverFoco) botao.focus();
  }

  // Clique/Enter/Espaço no botão: alterna.
  botao.addEventListener(
    'click',
    () => definirEstado(botao.getAttribute('aria-expanded') !== 'true'),
    { signal }
  );

  // Esc em qualquer lugar da página fecha o menu, se estiver aberto.
  document.addEventListener(
    'keydown',
    (evento) => {
      if (evento.key === 'Escape' && botao.getAttribute('aria-expanded') === 'true') {
        definirEstado(false, true);
      }
    },
    { signal }
  );

  // Clicar num link do menu (âncora na mesma página) fecha o menu.
  // Delegação: um listener no menu cobre todos os links.
  menu.addEventListener(
    'click',
    (evento) => {
      if (evento.target.closest('a')) definirEstado(false);
    },
    { signal }
  );
}
