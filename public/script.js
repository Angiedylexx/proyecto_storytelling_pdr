const API_URL = '/api/comentarios';

const formulario = document.getElementById('frm-narrativa');
const inputNombre = document.getElementById('inp-nombre');
const inputMensaje = document.getElementById('inp-narrativa');
const errorNombre = document.getElementById('err-nombre');
const errorMensaje = document.getElementById('err-narrativa');
const botonEnviar = document.getElementById('btn-enviar');
const botonTexto = document.getElementById('btn-texto');
const botonCargando = document.getElementById('btn-spinner');
const mensajeExito = document.getElementById('toast-success');
const listaMensajes = document.getElementById('lista-narrativas');
const estadoCarga = document.getElementById('estado-carga');
const botonMenu = document.getElementById('mobile-menu-btn');
const menuPrincipal = document.getElementById('main-nav-list');
const contenedorArquetipos = document.getElementById('arquetipos-grid');

function crearTarjetaMensaje(item) {
  const article = document.createElement('article');
  article.className = 'narrativa-item';

  const fotoPerfil = document.createElement('div');
  fotoPerfil.className = 'narrativa-avatar';
  fotoPerfil.setAttribute('aria-hidden', 'true');
  fotoPerfil.textContent = item.nombre[0].toUpperCase();

  const content = document.createElement('div');
  content.className = 'narrativa-content';

  const header = document.createElement('div');
  header.className = 'narrativa-header';

  const author = document.createElement('p');
  author.className = 'narrativa-author';
  author.textContent = item.nombre;

  const time = document.createElement('time');
  time.className = 'narrativa-date';
  time.setAttribute('datetime', item.fecha || '');
  time.textContent = item.fecha || '';

  const text = document.createElement('p');
  text.className = 'narrativa-text';
  text.textContent = item.narrativa || '';

  header.append(author, time);
  content.append(header, text);
  article.append(fotoPerfil, content);

  return article;
}

async function cargarNarrativas() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const { data } = await response.json();

    if (estadoCarga) estadoCarga.remove();

    if (listaMensajes) {
      data.forEach(item => {
        listaMensajes.appendChild(crearTarjetaMensaje(item));
      });
    }
  } catch (err) {
    console.error('Error al cargar:', err);
    if (estadoCarga) {
      estadoCarga.textContent = '⚠️ No se pudo conectar con la API.';
    }
  }
}

if (botonMenu && menuPrincipal) {
  botonMenu.addEventListener('click', () => {
    const isExpanded = botonMenu.getAttribute('aria-expanded') === 'true';
    botonMenu.setAttribute('aria-expanded', !isExpanded);
    menuPrincipal.classList.toggle('hidden');
  });
}

const arquetiposData = [
  { id: 'hero', titulo: 'El Héroe', desc: 'El triunfo sobre el caos.', frase: 'Desafía tus límites', imagen: 'imagenes/arquetipos/heroe.png' },
  { id: 'sage', titulo: 'El Sabio', desc: 'La claridad en la duda.', frase: 'El conocimiento te libera', imagen: 'imagenes/arquetipos/sabio.webp' },
  { id: 'rebel', titulo: 'El Rebelde', desc: 'La ruptura con lo establecido.', frase: 'Cuestiona las reglas', imagen: 'imagenes/arquetipos/valiente.jpeg' },
  { id: 'creator', titulo: 'El Creativo', desc: 'La imaginación hecha realidad.', frase: 'Si puedes soñarlo, lo tienes', imagen: 'imagenes/arquetipos/creativo.avif' }
];

function renderArquetipos() {
  if (!contenedorArquetipos) return;

  arquetiposData.forEach(item => {
    const card = document.createElement('div');
    card.className = 'arquetipo-card';

    const bubble = document.createElement('div');
    bubble.className = 'arquetipo-img-container';

    const img = document.createElement('img');
    img.src = item.imagen;
    img.alt = `Representación de ${item.titulo}`;
    img.loading = 'lazy';

    const overlay = document.createElement('div');
    overlay.className = 'arquetipo-overlay';

    const desc = document.createElement('p');
    desc.style.cssText = 'font-size: 0.75rem; margin-bottom: 0.5rem;';
    desc.textContent = item.desc;

    const phrase = document.createElement('span');
    phrase.style.cssText = 'font-weight: 900; color: #5fd4ac; text-transform: uppercase; font-size: 0.875rem;';
    phrase.textContent = item.frase;

    overlay.append(desc, phrase);
    bubble.append(img, overlay);

    const title = document.createElement('h3');
    title.className = 'arquetipo-titulo';
    title.textContent = item.titulo;

    card.append(bubble, title);
    contenedorArquetipos.appendChild(card);
  });
}

const validarFormulario = () => {
  let isValid = true;

  if (inputNombre.value.trim().length < 2) {
    errorNombre.textContent = 'Ingresa un nombre válido (mín. 2 caracteres).';
    errorNombre.classList.remove('hidden');
    isValid = false;
  } else {
    errorNombre.classList.add('hidden');
  }

  if (inputMensaje.value.trim().length < 10) {
    errorMensaje.textContent = 'La narrativa debe ser más descriptiva (mín. 10 caracteres).';
    errorMensaje.classList.remove('hidden');
    isValid = false;
  } else {
    errorMensaje.classList.add('hidden');
  }

  return isValid;
};


const setCargando = (status) => {
  if (botonEnviar) botonEnviar.disabled = status;
  if (botonTexto) botonTexto.textContent = status ? 'Publicando...' : 'Publicar Narrativa';
  if (botonCargando) botonCargando.classList.toggle('hidden', !status);
};

if (formulario) {
  formulario.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    setCargando(true);
    const payload = {
      nombre: inputNombre.value.trim(),
      narrativa: inputMensaje.value.trim()
    };

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const body = await res.json();
      if (!res.ok) throw new Error(body.mensaje || 'Error en servidor');

      if (listaMensajes) {
        const nuevaCard = crearTarjetaMensaje(body.data);
        listaMensajes.prepend(nuevaCard);
      }

      formulario.reset();

      if (mensajeExito) {
        mensajeExito.classList.add('active');
        setTimeout(() => {
          mensajeExito.classList.remove('active');
        }, 3500);
      }

    } catch (err) {
      alert(`❌ ${err.message}`);
    } finally {
      setCargando(false);
    }
  });
}

const carruselCasos = document.getElementById('carrusel-casos');
const btnSliderPrev = document.getElementById('btn-prev');
const btnSliderNext = document.getElementById('btn-next');

if (carruselCasos && btnSliderPrev && btnSliderNext) {
  const step = 324;
  btnSliderPrev.addEventListener('click', () => carruselCasos.scrollBy({ left: -step, behavior: 'smooth' }));
  btnSliderNext.addEventListener('click', () => carruselCasos.scrollBy({ left: step, behavior: 'smooth' }));
}

renderArquetipos();
cargarNarrativas();
