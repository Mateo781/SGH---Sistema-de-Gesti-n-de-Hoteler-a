/**
 * SGH - SISTEMA DE GESTIÓN HOTELERA | PORTAL ENCARGADO DE MANTENIMIENTO
 * Controlador de Casos de Uso de Mantenimiento:
 * 1. Consultar Reportes de Averías / Incidencias
 * 2. Registrar Atención de Reparación
 *    - <<include>> Realizar Informe Técnico
 *    - <<include>> Notificar Habitación Reparada
 * 3. Cancelar / Posponer Reparación (<<extend>> sobre Registrar Atención)
 * 4. Consultar Historial de Mantenimientos
 */

document.addEventListener('DOMContentLoaded', () => {
  initMaintNavigation();
  initFilters();
  initRepairModal();
  initNewIncidentModal();
  renderIncidencias();
  renderHistorial();
  updateMaintKPIs();
});

// =============================================================================
// ESTADO DE OPERACIONES DE MANTENIMIENTO (SGH ENGINEERING DATA)
// =============================================================================
const SGH_MAINT_STATE = {
  activeTab: 'section-reportes',
  statusFilter: 'ALL',
  selectedIncident: null,

  // Lista viva de incidencias reportadas (Limpieza, Huéspedes, Inspección)
  incidencias: [
    {
      id: 'INC-2041',
      habitacion: '304',
      area: 'Suite 304 - Gran Terraza',
      titulo: 'Avería en Climatizador Chiller (Falta de enfriamiento)',
      descripcion: 'El huésped reporta que la unidad fan-coil no desciende de 24°C y emite un ligero zumbido intermitente.',
      prioridad: 'URGENTE',
      reportadoPor: 'Personal Limpieza (Carmen Vega)',
      tiempo: 'Hace 25 min',
      estado: 'PENDIENTE', // PENDIENTE | EN_CURSO | RESUELTO | POSPUESTO
      repuestosEstimados: 'Filtro HEPA / Válvula de 3 vías'
    },
    {
      id: 'INC-2042',
      habitacion: '404',
      area: 'Suite 404 - Suite Embajador',
      titulo: 'Goteo en Grifería Termostática de Hidromasaje',
      descripcion: 'Pérdida continua de agua caliente por la junta del mezclador principal de la bañera de hidromasaje.',
      prioridad: 'ALTA',
      reportadoPor: 'Huésped VIP (Dra. Elena Rostova)',
      tiempo: 'Hace 1 hora',
      estado: 'EN_CURSO',
      repuestosEstimados: 'Cartucho cerámico termostático 1/2'
    },
    {
      id: 'INC-2043',
      habitacion: 'PISC',
      area: 'Áreas Comunes - Piscina Climatizada',
      titulo: 'Descalibración en Sistema de Bomba Calorífica',
      descripcion: 'La temperatura del agua descendió a 22°C (estándar 29°C). Requiere rearme manual del presostato.',
      prioridad: 'MEDIA',
      reportadoPor: 'Inspección de Turno Mañana',
      tiempo: 'Hace 3 horas',
      estado: 'PENDIENTE',
      repuestosEstimados: 'Sonda NTC de temperatura'
    },
    {
      id: 'INC-2044',
      habitacion: '501',
      area: 'Suite 501 - Penthouse Imperial',
      titulo: 'Bloqueo en Motor de Cortinas Blackout Panorámicas',
      descripcion: 'El servomotor lateral del riel este se trabó en posición semiabierta. Requiere lubricación y reseteo de fin de carrera.',
      prioridad: 'MEDIA',
      reportadoPor: 'Mayordomía VIP',
      tiempo: 'Hace 4 horas',
      estado: 'PENDIENTE',
      repuestosEstimados: 'Fusible térmico 2A / Grasa dieléctrica'
    },
    {
      id: 'INC-2045',
      habitacion: 'ASC-B',
      area: 'Infraestructura - Ascensor Panorámico Torre B',
      titulo: 'Revisión Periódica de Patines y Sensores de Puerta',
      descripcion: 'Mantenimiento preventivo quincenal programado para garantizar suavidad de marcha y seguridad biométrica.',
      prioridad: 'BAJA',
      reportadoPor: 'Plan Director SGH',
      tiempo: 'Hoy 08:00 hs',
      estado: 'EN_CURSO',
      repuestosEstimados: 'Kit de escobillas de grafito'
    }
  ],

  // Historial de incidencias auditadas y resueltas
  historial: [
    {
      id: 'INC-2038',
      habitacion: 'Suite 205',
      titulo: 'Sustitución de Luminarias LED Dimerizables',
      diagnostico: 'Driver electrónico de 24V quemado por fluctuación de tensión.',
      reparadoPor: 'Ing. Darío Silva',
      fecha: 'Ayer, 16:30 hs',
      repuestos: '2x Lámpara LED Warm 2700K + Driver MeanWell',
      costo: '$115 USD',
      horas: '1.2 hs',
      habitacionHabilitada: true
    },
    {
      id: 'INC-2039',
      habitacion: 'Suite 302',
      titulo: 'Desobstrucción y Sellado de Drenaje Jacuzzi',
      diagnostico: 'Obstrucción parcial por sedimentación en sifón secundario.',
      reparadoPor: 'Téc. Marcelo Paz',
      fecha: '29 Oct 2026',
      repuestos: 'Sellador polímero neutro + Filtro sifón',
      costo: '$80 USD',
      horas: '0.8 hs',
      habitacionHabilitada: true
    },
    {
      id: 'INC-2040',
      habitacion: 'Suite 101',
      titulo: 'Reprogramación de Cerradura Electrónica RFID',
      diagnostico: 'Batería de respaldo agotada y desincronización con el servidor de llaves maestras.',
      reparadoPor: 'Ing. Darío Silva',
      fecha: '28 Oct 2026',
      repuestos: '4x Baterías Litio AA Industrial',
      costo: '$45 USD',
      horas: '0.5 hs',
      habitacionHabilitada: true
    }
  ]
};

