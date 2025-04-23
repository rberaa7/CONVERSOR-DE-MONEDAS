const selectorUno = document.getElementById('selector_uno');
const selectorDos = document.getElementById('selector_dos');
const cantidadUno = document.getElementById('cantidad_uno');
const cantidadDos = document.getElementById('cantidad_dos');
const rateText = document.getElementById('rate');
const divsCantidades = document.querySelectorAll('.cantidades');
const iconoModo = document.getElementById('iconoModo');
const modoSwitch = document.getElementById('modoSwitch');

// Inicializa el modo claro por defecto
document.body.classList.add('light');
iconoModo.textContent = '☀️';

modoSwitch.addEventListener('change', () => {
  document.body.classList.toggle('dark');
  document.body.classList.toggle('light');
  iconoModo.textContent = document.body.classList.contains('dark') ? '🌙' : '☀️';
});

const monedas = ["USD","ARS","EUR","BRL","CLP","COP","MXN","UYU","GBP","JPY","CNY"];
monedas.forEach(moneda => {
  const option1 = document.createElement('option');
  const option2 = document.createElement('option');
  option1.value = option2.value = moneda;
  option1.textContent = option2.textContent = moneda;
  selectorUno.appendChild(option1);
  selectorDos.appendChild(option2);
});
selectorUno.value = "ARS";
selectorDos.value = "USD";

async function calcular() {
  const moneda1 = selectorUno.value;
  const moneda2 = selectorDos.value;
  const cantidad = cantidadUno.value;

  const res = await fetch(`https://api.exchangerate-api.com/v4/latest/${moneda1}`);
  const data = await res.json();
  const tasa = data.rates[moneda2];

  cantidadDos.value = (cantidad * tasa).toFixed(2);
  rateText.textContent = `1 ${moneda1} = ${tasa.toFixed(4)} ${moneda2}`;
}

selectorUno.addEventListener('change', calcular);
selectorDos.addEventListener('change', calcular);
cantidadUno.addEventListener('input', calcular);
cantidadUno.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') calcular();
  cantidadUno.addEventListener('input', calcular);
});

document.getElementById('botoninvertir').addEventListener('click', () => {
  [selectorUno.value, selectorDos.value] = [selectorDos.value, selectorUno.value];
  divsCantidades.forEach(div => div.classList.add('invertida'));
  setTimeout(() => {
    divsCantidades.forEach(div => div.classList.remove('invertida'));
  }, 500);
  calcular();
});

calcular();

