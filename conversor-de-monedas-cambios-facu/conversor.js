const selectorUno = document.getElementById('selector_uno');
const selectorDos = document.getElementById('selector_dos');
const cantidadUno = document.getElementById('cantidad_uno');
const cantidadDos = document.getElementById('cantidad_dos');
const rateText = document.getElementById('rate');
const iconoModo = document.getElementById('iconoModo');
const modoSwitch = document.getElementById('modoSwitch');
const divsCantidades = document.querySelectorAll('.cantidades');

const monedas = ["USD", "ARS", "EUR", "BRL", "CLP", "COP", "MXN", "UYU", "GBP", "JPY", "CNY"];

// Cambié los nombres de variables para que sean más descriptivos
// Ejemplo: "selectorUno" en lugar de "currencyEl_one", mejora la legibilidad y mantiene consistencia en el código.

// Reemplacé la creación manual de elementos option por new Option() 
// Esto reduce código repetido y mejora la claridad.


// Llenar los selectores
monedas.forEach(moneda => {
  const option1 = new Option(moneda, moneda);
  const option2 = new Option(moneda, moneda);
  selectorUno.add(option1);
  selectorDos.add(option2);
});
// Inicialicé valores por defecto para los selectores
// Esto mejora la experiencia del usuario al mostrar una conversión de ejemplo apenas se carga la página.
selectorUno.value = "ARS";
selectorDos.value = "USD";

// Mejoré el switch de modo claro/oscuro con toggle
// También se actualiza el ícono según el modo activado con un operador ternario para simplificar el código.
// Modo oscuro/claro
iconoModo.textContent = '☀️';
modoSwitch.addEventListener('change', () => {
  document.body.classList.toggle('dark');
  document.body.classList.toggle('light');
  iconoModo.textContent = document.body.classList.contains('dark') ? '🌙' : '☀️';
});

// Mejoré la función calcular para validar que el valor ingresado sea un número válido y positivo.
// También agregué control de errores con try/catch para evitar que el sitio se rompa si la API falla o no responde.
// Calcular conversión
async function calcular() {
  const moneda1 = selectorUno.value;
  const moneda2 = selectorDos.value;
  const cantidad = parseFloat(cantidadUno.value);

  if (isNaN(cantidad) || cantidad <= 0) {
    cantidadDos.value = '';
    rateText.textContent = 'Ingresá un valor válido.';
    return;
  }

  try {
    const res = await fetch(`https://api.exchangerate-api.com/v4/latest/${moneda1}`);
    if (!res.ok) throw new Error('Error al obtener datos');
    const data = await res.json();
    const tasa = data.rates[moneda2];

    if (!tasa) {
      rateText.textContent = "Moneda no disponible.";
      return;
    }

    cantidadDos.value = (cantidad * tasa).toFixed(2);
    rateText.textContent = `1 ${moneda1} = ${tasa.toFixed(4)} ${moneda2}`;
  } catch (err) {
    rateText.textContent = "Error al cargar datos 😢";
    console.error(err);
  }
}

// Eventos
selectorUno.addEventListener('change', calcular);
selectorDos.addEventListener('change', calcular);
cantidadUno.addEventListener('input', calcular);

// Agregué un evento al presionar Enter en el input para mejorar la usabilidad
// Permite al usuario calcular sin necesidad de hacer clic en otro lado
cantidadUno.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') calcular();
});

// El botón "invertir" ahora intercambia los valores de los selectores utilizando destructuring
// También se agrega y remueve una clase de animación para indicar el cambio visualmente
document.getElementById('botoninvertir').addEventListener('click', () => {
  [selectorUno.value, selectorDos.value] = [selectorDos.value, selectorUno.value];
  divsCantidades.forEach(div => div.classList.add('invertida'));
  setTimeout(() => {
    divsCantidades.forEach(div => div.classList.remove('invertida'));
  }, 500);
  calcular();
});

// Inicial
calcular();