/**
 * 1. Navegación por Secciones
 */
function initMaintNavigation() {
  const navBtns = document.querySelectorAll('.maint-nav-btn');
  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      if (targetId) switchMaintSection(targetId);
    });
  });
}

function switchMaintSection(sectionId) {
  SGH_MAINT_STATE.activeTab = sectionId;

  document.querySelectorAll('.maint-nav-btn').forEach(b => {
    b.classList.toggle('active', b.getAttribute('data-target') === sectionId);
  });

  document.querySelectorAll('.maint-section').forEach(sec => {
    sec.classList.toggle('active', sec.id === sectionId);
  });
}

/**
 * 2. Filtros de Reportes (CU: Consultar Reportes de Averías)
 */
function initFilters() {
  const chips = document.querySelectorAll('.filter-chip');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      SGH_MAINT_STATE.statusFilter = chip.getAttribute('data-status');
      renderIncidencias();
    });
  });

  const prioritySelect = document.getElementById('filter-priority');
  if (prioritySelect) {
    prioritySelect.addEventListener('change', renderIncidencias);
  }
}

/**
 * Renderiza la lista de Incidencias Activas
 */
function renderIncidencias() {
  const container = document.getElementById('incidents-cards-container');
  if (!container) return;

  const prioritySelect = document.getElementById('filter-priority');
  const selPriority = prioritySelect ? prioritySelect.value : 'ALL';
  const selStatus = SGH_MAINT_STATE.statusFilter;

  let filtered = SGH_MAINT_STATE.incidencias;

  if (selStatus !== 'ALL') {
    filtered = filtered.filter(i => i.estado === selStatus);
  }

  if (selPriority !== 'ALL') {
    filtered = filtered.filter(i => i.prioridad === selPriority);
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding:3.5rem 2rem; background:#fff; border-radius:var(--radius-lg); border:1px dashed var(--border-medium);">
        <i class="ph-thin ph-check-circle" style="font-size:3.5rem; color:var(--status-success); margin-bottom:0.75rem; display:block;"></i>
        <h3 style="font-family:var(--font-serif); font-size:1.75rem; color:var(--navy-900);">No hay reportes con este criterio</h3>
        <p style="color:var(--text-muted); font-size:0.88rem;">Todas las instalaciones operan dentro de los estándares de excelencia del hotel.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(item => {
    let cardClass = '';
    if (item.prioridad === 'URGENTE') cardClass = 'urgent';
    else if (item.prioridad === 'ALTA') cardClass = 'warning';
    else if (item.estado === 'RESUELTO') cardClass = 'success';

    let statusPillClass = 'pendiente';
    let statusPillText = 'Pendiente de Atención';
    let statusIcon = 'ph-clock';

    if (item.estado === 'EN_CURSO') {
      statusPillClass = 'en-curso';
      statusPillText = 'En Reparación';
      statusIcon = 'ph-wrench';
    } else if (item.estado === 'RESUELTO') {
      statusPillClass = 'resuelto';
      statusPillText = 'Reparado & Habilitado';
      statusIcon = 'ph-check-circle';
    } else if (item.estado === 'POSPUESTO') {
      statusPillClass = 'pendiente';
      statusPillText = 'Pospuesto / Repuestos';
      statusIcon = 'ph-pause-circle';
    }

    return `
      <article class="incident-card ${cardClass}">
        
        <!-- Identificador de Habitación / Área -->
        <div class="incident-room-badge">
          <span class="room-number-bold">${item.habitacion}</span>
          <span class="room-tag-sub">Suite / Zona</span>
        </div>

        <!-- Información Central de la Avería -->
        <div class="incident-main-info">
          <div class="incident-code-meta">
            <span>${item.id}</span>
            <span>&bull;</span>
            <span class="priority-tag ${item.prioridad.toLowerCase()}">
              ${item.prioridad}
            </span>
            <span>&bull;</span>
            <span style="color:var(--navy-700); font-weight:600;"><i class="ph-bold ph-map-pin"></i> ${item.area}</span>
          </div>

          <h3 class="incident-title">${item.titulo}</h3>
          <p class="incident-desc">${item.descripcion}</p>
        </div>

        <!-- Origen del Reporte -->
        <div class="incident-reporter-box">
          <span class="reporter-label">Origen de Detección</span>
          <strong>${item.reportadoPor}</strong>
          <span class="reporter-time"><i class="ph ph-clock"></i> ${item.tiempo}</span>
        </div>

        <!-- Estado Operativo -->
        <div class="incident-status-cell">
          <span class="status-pill ${statusPillClass}">
            <i class="ph-bold ${statusIcon}"></i>
            <span>${statusPillText}</span>
          </span>
          <span style="font-size:0.7rem; color:var(--text-muted); font-weight:500;">
            Est. Material: ${item.repuestosEstimados}
          </span>
        </div>

        <!-- Acciones del Encargado (CU: Registrar Atención) -->
        <div class="incident-actions-col">
          ${item.estado !== 'RESUELTO' ? `
            <button class="btn-start-repair" onclick="openRepairModal('${item.id}')">
              <i class="ph-bold ph-wrench"></i>
              <span>${item.estado === 'EN_CURSO' ? 'Continuar Informe' : 'Atender Incidencia'}</span>
            </button>

            <button class="btn-postpone-repair" onclick="postponeIncident('${item.id}')" title="Posponer o cancelar por falta de repuestos">
              <i class="ph-bold ph-clock-counter-clockwise"></i>
              <span>Posponer Orden</span>
            </button>
          ` : `
            <span style="font-size:0.8rem; color:var(--status-success); font-weight:700; text-align:center;">
              <i class="ph-fill ph-check-circle"></i> Ficha Archivada
            </span>
          `}
        </div>

      </article>
    `;
  }).join('');
}

/**
 * 3. Modal de Atención Técnica & Emisión de Informe (CU: Registrar Atención <<include>> Informe & <<include>> Notificar)
 */
function initRepairModal() {
  const modal = document.getElementById('repair-modal');
  const closeCross = document.getElementById('btn-close-repair-modal');
  const formRepair = document.getElementById('form-repair-report');

  if (closeCross && modal) {
    closeCross.addEventListener('click', () => modal.classList.remove('active'));
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  }

  if (formRepair) {
    formRepair.addEventListener('submit', (e) => {
      e.preventDefault();
      completeRepairOrder();
    });
  }
}

function openRepairModal(incidentId) {
  const incident = SGH_MAINT_STATE.incidencias.find(i => i.id === incidentId);
  if (!incident) return;

  SGH_MAINT_STATE.selectedIncident = incident;

  // Cambiar estado a EN_CURSO si estaba pendiente
  if (incident.estado === 'PENDIENTE') {
    incident.estado = 'EN_CURSO';
    renderIncidencias();
    updateMaintKPIs();
  }

  // Prellenar datos del modal
  document.getElementById('modal-inc-id').textContent = incident.id;
  document.getElementById('modal-inc-title').textContent = incident.titulo;
  document.getElementById('modal-inc-area').textContent = incident.area;
  document.getElementById('modal-inc-desc').textContent = incident.descripcion;

  // Limpiar campos de informe
  document.getElementById('rep-diag').value = '';
  document.getElementById('rep-actions').value = '';
  document.getElementById('rep-parts').value = incident.repuestosEstimados;
  document.getElementById('rep-hours').value = '1.0';
  document.getElementById('check-notify-suite').checked = true;

  document.getElementById('repair-modal').classList.add('active');
}

/**
 * Finaliza la orden de trabajo (Ejecuta Informe Técnico y Notifica Habitación Reparada)
 */
function completeRepairOrder() {
  const inc = SGH_MAINT_STATE.selectedIncident;
  if (!inc) return;

  const diag = document.getElementById('rep-diag').value.trim() || 'Falla corregida satisfactoriamente según normativa de ingeniería SGH.';
  const actions = document.getElementById('rep-actions').value.trim() || 'Ajuste de componentes mecánicos y verificación de parámetros de confort.';
  const parts = document.getElementById('rep-parts').value.trim() || 'Insumos varios de almacén';
  const hours = document.getElementById('rep-hours').value || '1.0';
  const notifyRoom = document.getElementById('check-notify-suite').checked;

  const btnSubmit = document.getElementById('btn-submit-repair-order');
  btnSubmit.disabled = true;
  btnSubmit.innerHTML = '<i class="ph-bold ph-spinner animate-spin"></i> Registrando informe y notificando...';

  setTimeout(() => {
    // 1. Actualizar estado de la incidencia a RESUELTO
    inc.estado = 'RESUELTO';

    // 2. Agregar al historial auditado (CU: Realizar Informe Técnico)
    const nuevoHistorial = {
      id: inc.id,
      habitacion: inc.area,
      titulo: inc.titulo,
      diagnostico: `${diag} - Acciones: ${actions}`,
      reparadoPor: 'Ing. Darío Silva',
      fecha: 'Ahora mismo',
      repuestos: parts,
      costo: `$${Math.floor(60 + Math.random() * 120)} USD`,
      horas: `${hours} hs`,
      habitacionHabilitada: notifyRoom
    };

    SGH_MAINT_STATE.historial.unshift(nuevoHistorial);

    btnSubmit.disabled = false;
    btnSubmit.innerHTML = '<i class="ph-bold ph-check-circle"></i> <span>Completar Reparación & Emitir Informe</span>';

    // Cerrar modal
    document.getElementById('repair-modal').classList.remove('active');

    // Refrescar vistas
    renderIncidencias();
    renderHistorial();
    updateMaintKPIs();

    // Mensaje confirmatorio (CU: Notificar Habitación Reparada)
    const msgNotif = notifyRoom 
      ? `¡Reparación ${inc.id} completada! La ${inc.area} fue HABILITADA y se notificó a Recepción y Gobernanta.`
      : `Informe técnico de ${inc.id} guardado satisfactoriamente.`;

    showMaintToast(msgNotif, 'success');
  }, 1000);
}

/**
 * 4. Posponer / Cancelar Reparación (CU: Cancelar / Posponer Reparación <<extend>>)
 */
function postponeIncident(incidentId) {
  const inc = SGH_MAINT_STATE.incidencias.find(i => i.id === incidentId);
  if (!inc) return;

  const motivo = prompt(
    `[SGH MANTENIMIENTO - EXTENSIÓN DE CASO DE USO]\n\n` +
    `Indique el motivo justificado para posponer o cancelar la orden de trabajo de ${inc.id} (${inc.area}):\n\n` +
    `Ejemplos: "Falta de repuestos en pañol", "Requiere contratista de Chiller externo", "Huésped solicitó intervención más tarde".`,
    'Falta de stock de repuestos en almacén central. Solicitud de compra enviada.'
  );

  if (motivo) {
    inc.estado = 'POSPUESTO';
    inc.descripcion += ` [POSPUESTO: ${motivo}]`;
    renderIncidencias();
    updateMaintKPIs();
    showMaintToast(`La orden ${inc.id} se ha pospuesto. Motivo registrado: "${motivo}"`, 'warning');
  }
}

/**
 * 5. Historial de Mantenimientos (CU: Consultar Historial)
 */
function renderHistorial() {
  const tbody = document.getElementById('history-table-body');
  if (!tbody) return;

  tbody.innerHTML = SGH_MAINT_STATE.historial.map(h => `
    <tr>
      <td><strong style="color:var(--navy-900); font-family:var(--font-mono);">${h.id}</strong></td>
      <td><strong>${h.habitacion}</strong></td>
      <td>
        <div style="font-weight:600; color:var(--navy-900);">${h.titulo}</div>
        <div style="font-size:0.75rem; color:var(--text-muted);">${h.diagnostico}</div>
      </td>
      <td>
        <span style="font-size:0.8rem; font-weight:600; color:var(--navy-700);"><i class="ph-bold ph-user"></i> ${h.reparadoPor}</span>
      </td>
      <td>${h.fecha}</td>
      <td><span style="font-size:0.75rem; color:var(--text-secondary);">${h.repuestos}</span></td>
      <td><strong>${h.costo}</strong> (${h.horas})</td>
      <td>
        <span class="status-pill resuelto" style="font-size:0.7rem; padding:0.2rem 0.6rem;">
          <i class="ph-bold ph-check"></i> Suite Operativa
        </span>
      </td>
      <td style="text-align:right;">
        <button class="filter-chip" onclick="viewTechnicalAudit('${h.id}')" title="Ver ficha técnica completa">
          <i class="ph-bold ph-file-text"></i> Ficha
        </button>
      </td>
    </tr>
  `).join('');
}

function viewTechnicalAudit(histId) {
  const h = SGH_MAINT_STATE.historial.find(item => item.id === histId);
  if (!h) return;

  alert(
    `========================================\n` +
    `SGH INGENIERÍA & MANTENIMIENTO TÉCNICO\n` +
    `INFORME FINAL DE INTERVENCIÓN AUDITADO\n` +
    `========================================\n` +
    `ORDEN DE TRABAJO: ${h.id}\n` +
    `UBICACIÓN / SUITE: ${h.habitacion}\n` +
    `TRABAJO REALIZADO: ${h.titulo}\n` +
    `RESPONSABLE TÉCNICO: ${h.reparadoPor}\n` +
    `FECHA DE CIERRE: ${h.fecha}\n` +
    `DIAGNÓSTICO: ${h.diagnostico}\n` +
    `REPUESTOS UTILIZADOS: ${h.repuestos}\n` +
    `COSTO DIRECTO / HORAS: ${h.costo} (${h.horas})\n` +
    `ESTADO FINAL: Habitación Habilitada & Verificada\n` +
    `========================================`
  );
}

/**
 * 6. Actualización de Indicadores KPI
 */
function updateMaintKPIs() {
  const pendCount = SGH_MAINT_STATE.incidencias.filter(i => i.estado === 'PENDIENTE' || i.estado === 'POSPUESTO').length;
  const inProgCount = SGH_MAINT_STATE.incidencias.filter(i => i.estado === 'EN_CURSO').length;
  const resCount = SGH_MAINT_STATE.historial.length;

  const kpiPend = document.getElementById('kpi-pend-count');
  const kpiProg = document.getElementById('kpi-prog-count');
  const kpiRes = document.getElementById('kpi-res-count');
  const navBadge = document.getElementById('badge-pend-count');

  if (kpiPend) kpiPend.textContent = pendCount;
  if (kpiProg) kpiProg.textContent = inProgCount;
  if (kpiRes) kpiRes.textContent = resCount;
  if (navBadge) navBadge.textContent = pendCount;
}

/**
 * 7. Toast Notificaciones
 */
function showMaintToast(message, type = 'info') {
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

/**
 * 8. Modal para Registrar Nueva Avería (Inspección de Guardia)
 */
function initNewIncidentModal() {
  const modal = document.getElementById('modal-new-incident');
  const openBtn = document.getElementById('btn-open-new-incident');
  const closeBtn = document.getElementById('btn-close-new-modal');
  const form = document.getElementById('form-new-incident');

  if (openBtn && modal) {
    openBtn.addEventListener('click', () => modal.classList.add('active'));
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => modal.classList.remove('active'));
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const room = document.getElementById('new-inc-room').value.trim();
      const priority = document.getElementById('new-inc-priority').value;
      const title = document.getElementById('new-inc-title').value.trim();
      const desc = document.getElementById('new-inc-desc').value.trim();
      const parts = document.getElementById('new-inc-parts').value.trim() || 'A determinar en diagnóstico';

      const nextId = 'INC-' + (2046 + Math.floor(Math.random() * 50));
      const roomNumber = room.replace(/\D/g, '') || room.substring(0, 4).toUpperCase();

      const newInc = {
        id: nextId,
        habitacion: roomNumber,
        area: room,
        titulo: title,
        descripcion: desc,
        prioridad: priority,
        reportadoPor: 'Inspección de Guardia (Ing. Darío Silva)',
        tiempo: 'Hace instantes',
        estado: 'PENDIENTE',
        repuestosEstimados: parts
      };

      SGH_MAINT_STATE.incidencias.unshift(newInc);
      form.reset();
      modal.classList.remove('active');
      renderIncidencias();
      updateMaintKPIs();
      showMaintToast(`Nueva orden ${nextId} registrada para ${room}.`, 'success');
    });
  }
}

