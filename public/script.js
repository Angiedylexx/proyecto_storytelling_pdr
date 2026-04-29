/**
 * ==========================================
 * PATRÓN OBSERVER (Sujeto Base)
 * ==========================================
 */
class Subject {
  constructor() {
    this.observers = [];
  }
  subscribe(observer) {
    this.observers.push(observer);
  }
  notify(data) {
    this.observers.forEach(obs => obs(data));
  }
}

/**
 * ==========================================
 * PATRÓN SINGLETON + OBSERVER (Cart Manager)
 * ==========================================
 */
class CartManager extends Subject {
  static instance;
  constructor() {
    if (CartManager.instance) return CartManager.instance;
    super();
    this.items = [];
    CartManager.instance = this;
  }

  addItem(product) {
    this.items.push(product);
    console.log(`[Singleton] Producto añadido: ${product.name}`);
    this.notify(this.items);
  }

  getCount() {
    return this.items.length;
  }
}

const cart = new CartManager();

/**
 * ==========================================
 * PATRÓN FACTORY (UI Factory)
 * ==========================================
 */
class UIFactory {
  static create(type, data) {
    switch (type) {
      case 'product':
        return this.createProductCard(data);
      case 'toast':
        return this.createToast(data);
      case 'narrative':
        return this.createNarrativeCard(data);
      default:
        throw new Error(`Tipo de componente no soportado: ${type}`);
    }
  }

  static createProductCard(product) {
    const card = document.createElement('article');
    card.className = 'product-card';
    const priceFormatted = new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(product.price);

    card.innerHTML = `
      <div class="product-img-wrapper">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        <span class="product-badge">${product.tag}</span>
      </div>
      <div class="product-info">
        <p class="product-price">${priceFormatted}</p>
        <h3 class="product-title">${product.name}</h3>
        <p class="product-desc">${product.desc}</p>
        <button class="btn btn-primary btn-add-cart" data-id="${product.id}">
          Añadir al Carrito
        </button>
      </div>
    `;
    card.querySelector('.btn-add-cart').addEventListener('click', () => {
      cart.addItem(product);
      UIFactory.create('toast', { 
        title: '¡Producto Añadido!', 
        message: `${product.name} está listo para tu historia.` 
      });
    });
    return card;
  }

  static createNarrativeCard(item) {
    const article = document.createElement('article');
    article.className = 'narrativa-item';
    article.innerHTML = `
      <div class="narrativa-avatar" aria-hidden="true">${item.nombre[0].toUpperCase()}</div>
      <div class="narrativa-content">
        <div class="narrativa-header">
          <p class="narrativa-author">${item.nombre}</p>
          <time class="narrativa-date">${item.fecha || ''}</time>
        </div>
        <p class="narrativa-text">${item.narrativa || ''}</p>
      </div>
    `;
    return article;
  }

