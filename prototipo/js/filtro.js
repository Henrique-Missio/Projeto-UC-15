/**
 * filtro.js — Busca/filtro de notícias (T07, item 2)
 *
 * Melhoria progressiva:
 *  - Sem JS: a lista completa aparece (o JS só ESCONDE itens).
 *  - Com JS: digitar filtra; uma região role="status" anuncia "N resultados".
 *
 * Ganchos esperados no HTML (ver T07-ganchos.md):
 *  #busca            <input type="search"> com <label for="busca">
 *  #lista-noticias   contêiner cujos filhos diretos são um <article> por notícia
 *  #status-busca     <p role="status"> (leitor de tela anuncia mudanças)
 *  #busca-vazia      <p hidden> mensagem visual de estado vazio
 */

/**
 * Normaliza texto para comparar: minúsculas, sem acento, sem espaços nas pontas.
 * "Grêmio" e "gremio" passam a casar. NFD separa letra e acento; o replace tira o acento.
 */
const normalizar = (texto) =>
  texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

/** Texto pesquisável de um item: tudo, menos os botões. Clona para não mexer na página. */
function textoDoItem(item) {
  const copia = item.cloneNode(true);
  copia.querySelectorAll('button').forEach((b) => b.remove());
  return copia.textContent;
}

/** Singular/plural do contador. */
const rotulo = (total) => (total === 1 ? '1 resultado' : `${total} resultados`);

export function iniciarFiltro(signal) {
  const campo = document.getElementById('busca');
  const lista = document.getElementById('lista-noticias');
  const status = document.getElementById('status-busca');
  const vazio = document.getElementById('busca-vazia');
  if (!campo || !lista || !status) return;

  // Se o campo estiver dentro de <form>, Enter não pode recarregar a página.
  campo.closest('form')?.addEventListener('submit', (e) => e.preventDefault(), { signal });

  function filtrar() {
    const termo = normalizar(campo.value);
    let total = 0;

    // lista.children é lido a cada chamada: itens criados depois entram sozinhos.
    for (const item of lista.children) {
      // textContent: só o texto, sem executar nada. Nunca innerHTML.
      // O botão "Favoritar" fica de fora: senão buscar "fav" casaria com todas as notícias.
      const confere = termo === '' || normalizar(textoDoItem(item)).includes(termo);
      item.hidden = !confere; // atributo nativo hidden (CSS precisa de [hidden]{display:none})
      if (confere) total += 1;
    }

    // Região de status: textContent troca o texto e o leitor de tela anuncia.
    status.textContent = rotulo(total);

    // Estado vazio: mensagem visível só quando nada casa.
    if (vazio) vazio.hidden = total !== 0;
  }

  // 'input' dispara a cada tecla, no limpar (x) do type=search e ao colar.
  campo.addEventListener('input', filtrar, { signal });
}