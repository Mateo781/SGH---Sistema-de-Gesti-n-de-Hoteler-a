/**
 * SGH - SISTEMA DE GESTIÓN HOTELERA | 620 SGH LUXURY
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
  activeSuiteStatusFilter: 'ALL',
  suitesViewMode: 'grid',
  currentManagerName: 'Lic. Mateo González',
  suiteAudits: {},
  activeAuditCriteria: {},
  
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
      metodoPago: 'Transferencia Amex Platinum',
      auditLog: [
        { fecha: '20 Oct 2026, 14:10', accion: 'Reserva creada vía Portal Cliente' },
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
      email: 'mateo.gonzalez@620sgh.com',
      rol: 'GERENTE',
      departamento: 'Dirección General & Operaciones',
      estado: 'ACTIVO',
      ultimoAcceso: 'Ahora mismo',
      iniciales: 'MG'
    },
    {
      id: 'USR-002',
      nombre: 'Clara Domínguez',
      email: 'c.dominguez@620sgh.com',
      rol: 'GERENTE',
      departamento: 'Gerencia de Finanzas & Auditoría',
      estado: 'ACTIVO',
      ultimoAcceso: 'Hoy, 10:15',
      iniciales: 'CD'
    },
    {
      id: 'USR-003',
      nombre: 'Rosaura Mendez',
      email: 'r.mendez@620sgh.com',
      rol: 'LIMPIEZA',
      departamento: 'Housekeeping Pisos 3 y 4',
      estado: 'ACTIVO',
      ultimoAcceso: 'Hoy, 13:20',
      iniciales: 'RM'
    },
    {
      id: 'USR-004',
      nombre: 'Carmen Peralta',
      email: 'carmen.p@620sgh.com',
      rol: 'LIMPIEZA',
      departamento: 'Housekeeping Turno Matutino',
      estado: 'ACTIVO',
      ultimoAcceso: 'Hoy, 14:00',
      iniciales: 'CP'
    },
    {
      id: 'USR-005',
      nombre: 'Javier Morales',
      email: 'j.morales@620sgh.com',
      rol: 'LIMPIEZA',
      departamento: 'Housekeeping Penthouse',
      estado: 'INHABILITADO',
      ultimoAcceso: 'Hace 3 días',
      iniciales: 'JM'
    },
    {
      id: 'USR-006',
      nombre: 'Ing. Roberto Benítez',
      email: 'r.benitez@620sgh.com',
      rol: 'MANTENIMIENTO',
      departamento: 'Jefatura de Mantenimiento & Clima',
      estado: 'ACTIVO',
      ultimoAcceso: 'Hoy, 12:45',
      iniciales: 'RB'
    },
    {
      id: 'USR-007',
      nombre: 'Darío Navarro',
      email: 'd.navarro@620sgh.com',
      rol: 'MANTENIMIENTO',
      departamento: 'Electromecánica & Bombas',
      estado: 'ACTIVO',
      ultimoAcceso: 'Hoy, 09:12',
      iniciales: 'DN'
    },
    {
      id: 'USR-008',
      nombre: 'Emilio Varela',
      email: 'e.varela@620sgh.com',
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
      departamento: 'Huésped Frecuente',
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
      destinatarios: 'directorio@620sgh.com',
      estadoEnvio: 'ENVIADO',
      resumen: 'Ocupación media del 88.4%. Mayor demanda en suites Penthouse y Master.'
    },
    {
      id: 'REP-2026-103',
      titulo: 'Consolidado Financiero Cierre Q3 & Proyección Q4',
      categoria: 'Financiero & Ingresos',
      fecha: '24 Oct 2026, 11:15',
      generadoPor: 'Clara Domínguez',
      destinatarios: 'auditoria@620sgh.com',
      estadoEnvio: 'ENVIADO',
      resumen: 'Superávit operativo del 18.5% respecto a metas trimestrales.'
    },
    {
      id: 'REP-2026-102',
      titulo: 'Informe de Eficiencia Operativa Housekeeping & Tiempos',
      categoria: 'Operaciones & Limpieza',
      fecha: '21 Oct 2026, 16:40',
      generadoPor: 'Lic. Mateo González',
      destinatarios: 'operaciones@620sgh.com',
      estadoEnvio: 'ENVIADO',
      resumen: 'Tiempo promedio de limpieza reducido a 24 minutos por habitación estándar.'
    },
    {
      id: 'REP-2026-101',
      titulo: 'Reporte Técnico de Mantenimiento de Climatización Central',
      categoria: 'Mantenimiento & Incidencias',
      fecha: '18 Oct 2026, 09:20',
      generadoPor: 'Lic. Mateo González',
      destinatarios: 'mantenimiento@620sgh.com',
      estadoEnvio: 'ENVIADO',
      resumen: 'Certificación de calderas y chillers efectuada conforme a normativa.'
    }
  ]
};

// =============================================================================
// 2. INICIALIZACIÓN Y NAVEGACIÓN RESPONSIVE
// =============================================================================

document.addEventListener('DOMContentLoaded', () => {
  if (window.SGH_DB) {
    const activeUser = SGH_DB.requireAuth(['GERENTE']);
    if (!activeUser) return;

    SGH_STATE.usuarios = SGH_DB.getUsers();
    SGH_STATE.currentManagerName = activeUser.nombre;
    const avatarEl = document.querySelector('.user-avatar');
    const nameEl = document.querySelector('.user-name');
    if (avatarEl) avatarEl.textContent = activeUser.iniciales;
    if (nameEl) nameEl.textContent = activeUser.nombre;

    const logoutBtn = document.querySelector('.user-logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => SGH_DB.logout());
    }
  }

  loadSuitesAuditState();
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
    case 'tab-suites':
      crumb.textContent = 'Auditar Suites';
      pageTitle.textContent = 'Auditoría Integral de Suites & Calidad';
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
  renderSuitesAudit();
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
  if (window.SGH_DB) {
    SGH_DB.updateUser(user.id, { rol: newRole, departamento: department });
  }

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

  if (window.SGH_DB) {
    SGH_DB.updateUser(user.id, { estado: user.estado });
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

// =============================================================================
// 9. AUDITORÍA DE SUITES (GERENCIA)
// =============================================================================

const SUITES_AUDIT_STORAGE_KEY = 'sgh_suite_audits_v1';
const HK_ROOMS_STORAGE_KEY = 'sgh_limpieza_rooms_v1';
const HK_LOGS_STORAGE_KEY = 'sgh_limpieza_logs_v1';
const MAINT_INCIDENTS_KEY = 'sgh_incidencias_db_v1';

const SUITE_AUDIT_CRITERIA = [
  {
    key: 'higiene',
    titulo: 'Higiene, Blancos y Presentación (Housekeeping)',
    detalle: 'Tendido 1000 hilos, desinfección de mármol, sanitarios y aromatización ambiental.'
  },
  {
    key: 'climatizacion',
    titulo: 'Climatización, Iluminación y Domótica',
    detalle: 'Fan-coil calibrado a 21°C, cortinas motorizadas y escenas LED operativas.'
  },
  {
    key: 'seguridad',
    titulo: 'Seguridad Electrónica y Accesos RFID',
    detalle: 'Cerradura RFID sincronizada, caja fuerte ejecutiva y detectores de humo.'
  },
  {
    key: 'amenidades',
    titulo: 'Amenidades VIP, Minibar y Cava',
    detalle: 'Reposición completa de cortesías, cristalería fina y sellos de garantía.'
  },
  {
    key: 'mobiliario',
    titulo: 'Integridad Edilicia, Grifería y Terraza',
    detalle: 'Mobiliario sin desgaste, ausencia de fugas y drenaje óptimo en hidromasaje.'
  }
];

const SUITES_CATALOG_SEED = [
  {
    id: 'STE-501',
    numero: '501',
    piso: 5,
    nombre: 'Penthouse Imperial',
    categoria: 'Royal Master Suite',
    precioNoche: 2500,
    capacidad: 4,
    superficie: '220 m²',
    cama: '1 King Size Imperial + 1 Queen',
    vista: 'Panorámica 360° al Lago y Ciudad',
    imagen: '../img/suite_penthouse.jpg',
    hkDefault: 'NO_MOLESTAR'
  },
  {
    id: 'STE-404',
    numero: '404',
    piso: 4,
    nombre: 'Suite Embajador',
    categoria: 'Executive Corner Suite',
    precioNoche: 1300,
    capacidad: 2,
    superficie: '135 m²',
    cama: '1 King Size Premium',
    vista: 'Vista Frontal al Lago y Bosque',
    imagen: '../img/suite_embajador.jpg',
    hkDefault: 'EN_LIMPIEZA'
  },
  {
    id: 'STE-410',
    numero: '410',
    piso: 4,
    nombre: 'Suite Ejecutiva',
    categoria: 'Executive Corner Suite',
    precioNoche: 1300,
    capacidad: 2,
    superficie: '130 m²',
    cama: '1 King Size Premium',
    vista: 'Vista Panorámica Ciudad',
    imagen: '../img/suite_embajador.jpg',
    hkDefault: 'LIMPIA'
  },
  {
    id: 'STE-302',
    numero: '302',
    piso: 3,
    nombre: 'Gran Terraza Jardín',
    categoria: 'Deluxe Family Suite',
    precioNoche: 1100,
    capacidad: 5,
    superficie: '160 m²',
    cama: '2 King Size + 1 Sofá Cama',
    vista: 'Jardines Franceses Privados',
    imagen: '../img/suite_embajador.jpg',
    hkDefault: 'LIMPIA'
  },
  {
    id: 'STE-304',
    numero: '304',
    piso: 3,
    nombre: 'Gran Terraza',
    categoria: 'Deluxe Family Suite',
    precioNoche: 1050,
    capacidad: 4,
    superficie: '145 m²',
    cama: '2 Queen Size',
    vista: 'Vista al Lago',
    imagen: '../img/suite_embajador.jpg',
    hkDefault: 'PENDIENTE'
  },
  {
    id: 'STE-314',
    numero: '314',
    piso: 3,
    nombre: 'Deluxe Superior',
    categoria: 'Deluxe Room',
    precioNoche: 900,
    capacidad: 2,
    superficie: '78 m²',
    cama: '1 King Size',
    vista: 'Jardín Interior',
    imagen: '../img/suite_penthouse.jpg',
    hkDefault: 'PENDIENTE'
  },
  {
    id: 'STE-205',
    numero: '205',
    piso: 2,
    nombre: 'Vista al Lago Superior',
    categoria: 'Premium King Room',
    precioNoche: 975,
    capacidad: 2,
    superficie: '95 m²',
    cama: '1 King Size',
    vista: 'Atardecer sobre el Lago',
    imagen: '../img/suite_penthouse.jpg',
    hkDefault: 'PENDIENTE'
  },
  {
    id: 'STE-101',
    numero: '101',
    piso: 1,
    nombre: 'Suite Jardín Planta Baja',
    categoria: 'Deluxe Room',
    precioNoche: 850,
    capacidad: 2,
    superficie: '75 m²',
    cama: '1 King Size',
    vista: 'Parque Central',
    imagen: '../img/suite_penthouse.jpg',
    hkDefault: 'LIMPIA'
  }
];

const DEFAULT_MAINT_SEED = [
  { id: 'INC-2041', habitacion: '304', titulo: 'Avería en Climatizador Chiller (Falta de enfriamiento)', prioridad: 'URGENTE', estado: 'PENDIENTE' },
  { id: 'INC-2042', habitacion: '404', titulo: 'Goteo en Grifería Termostática de Hidromasaje', prioridad: 'ALTA', estado: 'EN_CURSO' },
  { id: 'INC-2044', habitacion: '501', titulo: 'Bloqueo en Motor de Cortinas Blackout Panorámicas', prioridad: 'MEDIA', estado: 'PENDIENTE' }
];

function buildDefaultSuiteAudits() {
  return {
    'STE-501': {
      estado: 'PENDIENTE',
      puntaje: 80,
      precioNoche: 2500,
      checklist: { higiene: true, climatizacion: true, seguridad: true, amenidades: true, mobiliario: false },
      ultimaAuditoria: '25 Oct 2026, 11:00',
      auditor: 'Lic. Mateo González',
      notas: 'Pendiente revisión de motor de cortina blackout este antes de próximo turno.',
      historial: [
        { fecha: '25 Oct 2026, 11:00', auditor: 'Lic. Mateo González', estado: 'OBSERVADA', puntaje: 80, nota: 'Suite en estadía diplomática; revisar riel blackout.' }
      ]
    },
    'STE-404': {
      estado: 'OBSERVADA',
      puntaje: 80,
      precioNoche: 1300,
      checklist: { higiene: true, climatizacion: true, seguridad: true, amenidades: true, mobiliario: false },
      ultimaAuditoria: '26 Oct 2026, 17:15',
      auditor: 'Clara Domínguez',
      notas: 'Goteo reportado en grifería termostática de hidromasaje (INC-2042 en curso).',
      historial: [
        { fecha: '26 Oct 2026, 17:15', auditor: 'Clara Domínguez', estado: 'OBSERVADA', puntaje: 80, nota: 'Requiere cierre de incidencia INC-2042 antes del check-in.' }
      ]
    },
    'STE-410': {
      estado: 'APROBADA',
      puntaje: 100,
      precioNoche: 1300,
      checklist: { higiene: true, climatizacion: true, seguridad: true, amenidades: true, mobiliario: true },
      ultimaAuditoria: '26 Oct 2026, 12:40',
      auditor: 'Lic. Mateo González',
      notas: 'Cumplimiento integral 5/5. Habilitada para huéspedes VIP.',
      historial: [
        { fecha: '26 Oct 2026, 12:40', auditor: 'Lic. Mateo González', estado: 'APROBADA', puntaje: 100, nota: 'Checklist completo sin observaciones.' }
      ]
    },
    'STE-302': {
      estado: 'APROBADA',
      puntaje: 100,
      precioNoche: 1100,
      checklist: { higiene: true, climatizacion: true, seguridad: true, amenidades: true, mobiliario: true },
      ultimaAuditoria: '26 Oct 2026, 14:05',
      auditor: 'Lic. Mateo González',
      notas: 'Jacuzzi exterior verificado y blancos impecables.',
      historial: [
        { fecha: '26 Oct 2026, 14:05', auditor: 'Lic. Mateo González', estado: 'APROBADA', puntaje: 100, nota: 'Certificada tras reparación de drenaje INC-2039.' }
      ]
    },
    'STE-304': {
      estado: 'BLOQUEADA',
      puntaje: 60,
      precioNoche: 1050,
      checklist: { higiene: false, climatizacion: false, seguridad: true, amenidades: true, mobiliario: true },
      ultimaAuditoria: '26 Oct 2026, 17:45',
      auditor: 'Lic. Mateo González',
      notas: 'Bloqueada temporalmente por avería urgente en Chiller (INC-2041) y limpieza pendiente.',
      historial: [
        { fecha: '26 Oct 2026, 17:45', auditor: 'Lic. Mateo González', estado: 'BLOQUEADA', puntaje: 60, nota: 'Retirada de venta hasta reparación de fan-coil y repaso de limpieza.' }
      ]
    },
    'STE-314': {
      estado: 'PENDIENTE',
      puntaje: 80,
      precioNoche: 900,
      checklist: { higiene: false, climatizacion: true, seguridad: true, amenidades: true, mobiliario: true },
      ultimaAuditoria: '24 Oct 2026, 16:10',
      auditor: 'Clara Domínguez',
      notas: 'Pendiente inspección posterior al cambio de blancos por check-out reciente.',
      historial: [
        { fecha: '24 Oct 2026, 16:10', auditor: 'Clara Domínguez', estado: 'APROBADA', puntaje: 100, nota: 'Inspección previa aprobada.' }
      ]
    },
    'STE-205': {
      estado: 'PENDIENTE',
      puntaje: 80,
      precioNoche: 975,
      checklist: { higiene: false, climatizacion: true, seguridad: true, amenidades: true, mobiliario: true },
      ultimaAuditoria: '25 Oct 2026, 17:00',
      auditor: 'Lic. Mateo González',
      notas: 'Luminarias LED reparadas (INC-2038). Falta validación final de amenities.',
      historial: [
        { fecha: '25 Oct 2026, 17:00', auditor: 'Lic. Mateo González', estado: 'APROBADA', puntaje: 100, nota: 'Validación eléctrica completada.' }
      ]
    },
    'STE-101': {
      estado: 'PENDIENTE',
      puntaje: 100,
      precioNoche: 850,
      checklist: { higiene: true, climatizacion: true, seguridad: true, amenidades: true, mobiliario: true },
      ultimaAuditoria: '24 Oct 2026, 11:45',
      auditor: 'Clara Domínguez',
      notas: 'Cerradura RFID reprogramada sin novedades. Lista para re-certificación semanal.',
      historial: [
        { fecha: '24 Oct 2026, 11:45', auditor: 'Clara Domínguez', estado: 'APROBADA', puntaje: 100, nota: 'Acceso RFID verificado con llave maestra.' }
      ]
    }
  };
}

function loadSuitesAuditState() {
  try {
    const raw = localStorage.getItem(SUITES_AUDIT_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        SGH_STATE.suiteAudits = { ...buildDefaultSuiteAudits(), ...parsed };
        return;
      }
    }
  } catch (err) {
    // Fallback a semilla inicial
  }
  SGH_STATE.suiteAudits = buildDefaultSuiteAudits();
  saveSuitesAuditState();
}

function saveSuitesAuditState() {
  try {
    localStorage.setItem(SUITES_AUDIT_STORAGE_KEY, JSON.stringify(SGH_STATE.suiteAudits));
  } catch (err) {
    // Ignorar errores de cuota
  }
}

function readLocalJsonArray(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch (err) {
    return null;
  }
}

function getLiveMaintenanceMap() {
  const stored = readLocalJsonArray(MAINT_INCIDENTS_KEY);
  const merged = new Map();
  DEFAULT_MAINT_SEED.forEach(item => merged.set(item.id, item));
  if (stored) {
    stored.forEach(item => {
      if (item && item.id) merged.set(item.id, item);
    });
  }

  const byRoom = {};
  merged.forEach(inc => {
    if (inc.estado === 'RESUELTO') return;
    const roomNum = String(inc.habitacion || '').trim();
    if (!roomNum) return;
    if (!byRoom[roomNum]) byRoom[roomNum] = [];
    byRoom[roomNum].push(inc);
  });
  return byRoom;
}

function getLiveHousekeepingMap() {
  const stored = readLocalJsonArray(HK_ROOMS_STORAGE_KEY);
  const map = {};
  if (stored) {
    stored.forEach(r => {
      if (r && r.id) map[r.id] = r;
    });
  }
  return map;
}

function getEnrichedSuites() {
  const hkMap = getLiveHousekeepingMap();
  const maintMap = getLiveMaintenanceMap();

  return SUITES_CATALOG_SEED.map(suite => {
    const audit = SGH_STATE.suiteAudits[suite.id] || buildDefaultSuiteAudits()[suite.id];
    const hkRoom = hkMap[suite.id];
    const hkStatus = hkRoom ? hkRoom.estado : suite.hkDefault;
    const hkNota = hkRoom ? hkRoom.nota : '';

    const activeReserva = SGH_STATE.reservas.find(
      r => r.estado !== 'CANCELADA' && String(r.habitacion || '').startsWith(suite.numero)
    );

    const openIncidents = maintMap[suite.numero] || [];

    return {
      ...suite,
      precioNoche: Number(audit.precioNoche || suite.precioNoche),
      hkStatus,
      hkNota,
      openIncidents,
      activeReserva,
      audit
    };
  });
}

function getSuiteAuditStatusBadge(status) {
  switch (status) {
    case 'APROBADA':
      return `<span class="status-pill confirmed"><i class="ph-bold ph-seal-check"></i> Aprobada</span>`;
    case 'OBSERVADA':
      return `<span class="status-pill pending"><i class="ph-bold ph-warning"></i> Con Observaciones</span>`;
    case 'BLOQUEADA':
      return `<span class="status-pill cancelled"><i class="ph-bold ph-prohibit"></i> Bloqueada</span>`;
    case 'PENDIENTE':
    default:
      return `<span class="status-pill checkin"><i class="ph-bold ph-hourglass-medium"></i> Pendiente</span>`;
  }
}

function getHousekeepingLabel(hkStatus) {
  switch (hkStatus) {
    case 'LIMPIA':
      return { text: 'Limpia & Verificada', cls: 'ok', icon: 'ph-check-circle' };
    case 'EN_LIMPIEZA':
      return { text: 'En Limpieza', cls: 'warn', icon: 'ph-broom' };
    case 'NO_MOLESTAR':
      return { text: 'No Molestar', cls: 'warn', icon: 'ph-door' };
    case 'PENDIENTE':
    default:
      return { text: 'Pendiente de Aseo', cls: 'danger', icon: 'ph-clock' };
  }
}

function setSuitesViewMode(mode) {
  SGH_STATE.suitesViewMode = mode === 'table' ? 'table' : 'grid';
  document.getElementById('btn-suites-grid-view')?.classList.toggle('active', SGH_STATE.suitesViewMode === 'grid');
  document.getElementById('btn-suites-table-view')?.classList.toggle('active', SGH_STATE.suitesViewMode === 'table');
  renderSuitesAudit();
}

function filterSuitesByAuditStatus(status) {
  SGH_STATE.activeSuiteStatusFilter = status;
  document.querySelectorAll('.suite-filter-chip').forEach(chip => {
    chip.classList.toggle('active', chip.getAttribute('data-audit-status') === status);
  });
  renderSuitesAudit();
}

function filterSuitesAudit() {
  renderSuitesAudit();
}

function renderSuitesAudit() {
  const allSuites = getEnrichedSuites();
  updateSuiteAuditKPIs(allSuites);

  const query = (document.getElementById('suite-search')?.value || '').toLowerCase().trim();
  const floorFilter = document.getElementById('suite-floor-filter')?.value || 'ALL';
  const statusFilter = SGH_STATE.activeSuiteStatusFilter;

  const filtered = allSuites.filter(s => {
    const matchStatus = statusFilter === 'ALL' || s.audit.estado === statusFilter;
    const matchFloor = floorFilter === 'ALL' || String(s.piso) === floorFilter;
    const guestName = s.activeReserva ? s.activeReserva.huesped.toLowerCase() : '';
    const matchQuery =
      !query ||
      s.numero.toLowerCase().includes(query) ||
      s.nombre.toLowerCase().includes(query) ||
      s.categoria.toLowerCase().includes(query) ||
      guestName.includes(query);
    return matchStatus && matchFloor && matchQuery;
  });

  const gridEl = document.getElementById('suites-audit-grid');
  const tableWrap = document.getElementById('suites-audit-table-wrap');
  const tableBody = document.getElementById('suites-audit-table-body');
  if (!gridEl || !tableWrap || !tableBody) return;

  if (SGH_STATE.suitesViewMode === 'table') {
    gridEl.style.display = 'none';
    tableWrap.style.display = 'block';
    renderSuitesAuditTable(filtered, tableBody);
  } else {
    tableWrap.style.display = 'none';
    gridEl.style.display = 'grid';
    renderSuitesAuditGrid(filtered, gridEl);
  }
}

function updateSuiteAuditKPIs(suites) {
  const total = suites.length;
  const aprobadas = suites.filter(s => s.audit.estado === 'APROBADA').length;
  const pendientes = suites.filter(s => s.audit.estado === 'PENDIENTE').length;
  const observadas = suites.filter(s => s.audit.estado === 'OBSERVADA').length;
  const bloqueadas = suites.filter(s => s.audit.estado === 'BLOQUEADA').length;
  const avgScore = total
    ? Math.round(suites.reduce((acc, s) => acc + (s.audit.puntaje || 0), 0) / total)
    : 0;

  const setText = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  setText('kpi-suites-aprobadas', aprobadas);
  setText('kpi-suites-pendientes', pendientes);
  setText('kpi-suites-observadas', observadas + bloqueadas);
  setText('kpi-suites-score', `${avgScore}%`);

  setText('count-suites-all', total);
  setText('count-suites-pendiente', pendientes);
  setText('count-suites-aprobada', aprobadas);
  setText('count-suites-observada', observadas);
  setText('count-suites-bloqueada', bloqueadas);

  const navBadge = document.getElementById('badge-pending-suites');
  if (navBadge) {
    navBadge.textContent = pendientes + observadas + bloqueadas;
  }
}

function renderSuitesAuditGrid(suites, container) {
  if (suites.length === 0) {
    container.innerHTML = `
      <div class="panel-card" style="grid-column: 1 / -1; text-align: center; padding: 3rem 1.5rem;">
        <i class="ph-thin ph-buildings" style="font-size: 3rem; color: var(--text-dim); margin-bottom: 0.75rem; display: block;"></i>
        <h3 style="font-family: var(--font-serif); font-size: 1.5rem; color: var(--navy-900);">Sin suites coincidentes</h3>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.25rem;">Ajuste los filtros de piso, estado de auditoría o búsqueda.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = suites.map(s => {
    const hk = getHousekeepingLabel(s.hkStatus);
    const incCount = s.openIncidents.length;
    const maintInfo = incCount > 0
      ? { text: `${incCount} falla${incCount > 1 ? 's' : ''} activa${incCount > 1 ? 's' : ''}`, cls: 'danger', icon: 'ph-wrench' }
      : { text: 'Sin fallas activas', cls: 'ok', icon: 'ph-shield-check' };

    return `
      <article class="suite-audit-card status-${s.audit.estado.toLowerCase()}">
        <div class="suite-card-media">
          <img src="${s.imagen}" alt="${s.nombre}">
          <div class="suite-media-top">
            <span class="suite-number-pill">SUITE ${s.numero} · PISO ${s.piso}</span>
            ${getSuiteAuditStatusBadge(s.audit.estado)}
          </div>
          <div class="suite-media-bottom">
            <div>
              <div class="suite-media-title">${s.nombre}</div>
              <div class="suite-media-cat">${s.categoria} · ${s.superficie}</div>
            </div>
            <span class="suite-rate-tag">$${s.precioNoche.toLocaleString()} / noche</span>
          </div>
        </div>

        <div class="suite-card-body">
          <div class="suite-guest-strip">
            ${s.activeReserva
              ? `<span><i class="ph-bold ph-user-check"></i> <strong>${s.activeReserva.huesped}</strong></span>
                 <span style="font-size:0.7rem; font-weight:700; color:var(--navy-700);">${s.activeReserva.estado === 'CHECK_IN' ? 'En Estadía' : 'Reservada'}</span>`
              : `<span><i class="ph ph-key"></i> Inventario disponible</span>
                 <span style="font-size:0.7rem; color:var(--text-muted);">Cap. ${s.capacidad} pers.</span>`
            }
          </div>

          <div class="suite-sync-row">
            <div class="suite-sync-box">
              <span class="suite-sync-label">Housekeeping</span>
              <span class="suite-sync-value ${hk.cls}">
                <i class="ph-bold ${hk.icon}"></i> ${hk.text}
              </span>
            </div>
            <div class="suite-sync-box">
              <span class="suite-sync-label">Mantenimiento</span>
              <span class="suite-sync-value ${maintInfo.cls}">
                <i class="ph-bold ${maintInfo.icon}"></i> ${maintInfo.text}
              </span>
            </div>
          </div>

          <div class="suite-score-row">
            <div class="suite-score-head">
              <span>Cumplimiento Checklist</span>
              <strong style="color:var(--navy-900);">${s.audit.puntaje}%</strong>
            </div>
            <div class="progress-bar-wrap" style="margin-top:0;">
              <div class="progress-bar-fill" style="width:${s.audit.puntaje}%;"></div>
            </div>
          </div>

          <p style="font-size:0.78rem; color:var(--text-secondary); line-height:1.45;">
            ${s.audit.notas}
          </p>
        </div>

        <div class="suite-card-footer">
          <div class="suite-last-audit">
            <div>Última: <strong>${s.audit.ultimaAuditoria}</strong></div>
            <div>Por: ${s.audit.auditor}</div>
          </div>
          <button type="button" class="btn-primary-action" style="padding:0.48rem 0.9rem; font-size:0.78rem;" onclick="openSuiteAuditModal('${s.id}')">
            <i class="ph-bold ph-clipboard-text"></i> Auditar
          </button>
        </div>
      </article>
    `;
  }).join('');
}

function renderSuitesAuditTable(suites, tbody) {
  if (suites.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align:center; padding: 2.5rem; color: var(--text-muted);">
          No se encontraron suites con los filtros seleccionados.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = suites.map(s => {
    const hk = getHousekeepingLabel(s.hkStatus);
    const incCount = s.openIncidents.length;
    return `
      <tr>
        <td>
          <div style="display:flex; flex-direction:column;">
            <strong style="color:var(--navy-900);">Suite ${s.numero} · ${s.nombre}</strong>
            <span style="font-size:0.74rem; color:var(--text-muted);">Piso ${s.piso} · ${s.superficie}</span>
          </div>
        </td>
        <td>
          <div style="display:flex; flex-direction:column;">
            <span style="font-weight:600; color:var(--navy-800);">${s.categoria}</span>
            <span style="font-size:0.75rem; color:var(--text-muted);">$${s.precioNoche.toLocaleString()} USD / noche</span>
          </div>
        </td>
        <td>
          ${s.activeReserva
            ? `<span style="font-weight:600; color:var(--navy-900); font-size:0.8rem;">${s.activeReserva.huesped}</span>
               <span style="display:block; font-size:0.72rem; color:var(--text-muted);">${s.activeReserva.id}</span>`
            : `<span style="font-size:0.78rem; color:var(--text-muted);">Sin huésped asignado</span>`
          }
        </td>
        <td>
          <div style="display:flex; flex-direction:column; gap:0.2rem;">
            <span class="suite-sync-value ${hk.cls}"><i class="ph-bold ${hk.icon}"></i> ${hk.text}</span>
            <span class="suite-sync-value ${incCount > 0 ? 'danger' : 'ok'}">
              <i class="ph-bold ${incCount > 0 ? 'ph-wrench' : 'ph-shield-check'}"></i>
              ${incCount > 0 ? `${incCount} incidencia(s)` : 'Sin averías'}
            </span>
          </div>
        </td>
        <td>
          <strong style="font-family:var(--font-serif); font-size:1.05rem; color:var(--navy-900);">${s.audit.puntaje}%</strong>
        </td>
        <td>${getSuiteAuditStatusBadge(s.audit.estado)}</td>
        <td class="text-right">
          <button class="btn-table-action" onclick="openSuiteAuditModal('${s.id}')">
            <i class="ph-bold ph-clipboard-text"></i> Auditar
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function openSuiteAuditModal(suiteId) {
  const suite = getEnrichedSuites().find(s => s.id === suiteId);
  if (!suite) return;

  SGH_STATE.activeAuditCriteria = { ...(suite.audit.checklist || {}) };

  const titleEl = document.getElementById('suite-audit-modal-title');
  const subtitleEl = document.getElementById('suite-audit-modal-subtitle');
  const bodyEl = document.getElementById('suite-audit-modal-body');
  if (!bodyEl) return;

  if (titleEl) titleEl.textContent = `Auditoría — Suite ${suite.numero}: ${suite.nombre}`;
  if (subtitleEl) subtitleEl.textContent = `${suite.categoria} · Piso ${suite.piso} · ${suite.superficie}`;

  const hk = getHousekeepingLabel(suite.hkStatus);
  const activeIncidentsHtml = suite.openIncidents.length > 0
    ? suite.openIncidents.map(inc => `
        <div style="font-size:0.78rem; padding:0.45rem 0.65rem; background:var(--status-danger-bg); border:1px solid var(--status-danger-border); border-radius:var(--radius-sm); color:var(--status-danger); margin-top:0.35rem;">
          <strong>${inc.id} (${inc.prioridad}):</strong> ${inc.titulo}
        </div>
      `).join('')
    : `<div style="font-size:0.78rem; color:var(--status-success); font-weight:600; margin-top:0.25rem;"><i class="ph-bold ph-check-circle"></i> Sin incidencias técnicas abiertas en Mantenimiento.</div>`;

  const scorePct = calculateChecklistScore(SGH_STATE.activeAuditCriteria);

  bodyEl.innerHTML = `
    <div class="suite-audit-hero">
      <img src="${suite.imagen}" alt="${suite.nombre}" class="suite-audit-thumb">
      <div>
        <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:0.5rem; flex-wrap:wrap;">
          <div>
            <h4 style="font-family:var(--font-serif); font-size:1.35rem; color:var(--navy-900); line-height:1.15;">
              Suite ${suite.numero} · ${suite.nombre}
            </h4>
            <p style="font-size:0.8rem; color:var(--text-muted); margin-top:0.2rem;">Vista: ${suite.vista}</p>
          </div>
          ${getSuiteAuditStatusBadge(suite.audit.estado)}
        </div>

        <div class="suite-audit-specs">
          <span class="suite-spec-tag"><i class="ph-bold ph-arrows-out"></i> ${suite.superficie}</span>
          <span class="suite-spec-tag"><i class="ph-bold ph-users"></i> Hasta ${suite.capacidad} pers.</span>
          <span class="suite-spec-tag"><i class="ph-bold ph-bed"></i> ${suite.cama}</span>
          <span class="suite-spec-tag"><i class="ph-bold ph-sparkle"></i> Housekeeping: ${hk.text}</span>
        </div>

        ${suite.activeReserva ? `
          <div style="margin-top:0.65rem; font-size:0.8rem; color:var(--navy-900); background:var(--bg-surface); border:1px solid var(--border-light); padding:0.45rem 0.7rem; border-radius:var(--radius-sm);">
            <strong>Huésped vinculado (${suite.activeReserva.id}):</strong> ${suite.activeReserva.huesped} · ${suite.activeReserva.checkIn} al ${suite.activeReserva.checkOut}
          </div>
        ` : ''}

        ${activeIncidentsHtml}
      </div>
    </div>

    <form id="form-suite-audit" onsubmit="submitSuiteAudit(event, '${suite.id}')">
      <div class="audit-score-banner">
        <div>
          <div style="font-size:0.72rem; text-transform:uppercase; letter-spacing:0.1em; color:#93c5fd; font-weight:700;">
            Puntaje de Inspección en Curso
          </div>
          <div style="font-size:0.84rem; color:#e2e8f0;">
            Marque los criterios verificados presencialmente en la suite
          </div>
        </div>
        <div style="text-align:right;">
          <div class="audit-score-num" id="live-audit-score">${scorePct}%</div>
          <div style="font-size:0.72rem; color:#93c5fd;" id="live-audit-fraction">
            ${countCheckedCriteria(SGH_STATE.activeAuditCriteria)} / ${SUITE_AUDIT_CRITERIA.length} criterios
          </div>
        </div>
      </div>

      <div class="audit-checklist-grid" id="suite-audit-checklist">
        ${SUITE_AUDIT_CRITERIA.map(item => {
          const checked = Boolean(SGH_STATE.activeAuditCriteria[item.key]);
          return `
            <label class="audit-check-item ${checked ? 'checked' : ''}" id="check-card-${item.key}">
              <div class="audit-check-left">
                <input type="checkbox" ${checked ? 'checked' : ''} onchange="toggleSuiteCriterion('${item.key}', this.checked)">
                <div>
                  <div style="font-size:0.86rem; font-weight:700; color:var(--navy-900);">${item.titulo}</div>
                  <div style="font-size:0.75rem; color:var(--text-muted);">${item.detalle}</div>
                </div>
              </div>
              <span style="font-size:0.72rem; font-weight:700; color:${checked ? 'var(--status-success)' : 'var(--text-muted)'}; white-space:nowrap;" id="check-status-${item.key}">
                ${checked ? 'CONFORME' : 'PENDIENTE'}
              </span>
            </label>
          `;
        }).join('')}
      </div>

      <div class="form-row">
        <div class="form-group col-half">
          <label class="form-label" for="audit-suite-rate">Tarifa Auditada (USD / noche)</label>
          <input type="number" class="form-control" id="audit-suite-rate" min="100" step="25" value="${suite.precioNoche}" required>
        </div>
        <div class="form-group col-half">
          <label class="form-label">Auditor Responsable</label>
          <input type="text" class="form-control" value="${SGH_STATE.currentManagerName}" readonly style="background:var(--bg-subtle);">
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Dictamen Gerencial de la Suite *</label>
        <div class="audit-verdict-grid">
          <label class="verdict-option">
            <input type="radio" name="suite-verdict" value="APROBADA" ${suite.audit.estado === 'APROBADA' || suite.audit.estado === 'PENDIENTE' ? 'checked' : ''}>
            <div class="verdict-card aprobada">
              <div style="font-weight:700; font-size:0.85rem; color:var(--status-success);"><i class="ph-bold ph-seal-check"></i> Aprobada</div>
              <div style="font-size:0.72rem; color:var(--text-muted); margin-top:0.2rem;">Cumple estándares 620 SGH. Habilitada para ocupación.</div>
            </div>
          </label>
          <label class="verdict-option">
            <input type="radio" name="suite-verdict" value="OBSERVADA" ${suite.audit.estado === 'OBSERVADA' ? 'checked' : ''}>
            <div class="verdict-card observada">
              <div style="font-weight:700; font-size:0.85rem; color:var(--status-warning);"><i class="ph-bold ph-warning"></i> Con Observaciones</div>
              <div style="font-size:0.72rem; color:var(--text-muted); margin-top:0.2rem;">Requiere repaso operativo menor antes de check-in.</div>
            </div>
          </label>
          <label class="verdict-option">
            <input type="radio" name="suite-verdict" value="BLOQUEADA" ${suite.audit.estado === 'BLOQUEADA' ? 'checked' : ''}>
            <div class="verdict-card bloqueada">
              <div style="font-weight:700; font-size:0.85rem; color:var(--status-danger);"><i class="ph-bold ph-prohibit"></i> Bloqueada</div>
              <div style="font-size:0.72rem; color:var(--text-muted); margin-top:0.2rem;">Fuera de servicio hasta resolución técnica o de aseo.</div>
            </div>
          </label>
        </div>
      </div>

      <div class="audit-dispatch-box">
        <div style="font-size:0.74rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:var(--navy-800);">
          <i class="ph-bold ph-arrows-split"></i> Acciones Coordinadas con Equipos SGH (Opcional)
        </div>
        <label class="checkbox-label">
          <input type="checkbox" id="audit-send-cleaning">
          <span>Solicitar repaso inmediato a <strong>Personal de Limpieza</strong> (sincroniza portal Limpieza)</span>
        </label>
        <label class="checkbox-label">
          <input type="checkbox" id="audit-send-maintenance">
          <span>Generar orden de avería para <strong>Mantenimiento Técnico</strong> (sincroniza portal Mantenimiento)</span>
        </label>
      </div>

      <div class="form-group">
        <label class="form-label" for="audit-suite-notes">Observaciones & Hallazgos de Auditoría *</label>
        <textarea class="form-control" id="audit-suite-notes" rows="3" required placeholder="Detalle hallazgos, conformidad de equipamiento o instrucciones al equipo...">${suite.audit.notas || ''}</textarea>
      </div>
    </form>

    <div style="margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid var(--border-light);">
      <h4 style="font-family:var(--font-serif); font-size:1.1rem; color:var(--navy-900); margin-bottom:0.5rem;">
        Historial de Auditorías de la Suite
      </h4>
      <div class="audit-timeline">
        ${(suite.audit.historial || []).map(h => `
          <div class="audit-timeline-item">
            <div class="audit-timeline-dot"></div>
            <div style="font-size:0.72rem; font-weight:700; color:var(--navy-700);">
              ${h.fecha} · ${h.auditor} · ${h.estado} (${h.puntaje}%)
            </div>
            <div style="font-size:0.82rem; color:var(--text-secondary);">${h.nota}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  openModal('modal-audit-suite');
}

function countCheckedCriteria(criteriaObj) {
  return SUITE_AUDIT_CRITERIA.filter(c => Boolean(criteriaObj[c.key])).length;
}

function calculateChecklistScore(criteriaObj) {
  const checked = countCheckedCriteria(criteriaObj);
  return Math.round((checked / SUITE_AUDIT_CRITERIA.length) * 100);
}

function toggleSuiteCriterion(key, isChecked) {
  SGH_STATE.activeAuditCriteria[key] = Boolean(isChecked);

  const card = document.getElementById(`check-card-${key}`);
  const statusEl = document.getElementById(`check-status-${key}`);
  if (card) card.classList.toggle('checked', isChecked);
  if (statusEl) {
    statusEl.textContent = isChecked ? 'CONFORME' : 'PENDIENTE';
    statusEl.style.color = isChecked ? 'var(--status-success)' : 'var(--text-muted)';
  }

  const scoreEl = document.getElementById('live-audit-score');
  const fracEl = document.getElementById('live-audit-fraction');
  if (scoreEl) scoreEl.textContent = `${calculateChecklistScore(SGH_STATE.activeAuditCriteria)}%`;
  if (fracEl) fracEl.textContent = `${countCheckedCriteria(SGH_STATE.activeAuditCriteria)} / ${SUITE_AUDIT_CRITERIA.length} criterios`;
}

function submitSuiteAudit(e, suiteId) {
  e.preventDefault();
  const suite = SUITES_CATALOG_SEED.find(s => s.id === suiteId);
  if (!suite) return;

  const verdictEl = document.querySelector('input[name="suite-verdict"]:checked');
  const verdict = verdictEl ? verdictEl.value : 'APROBADA';
  const notes = (document.getElementById('audit-suite-notes')?.value || '').trim();
  const newRate = Number(document.getElementById('audit-suite-rate')?.value || suite.precioNoche);
  const sendCleaning = Boolean(document.getElementById('audit-send-cleaning')?.checked);
  const sendMaint = Boolean(document.getElementById('audit-send-maintenance')?.checked);

  const score = calculateChecklistScore(SGH_STATE.activeAuditCriteria);
  const now = new Date();
  const fechaStr = `${now.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}, ${now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;

  const existing = SGH_STATE.suiteAudits[suiteId] || { historial: [] };
  const updatedHistorial = [
    {
      fecha: fechaStr,
      auditor: SGH_STATE.currentManagerName,
      estado: verdict,
      puntaje: score,
      nota: notes || `Auditoría registrada con ${score}% de conformidad.`
    },
    ...(existing.historial || [])
  ];

  SGH_STATE.suiteAudits[suiteId] = {
    estado: verdict,
    puntaje: score,
    precioNoche: newRate > 0 ? newRate : suite.precioNoche,
    checklist: { ...SGH_STATE.activeAuditCriteria },
    ultimaAuditoria: fechaStr,
    auditor: SGH_STATE.currentManagerName,
    notas: notes,
    historial: updatedHistorial
  };

  saveSuitesAuditState();

  if (sendCleaning) {
    dispatchSuiteToHousekeeping(suite, notes);
  }
  if (sendMaint) {
    dispatchSuiteToMaintenance(suite, notes, verdict);
  }

  closeModal('modal-audit-suite');
  renderAllViews();

  const extraMsg = [
    sendCleaning ? 'Repaso enviado a Limpieza' : '',
    sendMaint ? 'Incidencia creada en Mantenimiento' : ''
  ].filter(Boolean).join(' y ');

  showToast(
    `Suite ${suite.numero} auditada (${verdict} · ${score}%).${extraMsg ? ' ' + extraMsg + '.' : ''}`,
    verdict === 'BLOQUEADA' ? 'danger' : 'navy'
  );
}

function dispatchSuiteToHousekeeping(suite, notes) {
  try {
    const rooms = readLocalJsonArray(HK_ROOMS_STORAGE_KEY);
    if (rooms) {
      const target = rooms.find(r => r.id === suite.id || r.numero === suite.numero);
      if (target) {
        target.estado = 'PENDIENTE';
        target.prioridad = 'URGENTE';
        target.nota = `Auditoría Gerencial (${SGH_STATE.currentManagerName}): ${notes}`;
        localStorage.setItem(HK_ROOMS_STORAGE_KEY, JSON.stringify(rooms));
      }
    }

    const logs = readLocalJsonArray(HK_LOGS_STORAGE_KEY) || [];
    logs.unshift({
      hora: 'Hoy, ' + new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      habitacion: `Suite ${suite.numero}`,
      evento: 'Repaso Solicitado por Auditoría Gerencial',
      detalle: notes,
      responsable: SGH_STATE.currentManagerName
    });
    localStorage.setItem(HK_LOGS_STORAGE_KEY, JSON.stringify(logs));
  } catch (err) {
    // Ignorar errores de almacenamiento
  }
}

function dispatchSuiteToMaintenance(suite, notes, verdict) {
  try {
    const existing = readLocalJsonArray(MAINT_INCIDENTS_KEY) || [];
    const newInc = {
      id: 'INC-' + Math.floor(2100 + Math.random() * 800),
      habitacion: suite.numero,
      area: `Suite ${suite.numero} - ${suite.nombre}`,
      titulo: `Hallazgo en Auditoría Gerencial (Suite ${suite.numero})`,
      descripcion: notes || 'Revisión técnica solicitada tras auditoría de gerencia.',
      prioridad: verdict === 'BLOQUEADA' ? 'URGENTE' : 'ALTA',
      reportadoPor: `Gerencia (${SGH_STATE.currentManagerName})`,
      tiempo: 'Ahora mismo',
      estado: 'PENDIENTE',
      repuestosEstimados: 'Por diagnosticar en sitio'
    };
    existing.unshift(newInc);
    localStorage.setItem(MAINT_INCIDENTS_KEY, JSON.stringify(existing));
  } catch (err) {
    // Ignorar errores de almacenamiento
  }
}