  static createToast({ title, message, isError = false }) {
    const existing = document.getElementById('dynamic-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'dynamic-toast';
    toast.className = `toast-popup active ${isError ? 'toast-error' : ''}`;
    toast.innerHTML = `
      <span class="toast-icon">${isError ? '❌' : '✨'}</span>
      <h3 class="titulo-toast">${title}</h3>
      <p class="texto-toast">${message}</p>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.remove('active'), 3500);
    return toast;
  }
}

// ==========================================
// CONFIGURACIÓN Y ESTADO INICIAL
// ==========================================

const API_URL = '/api/comentarios';
const elements = {
  formulario: document.getElementById('frm-narrativa'),
  inputNombre: document.getElementById('inp-nombre'),
  inputMensaje: document.getElementById('inp-narrativa'),
  errorNombre: document.getElementById('err-nombre'),
  errorMensaje: document.getElementById('err-narrativa'),
  botonEnviar: document.getElementById('btn-enviar'),
  botonTexto: document.getElementById('btn-texto'),
  botonCargando: document.getElementById('btn-spinner'),
  listaMensajes: document.getElementById('lista-narrativas'),
  estadoCarga: document.getElementById('estado-carga'),
  botonMenu: document.getElementById('mobile-menu-btn'),
  menuPrincipal: document.getElementById('main-nav-list'),
  contenedorArquetipos: document.getElementById('arquetipos-grid'),
  contenedorTienda: document.getElementById('shop-grid'),
  cartCounter: document.getElementById('cart-count')
};

const productsData = [
  { id: 1, name: 'Saga del Héroe', price: 189900, tag: 'Más Vendido', desc: 'Kit de plantillas y arquetipos para marcas que buscan inspirar valentía.', image: 'https://images.unsplash.com/photo-1519791883288-dc8bd696e667?auto=format&fit=crop&q=80&w=400' },
  { id: 2, name: 'Oráculo del Sabio', price: 145000, tag: 'Novedad', desc: 'Herramientas analíticas para construir autoridad y confianza digital.', image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=400' },
  { id: 3, name: 'Manifiesto Rebelde', price: 120000, tag: 'Especial', desc: 'Guía de comunicación disruptiva para romper con lo establecido.', image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=400' }
];

const arquetiposData = [
  { id: 'hero', titulo: 'El Héroe', desc: 'El triunfo sobre el caos.', frase: 'Desafía tus límites', imagen: 'imagenes/arquetipos/heroe.png', alt: 'Hero' },
  { id: 'sage', titulo: 'El Sabio', desc: 'La claridad en la duda.', frase: 'El conocimiento te libera', imagen: 'imagenes/arquetipos/sabio.webp', alt: 'Sage' },
  { id: 'rebel', titulo: 'El Rebelde', desc: 'La ruptura con lo establecido.', frase: 'Cuestiona las reglas', imagen: 'imagenes/arquetipos/valiente.jpeg', alt: 'Rebel' },
  { id: 'creator', titulo: 'El Creativo', desc: 'La imaginación hecha realidad.', frase: 'Si puedes soñarlo, lo tienes', imagen: 'imagenes/arquetipos/creativo.avif', alt: 'Creator' }
];

// ==========================================
// INICIALIZACIÓN DE OBSERVADORES
// ==========================================

cart.subscribe((items) => {
  if (elements.cartCounter) {
    elements.cartCounter.textContent = items.length;
    elements.cartCounter.style.transform = 'scale(1.2)';
    setTimeout(() => elements.cartCounter.style.transform = 'scale(1)', 200);
  }
});

// ==========================================
// FUNCIONES DE CARGA Y RENDER
// ==========================================

async function cargarNarrativas() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const { data } = await response.json();
    if (elements.estadoCarga) elements.estadoCarga.remove();
    if (elements.listaMensajes) {
      data.forEach(item => {
        elements.listaMensajes.appendChild(UIFactory.create('narrative', item));
      });
    }
  } catch (err) {
    console.error('Error al cargar:', err);
    if (elements.estadoCarga) elements.estadoCarga.textContent = '⚠️ No se pudo conectar con la API.';
  }
}

function renderTienda() {
  if (!elements.contenedorTienda) return;
  productsData.forEach(p => {
    elements.contenedorTienda.appendChild(UIFactory.create('product', p));
  });
}

function renderArquetipos() {
  if (!elements.contenedorArquetipos) return;
  arquetiposData.forEach(item => {
    const card = document.createElement('div');
    card.className = 'arquetipo-card';
    card.innerHTML = `
      <div class="arquetipo-img-container">
        <img src="${item.imagen}" alt="${item.alt}" loading="lazy">
        <div class="arquetipo-overlay">
          <p style="font-size: 0.75rem; margin-bottom: 0.5rem;">${item.desc}</p>
          <span style="font-weight: 900; color: #5fd4ac; text-transform: uppercase; font-size: 0.875rem;">${item.frase}</span>
        </div>
      </div>
      <h3 class="arquetipo-titulo">${item.titulo}</h3>
    `;
    elements.contenedorArquetipos.appendChild(card);
  });
}

// ==========================================
// EVENT LISTENERS Y LÓGICA DE FORMULARIO
// ==========================================

if (elements.botonMenu && elements.menuPrincipal) {
  elements.botonMenu.addEventListener('click', () => {
    const isExpanded = elements.botonMenu.getAttribute('aria-expanded') === 'true';
    elements.botonMenu.setAttribute('aria-expanded', !isExpanded);
    elements.menuPrincipal.classList.toggle('hidden');
    elements.menuPrincipal.classList.toggle('active');
  });
}

const validarFormulario = () => {
  let isValid = true;
  if (elements.inputNombre.value.trim().length < 2) {
    elements.errorNombre.textContent = 'Ingresa un nombre válido.';
    elements.errorNombre.classList.remove('hidden');
    isValid = false;
  } else {
    elements.errorNombre.classList.add('hidden');
  }
  if (elements.inputMensaje.value.trim().length < 10) {
    elements.errorMensaje.textContent = 'Mínimo 10 caracteres.';
    elements.errorMensaje.classList.remove('hidden');
    isValid = false;
  } else {
    elements.errorMensaje.classList.add('hidden');
  }
  return isValid;
};

if (elements.formulario) {
  elements.formulario.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    elements.botonEnviar.disabled = true;
    elements.botonTexto.textContent = 'Publicando...';

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: elements.inputNombre.value.trim(),
          narrativa: elements.inputMensaje.value.trim()
        })
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.mensaje || 'Error');

      if (elements.listaMensajes) {
        elements.listaMensajes.prepend(UIFactory.create('narrative', body.data));
      }
      elements.formulario.reset();
      UIFactory.create('toast', { title: '¡Éxito!', message: 'Tu historia ha sido publicada.' });

    } catch (err) {
      UIFactory.create('toast', { title: 'Error', message: err.message, isError: true });
    } finally {
      elements.botonEnviar.disabled = false;
      elements.botonTexto.textContent = 'Publicar';
    }
  });
}

// Inicialización final
renderArquetipos();
renderTienda();
cargarNarrativas();
