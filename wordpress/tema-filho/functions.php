<?php
/**
 * Funções do tema filho FutNotícias.
 * O WordPress carrega este arquivo ANTES do functions.php do pai.
 */

// Bloqueia acesso direto ao arquivo fora do WordPress.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Registra o CSS do tema filho.
 * Dependência: o handle do pai garante a ordem (pai primeiro, filho depois).
 */
function futnoticias_enfileirar_estilos() {
	// Estilo do pai: lido do tema declarado em "Template".
	wp_enqueue_style(
		'futnoticias-pai',
		get_template_directory_uri() . '/style.css',
		array(),
		wp_get_theme( get_template() )->get( 'Version' )
	);

	// Estilo do filho: carrega depois do pai.
	// filemtime() muda a versão a cada edição (evita cache velho).
	wp_enqueue_style(
		'futnoticias-filho',
		get_stylesheet_uri(),
		array( 'futnoticias-pai' ),
		filemtime( get_stylesheet_directory() . '/style.css' )
	);
}
add_action( 'wp_enqueue_scripts', 'futnoticias_enfileirar_estilos' );

/**
 * Adiciona a classe de escopo .site-futnoticias ao <body>.
 * Todo o CSS do filho depende desta classe.
 */
function futnoticias_classe_corpo( $classes ) {
	$classes[] = 'site-futnoticias';
	return $classes;
}
add_filter( 'body_class', 'futnoticias_classe_corpo' );