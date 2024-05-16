// Texto completo del encabezado
var textoCompleto = "Programador Fronted en Proceso... ⌛";
var indice = 0;
var velocidad = 100; // Velocidad de aparición en milisegundos

function mostrarLetra() {
  var encabezado = document.getElementById("texto");
  encabezado.textContent += textoCompleto.charAt(indice);
  indice++;
  if (indice < textoCompleto.length) {
    setTimeout(mostrarLetra, velocidad);
  }
}

// Comienza a mostrar letra por letra cuando la página se carga
window.onload = function () {
  mostrarLetra();
};
