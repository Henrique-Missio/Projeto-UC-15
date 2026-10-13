/**
 * favoritos.js — Favoritar notícias (T07, item 3)
 *
 * Regras de negócio:
 *  1. Favorito alterna com aria-pressed (botão de alternância).
 *  2. Persistência em localStorage SÓ após consentimento explícito
 *     (aviso com "Aceitar" e "Recusar").
 *  3. Sem consentimento (ou recusado): favorito vive só em memória
 *     e some ao recarregar.
 *  4. localStorage pode estar bloqueado: todo acesso fica em try/catch.
 *  5. Delegação de evento: UM listener na lista cobre itens atuais e futuros.
 *
 * Ganchos esperados no HTML (ver T07-ganchos.md):
 *  #lista-noticias                    contêiner dos itens
 *  button[data-favorito="<id>"]       botão por notícia, com aria-pressed
 *  [data-contador-favoritos]          elementos que recebem o número de favoritos (menu e página)
 *  #lista-favoritos / #favoritos-vazio  seção "Notícias favoritas": lista de links e estado vazio
 *  article#noticia-<id> com h3        card original (destino do link e fonte do título)
 *  #aviso-consentimento               região hidden com os 2 botões
 *  button[data-consentimento="aceitar|recusar"]
 */

const CHAVE_CONSENTO = 'futnoticias:consentimento'; // 'aceito' | 'recusado'
const CHAVE_FAVORITOS = 'futnoticias:favoritos'; // JSON: ["id1","id2"]

// ---- Acesso seguro ao localStorage (pode lançar erro se bloqueado) ----
function ler(chave) {
  try {
    return localStorage.getItem(chave);
  } catch {
    return null;
  }
}
function gravar(chave, valor) {
  try {
    localStorage.setItem(chave, valor);
  } catch {
    /* bloqueado: segue só em memória */
  }
}
function remover(chave) {
  try {
    localStorage.removeItem(chave);
  } catch {
    /* ignora */
  }
}

export function iniciarFavoritos(signal) {
  const lista = document.getElementById('lista-noticias');
  if (!lista) return;
  // Todos os contadores da página (menu + parágrafo da seção).
  const contadores = document.querySelectorAll('[data-contador-favoritos]');
  // Seção "Notícias favoritas".
  const listaFav = document.getElementById('lista-favoritos');
  const vazioFav = document.getElementById('favoritos-vazio');
  const aviso = document.getElementById('aviso-consentimento');

  // Estado em memória. Set evita duplicata.
  const favoritos = new Set();
  let consentimento = ler(CHAVE_CONSENTO); // null = ainda não decidiu

  // Só carrega favoritos salvos se o usuário já aceitou antes.
  if (consentimento === 'aceito') {
    try {
      const salvos = JSON.parse(ler(CHAVE_FAVORITOS) ?? '[]');
      if (Array.isArray(salvos)) salvos.forEach((id) => favoritos.add(String(id)));
    } catch {
      /* JSON corrompido: começa vazio */
    }
  }

  /** Redesenha: aria-pressed de cada botão + contador. Cobre itens dinâmicos. */
  function sincronizar() {
    for (const botao of lista.querySelectorAll('button[data-favorito]')) {
      botao.setAttribute('aria-pressed', String(favoritos.has(botao.dataset.favorito)));
    }
    // Contadores: só o número, via textContent.
    contadores.forEach((el) => (el.textContent = String(favoritos.size)));

    // Seção "Notícias favoritas": um <li><a> por favorito, apontando para o card original.
    if (listaFav) {
      const itens = [];
      for (const id of favoritos) {
        // CSS.escape protege o seletor caso o id tenha caractere especial.
        const botao = lista.querySelector(`button[data-favorito="${CSS.escape(id)}"]`);
        const card = botao?.closest('article');
        const titulo = card?.querySelector('h3')?.textContent;
        if (!card?.id || !titulo) continue; // favorito salvo cujo card não existe mais: ignora
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.href = `#${card.id}`;
        link.textContent = titulo; // textContent, nunca innerHTML
        li.append(link);
        itens.push(li);
      }
      listaFav.replaceChildren(...itens); // troca a lista inteira de uma vez
      if (vazioFav) vazioFav.hidden = itens.length > 0; // mensagem só quando não há favoritos
    }
  }

  /** Grava só com consentimento aceito. */
  function persistir() {
    if (consentimento === 'aceito') gravar(CHAVE_FAVORITOS, JSON.stringify([...favoritos]));
  }

  // ---- Delegação: clique em qualquer lugar de um botão favorito ----
  lista.addEventListener(
    'click',
    (evento) => {
      // closest sobe do alvo (pode ser um <span> ou ícone dentro do botão)
      // até o botão. Fora de um botão favorito: ignora.
      const botao = evento.target.closest('button[data-favorito]');
      if (!botao || !lista.contains(botao)) return;

      const id = botao.dataset.favorito;
      if (favoritos.has(id)) favoritos.delete(id);
      else favoritos.add(id);

      persistir();
      sincronizar();
    },
    { signal }
  );

  // ---- Aviso de consentimento ----
  if (aviso) {
    // Só mostra se ainda não houve decisão.
    aviso.hidden = consentimento !== null;

    aviso.addEventListener(
      'click',
      (evento) => {
        const escolha = evento.target.closest('button[data-consentimento]');
        if (!escolha) return;

        const aceitou = escolha.dataset.consentimento === 'aceitar';
        consentimento = aceitou ? 'aceito' : 'recusado';
        // Registra a própria escolha (decisão a documentar em DECISOES.md).
        gravar(CHAVE_CONSENTO, consentimento);

        if (aceitou) {
          persistir(); // grava o que já foi favoritado em memória
        } else {
          remover(CHAVE_FAVORITOS); // recusou: nada fica salvo
        }

        // Esconder o aviso com o foco dentro dele joga o foco no <body>.
        // Devolvemos ao primeiro favorito da lista.
        aviso.hidden = true;
        lista.querySelector('button[data-favorito]')?.focus();
      },
      { signal }
    );
  }

  sincronizar();
}