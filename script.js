/* 
   DULCE RINCÓN - 
   Cada bloque se puede copiar cada bloque a otro proyecto por separado, siempre que
   el HTML tenga los mismos id. */


/* NIVEL 1: INTERACCIONES BÁSICAS (DOM y eventos) */

/*  Menú  */
const btnMenu = document.getElementById("btn-menu");
const menu = document.getElementById("menu");

btnMenu.addEventListener("click", function () {

  // toggle: si tiene la clase la saca, si no la tiene la agrega
  const abierto = menu.classList.toggle("abierto");
  btnMenu.setAttribute("aria-expanded", abierto);
  btnMenu.textContent = abierto ? "✕" : "☰";
});

// Al tocar un enlace del menú, se cierra (útil en el celular)
menu.querySelectorAll("a").forEach(function (enlace) {
  enlace.addEventListener("click", function () {
    menu.classList.remove("abierto");
    btnMenu.textContent = "☰";
  });
});


/* Modo claro / oscuro  */
const btnTema = document.getElementById("btn-tema");

function aplicarTema(oscuro) {
  document.body.classList.toggle("oscuro", oscuro);
  btnTema.textContent = oscuro ? "☀️" : "🌙";
}

//  al cargar la página, recuperamos la elección guardada
aplicarTema(localStorage.getItem("tema") === "oscuro");

btnTema.addEventListener("click", function () {
  const ahoraOscuro = !document.body.classList.contains("oscuro");
  aplicarTema(ahoraOscuro);
  // guardamos la elección para la próxima visita
  localStorage.setItem("tema", ahoraOscuro ? "oscuro" : "claro");
});


/* Botón "volver arriba" */
const btnArriba = document.getElementById("btn-arriba");

window.addEventListener("scroll", function () {
  // Aparece cuando bajamos más de 300 píxeles
  if (window.scrollY > 300) {
    btnArriba.classList.remove("oculto");
  } else {
    btnArriba.classList.add("oculto");
  }
});

btnArriba.addEventListener("click", function () {
  window.scrollTo({ top: 0, behavior: "smooth" });
});


/*  Saludo según la hora y año automático */
function obtenerSaludo() {
  const hora = new Date().getHours();
  if (hora < 12) {
    return "¡Buen día! ☀️";
  } else if (hora < 20) {
    return "¡Buenas tardes! 🌤️";
  } else {
    return "¡Buenas noches! 🌙";
  }
}

document.getElementById("saludo").textContent = obtenerSaludo() + " Bienvenido a Dulce Rincón";
document.getElementById("anio").textContent = new Date().getFullYear();


/*  Galería con imagen ampliada  */
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");

document.querySelectorAll(".miniatura").forEach(function (miniatura) {
  miniatura.addEventListener("click", function () {
    lightboxImg.src = miniatura.src;
    lightboxImg.alt = miniatura.alt;
    lightbox.classList.remove("oculto");
  });
});

// Cerrar al hacer clic en cualquier parte de la ventana oscura
lightbox.addEventListener("click", function () {
  lightbox.classList.add("oculto");
});

// Cerrar con la tecla Escape
document.addEventListener("keydown", function (evento) {
  if (evento.key === "Escape") {
    lightbox.classList.add("oculto");
  }
});


/* NIVEL 2: ARRAYS, OBJETOS Y BUCLES */

/*  Catálogo generado con JS  */
// Un ARRAY de OBJETOS: cada producto tiene sus propiedades.
// Para adaptar la demo a otro emprendimiento, solo hay que cambiar esta lista.
const productos = [
  { id: 1, nombre: "Torta de chocolate",  categoria: "tortas",  precio: 9500, emoji: "🍫", descripcion: "Bizcochuelo húmedo con ganache." },
  { id: 2, nombre: "Cheesecake frutos rojos", categoria: "tortas", precio: 10500, emoji: "🍓", descripcion: "Base de galleta y cobertura de frutos rojos." },
  { id: 3, nombre: "Lemon pie",           categoria: "tortas",  precio: 8800,  emoji: "🍋", descripcion: "Crema de limón y merengue italiano." },
  { id: 4, nombre: "Docena de medialunas", categoria: "salados", precio: 4200, emoji: "🥐", descripcion: "De manteca, recién horneadas." },
  { id: 5, nombre: "Sándwiches de miga (x12)", categoria: "salados", precio: 5800, emoji: "🥪", descripcion: "Jamón y queso, surtidos." },
  { id: 6, nombre: "Pizzetas (x10)",      categoria: "salados", precio: 4800,  emoji: "🍕", descripcion: "Con salsa de tomate y mozzarella." },
  { id: 7, nombre: "Café con leche",      categoria: "bebidas", precio: 1800,  emoji: "☕", descripcion: "Grande, con espuma." },
  { id: 8, nombre: "Limonada con menta",  categoria: "bebidas", precio: 2200,  emoji: "🍹", descripcion: "Natural, bien fría." }
];

