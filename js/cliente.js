/**
 * SGH - SISTEMA DE GESTIÓN HOTELERA | PORTAL DEL CLIENTE VIP
 * Controlador de Casos de Uso del Cliente:
 * 1. Consultar Disponibilidad de Habitaciones
 * 2. Realizar Reserva (<<include>> Procesar Pago)
 * 3. Consultar Mis Reservas
 * 4. Cancelar Reserva (<<extend>> Mis Reservas)
 */

document.addEventListener('DOMContentLoaded', () => {
  initClientNavigation();
  initAvailabilitySearch();
  initBookingModal();
  renderSuitesCatalog(SGH_SUITES);
  renderMisReservas();
});

// =============================================================================
// CATÁLOGO DE SUITES DE LUJO (SGH RESIDENCES & SUITES)
// =============================================================================
const SGH_SUITES = [
  {
    id: 'STE-501',
    numero: '501',
    nombre: 'Penthouse Imperial',
    categoria: 'Royal Master Suite',
    precioNoche: 2500,
    imagen: 'img/suite_penthouse.jpg',
    capacidad: 4,
    superficie: '220 m²',
    cama: '1 King Size Imperial + 1 Queen',
    vista: 'Panorámica 360° al Lago y Ciudad',
    descripcion: 'La cúspide del refinamiento y privacidad. Chimenea de mármol italiano, terraza privada con jacuzzi exterior, servicio de mayordomo las 24 horas y ascensor de acceso directo.',
    disponible: true,
    badge: 'La Joya del Hotel'
  },
  {
    id: 'STE-404',
    numero: '404',
    nombre: 'Suite Embajador',
    categoria: 'Executive Corner Suite',
    precioNoche: 1300,
    imagen: 'img/suite_embajador.jpg',
    capacidad: 2,
    superficie: '135 m²',
    cama: '1 King Size Premium',
    vista: 'Vista Frontal al Lago y Bosque',
    descripcion: 'Diseñada para la máxima tranquilidad y distinción diplomática. Balcón panorámico con ventanales de suelo a techo, área de reuniones ejecutivas y cava de vinos privada.',
    disponible: true,
    badge: 'Favorita VIP'
  },
  {
    id: 'STE-302',
    numero: '302',
    nombre: 'Gran Terraza Jardín',
    categoria: 'Deluxe Family Suite',
    precioNoche: 1100,
    imagen: 'img/suite_embajador.jpg',
    capacidad: 5,
    superficie: '160 m²',
    cama: '2 King Size + 1 Sofá Cama',
    vista: 'Jardines Franceses Privados',
    descripcion: 'Espacios generosos y calidez residencial de ensueño. Salón comedor integrado, baño de mármol con doble lavabo y terraza con acceso exclusivo a los jardines del palacio.',
    disponible: true,
    badge: 'Familiar Exclusiva'
  },
  {
    id: 'STE-205',
    numero: '205',
    nombre: 'Vista al Lago Superior',
    categoria: 'Premium King Room',
    precioNoche: 975,
    imagen: 'img/suite_penthouse.jpg',
    capacidad: 2,
    superficie: '95 m²',
    cama: '1 King Size',
    vista: 'Atardecer sobre el Lago',
    descripcion: 'Intimidad y sobriedad ejecutiva. Bañera hidromasaje independiente, ropa de cama de algodón egipcio de 1000 hilos y sistema de iluminación bioadaptativa.',
    disponible: true,
    badge: 'Disponibilidad Inmediata'
  }
];

// =============================================================================
// ESTADO DEL CLIENTE (RESERVAS ACTIVAS Y SELECCIONADAS)
// =============================================================================
const SGH_CLIENTE_STATE = {
  activeSection: 'section-catalogo',
  selectedSuite: null,
  checkInDate: '2026-11-05',
  checkOutDate: '2026-11-10',
  huespedes: 2,
  
  // Reservas activas del cliente actual (Dra. Elena Rostova)
  misReservas: [
    {
      id: 'RES-8922',
      suiteId: 'STE-404',
      suiteNombre: 'Suite Embajador',
      categoria: 'Executive Corner Suite',
      imagen: 'img/suite_embajador.jpg',
      checkIn: '27 Oct 2026',
      checkOut: '02 Nov 2026',
      noches: 6,
      huespedes: 2,
      montoTotal: 7800,
      estado: 'CONFIRMADA', // CONFIRMADA | CANCELADA
      metodoPago: 'Visa Signature Platinum •••• 4920',
      fechaReserva: '22 Oct 2026, 09:25'
    }
  ]
};

