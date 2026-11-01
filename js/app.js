/**
 * SGH - SISTEMA DE GESTIÓN HOTELERA | GRAND SGH LUXURY
 * Dashboard Ejecutivo del Gerente
 * 
 * Implementación de Casos de Uso del Diagrama UML de Gerente:
 * 1. Gestionar Reservas (<<include>> Auditar Reservas, <<extend>> Cancelar Reserva Manualmente)
 * 2. Gestionar Usuarios en Lista/Tabla (<<include>> Asignar Roles, <<extend>> Inhabilitar Usuario)
 * 3. Consultar / Generar Reporte (<<include>> Enviar Reporte, <<include>> Consultar Historial de Reportes)
 * 4. Soporte Responsive para Dispositivos Móviles y Escritorio
 */

// =============================================================================
// 1. ESTADO DE LA APLICACIÓN (DATOS REALISTAS DE ALTA CALIDAD)
// =============================================================================

const SGH_STATE = {
  activeTab: 'tab-overview',
  activeRoleFilter: 'ALL',
  
  // Reservas activas y en auditoría
  reservas: [
    {
      id: 'RES-8921',
      huesped: 'Conde Alessandro Vieri',
      email: 'a.vieri@florenceholding.it',
      telefono: '+39 055 918234',
      habitacion: '501 - Penthouse Imperial',
      categoria: 'Royal Master Suite',
      checkIn: '26 Oct 2026',
      checkOut: '31 Oct 2026',
      noches: 5,
      monto: 12500,
      estado: 'CHECK_IN', // CHECK_IN | CONFIRMADA | PENDIENTE_PAGO | CANCELADA
      estadoPago: 'PAGADO',
      metodoPago: 'Transferencia Amex Platinum Concierge',
      auditLog: [
        { fecha: '20 Oct 2026, 14:10', accion: 'Reserva creada vía Portal VIP Cliente' },
        { fecha: '20 Oct 2026, 14:15', accion: 'Pago de garantía completado ($12,500.00)' },
        { fecha: '26 Oct 2026, 12:30', accion: 'Suite inspeccionada y entregada con amenidades especiales' },
        { fecha: '26 Oct 2026, 13:45', accion: 'Check-in presencial validado con pasaporte diplomático' }
      ]
    },
    {
      id: 'RES-8922',
      huesped: 'Dra. Elena Rostova',
      email: 'elena.rostova@geneva-health.ch',
      telefono: '+41 22 710 4920',
      habitacion: '404 - Suite Embajador',
      categoria: 'Executive Corner Suite',
      checkIn: '27 Oct 2026',
      checkOut: '02 Nov 2026',
      noches: 6,
      monto: 7800,
      estado: 'CONFIRMADA',
      estadoPago: 'PAGADO',
      metodoPago: 'Tarjeta Corporativa Visa Signature',
      auditLog: [
        { fecha: '22 Oct 2026, 09:20', accion: 'Reserva confirmada con tarifa corporativa' },
        { fecha: '22 Oct 2026, 09:25', accion: 'Cobro verificado satisfactoriamente' }
      ]
    },
    {
      id: 'RES-8923',
      huesped: 'Arq. Santiago Bilbao & Familia',
      email: 'santiago@bilbaostudio.es',
      telefono: '+34 914 883 112',
      habitacion: '302 - Gran Terraza Jardín',
      categoria: 'Deluxe Family Suite',
      checkIn: '28 Oct 2026',
      checkOut: '01 Nov 2026',
      noches: 4,
      monto: 4400,
      estado: 'CONFIRMADA',
      estadoPago: 'PAGADO',
      metodoPago: 'Mastercard Black',
      auditLog: [
        { fecha: '24 Oct 2026, 18:02', accion: 'Reserva directa con solicitud de cuna y servicio de transfers' }
      ]
    },
    {
      id: 'RES-8924',
      huesped: 'Marcus Sterling',
      email: 'm.sterling@capital-partners.co.uk',
      telefono: '+44 20 7946 0912',
      habitacion: '205 - Vista al Lago',
      categoria: 'Premium King Room',
      checkIn: '29 Oct 2026',
      checkOut: '31 Oct 2026',
      noches: 2,
      monto: 1950,
      estado: 'PENDIENTE_PAGO',
      estadoPago: 'PENDIENTE',
      metodoPago: 'En espera de liquidación bancaria SWIFT',
      auditLog: [
        { fecha: '25 Oct 2026, 11:40', accion: 'Pre-reserva efectuada. Vencimiento de plazo en 24h' }
      ]
    },
    {
      id: 'RES-8925',
      huesped: 'Valentin Laurent',
      email: 'v.laurent@luxury-spirits.fr',
      telefono: '+33 1 42 68 55 00',
      habitacion: '410 - Suite Ejecutiva',
      categoria: 'Executive Corner Suite',
      checkIn: '30 Oct 2026',
      checkOut: '04 Nov 2026',
      noches: 5,
      monto: 6500,
      estado: 'CONFIRMADA',
      estadoPago: 'PAGADO',
      metodoPago: 'Amex Centurion',
      auditLog: [
        { fecha: '25 Oct 2026, 16:15', accion: 'Reserva asegurada con paquete gastronómico' }
      ]
    },
    {
      id: 'RES-8920',
      huesped: 'Kenji Takahashi',
      email: 'takahashi.k@tokyotech.jp',
      telefono: '+81 3 5555 0143',
      habitacion: '314 - Deluxe Superior',
      categoria: 'Deluxe Room',
      checkIn: '25 Oct 2026',
      checkOut: '28 Oct 2026',
      noches: 3,
      monto: 2700,
      estado: 'CANCELADA',
      estadoPago: 'REEMBOLSADO',
      metodoPago: 'Reembolso total gerencial ejecutado',
      auditLog: [
        { fecha: '23 Oct 2026, 10:00', accion: 'Reserva creada' },
        { fecha: '25 Oct 2026, 08:30', accion: 'Cancelación manual gerencial por reprogramación de vuelo' }
      ]
    }
  ],

  // Usuarios del sistema con roles SGH (Gerente, Cliente, Limpieza, Mantenimiento)
  usuarios: [
    {
      id: 'USR-001',
      nombre: 'Lic. Mateo González',
      email: 'mateo.gonzalez@grandsgh.com',
      rol: 'GERENTE',
      departamento: 'Dirección General & Operaciones',
      estado: 'ACTIVO',
      ultimoAcceso: 'Ahora mismo',
      iniciales: 'MG'
    },
    {
      id: 'USR-002',
      nombre: 'Clara Domínguez',
      email: 'c.dominguez@grandsgh.com',
      rol: 'GERENTE',
      departamento: 'Gerencia de Finanzas & Auditoría',
      estado: 'ACTIVO',
      ultimoAcceso: 'Hoy, 10:15',
      iniciales: 'CD'
    },
    {
      id: 'USR-003',
      nombre: 'Rosaura Mendez',
      email: 'r.mendez@grandsgh.com',
      rol: 'LIMPIEZA',
      departamento: 'Housekeeping Pisos 3 y 4',
      estado: 'ACTIVO',
      ultimoAcceso: 'Hoy, 13:20',
      iniciales: 'RM'
    },
    {
      id: 'USR-004',
      nombre: 'Carmen Peralta',
      email: 'carmen.p@grandsgh.com',
      rol: 'LIMPIEZA',
      departamento: 'Housekeeping Turno Matutino',
      estado: 'ACTIVO',
      ultimoAcceso: 'Hoy, 14:00',
      iniciales: 'CP'
    },
    {
      id: 'USR-005',
      nombre: 'Javier Morales',
      email: 'j.morales@grandsgh.com',
      rol: 'LIMPIEZA',
      departamento: 'Housekeeping Penthouse & Spa',
      estado: 'INHABILITADO',
      ultimoAcceso: 'Hace 3 días',
      iniciales: 'JM'
    },
    {
      id: 'USR-006',
      nombre: 'Ing. Roberto Benítez',
      email: 'r.benitez@grandsgh.com',
      rol: 'MANTENIMIENTO',
      departamento: 'Jefatura de Mantenimiento & Clima',
      estado: 'ACTIVO',
      ultimoAcceso: 'Hoy, 12:45',
      iniciales: 'RB'
    },
    {
      id: 'USR-007',
      nombre: 'Darío Navarro',
      email: 'd.navarro@grandsgh.com',
      rol: 'MANTENIMIENTO',
      departamento: 'Electromecánica & Bombas',
      estado: 'ACTIVO',
      ultimoAcceso: 'Hoy, 09:12',
      iniciales: 'DN'
    },
    {
      id: 'USR-008',
      nombre: 'Emilio Varela',
      email: 'e.varela@grandsgh.com',
      rol: 'MANTENIMIENTO',
      departamento: 'Servicios Edilicios',
      estado: 'ACTIVO',
      ultimoAcceso: 'Ayer, 18:30',
      iniciales: 'EV'
    },
    {
      id: 'USR-009',
      nombre: 'Sr. George H. Vance',
      email: 'g.vance@vanceholdings.com',
      rol: 'CLIENTE',
      departamento: 'Huésped Frecuente VIP',
      estado: 'ACTIVO',
      ultimoAcceso: '24 Oct 2026',
      iniciales: 'GV'
    },
    {
      id: 'USR-010',
      nombre: 'Madame Sophie Delacroix',
      email: 's.delacroix@parisart.fr',
      rol: 'CLIENTE',
      departamento: 'Membresía Presidencial',
      estado: 'ACTIVO',
      ultimoAcceso: '20 Oct 2026',
      iniciales: 'SD'
    }
  ],

  // Historial de reportes generados y enviados
  reportes: [
    {
      id: 'REP-2026-104',
      titulo: 'Auditoría Mensual de Ocupación & RevPAR',
      categoria: 'Ocupación & Reservas',
      fecha: '26 Oct 2026, 17:30',
      generadoPor: 'Lic. Mateo González',
      destinatarios: 'directorio@grandsgh.com',
      estadoEnvio: 'ENVIADO',
      resumen: 'Ocupación media del 88.4%. Mayor demanda en suites Penthouse y Master.'
    },
    {
      id: 'REP-2026-103',
      titulo: 'Consolidado Financiero Cierre Q3 & Proyección Q4',
      categoria: 'Financiero & Ingresos',
      fecha: '24 Oct 2026, 11:15',
      generadoPor: 'Clara Domínguez',
      destinatarios: 'auditoria@grandsgh.com',
      estadoEnvio: 'ENVIADO',
      resumen: 'Superávit operativo del 18.5% respecto a metas trimestrales.'
    },
    {
      id: 'REP-2026-102',
      titulo: 'Informe de Eficiencia Operativa Housekeeping & Tiempos',
      categoria: 'Operaciones & Limpieza',
      fecha: '21 Oct 2026, 16:40',
      generadoPor: 'Lic. Mateo González',
      destinatarios: 'operaciones@grandsgh.com',
      estadoEnvio: 'ENVIADO',
      resumen: 'Tiempo promedio de limpieza reducido a 24 minutos por habitación estándar.'
    },
    {
      id: 'REP-2026-101',
      titulo: 'Reporte Técnico de Mantenimiento de Climatización Central',
      categoria: 'Mantenimiento & Incidencias',
      fecha: '18 Oct 2026, 09:20',
      generadoPor: 'Lic. Mateo González',
      destinatarios: 'mantenimiento@grandsgh.com',
      estadoEnvio: 'ENVIADO',
      resumen: 'Certificación de calderas y chillers efectuada conforme a normativa.'
    }
  ]
};

