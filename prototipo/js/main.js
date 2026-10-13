/**
 * main.js — Ponto de entrada do JavaScript do protótipo (T07, item 6)
 *
 * Carregar no HTML com:
 *   <script type="module" src="js/main.js"></script>
 * type="module" já é adiado (como defer): roda depois do HTML pronto.
 * Módulos exigem servidor (http://). Não abrem por file://.
 *
 * AbortController (item 6 da T07):
 *  um único "signal" é passado a todos os módulos.
 *  Cada addEventListener usa { signal }.
 *  Chamar desmontar() faz abort() e TODOS os listeners saem de uma vez.
 *  Chamar montar() duas vezes NÃO duplica handler (guarda abaixo).
 */
import { iniciarMenu } from './menu.js';
import { iniciarFiltro } from './filtro.js';
import { iniciarFavoritos } from './favoritos.js';
import { iniciarTrilho } from './trilho.js';
import { iniciarFormulario } from './formulario.js';

// Controlador atual. null = desmontado.
let controlador = null;

/** Liga todos os recursos. Segunda chamada seguida não faz nada. */
export function montar() {
  if (controlador) return;
  controlador = new AbortController();
  const { signal } = controlador;

  // A classe "js" no <html> libera as regras de CSS que só valem com JS
  // (ex.: esconder o menu no mobile). Sem JS, ela não existe e tudo fica visível.
  document.documentElement.classList.add('js');

  iniciarMenu(signal);
  iniciarFiltro(signal);
  iniciarFavoritos(signal);
  iniciarTrilho(signal);
  iniciarFormulario(signal);
}

/** Remove todos os listeners e a classe "js". */
export function desmontar() {
  controlador?.abort();
  controlador = null;
  document.documentElement.classList.remove('js');
}

montar();
