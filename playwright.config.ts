// playwright.config.ts
// Configuração da suíte Playwright do Projeto UC15 (T11).
import { defineConfig, devices } from '@playwright/test';

// Porta do servidor estático local. Fica numa constante para
// o webServer e o baseURL usarem sempre o mesmo valor.
const PORTA = 4173;

export default defineConfig({
  // Pasta onde ficam as specs (tests/e2e/*.spec.ts).
  testDir: './tests/e2e',

  // Cada teste roda isolado. Sem dependência de ordem entre arquivos.
  fullyParallel: true,

  // Falha o build se alguém esquecer um test.only no código.
  forbidOnly: !!process.env.CI,

  // Reporter HTML: gera playwright-report/ (ignorado no Git).
  reporter: 'html',

  use: {
    // Com baseURL, os testes usam page.goto('/') em vez da URL inteira.
    baseURL: `http://localhost:${PORTA}`,

    // Trace só quando um teste falha e roda de novo (retry).
    // Evita guardar arquivos grandes sem necessidade.
    trace: 'on-first-retry',
  },

  // Uma tentativa extra: o trace só é gravado nela.
  retries: 1,

  // Sobe o servidor estático servindo a pasta prototipo/.
  // -c-1 desliga o cache, para o teste ler sempre o arquivo atual.
  webServer: {
    command: `npx http-server prototipo -p ${PORTA} -c-1 --silent`,
    url: `http://localhost:${PORTA}`,
    // Reaproveita um servidor já aberto quando roda local.
    reuseExistingServer: !process.env.CI,
  },

  // Cada projeto é um motor ou perfil de dispositivo.
  // Emulado não é aparelho real: o limite vai para o TESTES.md.
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    // WebKit é o motor do Safari, mas não é o Safari real.
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    // Perfis móveis emulados (viewport, toque e user agent).
    { name: 'Pixel 7', use: { ...devices['Pixel 7'] } },
    { name: 'iPhone 14', use: { ...devices['iPhone 14'] } },
  ],
});