const listaProductos = document.getElementById("lista-productos");
const sinResultados = document.getElementById("sin-resultados");

// Convierte un número en dinero con formato argentino: 9500 -> "$9.500"
function formatearPrecio(numero) {
  return "$" + numero.toLocaleString("es-AR");
}

// Recibe un array de productos y dibuja una tarjeta por cada uno (BUCLE)
function mostrarProductos(lista) {
  listaProductos.innerHTML = ""; // vaciamos lo que había

  for (let i = 0; i < lista.length; i++) {
    const p = lista[i];

    const tarjeta = document.createElement("article");
    tarjeta.className = "tarjeta";
    tarjeta.innerHTML =
      '<div class="emoji">' + p.emoji + "</div>" +
      "<h3>" + p.nombre + "</h3>" +
      '<p class="descripcion">' + p.descripcion + "</p>" +
      '<p class="precio">' + formatearPrecio(p.precio) + "</p>" +
      '<button class="btn" data-id="' + p.id + '">Agregar</button>';

    listaProductos.appendChild(tarjeta);
  }

  // Si no hay productos, mostramos el mensaje
  sinResultados.classList.toggle("oculto", lista.length > 0);
}


/* Filtro por categoría +  Buscador */
// Los dos comparten una función: así funcionan juntos
let categoriaActual = "todos";
let textoBusqueda = "";

function aplicarFiltros() {
  const filtrados = productos.filter(function (p) {
    const coincideCategoria = categoriaActual === "todos" || p.categoria === categoriaActual;
    const coincideTexto = p.nombre.toLowerCase().includes(textoBusqueda.toLowerCase());
    return coincideCategoria && coincideTexto;
  });
  mostrarProductos(filtrados);
}

// Botones de categoría
const botonesFiltro = document.querySelectorAll(".filtro");
botonesFiltro.forEach(function (boton) {
  boton.addEventListener("click", function () {
    categoriaActual = boton.dataset.categoria;
    botonesFiltro.forEach(function (b) { b.classList.remove("activo"); });
    boton.classList.add("activo");
    aplicarFiltros();
  });
});

// Buscador: "input" se dispara con cada letra que se escribe
document.getElementById("buscador").addEventListener("input", function (evento) {
  textoBusqueda = evento.target.value;
  aplicarFiltros();
});

// Dibujamos el catálogo completo al cargar
aplicarFiltros();


/* Carrusel de testimonios  */
const testimonios = [
  { texto: "La mejor torta de chocolate que probé, ¡volvimos tres veces!", autor: "Lucía M." },
  { texto: "Pedimos los sándwiches para un cumple y desaparecieron en minutos.", autor: "Martín R." },
  { texto: "Atención muy amable y todo llegó a tiempo. Recomendado.", autor: "Sofía P." }
];

const carrusel = document.getElementById("carrusel");
const carruselTexto = document.getElementById("carrusel-texto");
const carruselAutor = document.getElementById("carrusel-autor");
let posicionTestimonio = 0;

function mostrarTestimonio() {
  carruselTexto.textContent = "“" + testimonios[posicionTestimonio].texto + "”";
  carruselAutor.textContent = "— " + testimonios[posicionTestimonio].autor;
}

function siguienteTestimonio() {
  carrusel.classList.add("desvanecido"); // se desvanece...
  setTimeout(function () {
    // % vuelve a 0 cuando llega al final de la lista
    posicionTestimonio = (posicionTestimonio + 1) % testimonios.length;
    mostrarTestimonio();
    carrusel.classList.remove("desvanecido"); // ...y reaparece con el nuevo texto
  }, 400);
}

mostrarTestimonio();
let temporizadorCarrusel = setInterval(siguienteTestimonio, 4000); // cada 4 segundos

// Se pausa mientras el mouse está encima
carrusel.addEventListener("mouseenter", function () { clearInterval(temporizadorCarrusel); });
carrusel.addEventListener("mouseleave", function () {
  temporizadorCarrusel = setInterval(siguienteTestimonio, 4000);
});


/* Preguntas frecuentes (acordeón)  */
document.querySelectorAll(".faq-pregunta").forEach(function (boton) {
  boton.addEventListener("click", function () {
    const item = boton.parentElement;
    const abierto = item.classList.toggle("abierto");
    boton.querySelector("span").textContent = abierto ? "−" : "+";
  });
});


/* NIVEL 3: FUNCIONES Y LÓGICA*/

/* Carrito de compras   */
// El carrito es un array de objetos: { id: 1, cantidad: 2 }
let carrito = [];

