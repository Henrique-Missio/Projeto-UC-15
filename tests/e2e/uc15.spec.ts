// tests/e2e/uc15.spec.ts
// Suíte E2E mínima da T11 (Projeto UC15).
// Cobre: menu, filtro, favorito, formulário e overflow em 320px.
// Regras da SPEC: seletores por papel/rótulo (getByRole/getByLabel),
// expect "web-first" (espera sozinho), sem waitForTimeout, testes independentes.

import { test, expect } from '@playwright/test';

// beforeEach roda antes de CADA teste. Assim todo teste abre a home do zero.
// Isso garante independência: nenhum teste depende do resultado de outro.
test.beforeEach(async ({ page }) => {
  // '/' vira http://localhost:4173/ por causa do baseURL do playwright.config.ts.
  await page.goto('/');
});

// ---------------------------------------------------------------
// 1. MENU
// ---------------------------------------------------------------
test.describe('menu', () => {
  // O botão hambúrguer só aparece em tela estreita (CSS mobile-first).
  // Por isso este grupo força um viewport de celular em todos os projetos.
  test.use({ viewport: { width: 375, height: 800 } });

  test('abre e fecha com aria-expanded correto', async ({ page }) => {
    // Botão real, achado pelo nome acessível (aria-label="Menu").
    const botao = page.getByRole('button', { name: 'Menu' });

    // Estado inicial: fechado.
    await expect(botao).toHaveAttribute('aria-expanded', 'false');

    // Clique abre. Este é o ponto que a mutação da T11 vai quebrar.
    await botao.click();
    await expect(botao).toHaveAttribute('aria-expanded', 'true');

    // Segundo clique fecha de novo.
    await botao.click();
    await expect(botao).toHaveAttribute('aria-expanded', 'false');
  });
});

// ---------------------------------------------------------------
// 2. FILTRO DE NOTÍCIAS
// ---------------------------------------------------------------
test.describe('filtro', () => {
  test('mostra N resultados e o estado vazio', async ({ page }) => {
    // Campo achado pelo <label> "Buscar notícias".
    const busca = page.getByLabel('Buscar notícias');
    // Região role="status": o JS escreve "N resultados" aqui.
    const status = page.locator('#status-busca');
    // Mensagem do estado vazio (atributo hidden removido pelo JS).
    const vazio = page.locator('#busca-vazia');

    // Termo que existe em só uma notícia ("Novo Reforço").
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
// 3. FAVORITO
// ---------------------------------------------------------------
test.describe('favorito', () => {
  test('alterna aria-pressed', async ({ page }) => {
    // Primeiro botão "Favoritar" da lista de notícias.
    const botao = page.locator('#lista-noticias').getByRole('button', { name: 'Favoritar' }).first();

    // Estado inicial: não favoritado.
    await expect(botao).toHaveAttribute('aria-pressed', 'false');

    // Clique favorita. Sem consentimento, o estado fica só em memória.
    await botao.click();
    await expect(botao).toHaveAttribute('aria-pressed', 'true');

    // Clique de novo desfavorita.
    await botao.click();
    await expect(botao).toHaveAttribute('aria-pressed', 'false');
  });
});

// ---------------------------------------------------------------
// 4. FORMULÁRIO: erro, depois sucesso
// ---------------------------------------------------------------
test.describe('formulário', () => {
  test('mostra erro com campos vazios e sucesso com dados válidos', async ({ page }) => {
    const enviar = page.getByRole('button', { name: 'Enviar mensagem' });
    // Região role="status" do formulário.
    const resultado = page.locator('#contato-status');

    // Passo 1: envia vazio. Os erros em texto ("Erro: ...") devem aparecer.
    await enviar.click();
    await expect(page.locator('#nome-erro')).toBeVisible();
    await expect(page.locator('#email-erro')).toBeVisible();
    await expect(page.locator('#mensagem-erro')).toBeVisible();

    // Passo 2: preenche tudo com dados fictícios (nada de dado pessoal real).
    await page.getByLabel('Nome', { exact: true }).fill('Pessoa Teste');
    await page.getByLabel('E-mail').fill('teste@exemplo.com');
    await page.getByLabel('Mensagem').fill('Mensagem de teste.');
    await enviar.click();

    // Passo 3: os erros somem e a região de status ganha uma mensagem.
    await expect(page.locator('#nome-erro')).toBeHidden();
    await expect(page.locator('#email-erro')).toBeHidden();
    await expect(page.locator('#mensagem-erro')).toBeHidden();
    await expect(resultado).not.toBeEmpty();
  });
});

// ---------------------------------------------------------------
// 5. SEM OVERFLOW HORIZONTAL EM 320px
// ---------------------------------------------------------------
test.describe('320px', () => {
  // 320px é o piso do critério WCAG de reflow.
  test.use({ viewport: { width: 320, height: 640 } });

  test('a página não rola na horizontal', async ({ page }) => {
    // Espera as imagens e o CSS carregarem antes de medir.
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