/**
 * 1. Navegación entre Secciones del Cliente
 */
function initClientNavigation() {
  const navBtns = document.querySelectorAll('.client-nav-btn');
  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetSection = btn.getAttribute('data-target');
      if (targetSection) {
        switchClientSection(targetSection);
      }
    });
  });
}

function switchClientSection(sectionId) {
  SGH_CLIENTE_STATE.activeSection = sectionId;

  // Botones de navegación
  document.querySelectorAll('.client-nav-btn').forEach(b => {
    b.classList.toggle('active', b.getAttribute('data-target') === sectionId);
  });

  // Secciones
  document.querySelectorAll('.client-section').forEach(sec => {
    sec.classList.toggle('active', sec.id === sectionId);
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * 2. Motor de Búsqueda y Disponibilidad (CU: Consultar Disponibilidad)
 */
function initAvailabilitySearch() {
  const btnSearch = document.getElementById('btn-search-availability');
  const catFilter = document.getElementById('search-category');
  const guestsFilter = document.getElementById('search-guests');

  if (btnSearch) {
    btnSearch.addEventListener('click', () => {
      const selectedCat = catFilter.value;
      const selectedGuests = parseInt(guestsFilter.value) || 1;

      let filtered = SGH_SUITES;
      if (selectedCat !== 'ALL') {
        filtered = filtered.filter(s => s.categoria.toLowerCase().includes(selectedCat.toLowerCase()) || s.nombre.toLowerCase().includes(selectedCat.toLowerCase()));
      }

      filtered = filtered.filter(s => s.capacidad >= selectedGuests);

      renderSuitesCatalog(filtered);
      showClientToast(`Búsqueda actualizada: ${filtered.length} suites disponibles para sus fechas.`, 'info');
    });
  }
}

/**
 * Renderiza tarjetas de Suites en el Catálogo
 */
function renderSuitesCatalog(suitesList) {
  const container = document.getElementById('suites-catalog-grid');
  if (!container) return;

  if (suitesList.length === 0) {
    container.innerHTML = `
      <div style="grid-column: span 2; text-align: center; padding: 4rem 2rem; background: #ffffff; border-radius: var(--radius-lg); border: 1px dashed var(--border-medium);">
        <i class="ph-thin ph-calendar-x" style="font-size: 3.5rem; color: var(--navy-600); margin-bottom: 1rem; display: block;"></i>
        <h3 style="font-family: var(--font-serif); font-size: 1.8rem; color: var(--navy-900); margin-bottom: 0.5rem;">No se encontraron suites con esos criterios</h3>
        <p style="color: var(--text-muted); font-size: 0.9rem;">Pruebe ajustando el número de huéspedes o la categoría seleccionada.</p>
        <button class="btn-book-suite" style="margin-top: 1.5rem;" onclick="renderSuitesCatalog(SGH_SUITES)">
          <i class="ph ph-arrow-clockwise"></i> Restablecer Filtros
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = suitesList.map(suite => `
    <article class="suite-card">
      <div class="suite-card-image-wrap">
        <img src="${suite.imagen}" alt="${suite.nombre}" class="suite-card-image">
        <span class="suite-badge-floating ${suite.badge.includes('Joya') ? 'gold' : ''}">
          <i class="ph-bold ph-star"></i> ${suite.badge}
        </span>
        <div class="suite-price-pill">
          <span class="suite-price-val">$${suite.precioNoche.toLocaleString()}</span>
          <span class="suite-price-period">/ noche</span>
        </div>
      </div>

      <div class="suite-card-body">
        <div>
          <span style="font-size:0.75rem; font-weight:700; color:var(--accent-gold); text-transform:uppercase; letter-spacing:0.08em; display:block; margin-bottom:0.25rem;">
            SUITE ${suite.numero} · ${suite.categoria}
          </span>
          <h3 class="suite-title">${suite.nombre}</h3>
          <p class="suite-description">${suite.descripcion}</p>
        </div>

        <div>
          <div class="suite-amenities-strip">
            <div class="amenity-item" title="Superficie total">
              <i class="ph-bold ph-arrows-out"></i> ${suite.superficie}
            </div>
            <div class="amenity-item" title="Capacidad máxima de huéspedes">
              <i class="ph-bold ph-users"></i> Hasta ${suite.capacidad} Pers.
            </div>
            <div class="amenity-item" title="Cama de lujo">
              <i class="ph-bold ph-bed"></i> ${suite.cama.split('+')[0]}
            </div>
          </div>

          <div class="suite-card-footer">
            <div class="availability-indicator">
              <span class="dot-pulse"></span>
              <span>Confirmación Instantánea</span>
            </div>

            <button class="btn-book-suite" onclick="openBookingModal('${suite.id}')">
              <span>Reservar Suite</span>
              <i class="ph-bold ph-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    </article>
  `).join('');
}

/**
 * 3. Proceso de Reserva & Pago (CU: Realizar Reserva <<include>> Procesar Pago)
 */
function initBookingModal() {
  const modal = document.getElementById('booking-modal');
  const closeCross = document.getElementById('btn-close-booking-modal');
  const formBooking = document.getElementById('form-booking-checkout');

  if (closeCross && modal) {
    closeCross.addEventListener('click', () => modal.classList.remove('active'));
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  }

  // Listener para recalcular al cambiar fechas en el modal
  const checkInInput = document.getElementById('booking-checkin');
  const checkOutInput = document.getElementById('booking-checkout');
  if (checkInInput && checkOutInput) {
    checkInInput.addEventListener('change', updateBookingCalculations);
    checkOutInput.addEventListener('change', updateBookingCalculations);
  }

  // Métodos de pago
  document.querySelectorAll('.pay-card-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.pay-card-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
    });
  });

  // Envío del Checkout de Pago
  if (formBooking) {
    formBooking.addEventListener('submit', (e) => {
      e.preventDefault();
      processBookingPayment();
    });
  }
}

function openBookingModal(suiteId) {
  const suite = SGH_SUITES.find(s => s.id === suiteId);
  if (!suite) return;

  SGH_CLIENTE_STATE.selectedSuite = suite;

  // Actualizar datos de la suite en el modal
  document.getElementById('modal-suite-title').textContent = suite.nombre;
  document.getElementById('modal-suite-cat').textContent = `SUITE ${suite.numero} · ${suite.categoria}`;
  document.getElementById('modal-suite-img').src = suite.imagen;
  document.getElementById('modal-price-night').textContent = `$${suite.precioNoche.toLocaleString()}`;

  // Fechas por defecto (próximo fin de semana o 4 noches)
  const today = new Date();
  const dIn = new Date(today);
  dIn.setDate(today.getDate() + 5);
  const dOut = new Date(dIn);
  dOut.setDate(dIn.getDate() + 4);

  document.getElementById('booking-checkin').value = dIn.toISOString().split('T')[0];
  document.getElementById('booking-checkout').value = dOut.toISOString().split('T')[0];

  updateBookingCalculations();

  document.getElementById('booking-modal').classList.add('active');
}

function updateBookingCalculations() {
  const suite = SGH_CLIENTE_STATE.selectedSuite;
  if (!suite) return;

  const inVal = document.getElementById('booking-checkin').value;
  const outVal = document.getElementById('booking-checkout').value;

  const d1 = new Date(inVal);
  const d2 = new Date(outVal);
  let diffDays = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24));
  if (diffDays <= 0 || isNaN(diffDays)) diffDays = 1;

  const subtotal = suite.precioNoche * diffDays;
  const serviceFee = Math.round(subtotal * 0.10);
  const taxes = Math.round(subtotal * 0.08);
  const total = subtotal + serviceFee + taxes;

  document.getElementById('calc-nights-count').textContent = `${diffDays} noche${diffDays > 1 ? 's' : ''}`;
  document.getElementById('calc-subtotal-val').textContent = `$${subtotal.toLocaleString()}`;
  document.getElementById('calc-service-val').textContent = `$${serviceFee.toLocaleString()}`;
  document.getElementById('calc-tax-val').textContent = `$${taxes.toLocaleString()}`;
  document.getElementById('calc-total-val').textContent = `$${total.toLocaleString()}`;
  document.getElementById('btn-payment-amount').textContent = `$${total.toLocaleString()}`;
}

function processBookingPayment() {
  const suite = SGH_CLIENTE_STATE.selectedSuite;
  const inVal = document.getElementById('booking-checkin').value;
  const outVal = document.getElementById('booking-checkout').value;
  const btnSubmit = document.getElementById('btn-confirm-payment');

  const d1 = new Date(inVal);
  const d2 = new Date(outVal);
  let diffDays = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) diffDays = 1;

  const subtotal = suite.precioNoche * diffDays;
  const total = subtotal + Math.round(subtotal * 0.18);

  // Animación de procesamiento bancario
  btnSubmit.disabled = true;
  btnSubmit.innerHTML = '<i class="ph-bold ph-spinner animate-spin"></i> Procesando transacción segura...';

  setTimeout(() => {
    // Generar nueva reserva
    const newResCode = 'RES-' + Math.floor(1000 + Math.random() * 9000);
    const nuevaReserva = {
      id: newResCode,
      suiteId: suite.id,
      suiteNombre: suite.nombre,
      categoria: suite.categoria,
      imagen: suite.imagen,
      checkIn: formatDateHuman(inVal),
      checkOut: formatDateHuman(outVal),
      noches: diffDays,
      huespedes: parseInt(document.getElementById('booking-guests').value) || 2,
      montoTotal: total,
      estado: 'CONFIRMADA',
      metodoPago: 'Visa Signature Platinum •••• 4920',
      fechaReserva: 'Ahora mismo'
    };

    SGH_CLIENTE_STATE.misReservas.unshift(nuevaReserva);

    btnSubmit.disabled = false;
    btnSubmit.innerHTML = '<i class="ph-bold ph-shield-check"></i> <span>Confirmar y Garantizar Reserva</span>';

    // Cerrar modal
    document.getElementById('booking-modal').classList.remove('active');

    // Actualizar vista de Mis Reservas y saltar a ella
    renderMisReservas();
    switchClientSection('section-mis-reservas');

    showClientToast(`¡Reserva ${newResCode} confirmada exitosamente! Hemos generado su voucher oficial de estancia.`, 'success');
  }, 1300);
}

/**
 * 4. Panel de Mis Reservas (CU: Consultar Mis Reservas)
 */
function renderMisReservas() {
  const container = document.getElementById('client-reservas-list');
  const countBadge = document.getElementById('badge-mis-reservas');
  if (!container) return;

  const activas = SGH_CLIENTE_STATE.misReservas.filter(r => r.estado === 'CONFIRMADA');
  if (countBadge) countBadge.textContent = activas.length;

  if (SGH_CLIENTE_STATE.misReservas.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 4rem 2rem; background: #ffffff; border-radius: var(--radius-lg); border: 1px solid var(--border-light);">
        <i class="ph-thin ph-bookmarks" style="font-size: 3.5rem; color: var(--navy-500); margin-bottom: 1rem; display: block;"></i>
        <h3 style="font-family: var(--font-serif); font-size: 1.8rem; color: var(--navy-900); margin-bottom: 0.5rem;">Aún no tiene reservas registradas</h3>
        <p style="color: var(--text-muted); font-size: 0.9rem;">Explore nuestro catálogo de suites de alta gama y realice su primera estancia en Grand SGH.</p>
        <button class="btn-book-suite" style="margin-top: 1.5rem;" onclick="switchClientSection('section-catalogo')">
          <i class="ph ph-magnifying-glass"></i> Consultar Suites Disponibles
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = SGH_CLIENTE_STATE.misReservas.map(r => `
    <article class="client-reserva-card">
      <div class="reserva-photo-wrap">
        <img src="${r.imagen}" alt="${r.suiteNombre}" class="reserva-photo">
        <span class="reserva-photo-code">${r.id}</span>
      </div>

      <div class="reserva-details-wrap">
        <div>
          <div class="reserva-status-row">
            <span class="badge-reserva-state ${r.estado === 'CONFIRMADA' ? 'confirmed' : 'cancelled'}">
              <i class="ph-bold ${r.estado === 'CONFIRMADA' ? 'ph-check-circle' : 'ph-x-circle'}"></i>
              ${r.estado === 'CONFIRMADA' ? 'Reserva Garantizada & Confirmada' : 'Cancelación Efectuada'}
            </span>
            <span style="font-size:0.75rem; color:var(--text-muted);">
              Emitido: ${r.fechaReserva}
            </span>
          </div>

          <h3 class="reserva-suite-name">${r.suiteNombre}</h3>
          
          <div class="reserva-dates-info">
            <i class="ph-bold ph-calendar"></i>
            <span>${r.checkIn} — ${r.checkOut} (${r.noches} noches)</span>
          </div>

          <div class="reserva-specs-strip">
            <span><i class="ph-bold ph-bed"></i> ${r.categoria}</span>
            <span><i class="ph-bold ph-user-check"></i> Titular: Dra. Elena Rostova</span>
            <span><i class="ph-bold ph-credit-card"></i> ${r.metodoPago}</span>
          </div>
        </div>

        <div style="font-size: 0.76rem; color: var(--accent-gold); font-weight: 600; margin-top: 0.75rem;">
          <i class="ph-fill ph-check-circle"></i> Incluye desayuno gourmet a la suite y acceso preferencial al Spa SGH.
        </div>
      </div>

      <div class="reserva-actions-column">
        <div class="reserva-total-box">
          <div class="reserva-total-label">Importe Liquidado</div>
          <div class="reserva-total-val">$${r.montoTotal.toLocaleString()}</div>
        </div>

        <button class="btn-voucher-action" onclick="printVoucher('${r.id}')">
          <i class="ph-bold ph-file-text"></i>
          <span>Ficha / Voucher</span>
        </button>

        ${r.estado === 'CONFIRMADA' ? `
          <button class="btn-cancel-reservation" onclick="openCancelModal('${r.id}')">
            <i class="ph-bold ph-x"></i>
            <span>Cancelar Reserva</span>
          </button>
        ` : `
          <span style="font-size:0.75rem; color:var(--status-danger); font-weight:700;">
            Reembolso 100% aplicado
          </span>
        `}
      </div>
    </article>
  `).join('');
}

/**
 * 5. Cancelación de Reserva (CU: Cancelar Reserva)
 */
function openCancelModal(reservaId) {
  const reserva = SGH_CLIENTE_STATE.misReservas.find(r => r.id === reservaId);
  if (!reserva) return;

  const confirmCancel = confirm(
    `¿Desea solicitar la cancelación de la reserva ${reserva.id} (${reserva.suiteNombre})?\n\n` +
    `• Fechas: ${reserva.checkIn} a ${reserva.checkOut}\n` +
    `• Importe a reintegrar: $${reserva.montoTotal.toLocaleString()}\n` +
    `• Política SGH: Reembolso completo del 100% sin penalización.\n\n` +
    `Presione ACEPTAR para confirmar la anulación.`
  );

  if (confirmCancel) {
    reserva.estado = 'CANCELADA';
    renderMisReservas();
    showClientToast(`La reserva ${reserva.id} ha sido cancelada satisfactoriamente. Se procesó el reembolso de $${reserva.montoTotal.toLocaleString()} a su método de pago.`, 'warning');
  }
}

/**
 * Imprimir / Visualizar Voucher Digital
 */
function printVoucher(reservaId) {
  const r = SGH_CLIENTE_STATE.misReservas.find(item => item.id === reservaId);
  if (!r) return;
  alert(
    `========================================\n` +
    `GRAND SGH LUXURY RESIDENCES & HOTEL\n` +
    `COMPROBANTE OFICIAL DE RESERVA\n` +
    `========================================\n` +
    `CÓDIGO OFICIAL: ${r.id}\n` +
    `HUÉSPED TITULAR: Dra. Elena Rostova\n` +
    `SUITE ASIGNADA: ${r.suiteNombre} (${r.categoria})\n` +
    `CHECK-IN: ${r.checkIn} (15:00 hs)\n` +
    `CHECK-OUT: ${r.checkOut} (12:00 hs)\n` +
    `ESTADÍA: ${r.noches} noches\n` +
    `MONTO ABONADO: $${r.montoTotal.toLocaleString()} USD\n` +
    `ESTADO: ${r.estado}\n` +
    `ACCESO DIGITAL: Código QR VIP Generado\n` +
    `========================================`
  );
}

/**
 * Utilidades
 */
function formatDateHuman(dateStr) {
  const [y, m, d] = dateStr.split('-');
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  return `${d} ${months[parseInt(m) - 1]} ${y}`;
}

function showClientToast(message, type = 'info') {
  const existing = document.querySelector('.auth-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `auth-toast ${type}`;

  let iconName = 'ph-info';
  if (type === 'success') iconName = 'ph-check-circle';
  if (type === 'warning') iconName = 'ph-clock-countdown';
  if (type === 'error') iconName = 'ph-warning-circle';

  toast.innerHTML = `
    <i class="ph-bold ${iconName}" style="font-size:1.3rem;"></i>
    <div>${message}</div>
  `;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(15px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