const carritoItems = document.getElementById("carrito-items");
const carritoContador = document.getElementById("carrito-contador");
const carritoTotal = document.getElementById("carrito-total");

// Busca un producto por su id en el catálogo
function buscarProducto(id) {
  return productos.find(function (p) { return p.id === id; });
}

// Suma cuántas unidades hay en total
function contarItems() {
  let total = 0;
  for (const item of carrito) {
    total += item.cantidad;
  }
  return total;
}

// Calcula el precio total (precio × cantidad de cada ítem)
function calcularTotal() {
  let total = 0;
  for (const item of carrito) {
    total += buscarProducto(item.id).precio * item.cantidad;
  }
  return total;
}

function agregarAlCarrito(id) {
  const existente = carrito.find(function (item) { return item.id === id; });
  if (existente) {
    existente.cantidad++;
  } else {
    carrito.push({ id: id, cantidad: 1 });
  }
  actualizarCarrito();
}

function quitarDelCarrito(id) {
  const item = carrito.find(function (i) { return i.id === id; });
  if (!item) return;
  item.cantidad--;
  if (item.cantidad === 0) {
    carrito = carrito.filter(function (i) { return i.id !== id; });
  }
  actualizarCarrito();
}

function actualizarCarrito() {
  carritoItems.innerHTML = "";

  if (carrito.length === 0) {
    carritoItems.innerHTML = "<li>Todavía no agregaste nada 🙂</li>";
  }

  for (const item of carrito) {
    const p = buscarProducto(item.id);
    const li = document.createElement("li");
    li.innerHTML =
      "<span>" + p.emoji + " " + p.nombre + "</span>" +
      "<span>" +
        '<button data-quitar="' + p.id + '">−</button> ' +
        item.cantidad + " " +
        '<button data-sumar="' + p.id + '">+</button>' +
      "</span>" +
      "<span>" + formatearPrecio(p.precio * item.cantidad) + "</span>";
    carritoItems.appendChild(li);
  }

  carritoContador.textContent = contarItems();
  carritoTotal.textContent = formatearPrecio(calcularTotal());

  // guardamos el carrito cada vez que cambia
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Un solo "escuchador" para todos los botones "Agregar" (delegación de eventos),
// porque las tarjetas se crean con JS y no existen cuando carga la página.
listaProductos.addEventListener("click", function (evento) {
  const id = evento.target.dataset.id;
  if (id) agregarAlCarrito(Number(id));
});

carritoItems.addEventListener("click", function (evento) {
  if (evento.target.dataset.sumar) agregarAlCarrito(Number(evento.target.dataset.sumar));
  if (evento.target.dataset.quitar) quitarDelCarrito(Number(evento.target.dataset.quitar));
});

document.getElementById("btn-vaciar").addEventListener("click", function () {
  carrito = [];
  actualizarCarrito();
});

//  al cargar la página, recuperamos el carrito guardado
try {
  const guardado = JSON.parse(localStorage.getItem("carrito"));
  if (Array.isArray(guardado)) carrito = guardado;
} catch (error) {
  carrito = [];
}
actualizarCarrito();


/*  Botón "Pedir por WhatsApp"  */
// IMPORTANTE: cambiar por el número real, con código de país y sin + ni espacios.
// Argentina: 54 + 9 + código de área (sin 0) + número (sin 15)
const NUMERO_WHATSAPP = "5493420000000";

function armarMensajePedido() {
  let mensaje = "¡Hola! Quiero hacer este pedido:\n";
  for (const item of carrito) {
    const p = buscarProducto(item.id);
    mensaje += "• " + item.cantidad + " x " + p.nombre + " (" + formatearPrecio(p.precio * item.cantidad) + ")\n";
  }
  mensaje += "\nTotal: " + formatearPrecio(calcularTotal());
  return mensaje;
}

document.getElementById("btn-whatsapp").addEventListener("click", function () {
  if (carrito.length === 0) {
    alert("Primero agregá algún producto al carrito 🙂");
    return;
  }
  // encodeURIComponent convierte espacios y saltos de línea en un formato válido para URL
  const url = "https://wa.me/" + NUMERO_WHATSAPP + "?text=" + encodeURIComponent(armarMensajePedido());
  window.open(url, "_blank");
});


/*  Calculadora de presupuesto con descuento  */
const selectProducto = document.getElementById("pres-producto");
const inputCantidad = document.getElementById("pres-cantidad");
const resultadoPres = document.getElementById("pres-resultado");

// Llenamos el <select> con los productos del catálogo (otro uso del bucle)
for (const p of productos) {
  const opcion = document.createElement("option");
  opcion.value = p.id;
  opcion.textContent = p.nombre + " - " + formatearPrecio(p.precio);
  selectProducto.appendChild(opcion);
}

// Función pura: recibe datos y devuelve un resultado (fácil de probar)
function calcularPresupuesto(precio, cantidad) {
  const subtotal = precio * cantidad;
  let porcentajeDescuento = 0;

  if (cantidad >= 12) {
    porcentajeDescuento = 15;
  } else if (cantidad >= 6) {
    porcentajeDescuento = 10;
  }

  const descuento = subtotal * porcentajeDescuento / 100;
  return {
    subtotal: subtotal,
    porcentaje: porcentajeDescuento,
    descuento: descuento,
    total: subtotal - descuento
  };
}

document.getElementById("form-presupuesto").addEventListener("submit", function (evento) {
  evento.preventDefault(); // evita que la página se recargue

  const producto = buscarProducto(Number(selectProducto.value));
  const cantidad = Number(inputCantidad.value);

  if (!Number.isInteger(cantidad) || cantidad < 1) {
    resultadoPres.textContent = "Ingresá una cantidad válida (1 o más).";
    return;
  }

  const r = calcularPresupuesto(producto.precio, cantidad);
  resultadoPres.innerHTML =
    "<p>" + cantidad + " x " + producto.nombre + "</p>" +
    "<p>Subtotal: " + formatearPrecio(r.subtotal) + "</p>" +
    "<p>Descuento (" + r.porcentaje + "%): -" + formatearPrecio(r.descuento) + "</p>" +
    "<p><strong>Total: " + formatearPrecio(r.total) + "</strong></p>";
});


/* Formulario de contacto con validación */
const formContacto = document.getElementById("form-contacto");
const campoNombre = document.getElementById("nombre");
const campoEmail = document.getElementById("email");
const campoMensaje = document.getElementById("mensaje");
const mensajeExito = document.getElementById("form-exito");

// Cada función de validación devuelve un texto de error, o "" si está todo bien
function validarNombre(valor) {
  if (valor.trim() === "") return "Escribí tu nombre.";
  if (valor.trim().length < 3) return "El nombre es muy corto.";
  return "";
}

function validarEmail(valor) {
  // Expresión regular simple: algo@algo.algo
  const patron = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (valor.trim() === "") return "Escribí tu email.";
  if (!patron.test(valor)) return "El email no es válido.";
  return "";
}

function validarMensaje(valor) {
  if (valor.trim() === "") return "Escribí tu mensaje.";
  if (valor.trim().length < 10) return "El mensaje debe tener al menos 10 caracteres.";
  return "";
}

// Muestra (o borra) el error debajo de un campo
function mostrarError(campo, idError, texto) {
  document.getElementById(idError).textContent = texto;
  campo.classList.toggle("invalido", texto !== "");
}

formContacto.addEventListener("submit", function (evento) {
  evento.preventDefault();
  mensajeExito.classList.add("oculto");

  const errorNombre = validarNombre(campoNombre.value);
  const errorEmail = validarEmail(campoEmail.value);
  const errorMensaje = validarMensaje(campoMensaje.value);

  mostrarError(campoNombre, "error-nombre", errorNombre);
  mostrarError(campoEmail, "error-email", errorEmail);
  mostrarError(campoMensaje, "error-mensaje", errorMensaje);

  // Si no hay ningún error, el formulario es válido
  if (errorNombre === "" && errorEmail === "" && errorMensaje === "") {
    mensajeExito.classList.remove("oculto");
    formContacto.reset();
    // En un sitio real acá se enviarían los datos a un servidor.
  }
});


/* NIVEL 4: DESAFÍOS EXTRA
   ( localStorage está integrado arriba, en el modo oscuro
    y en el carrito. Buscar los comentarios "4.1")*/

/*  Cuenta regresiva para una promo  */
// Formato: AAAA-MM-DDTHH:MM:SS. Cambiar por la fecha de la promo real.
const fechaPromo = new Date("2026-12-24T00:00:00");
const cuentaRegresiva = document.getElementById("cuenta-regresiva");

function actualizarCuentaRegresiva() {
  const ahora = new Date();
  const diferencia = fechaPromo - ahora; // diferencia en milisegundos

  if (diferencia <= 0) {
    cuentaRegresiva.textContent = "¡La promo terminó!";
    clearInterval(temporizadorCuenta);
    return;
  }

  // Convertimos milisegundos a días, horas, minutos y segundos
  const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
  const horas = Math.floor((diferencia / (1000 * 60 * 60)) % 24);
  const minutos = Math.floor((diferencia / (1000 * 60)) % 60);
  const segundos = Math.floor((diferencia / 1000) % 60);

  cuentaRegresiva.textContent =
    dias + " días · " + horas + " h · " + minutos + " min · " + segundos + " s";
}

const temporizadorCuenta = setInterval(actualizarCuentaRegresiva, 1000);
actualizarCuentaRegresiva(); // la mostramos ya, sin esperar el primer segundo
