// tests/e2e/bootstrap.spec.ts
// Suíte E2E da F2 (prototipo/bootstrap.html), Projeto UC15 (T11).
// Cobre: navbar, modal, favorito com contador jQuery, filtro, formulário e 320px.
// Mesmas regras da uc15.spec.ts: seletores por papel/rótulo (getByRole/getByLabel),
// expect "web-first" (espera sozinho), sem waitForTimeout, testes independentes.

import { test, expect } from '@playwright/test';

// Movimento reduzido em todos os testes deste arquivo.
// O Bootstrap ignora cliques e Esc enquanto anima (collapse e fade do modal).
// Com prefers-reduced-motion: reduce, a animação some e o estado muda na hora.
// Assim o teste não depende de tempo. Também confirma que a F2 funciona sem movimento (T04).
test.use({ reducedMotion: 'reduce' });

// beforeEach roda antes de CADA teste. Todo teste abre a bootstrap.html do zero.
// Isso garante independência: nenhum teste depende do resultado de outro.
// Cada teste roda num contexto novo, então o localStorage começa vazio.
test.beforeEach(async ({ page }) => {
  // '/bootstrap.html' vira http://localhost:4173/bootstrap.html (baseURL do config).
  await page.goto('/bootstrap.html');
});

// ---------------------------------------------------------------
// 1. NAVBAR (collapse do Bootstrap)
// ---------------------------------------------------------------
test.describe('navbar', () => {
  // A navbar usa navbar-expand-md: o botão só aparece abaixo de 768px.
  // Por isso este grupo força um viewport de celular em todos os projetos.
  test.use({ viewport: { width: 375, height: 800 } });

  test('abre e fecha com aria-expanded correto', async ({ page }) => {
    // Botão real, achado pelo nome acessível (aria-label="Alternar navegação").
    const botao = page.getByRole('button', { name: 'Alternar navegação' });
    // Alvo do collapse: a lista de links.
    const menu = page.locator('#menu-principal');

    // Estado inicial: fechado.
    await expect(botao).toHaveAttribute('aria-expanded', 'false');
    await expect(menu).toBeHidden();

    // Clique abre. O Bootstrap troca o aria-expanded e mostra o menu.
    await botao.click();
    await expect(botao).toHaveAttribute('aria-expanded', 'true');
    await expect(menu).toBeVisible();

    // Segundo clique fecha de novo.
    await botao.click();
    await expect(botao).toHaveAttribute('aria-expanded', 'false');
    await expect(menu).toBeHidden();
  });
});

// ---------------------------------------------------------------
// 2. MODAL DE REVISÃO (D-09)
// ---------------------------------------------------------------
test.describe('modal', () => {
  test('abre, fecha com Esc e com o botão, e devolve o foco', async ({ page }) => {
    // Botão que abre o modal (data-bs-toggle="modal").
    const abrir = page.getByRole('button', { name: 'Revisar antes de enviar' });
    // O modal em si. Usado para checar visível/oculto (espera a animação fade).
    const modal = page.locator('#modal-envio');
    // Diálogo achado pelo nome acessível (aria-labelledby aponta para o título).
    const dialogo = page.getByRole('dialog', { name: 'Revisar antes de enviar' });

    // Abre pelo botão.
    await abrir.click();
    await expect(modal).toBeVisible();
    await expect(dialogo).toBeVisible();

    // Fecha com Esc. O Bootstrap devolve o foco ao botão que abriu.
    await page.keyboard.press('Escape');
    await expect(modal).toBeHidden();
    await expect(abrir).toBeFocused();

    // Abre de novo e fecha pelo botão "Fechar" (o X do cabeçalho).
    await abrir.click();
    await expect(modal).toBeVisible();
    await page.getByRole('button', { name: 'Fechar' }).click();
    await expect(modal).toBeHidden();
    await expect(abrir).toBeFocused();
  });
});