// =============================================================================
// 2. INICIALIZACIÓN Y NAVEGACIÓN RESPONSIVE
// =============================================================================

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initMobileDrawer();
  renderAllViews();
  setupEventListeners();
});

function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const targetTab = link.getAttribute('data-tab');
      if (targetTab) {
        switchTab(targetTab);
        closeMobileSidebar();
      }
    });
  });
}

function initMobileDrawer() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const closeBtn = document.getElementById('sidebar-close-btn');
  const overlay = document.getElementById('sidebar-overlay');
  const sidebar = document.getElementById('sidebar');

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.add('mobile-open');
      overlay.classList.add('active');
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeMobileSidebar);
  }

  if (overlay) {
    overlay.addEventListener('click', closeMobileSidebar);
  }
}

function closeMobileSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  if (sidebar) sidebar.classList.remove('mobile-open');
  if (overlay) overlay.classList.remove('active');
}

function switchTab(tabId) {
  SGH_STATE.activeTab = tabId;

  // Actualizar sidebar links
  document.querySelectorAll('.nav-link').forEach(link => {
    if (link.getAttribute('data-tab') === tabId) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Mostrar tab correspondiente
  document.querySelectorAll('.tab-pane').forEach(pane => {
    pane.classList.remove('active');
  });

  const activePane = document.getElementById(tabId);
  if (activePane) {
    activePane.classList.add('active');
  }

  // Actualizar breadcrumbs y títulos
  const crumb = document.getElementById('current-crumb');
  const pageTitle = document.getElementById('page-title');

  switch (tabId) {
    case 'tab-overview':
      crumb.textContent = 'Resumen Ejecutivo';
      pageTitle.textContent = 'Panel de Control Gerencial';
      break;
    case 'tab-reservas':
      crumb.textContent = 'Gestionar Reservas';
      pageTitle.textContent = 'Auditoría & Control de Reservas';
      break;
    case 'tab-usuarios':
      crumb.textContent = 'Gestionar Usuarios';
      pageTitle.textContent = 'Lista de Usuarios & Asignación de Roles';
      break;
    case 'tab-reportes':
      crumb.textContent = 'Reportes & Auditoría';
      pageTitle.textContent = 'Generación & Historial de Reportes';
      break;
  }
}

// =============================================================================
// 3. RENDERIZADO DE VISTAS (CASOS DE USO)
// =============================================================================

function renderAllViews() {
  renderOverviewReservas();
  renderReservasTable(SGH_STATE.reservas);
  filterUsuariosByRole(SGH_STATE.activeRoleFilter);
  renderReportesTable(SGH_STATE.reportes);
  updateBadgesAndCounters();
}

/**
 * Actualiza badges en la navegación y tarjetas de métricas
 */
function updateBadgesAndCounters() {
  const activasCount = SGH_STATE.reservas.filter(r => r.estado !== 'CANCELADA').length;
  const badgeRes = document.getElementById('badge-active-reservas');
  if (badgeRes) badgeRes.textContent = activasCount;

  const statRes = document.getElementById('stat-total-reservas');
  if (statRes) statRes.textContent = activasCount;

  const statStaff = document.getElementById('stat-staff-count');
  if (statStaff) statStaff.textContent = SGH_STATE.usuarios.filter(u => u.rol !== 'CLIENTE' && u.estado === 'ACTIVO').length;

  const statRep = document.getElementById('stat-report-count');
  if (statRep) statRep.textContent = SGH_STATE.reportes.length;

  // Contadores de roles en la vista de lista de usuarios
  const cAll = document.getElementById('count-all-users');
  if (cAll) cAll.textContent = SGH_STATE.usuarios.length;
  const cGer = document.getElementById('count-gerentes');
  if (cGer) cGer.textContent = SGH_STATE.usuarios.filter(u => u.rol === 'GERENTE').length;
  const cLimp = document.getElementById('count-limpieza');
  if (cLimp) cLimp.textContent = SGH_STATE.usuarios.filter(u => u.rol === 'LIMPIEZA').length;
  const cMant = document.getElementById('count-mantenimiento');
  if (cMant) cMant.textContent = SGH_STATE.usuarios.filter(u => u.rol === 'MANTENIMIENTO').length;
  const cCli = document.getElementById('count-clientes');
  if (cCli) cCli.textContent = SGH_STATE.usuarios.filter(u => u.rol === 'CLIENTE').length;
}

/**
 * Renderiza tabla reducida para el Overview
 */
function renderOverviewReservas() {
  const container = document.getElementById('overview-reservas-body');
  if (!container) return;

  const topReservas = SGH_STATE.reservas.slice(0, 4);
  container.innerHTML = topReservas.map(r => `
    <tr>
      <td><strong style="color:var(--navy-900);">${r.id}</strong></td>
      <td>
        <div class="guest-cell">
          <div class="cell-meta">
            <span class="guest-name">${r.huesped}</span>
            <span style="font-size:0.75rem; color:var(--navy-700); font-weight:600;"><i class="ph-bold ph-bed"></i> ${r.habitacion}</span>
          </div>
        </div>
      </td>
      <td>
        <span style="font-size:0.82rem; color:var(--text-secondary); font-weight:500;">${r.checkIn} — ${r.checkOut}</span>
      </td>
      <td>${getStatusBadgeHtml(r.estado)}</td>
      <td class="text-right">
        <button class="btn-table-action" onclick="openAuditModal('${r.id}')" title="Auditar Reserva">
          <i class="ph-bold ph-magnifying-glass"></i> Auditar
        </button>
      </td>
    </tr>
  `).join('');
}

/**
 * Renderiza tabla completa de Gestión de Reservas
 * Casos de uso: Auditar Reservas (<<include>>), Cancelar Reserva Manualmente (<<extend>>)
 */
function renderReservasTable(reservasList) {
  const container = document.getElementById('reservas-table-body');
  const countIndicator = document.getElementById('reservas-count-indicator');
  if (!container) return;

  if (countIndicator) {
    countIndicator.textContent = `Mostrando ${reservasList.length} reservas registradas`;
  }

  if (reservasList.length === 0) {
    container.innerHTML = `
      <tr>
        <td colspan="7" style="text-align:center; padding: 2.5rem; color: var(--text-muted);">
          No se encontraron reservas con los criterios seleccionados.
        </td>
      </tr>
    `;
    return;
  }

  container.innerHTML = reservasList.map(r => `
    <tr>
      <td>
        <strong style="color: var(--navy-800);">${r.id}</strong>
      </td>
      <td>
        <div class="guest-cell">
          <div class="cell-meta">
            <span class="guest-name">${r.huesped}</span>
            <span class="guest-email">${r.email}</span>
          </div>
        </div>
      </td>
      <td>
        <span class="suite-badge"><i class="ph-bold ph-bed"></i> ${r.habitacion}</span>
        <span class="suite-type">${r.categoria}</span>
      </td>
      <td>
        <div style="display:flex; flex-direction:column;">
          <span style="font-weight: 600; color: var(--navy-900); font-size: 0.84rem;">${r.checkIn} — ${r.checkOut}</span>
          <small style="color: var(--text-muted);">${r.noches} noches</small>
        </div>
      </td>
      <td>
        <strong style="font-family: var(--font-serif); font-size: 1.05rem; color: var(--navy-900);">
          $${r.monto.toLocaleString()}
        </strong>
      </td>
      <td>
        <div style="display:inline-flex; flex-direction:column; gap:0.25rem;">
          ${getStatusBadgeHtml(r.estado)}
          <span style="font-size:0.72rem; font-weight:700; color: ${r.estadoPago === 'PAGADO' ? 'var(--status-success)' : r.estadoPago === 'REEMBOLSADO' ? 'var(--navy-600)' : 'var(--status-warning)'};">
            ● ${r.estadoPago}
          </span>
        </div>
      </td>
      <td class="text-right">
        <div style="display:inline-flex; gap: 0.35rem; justify-content: flex-end;">
          <button class="btn-table-action" onclick="openAuditModal('${r.id}')" title="Auditar Reserva">
            <i class="ph-bold ph-shield-check"></i> Auditar
          </button>
          ${r.estado !== 'CANCELADA' ? `
            <button class="btn-table-action danger" onclick="openCancelModal('${r.id}')" title="Cancelar Reserva Manualmente">
              <i class="ph-bold ph-x-circle"></i> Cancelar
            </button>
          ` : `
            <span style="font-size:0.75rem; color:var(--text-dim); padding:0.35rem 0.65rem;">Cancelada</span>
          `}
        </div>
      </td>
    </tr>
  `).join('');
}

/**
 * Renderiza la LISTA DE USUARIOS (EN TABLA / LIST VIEW PARA MONITOR)
 * Casos de uso: Asignar Roles (<<include>>), Inhabilitar Usuario (<<extend>>)
 */
function renderUsuariosList(usuariosList) {
  const container = document.getElementById('users-table-body');
  const countIndicator = document.getElementById('users-count-indicator');
  if (!container) return;

  if (countIndicator) {
    countIndicator.textContent = `Mostrando ${usuariosList.length} usuarios registrados en SGH`;
  }

  if (usuariosList.length === 0) {
    container.innerHTML = `
      <tr>
        <td colspan="7" style="text-align:center; padding: 2.5rem; color: var(--text-muted);">
          No hay usuarios bajo el filtro seleccionado.
        </td>
      </tr>
    `;
    return;
  }

  container.innerHTML = usuariosList.map(u => `
    <tr class="${u.estado === 'INHABILITADO' ? 'user-row-disabled' : ''}">
      <td>
        <strong style="color: var(--navy-800); font-size: 0.82rem;">${u.id}</strong>
      </td>
      <td>
        <div class="user-cell">
          <div class="cell-avatar">${u.iniciales}</div>
          <div class="cell-meta">
            <span class="cell-name">${u.nombre}</span>
            <span class="cell-sub">${u.email}</span>
          </div>
        </div>
      </td>
      <td>
        <div style="display:flex; flex-direction:column; gap:0.25rem;">
          <div>
            <span class="user-role-badge ${u.rol.toLowerCase()}">
              ${getRoleIcon(u.rol)} ${u.rol}
            </span>
          </div>
          <span style="font-size: 0.74rem; color: var(--text-muted); font-weight: 500;">
            ${u.departamento}
          </span>
        </div>
      </td>
      <td>
        <span class="status-pill ${u.estado === 'ACTIVO' ? 'active' : 'disabled'}">
          <i class="ph-bold ${u.estado === 'ACTIVO' ? 'ph-check-circle' : 'ph-prohibit'}"></i>
          ${u.estado}
        </span>
      </td>
      <td>
        <span style="font-size: 0.78rem; color: var(--text-muted);">${u.ultimoAcceso}</span>
      </td>
      <td class="text-right">
        <div style="display:inline-flex; gap: 0.35rem; justify-content: flex-end;">
          <!-- Caso de uso: Asignar Roles (<<include>>) -->
          <button class="btn-table-action" onclick="openRolesModal('${u.id}')" title="Asignar o Modificar Rol">
            <i class="ph-bold ph-shield-star"></i> Rol
          </button>
          <!-- Caso de uso: Inhabilitar Usuario (<<extend>>) -->
          <button class="btn-table-action ${u.estado === 'ACTIVO' ? 'danger' : ''}" onclick="toggleUserStatus('${u.id}')" title="${u.estado === 'ACTIVO' ? 'Inhabilitar acceso' : 'Reactivar acceso'}">
            ${u.estado === 'ACTIVO' 
              ? '<i class="ph-bold ph-prohibit"></i> Inhabilitar' 
              : '<i class="ph-bold ph-check-circle"></i> Reactivar'}
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

/**
 * Renderiza tabla de Reportes & Auditoría
 * Casos de uso: Consultar Historial de Reportes (<<include>>), Enviar Reporte (<<include>>)
 */
function renderReportesTable(reportesList) {
  const container = document.getElementById('reports-table-body');
  if (!container) return;

  if (reportesList.length === 0) {
    container.innerHTML = `
      <tr>
        <td colspan="7" style="text-align:center; padding: 2.5rem; color: var(--text-muted);">
          No hay reportes archivados.
        </td>
      </tr>
    `;
    return;
  }

  container.innerHTML = reportesList.map(rep => `
    <tr>
      <td><strong style="color:var(--navy-800);">${rep.id}</strong></td>
      <td>
        <strong style="color: var(--navy-900); font-size: 0.9rem;">${rep.titulo}</strong>
        <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.2rem;">${rep.resumen}</p>
      </td>
      <td>
        <span class="user-role-badge" style="background:var(--navy-50); color:var(--navy-800); border:1px solid var(--navy-200);">${rep.categoria}</span>
      </td>
      <td>${rep.fecha}</td>
      <td>${rep.generadoPor}</td>
      <td>
        <span class="status-pill active">
          <i class="ph-bold ph-paper-plane-tilt"></i> ${rep.estadoEnvio}
        </span>
        <div style="font-size: 0.7rem; color: var(--text-muted); margin-top: 0.2rem;">${rep.destinatarios}</div>
      </td>
      <td class="text-right">
        <button class="btn-table-action" onclick="downloadReportSimulated('${rep.id}')" title="Descargar PDF">
          <i class="ph-bold ph-download-simple"></i> PDF
        </button>
      </td>
    </tr>
  `).join('');
}

// Helpers de Badges e Iconos
function getStatusBadgeHtml(status) {
  switch (status) {
    case 'CHECK_IN':
      return `<span class="status-pill checkin"><i class="ph-bold ph-key"></i> En Estadía</span>`;
    case 'CONFIRMADA':
      return `<span class="status-pill confirmed"><i class="ph-bold ph-check"></i> Confirmada</span>`;
    case 'PENDIENTE_PAGO':
      return `<span class="status-pill pending"><i class="ph-bold ph-clock"></i> Pendiente Pago</span>`;
    case 'CANCELADA':
      return `<span class="status-pill cancelled"><i class="ph-bold ph-prohibit"></i> Cancelada</span>`;
    default:
      return `<span class="status-pill">${status}</span>`;
  }
}

function getRoleIcon(rol) {
  switch (rol) {
    case 'GERENTE': return '<i class="ph-bold ph-crown"></i>';
    case 'LIMPIEZA': return '<i class="ph-bold ph-sparkle"></i>';
    case 'MANTENIMIENTO': return '<i class="ph-bold ph-wrench"></i>';
    case 'CLIENTE': return '<i class="ph-bold ph-user"></i>';
    default: return '<i class="ph-bold ph-identification-badge"></i>';
  }
}

// =============================================================================
// 4. LÓGICA DE CASOS DE USO DE RESERVAS
// =============================================================================

/**
 * CASO DE USO: Auditar Reservas (<<include>> de Gestionar Reservas)
 */
function openAuditModal(reservaId) {
  const reserva = SGH_STATE.reservas.find(r => r.id === reservaId);
  if (!reserva) return;

  const modalBody = document.getElementById('audit-modal-body');
  modalBody.innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; margin-bottom: 1.5rem;">
      <div style="background: var(--bg-subtle); border: 1px solid var(--border-light); padding: 1.15rem; border-radius: var(--radius-md);">
        <h4 style="font-family: var(--font-serif); font-size: 1.15rem; color: var(--navy-900); margin-bottom: 0.75rem;">
          Expediente del Huésped
        </h4>
        <p style="font-size:0.86rem; color:var(--navy-900);"><strong>Nombre:</strong> ${reserva.huesped}</p>
        <p style="font-size:0.86rem; color:var(--text-secondary);"><strong>Email:</strong> ${reserva.email}</p>
        <p style="font-size:0.86rem; color:var(--text-secondary);"><strong>Teléfono:</strong> ${reserva.telefono}</p>
        <p style="font-size:0.86rem; color:var(--text-secondary); margin-top:0.4rem;"><strong>Suite Reservada:</strong> ${reserva.habitacion}</p>
        <p style="font-size:0.86rem; color:var(--text-secondary);"><strong>Categoría:</strong> ${reserva.categoria}</p>
      </div>

      <div style="background: var(--bg-subtle); border: 1px solid var(--border-light); padding: 1.15rem; border-radius: var(--radius-md);">
        <h4 style="font-family: var(--font-serif); font-size: 1.15rem; color: var(--navy-900); margin-bottom: 0.75rem;">
          Liquidación Financiera
        </h4>
        <p style="font-size:0.86rem; color:var(--navy-900);"><strong>Total Estancia:</strong> $${reserva.monto.toLocaleString()} USD</p>
        <p style="font-size:0.86rem; color:var(--text-secondary);"><strong>Duración:</strong> ${reserva.noches} noches (${reserva.checkIn} al ${reserva.checkOut})</p>
        <p style="font-size:0.86rem; color:var(--text-secondary);"><strong>Estado de Pago:</strong> <span style="color:var(--status-success); font-weight:700;">${reserva.estadoPago}</span></p>
        <p style="font-size:0.86rem; color:var(--text-secondary);"><strong>Pasarela/Método:</strong> ${reserva.metodoPago}</p>
      </div>
    </div>

    <div>
      <h4 style="font-family: var(--font-serif); font-size: 1.15rem; color: var(--navy-900); margin-bottom: 0.75rem;">
        Pista de Auditoría & Trazabilidad (Audit Trail)
      </h4>
      <div style="border-left: 2px solid var(--navy-700); padding-left: 1.25rem; display: flex; flex-direction: column; gap: 0.75rem;">
        ${reserva.auditLog.map(log => `
          <div style="position: relative;">
            <div style="position: absolute; left: -1.6rem; top: 0.2rem; width: 10px; height: 10px; border-radius: 50%; background: var(--navy-700);"></div>
            <div style="font-size: 0.72rem; color: var(--navy-700); font-weight: 700;">${log.fecha}</div>
            <div style="font-size: 0.84rem; color: var(--text-secondary);">${log.accion}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  openModal('modal-audit-reserva');
}

/**
 * CASO DE USO: Cancelar Reserva Manualmente (<<extend>> de Gestionar Reservas)
 */
function openCancelModal(reservaId) {
  const reserva = SGH_STATE.reservas.find(r => r.id === reservaId);
  if (!reserva) return;

  document.getElementById('cancel-reserva-id').value = reserva.id;
  const preview = document.getElementById('cancel-modal-preview');
  preview.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <div>
        <strong style="color: var(--navy-900); font-size: 1rem;">${reserva.huesped}</strong>
        <p style="font-size: 0.8rem; color: var(--text-muted);">${reserva.id} · ${reserva.habitacion}</p>
      </div>
      <div style="text-align: right;">
        <span style="font-family: var(--font-serif); font-size: 1.25rem; color: var(--navy-900); font-weight: 700;">
          $${reserva.monto.toLocaleString()}
        </span>
        <p style="font-size: 0.72rem; color: var(--text-muted);">${reserva.noches} noches</p>
      </div>
    </div>
  `;

  document.getElementById('cancel-reason').value = '';
  document.getElementById('cancel-notes').value = '';
  openModal('modal-cancel-reserva');
}

function submitCancelReserva(e) {
  e.preventDefault();
  const reservaId = document.getElementById('cancel-reserva-id').value;
  const reason = document.getElementById('cancel-reason').value;
  const notes = document.getElementById('cancel-notes').value;
  const isRefund = document.getElementById('cancel-refund-check').checked;

  const reserva = SGH_STATE.reservas.find(r => r.id === reservaId);
  if (!reserva) return;

  // Actualización de estado
  reserva.estado = 'CANCELADA';
  if (isRefund) {
    reserva.estadoPago = 'REEMBOLSADO';
  }
  
  const timestamp = new Date().toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' });
  reserva.auditLog.push({
    fecha: `${timestamp}`,
    accion: `Cancelación manual efectuada por Gerencia. Motivo: ${reason}. Detalle: ${notes} (Reembolso 100%: ${isRefund ? 'SÍ' : 'NO'})`
  });

  closeModal('modal-cancel-reserva');
  renderAllViews();
  showToast(`Reserva ${reserva.id} cancelada manualmente con éxito. Se registró en auditoría.`, 'danger');
}

// =============================================================================
// 5. LÓGICA DE CASOS DE USO DE USUARIOS (LISTA & ASIGNACIÓN DE ROLES)
// =============================================================================

/**
 * CASO DE USO: Asignar Roles (<<include>> de Gestionar Usuarios)
 */
function openRolesModal(userId) {
  const user = SGH_STATE.usuarios.find(u => u.id === userId);
  if (!user) return;

  document.getElementById('role-user-id').value = user.id;
  document.getElementById('roles-modal-user-preview').innerHTML = `
    <div style="display: flex; align-items: center; gap: 0.85rem; padding: 0.85rem; background: var(--bg-subtle); border-radius: var(--radius-md); border: 1px solid var(--border-light);">
      <div class="cell-avatar" style="width: 42px; height: 42px;">${user.iniciales}</div>
      <div>
        <h4 style="font-size: 0.95rem; color:var(--navy-900);">${user.nombre}</h4>
        <span style="font-size: 0.75rem; color: var(--text-muted);">${user.email} · Rol actual: <strong>${user.rol}</strong></span>
      </div>
    </div>
  `;

  // Marcar radio button actual
  const radios = document.getElementsByName('selected-role');
  radios.forEach(radio => {
    radio.checked = (radio.value === user.rol);
  });

  document.getElementById('role-department').value = user.departamento;
  openModal('modal-roles');
}

function submitAssignRole(e) {
  e.preventDefault();
  const userId = document.getElementById('role-user-id').value;
  const radios = document.getElementsByName('selected-role');
  let newRole = 'CLIENTE';
  for (const r of radios) {
    if (r.checked) newRole = r.value;
  }
  const department = document.getElementById('role-department').value;

  const user = SGH_STATE.usuarios.find(u => u.id === userId);
  if (!user) return;

  user.rol = newRole;
  user.departamento = department;

  closeModal('modal-roles');
  renderAllViews();
  showToast(`Rol actualizado: ${user.nombre} ahora posee el rol de ${newRole}.`);
}

/**
 * CASO DE USO: Inhabilitar Usuario (<<extend>> de Asignar Roles / Gestionar Usuarios)
 */
function toggleUserStatus(userId) {
  const user = SGH_STATE.usuarios.find(u => u.id === userId);
  if (!user) return;

  if (user.estado === 'ACTIVO') {
    user.estado = 'INHABILITADO';
    showToast(`Usuario ${user.nombre} inhabilitado para operar en el sistema.`, 'danger');
  } else {
    user.estado = 'ACTIVO';
    showToast(`Usuario ${user.nombre} reactivado exitosamente.`);
  }

  renderAllViews();
}

function filterUsuariosByRole(role) {
  SGH_STATE.activeRoleFilter = role;

  document.querySelectorAll('.role-filter-chip').forEach(chip => {
    chip.classList.toggle('active', chip.getAttribute('data-role') === role);
  });

  const query = (document.getElementById('user-search')?.value || '').toLowerCase().trim();

  let filtered = SGH_STATE.usuarios;
  if (role !== 'ALL') {
    filtered = filtered.filter(u => u.rol === role);
  }
  if (query) {
    filtered = filtered.filter(u => 
      u.nombre.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query) ||
      u.departamento.toLowerCase().includes(query) ||
      u.id.toLowerCase().includes(query)
    );
  }

  renderUsuariosList(filtered);
}

function searchUsuarios() {
  filterUsuariosByRole(SGH_STATE.activeRoleFilter);
}

// =============================================================================
// 6. LÓGICA DE CASOS DE USO DE REPORTES
// =============================================================================

/**
 * CASO DE USO: Consultar/Generar Reporte & Enviar Reporte
 */
function openReportModal(defaultTitle = '') {
  document.getElementById('rep-title').value = defaultTitle || 'Reporte Ejecutivo de Auditoría y Rendimiento';
  document.getElementById('rep-summary').value = '';
  openModal('modal-generate-report');
}

function quickGenerateReport(title) {
  openReportModal(title);
}

function submitGenerateReport(e) {
  e.preventDefault();
  const title = document.getElementById('rep-title').value;
  const category = document.getElementById('rep-category').value;
  const recipients = document.getElementById('rep-recipient').value;
  const summary = document.getElementById('rep-summary').value || 'Informe de control gerencial generado con éxito.';

  const newId = `REP-2026-${105 + SGH_STATE.reportes.length}`;
  const now = new Date();
  const fechaStr = `${now.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}, ${now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;

  const newReport = {
    id: newId,
    titulo: title,
    categoria: category,
    fecha: fechaStr,
    generadoPor: 'Lic. Mateo González (Gerente)',
    destinatarios: recipients,
    estadoEnvio: 'ENVIADO',
    resumen: summary
  };

  SGH_STATE.reportes.unshift(newReport);

  closeModal('modal-generate-report');
  renderAllViews();
  switchTab('tab-reportes');
  showToast(`Reporte ${newId} generado y distribuido formalmente por email.`);
}

function downloadReportSimulated(reportId) {
  const rep = SGH_STATE.reportes.find(r => r.id === reportId);
  if (!rep) return;
  showToast(`Descargando certificado oficial PDF de ${rep.id}...`);
}

// =============================================================================
// 7. BÚSQUEDAS Y FILTROS
// =============================================================================

function filterReservas() {
  const query = document.getElementById('reserva-search').value.toLowerCase().trim();
  const status = document.getElementById('reserva-status-filter').value;

  const filtered = SGH_STATE.reservas.filter(r => {
    const matchText = r.huesped.toLowerCase().includes(query) ||
                      r.id.toLowerCase().includes(query) ||
                      r.habitacion.toLowerCase().includes(query);
    const matchStatus = (status === 'ALL') || (r.estado === status);
    return matchText && matchStatus;
  });

  renderReservasTable(filtered);
}

function filterReports() {
  const query = document.getElementById('report-search').value.toLowerCase().trim();
  const filtered = SGH_STATE.reportes.filter(r => {
    return r.titulo.toLowerCase().includes(query) ||
           r.id.toLowerCase().includes(query) ||
           r.categoria.toLowerCase().includes(query);
  });
  renderReportesTable(filtered);
}

// =============================================================================
// 8. MODALES & UTILITARIOS
// =============================================================================

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('open');
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('open');
  }
}

function printAudit() {
  window.print();
}

function showToast(message, type = 'navy') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type === 'danger' ? 'danger' : ''}`;
  toast.innerHTML = `
    <i class="ph-bold ${type === 'danger' ? 'ph-warning-circle' : 'ph-check-circle'} toast-icon"></i>
    <span class="toast-message">${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 4200);
}

function setupEventListeners() {
  // Botón superior de nuevo reporte
  const btnQuickReport = document.getElementById('btn-quick-report');
  if (btnQuickReport) {
    btnQuickReport.addEventListener('click', () => openReportModal());
  }

  // Cerrar modales clickeando en el backdrop
  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        backdrop.classList.remove('open');
      }
    });
  });
}
