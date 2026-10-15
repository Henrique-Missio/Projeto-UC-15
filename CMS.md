# CMS

## Ambiente local
- Ferramenta: WordPress Studio 1.24.0, Windows 11.
- WordPress 7.1.3. PHP 8.4.26. WP-CLI 2.12.0.
- Banco: SQLite local (Studio). Produção usaria MariaDB/MySQL.
- HTTPS: ausente no local. Só http://localhost.
- Tema pai: twentytwentyfive 1.5 (tema de blocos).
- Tema filho: wordpress/tema-filho/.

## Tema pai e tema filho

(A preencher no T10.)

## Plug-ins

(Meta: zero. Se algum entrar, ficha com requisito, procedência, dados, impacto e rollback.)

## Usuários de teste
- henrique-admin: Administrator (eu). Gerencia tema, usuários e configurações.
- editor-teste: Editor. Publica e edita posts de qualquer autor.
- autor-teste: Author. Publica só os próprios posts.
- Senhas: no gerenciador de senhas. Nunca no repositório.
- Menor privilégio: o dia a dia de conteúdo usa Editor ou Author, não Administrator.

## Backup e restauração

(Banco, uploads, tema e plug-ins, separados.)

## Staging, produção e rollback

(Staging é um segundo site no Studio. Produção real não existe: débito declarado.)

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
- Observado: No DevTolls na aba Network, apareceu erro 403 e na página apareceu a mensagem permissão negada.
- Evidência: docs/evidencias/t10-author-403.png