// ---------------------------------------------------------------
// 3. FAVORITO + CONTADOR JQUERY (T07 e T08)
// ---------------------------------------------------------------
test.describe('favorito', () => {
  test('alterna aria-pressed e o contador do jQuery acompanha', async ({ page }) => {
    // Primeiro botão "Favoritar" da lista de notícias.
    const botao = page.locator('#lista-noticias').getByRole('button', { name: 'Favoritar' }).first();
    // Contador feito pelo jquery-favoritos.js (só observa o aria-pressed).
    const total = page.locator('[data-total-favoritos]');

    // Estado inicial: nada favoritado.
    await expect(botao).toHaveAttribute('aria-pressed', 'false');
    await expect(total).toHaveText('0');

    // Clique favorita (o favoritos.js nativo troca o estado; o jQuery só lê).
    await botao.click();
    await expect(botao).toHaveAttribute('aria-pressed', 'true');
    await expect(total).toHaveText('1');

    // Clique de novo desfavorita e o total volta a 0.
    await botao.click();
    await expect(botao).toHaveAttribute('aria-pressed', 'false');
    await expect(total).toHaveText('0');
  });
});

// ---------------------------------------------------------------
// 4. FILTRO DE NOTÍCIAS
// ---------------------------------------------------------------
test.describe('filtro', () => {
  test('mostra N resultados e o estado vazio', async ({ page }) => {
    // Campo achado pelo <label> "Buscar notícias".
    const busca = page.getByLabel('Buscar notícias');
    // Região role="status" (visually-hidden): o filtro.js escreve "N resultados".
    const status = page.locator('#status-busca');
    // Mensagem do estado vazio (atributo hidden removido pelo JS).
    const vazio = page.locator('#busca-vazia');

    // Termo que existe em só uma notícia.
    await busca.fill('reforço');
    await expect(status).toHaveText(/^1 resultado/);
    await expect(vazio).toBeHidden();

    // Termo que não existe em nenhuma notícia.
    await busca.fill('zzzzzz');
    await expect(vazio).toBeVisible();
    await expect(vazio).toHaveText(/Nenhuma notícia encontrada/);
  });
});

// ---------------------------------------------------------------
// 5. FORMULÁRIO: erro, depois sucesso
// ---------------------------------------------------------------
test.describe('formulário', () => {
  test('mostra erro com campos vazios e sucesso com dados válidos', async ({ page }) => {
    const enviar = page.getByRole('button', { name: 'Enviar mensagem' });
    // Região role="status" do formulário (começa vazia).
    const resultado = page.locator('#contato-status');

    // Passo 1: envia vazio. Os erros em texto ("Erro: ...") devem aparecer.
    await enviar.click();
    await expect(page.locator('#nome-erro')).toBeVisible();
    await expect(page.locator('#email-erro')).toBeVisible();
    await expect(page.locator('#mensagem-erro')).toBeVisible();

    // Passo 2: preenche tudo com dados fictícios (nada de dado pessoal real).
    await page.getByLabel('Nome', { exact: true }).fill('Pessoa Teste');
    await page.getByLabel('E-mail').fill('teste@exemplo.com');
    await page.getByLabel('Mensagem', { exact: true }).fill('Mensagem de teste.');
    await enviar.click();

    // Passo 3: os erros somem e a região de status ganha uma mensagem.
    await expect(page.locator('#nome-erro')).toBeHidden();
    await expect(page.locator('#email-erro')).toBeHidden();
    await expect(page.locator('#mensagem-erro')).toBeHidden();
    await expect(resultado).not.toBeEmpty();
  });
});

// ---------------------------------------------------------------
// 6. SEM OVERFLOW HORIZONTAL EM 320px
// ---------------------------------------------------------------
test.describe('320px', () => {
  // 320px é o piso do critério WCAG de reflow.
  test.use({ viewport: { width: 320, height: 640 } });

  test('a página não rola na horizontal', async ({ page }) => {
    // Espera o CSS do Bootstrap e as imagens carregarem antes de medir.
    await page.waitForLoadState('load');

    // Mede dentro do navegador: largura total do conteúdo x largura visível.
    const medidas = await page.evaluate(() => ({
      conteudo: document.documentElement.scrollWidth,
      visivel: document.documentElement.clientWidth,
    }));

    // Regra da SPEC: scrollWidth <= clientWidth.
    expect(medidas.conteudo).toBeLessThanOrEqual(medidas.visivel);
  });
});