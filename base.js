const BASE_URL = "https://dsclothing-9f0be-default-rtdb.firebaseio.com/";
 const COLECCIÓN = "productos" ; //
 constante PUNTO FINAL = ` ${ BASE_URL } / ${ COLECCIÓN } .json` ;
 const $ = ( q ) => document .querySelector ( q );
 const $$ = ( q ) => document .querySelectorAll ( q );
 constante formatARS = ( n ) =>
 nuevo Intl.NumberFormat ( "es-AR" , { estilo : "moneda" , moneda : "ARS" }). format ( n ?? 0 );

 función asíncrona fileToBase64Optimized ( archivo , tamaño máximo = 800 ) {
 si ( ! archivo ) devuelve nulo ;
 const bitmap = await createImageBitmap ( archivo );
 const { ancho , alto } = mapa de bits ;
 escala constante = Math.min ( 1 , maxSize / Math.max ( ancho , alto )) ;
 const canvas = document.createElement ( "canvas" ) ;
 lienzo . ancho = Math . redondo ( ancho * escala );
 lienzo . altura = Math . redondo ( altura * escala );
 const ctx = canvas.getContext ( "2d" ) ;
 ctx . drawImage ( mapa de bits , 0 , 0 , canvas . width , canvas . height );
 devolver esperar nueva Promesa (( resolver ) =>
 lienzo .toBlob (
 ( gota ) => {
 const lector = nuevo FileReader ();
 lector . onload = () => resolve ( lector . result );
 lector .readAsDataURL ( blob );
 },
 "imagen/jpeg" ,
 0,85
 )
 );
 }

 const form = $ ( "#product-form" );
 const inputId = $ ( "#id-del-producto" );
 constante inputTitle = $ ( "#título" );
 const inputPrice = $ ( "#precio" );
 const inputImage = $ ( "#imagen" );
 const imgPreview = $ ( "#vistaprevia" );
 const grid = $ ( "#productos-grid" );
 const vacío = $ ( "#vacío" );
 const reloadBtn = $ ( "#reload-btn" );
 constante resetBtn = $ ( "#reset-btn" );
 const formTitle = $ ( "#título-del-formulario" );

 deje que currentImageDataURL = null ;

 inputImage .addEventListener ( "cambio" , async ( e ) => {
 const archivo = e . destino . archivos ?.[ 0 ];
 si ( ! archivo ) {
 currentImageDataURL = nulo ;
 imgPreview . style . display = "ninguno" ;
 imgPreview .src = "" ;
 devolver ;
 }
 currentImageDataURL = await fileToBase64Optimized ( archivo );
 imgPreview .src = currentImageDataURL ;
 imgPreview . style . display = "bloque" ;
 });

 resetBtn .addEventListener ( "clic" , () => resetForm ());
 reloadBtn .addEventListener ( "clic" , () => loadProducts ());

 formulario.addEventListener (" enviar " , async ( e ) => {
 e . preventDefault ();
 const titulo = inputTitle . valor . trim ();
 const precio = parseFloat ( inputPrice . valor );

 if ( ! título || Número .isNaN ( precio )) {
 alert ( "Completá título y precio." );
 devolver ;
 }

 carga útil constante = {
 título ,
 precio ,
 imagen : currentImageDataURL ?? indefinido ,
 updatedAt : nueva fecha (). toISOString ()
 };

 constante id = inputId . valor ;
 intentar {
 si ( id ) {
 const url = ` ${ BASE_URL } / ${ COLECCIÓN } / ${ id } .json` ;
 const res = await fetch ( url , {
 método : "PARCHE" ,
 encabezados : { "Tipo de contenido" : "application/json" },
 cuerpo : JSON.stringify ( carga útil ) ,
 });
 if ( ! res . ok ) throw new Error ( "Error al editar" );
 } demás {
 carga útil . createdAt = nueva Fecha (). toISOString ();
 si ( ! payload . imagen ) {
 const confirmNoImg = confirmar (
 "No seleccionaste imagen. ¿Crear de todos modos?"
 );
 si ( ! confirmNoImg ) retorna ;
 }
 const res = await fetch ( PUNTO FINAL , {
 método : "POST" ,
 encabezados : { "Tipo de contenido" : "application/json" },
 cuerpo : JSON.stringify ( carga útil ) ,
 });
 if ( ! res . ok ) throw new Error ( "Error al crear" );
 }

 restablecerFormulario ();
 esperar cargarProductos ();
 } captura ( err ) {
 consola .error ( err );
 alert ( "Ups, hubo un problema guardando el producto." );
 }
 });

 función asíncrona loadProducts () {
 cuadrícula .innerHTML = "" ;
 vacío . classList . add ( "oculto" );
 intentar {
 const res = await fetch ( PUNTO FINAL );
 const datos = await res . json ();
 const entradas = datos ? Object.entradas ( datos ) : [] ;
 si ( ! entradas . longitud ) {
 vacío . classList . remove ( "oculto" );
 devolver ;
 }
 para ( const [ id , p ] de entradas ) {
 addCard ({ id , ... p });
 }
 } captura ( err ) {
 consola .error ( err );
 alert ( "No se pudieron cargar los productos." );
 }
 }

 función addCard ( prod ) {
 const tpl = document.getElementById ( "product-card-tpl" ). content.cloneNode ( true ) ;
 const el = tpl .querySelector ( ".product-card" );
 const img = tpl .querySelector ( ".product-img" );
 const title = tpl .querySelector ( ".product-title" );
 const precio = tpl .querySelector ( ".precio-producto" );
 const [ btnEdit , btnDelete ] = tpl .querySelectorAll ( "botón" );

 título . textContent = prod . title ?? "(Sin título)" ;
 precio . textContent = formatARS ( prod . price ?? 0 );

 si ( prod . imagen ) {
 img . src = prod . imagen ;
 } demás {
 img . alt = "Sin imagen" ;
 }

 btnEdit .addEventListener ( "clic" , () => fillFormForEdit ( prod ));
 btnDelete .addEventListener ( "clic" , () => deleteProduct ( prod .id ));

 cuadrícula .appendChild ( el );
 }

 función asíncrona deleteProduct ( id ) {
 if ( ! confirm ( "¿Seguro que quieres borrar este producto?" )) return ;
 intentar {
 const url = ` ${ BASE_URL } / ${ COLECCIÓN } / ${ id } .json` ;
 const res = await fetch ( url , { método : "ELIMINAR" });
 if ( ! res . ok ) throw new Error ( "Error al borrar" );
 esperar cargarProductos ();
 } captura ( err ) {
 consola .error ( err );
 alert ( "No se pudo borrar el producto." );
 }
 }

 función fillFormForEdit ( prod ) {
 inputId . valor = prod . id ;
 inputTitle . valor = prod . título ?? "" ;
 inputPrice . valor = prod . precio ?? "" ;
 formularioTítulo . textContent = "Editar producto" ;
 currentImageDataURL = prod . imagen ?? null ;
 imgPreview .src = currentImageDataURL || "" ;
 imgPreview . style . display = currentImageDataURL ? "bloque" : "ninguno" ;
 entradaImagen.valor = "" ;
 ventana .scrollTo ({ top : 0 , comportamiento : "suave" });
 }

 función resetForm () {
 inputId . valor = "" ;
 inputTitle . valor = "" ;
 precioEntrada.valor = "" ;
 entradaImagen.valor = "" ;
 currentImageDataURL = nulo ;
 imgPreview .src = "" ;
 imgPreview . style . display = "ninguno" ;
 formularioTítulo . textContent = "Crear producto" ;
 }

 documento .addEventListener ( "DOMContentLoaded" , loadProducts );