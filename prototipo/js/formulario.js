/**
 * formulario.js — Formulário de contato (T07, item 5)
 *
 * Funciona em index.html e em bootstrap.html (mesmos ids nas duas páginas).
 *
 * Estratégia:
 *  - O HTML traz label, required e type="email": a validação nativa funciona SEM JS.
 *  - Com JS: a Constraint Validation API (validity.valid) diz quais campos estão inválidos.
 *    Mostramos a mensagem de erro que JÁ está no HTML (<p id="<campo>-erro" hidden>),
 *    ligamos o campo a ela com aria-describedby e marcamos aria-invalid (decisão D-03).
 *  - O resultado final vai para a região role="status".
 *  - NÃO há envio remoto, nem POST. preventDefault cancela o envio (era isso que dava 404
 *    na bootstrap.html: o POST ia para uma página estática, que não aceita POST).
 *
 * Ganchos no HTML:
 *  #form-contato        <form>
 *  #<campo>-erro        <p hidden> com o texto do erro (ex.: #nome-erro, #email-erro)
 *  #contato-status      <p role="status"> com o resultado
 */

export function iniciarFormulario(signal) {
  const form = document.getElementById('form-contato');
  const resultado = document.getElementById('contato-status');
  if (!form || !resultado) return;

  // Desliga os balões nativos (inacessíveis em alguns leitores) SÓ com JS ativo.
  // Sem JS, o atributo novalidate não existe e a validação nativa segue valendo.
  form.noValidate = true;

  // Lido a cada uso: campos criados depois também entram.
  const campos = () => [...form.querySelectorAll('input, select, textarea')];

  /** Mostra o erro do campo: tira hidden, liga o aria-describedby e marca aria-invalid. */
  function mostrarErro(campo) {
    const erro = document.getElementById(`${campo.id}-erro`);
    campo.setAttribute('aria-invalid', 'true');
    if (erro) {
      erro.hidden = false;
      campo.setAttribute('aria-describedby', erro.id);
    }
  }

  /** Esconde o erro e desfaz as ligações. Um describedby fixo em elemento hidden ainda seria lido. */
  function limparErro(campo) {
    const erro = document.getElementById(`${campo.id}-erro`);
    campo.removeAttribute('aria-invalid');
    campo.removeAttribute('aria-describedby');
    if (erro) erro.hidden = true;
  }

  form.addEventListener(
    'submit',
    (evento) => {
      evento.preventDefault(); // nunca enviamos nada
      resultado.textContent = '';

      // validity.valid lê o estado sem disparar eventos 'invalid'.
      const invalidos = campos().filter((c) => !c.validity.valid);
      campos().forEach((c) => (c.validity.valid ? limparErro(c) : mostrarErro(c)));

      if (invalidos.length > 0) {
        resultado.textContent =
          invalidos.length === 1
            ? 'Há 1 campo com erro. Corrija e envie de novo.'
            : `Há ${invalidos.length} campos com erro. Corrija e envie de novo.`;
        invalidos[0].focus(); // leva o foco ao primeiro erro
        return;
      }

      // Sucesso. Honestidade na tela: nada saiu do aparelho.
      resultado.textContent =
        'Mensagem validada. Este protótipo não envia dados: nada saiu do seu aparelho.';
      form.reset();
    },
    { signal }
  );

  // Ao corrigir, o erro some na hora, sem esperar novo envio.
  // Delegação no form: um listener para todos os campos.
  form.addEventListener(
    'input',
    (evento) => {
      const campo = evento.target;
      if (campo.getAttribute?.('aria-invalid') !== 'true') return;
      if (campo.validity.valid) limparErro(campo);
    },
    { signal }
  );
}