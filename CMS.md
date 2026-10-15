# CMS

## Ambiente local
- Ferramenta: WordPress Studio 1.24.0, Windows 11.
- WordPress 7.1.3. PHP 8.4.26. WP-CLI 2.12.0.
- Banco: SQLite local (Studio). Produção usaria MariaDB/MySQL.
- HTTPS: ausente no local. Só http://localhost.
- Tema pai: twentytwentyfive 1.5 (tema de blocos).
- Tema filho: wordpress/tema-filho/.

## Tema pai e tema filho
- Pai: `twentytwentyfive` 1.5, tema de blocos. Decisão em DECISOES.md (D-14).
- Filho: `wordpress/tema-filho/`. O `Template` aponta para o pai.
- `style.css`: cabeçalho do tema e CSS com escopo `.site-futnoticias`. Sem `!important`.
- `functions.php`: enfileira o CSS do pai e depois o do filho. Adiciona a classe de escopo ao `body`.
- `theme.json`: paleta por papel e largura de leitura de 65ch.
- Os arquivos do pai não foram editados.

## Plug-ins
- Nenhum instalado. O core atendeu todos os requisitos.
- Se algum entrar: ficha com requisito, procedência, dados, impacto e rollback.

## Usuários de teste
- henrique-admin: Administrator (eu). Gerencia tema, usuários e configurações.
- editor-teste: Editor. Publica e edita posts de qualquer autor.
- autor-teste: Author. Publica só os próprios posts.
- Senhas: no gerenciador de senhas. Nunca no repositório.
- Menor privilégio: o dia a dia de conteúdo usa Editor ou Author, não Administrator.

## Backup e restauração

### Plano de backup
- Banco: incluído no export do Studio (SQLite local).
- Uploads: `wp-content/uploads`, incluídos no export.
- Tema: versionado no Git (`wordpress/tema-filho/`).
- Plug-ins: nenhum instalado. Nada a copiar.
- Destino: pasta local fora do repositório. O `.gitignore` bloqueia `*.zip` e `*.sql`.
- Frequência: antes de cada mudança grande.
- Arquivos gerados:
  - Site completo: `.zip`, 13,4 MB.
  - Só o banco: <nome e tamanho, se você exportou>.

### Teste de restauração
- Data: 15/10/2026.
- Origem: site `futnoticias`.
- Destino: site `futnoticias-staging` (2º site Studio).
- Passos: exportar no Studio, criar o 2º site, importar o `.zip`.
- Conferido no destino:
  - WordPress 7.1.3.
  - Tema `tema-filho` ativo.
  - 3 usuários com papéis administrator, editor e author.
  - 3 posts e 4 páginas.
  - Home abre com o menu na ordem correta.
- Resultado: ok.
- Evidência: os 4 prints `t10-restauracao-checagem-*.png` em `docs/evidencias/`.
- Limite: restauração testada só entre dois sites locais, na mesma máquina.

## Staging
- Staging: 2º site Studio, `futnoticias-staging`, porta 8882.
- Origem: `futnoticias`, porta 8881.
- Migração de URL: WP-CLI `search-replace`, ciente de dados serializados. Nunca `REPLACE` em SQL.
- Ordem: simulação com `--dry-run`, backup do staging, execução, conferência.
- Caso de teste: criei o post "Teste de URL" com um link para a porta 8881.
- URLs antes: `siteurl` e `home` já em 8882 (o Studio ajustou na importação).
- Simulação: 14 trocas previstas (1 em `post_content`, 13 em `guid`).
- Execução: o relatório mostrou 646 trocas.
- Divergência: o relatório conta linhas afetadas, inclusive em colunas sem URL (`user_login`, `post_status`). No SQLite do Studio ele não mede as trocas reais.
- Conferência (vale mais que o relatório):
  - Nova simulação: 0 trocas restantes.
  - `siteurl` e `home` em 8882.
  - Post de teste com o link em 8882.
  - 3 usuários e 3 posts intactos.
- Evidência: `docs/evidencias/t10-staging-search-replace-dry-run.png`, `t10-staging-search-replace.png`, `t10-staging-home2.png`.
- Limite: staging local, sem HTTPS. A produção real não existe (débito declarado).

## Diferenças para produção
- SQLite × MariaDB/MySQL: alguns plug-ins e SQL manual podem falhar.
- Sem HTTPS, sem CDN, sem cache de servidor.
- Sem e-mail real.

## Produção
- Não existe. Débito declarado.

## Teste de permissão: Author
- Usuário: autor-teste (Author).
- URL: http://localhost:8881/wp-admin/options-general.php
- Esperado: acesso negado (403).
- Observado: No DevTools na aba Network, apareceu erro 403 e na página apareceu a mensagem permissão negada.
- Evidência: docs/evidencias/t10-author-403.png

## Conteúdo
- Páginas: Notícias, Calendário, Classificação, Contato.
- Posts: notícias fictícias, criados por WP-CLI.
- Menu: criado no Editor de Site (Navegação), tema de blocos.
- Conteúdo padrão (Hello world!) removido.

## Caso extremo: Template errado
- Sintoma: `studio wp theme activate tema-filho` falhou com "The parent theme is missing".
- Mensagem: o WordPress pediu o tema pai com o nome `twentytwentyfive` seguido de um comentário.
- Causa: o `style.css` tinha um comentário na mesma linha do `Template`. O WordPress leu a linha inteira como nome do pai.
- Correção: deixar a linha limpa, só ` * Template: twentytwentyfive`, sem nada depois.
- Verificação: `studio wp theme list` mostrou `tema-filho` e `studio wp theme activate tema-filho` deu "Success".
- Lição: o valor de `Template` tem que ser exatamente o nome da pasta do pai.

## Caso extremo: pai ausente
- Site de teste: `futnoticias-staging` (porta 8882). O site principal não foi tocado.
- Teste: renomeei `wp-content/themes/twentytwentyfive` para `twentytwentyfive-off`.
- Observado em `theme list`: o `tema-filho` deixou de aparecer. Nenhum tema ficou `active`.
- Observado no navegador: tela em branco na home.
- Diagnóstico: `wp_get_themes` com `errors` listou o `tema-filho` como tema com erro.
- Causa: o filho depende do pai pelo `Template`. Sem a pasta do pai, o WordPress não carrega o filho.
- Reversão: renomeei a pasta de volta e rodei `theme activate tema-filho`.
- Verificação: `theme list` mostrou `tema-filho` ativo e `twentytwentyfive` presente.
- Evidência: `docs/evidencias/t10-pai-ausente-theme-list.png` e `docs/evidencias/t10-pai-ausente-tela-branca.png`.