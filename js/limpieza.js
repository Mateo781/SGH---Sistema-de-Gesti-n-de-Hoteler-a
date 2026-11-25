/**
 * SGH - SISTEMA DE GESTIÓN HOTELERA | PORTAL PERSONAL DE LIMPIEZA (620 SGH)
 * Casos de Uso:
 * 1. Consultar Habitaciones Asignadas / Pendientes
 * 2. Registrar Limpieza / Actualizar Estado (<<include>> Notificar Habitación Limpia)
 * 3. Registrar Huésped 'No Molestar' / Pospuesta (<<extend>>)
 * 4. Reportar Avería o Desperfecto (envía incidencia a Mantenimiento)
 */

const HK_ROOMS_STORAGE_KEY = 'sgh_limpieza_rooms_v1';
const HK_LOGS_STORAGE_KEY = 'sgh_limpieza_logs_v1';
const MAINT_INCIDENTS_KEY = 'sgh_incidencias_db_v1';

const DEFAULT_HK_ROOMS = [
  {
    id: 'STE-304',
    numero: '304',
    piso: 3,
    nombre: 'Suite Gran Terraza',
    categoria: 'Deluxe Family Suite',
    ocupacion: 'Check-out realizado',
    prioridad: 'URGENTE',
    estado: 'PENDIENTE',
    nota: 'Check-in programado a las 15:00 hs. Prioridad alta.'
  },
  {
    id: 'STE-404',
    numero: '404',
    piso: 4,
    nombre: 'Suite Embajador',
    categoria: 'Executive Corner Suite',
    ocupacion: 'Check-out realizado',
    prioridad: 'ALTA',
    estado: 'EN_LIMPIEZA',
    nota: 'Aseo profundo e inspección de hidromasaje en curso.'
  },
  {
    id: 'STE-501',
    numero: '501',
    piso: 5,
    nombre: 'Penthouse Imperial',
    categoria: 'Royal Master Suite',
    ocupacion: 'Huésped en estadía',
    prioridad: 'NORMAL',
    estado: 'NO_MOLESTAR',
    nota: 'Cartel "No Molestar" en puerta. Reintentar 16:30 hs.'
  },
  {
    id: 'STE-302',
    numero: '302',
    piso: 3,
    nombre: 'Gran Terraza Jardín',
    categoria: 'Deluxe Family Suite',
    ocupacion: 'Disponible / Lista',
    prioridad: 'NORMAL',
    estado: 'LIMPIA',
    nota: 'Limpia y notificada al sistema. Lista para recepción.'
  },
  {
    id: 'STE-205',
    numero: '205',
    piso: 2,
    nombre: 'Vista al Lago Superior',
    categoria: 'Premium King Room',
    ocupacion: 'Reserva pendiente hoy',
    prioridad: 'ALTA',
    estado: 'PENDIENTE',
    nota: 'Revisar reposición de amenities y luminarias.'
  },
  {
    id: 'STE-410',
    numero: '410',
    piso: 4,
    nombre: 'Suite Ejecutiva',
    categoria: 'Executive Corner Suite',
    ocupacion: 'Disponible',
    prioridad: 'NORMAL',
    estado: 'LIMPIA',
    nota: 'Verificada y habilitada sin observaciones.'
  },
  {
    id: 'STE-314',
    numero: '314',
    piso: 3,
    nombre: 'Deluxe Superior',
    categoria: 'Deluxe Room',
    ocupacion: 'Check-out reciente',
    prioridad: 'NORMAL',
    estado: 'PENDIENTE',
    nota: 'Cambio completo de blancos y repaso general.'
  },
  {
    id: 'STE-101',
    numero: '101',
    piso: 1,
    nombre: 'Suite Jardín Planta Baja',
    categoria: 'Deluxe Room',
    ocupacion: 'Disponible',
    prioridad: 'NORMAL',
    estado: 'LIMPIA',
    nota: 'Cerradura RFID operativa y habitación higienizada.'
  }
];

const DEFAULT_HK_LOGS = [
  {
    hora: 'Hoy, 13:45',
    habitacion: 'Suite 302',
    evento: 'Habitación Notificada Limpia',
    detalle: 'Lista para recepción sin desperfectos.',
    responsable: 'Rosaura Mendez'
  },
  {
    hora: 'Hoy, 13:10',
    habitacion: 'Suite 501',
    evento: 'Registrado "No Molestar"',
    detalle: 'Cartel en puerta. Reintentar 16:30 hs.',
    responsable: 'Carmen Vega'
  },
  {
    hora: 'Hoy, 12:25',
    habitacion: 'Suite 410',
    evento: 'Habitación Notificada Limpia',
    detalle: 'Checklist 4/4 completado.',
    responsable: 'Carmen Vega'
  }
];

const SGH_HK_STATE = {
  staffName: 'Carmen Vega',
  statusFilter: 'ALL',
  floorFilter: 'ALL',
  searchQuery: '',
  rooms: [],
  logs: []
};

document.addEventListener('DOMContentLoaded', () => {
  if (window.SGH_DB) {
    const activeUser = SGH_DB.requireAuth(['LIMPIEZA', 'GERENTE']);
    if (!activeUser) return;

    SGH_HK_STATE.staffName = activeUser.nombre;
    const avatarEl = document.querySelector('.staff-avatar');
    const nameEl = document.querySelector('.staff-name');
    if (avatarEl) avatarEl.textContent = activeUser.iniciales;
    if (nameEl) nameEl.textContent = activeUser.nombre;

    if (activeUser.rol === 'GERENTE') {
      const backBtn = document.getElementById('btn-back-gerencia');
      if (backBtn) backBtn.style.display = 'inline-flex';
    }

    const logoutLink = document.querySelector('a[href="login.html"]');
    if (logoutLink) {
      logoutLink.addEventListener('click', () => SGH_DB.logout());
    }
  }

  loadHkState();
  initHkNavigation();
  initHkFilters();
  initHkModals();
  renderRooms();
  renderLogs();
  updateHkKPIs();
});

function loadHkState() {
  try {
    const savedRooms = localStorage.getItem(HK_ROOMS_STORAGE_KEY);
    SGH_HK_STATE.rooms = savedRooms ? JSON.parse(savedRooms) : structuredClone(DEFAULT_HK_ROOMS);
  } catch (err) {
    SGH_HK_STATE.rooms = structuredClone(DEFAULT_HK_ROOMS);
  }

  try {
    const savedLogs = localStorage.getItem(HK_LOGS_STORAGE_KEY);
    SGH_HK_STATE.logs = savedLogs ? JSON.parse(savedLogs) : structuredClone(DEFAULT_HK_LOGS);
  } catch (err) {
    SGH_HK_STATE.logs = structuredClone(DEFAULT_HK_LOGS);
  }
}

function saveHkState() {
  localStorage.setItem(HK_ROOMS_STORAGE_KEY, JSON.stringify(SGH_HK_STATE.rooms));
  localStorage.setItem(HK_LOGS_STORAGE_KEY, JSON.stringify(SGH_HK_STATE.logs));
}

function formatShortTime() {
  return 'Hoy, ' + new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
}

function addLogEntry(habitacion, evento, detalle) {
  SGH_HK_STATE.logs.unshift({
    hora: formatShortTime(),
    habitacion,
    evento,
    detalle,
    responsable: SGH_HK_STATE.staffName
  });
  saveHkState();
  renderLogs();
}

/**
 * 1. Navegación entre pestañas
 */
function initHkNavigation() {
  document.querySelectorAll('.hk-nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-target');
      document.querySelectorAll('.hk-nav-btn').forEach(b => b.classList.toggle('active', b === btn));
      document.querySelectorAll('.hk-section').forEach(sec => sec.classList.toggle('active', sec.id === target));
    });
  });
}

/**
 * 2. Filtros por estado, piso y búsqueda
 */
function initHkFilters() {
  document.querySelectorAll('.hk-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.hk-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      SGH_HK_STATE.statusFilter = chip.getAttribute('data-status');
      renderRooms();
    });
  });

  const floorSelect = document.getElementById('hk-floor-filter');
  if (floorSelect) {
    floorSelect.addEventListener('change', () => {
      SGH_HK_STATE.floorFilter = floorSelect.value;
      renderRooms();
    });
  }

  const searchInput = document.getElementById('hk-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      SGH_HK_STATE.searchQuery = searchInput.value.trim().toLowerCase();
      renderRooms();
    });
  }
}

/**
 * 3. Renderizado de Habitaciones Asignadas (CU: Consultar Habitaciones Asignadas/Pendientes)
 */
function renderRooms() {
  const grid = document.getElementById('hk-rooms-grid');
  if (!grid) return;

  const filtered = SGH_HK_STATE.rooms.filter(r => {
    const matchStatus = SGH_HK_STATE.statusFilter === 'ALL' || r.estado === SGH_HK_STATE.statusFilter;
    const matchFloor = SGH_HK_STATE.floorFilter === 'ALL' || String(r.piso) === SGH_HK_STATE.floorFilter;
    const matchSearch =
      !SGH_HK_STATE.searchQuery ||
      r.numero.toLowerCase().includes(SGH_HK_STATE.searchQuery) ||
      r.nombre.toLowerCase().includes(SGH_HK_STATE.searchQuery) ||
      r.categoria.toLowerCase().includes(SGH_HK_STATE.searchQuery);
    return matchStatus && matchFloor && matchSearch;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1.5rem; background: #ffffff; border: 1px dashed var(--border-medium); border-radius: var(--radius-lg);">
        <i class="ph-thin ph-bed" style="font-size: 3rem; color: var(--text-dim); margin-bottom: 0.75rem; display: block;"></i>
        <h3 style="font-family: var(--font-serif); font-size: 1.55rem; color: var(--navy-900);">No hay habitaciones con estos filtros</h3>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.25rem;">Pruebe seleccionando otro piso o estado de limpieza.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(room => {
    const statusMap = {
      PENDIENTE: { cls: 'pendiente', icon: 'ph-clock', label: 'Pendiente de Aseo' },
      EN_LIMPIEZA: { cls: 'en_limpieza', icon: 'ph-broom', label: 'En Limpieza' },
      LIMPIA: { cls: 'limpia', icon: 'ph-check-circle', label: 'Limpia & Notificada' },
      NO_MOLESTAR: { cls: 'no_molestar', icon: 'ph-door', label: 'No Molestar' }
    };
    const st = statusMap[room.estado] || statusMap.PENDIENTE;
    const noteClass = room.estado === 'NO_MOLESTAR' ? 'dnd' : room.estado === 'LIMPIA' ? 'clean' : '';

    return `
      <article class="room-card status-${room.estado.toLowerCase()}">
        <div>
          <div class="room-card-head">
            <div class="room-number-block">
              <span class="room-num">${room.numero}</span>
              <span class="room-floor-tag">Piso ${room.piso}</span>
            </div>
            <span class="room-status-pill ${st.cls}">
              <i class="ph-bold ${st.icon}"></i> ${st.label}
            </span>
          </div>

          <h3 class="room-suite-title">${room.nombre}</h3>

          <div class="room-meta-strip">
            <span class="room-meta-tag"><i class="ph ph-tag"></i> ${room.categoria}</span>
            <span class="room-meta-tag"><i class="ph ph-key"></i> ${room.ocupacion}</span>
            ${room.prioridad === 'URGENTE' ? `<span class="room-meta-tag urgent"><i class="ph-bold ph-fire"></i> Urgente</span>` : ''}
          </div>
        </div>

        <div class="room-note-box ${noteClass}">
          ${room.nota}
        </div>

        <div class="room-actions-row">
          ${renderRoomActions(room)}
          <button type="button" class="btn-hk btn-hk-danger-outline" onclick="openDefectModal('${room.id}')" title="Reportar avería o desperfecto">
            <i class="ph-bold ph-wrench"></i> Avería
          </button>
        </div>
      </article>
    `;
  }).join('');
}

function renderRoomActions(room) {
  if (room.estado === 'PENDIENTE') {
    return `
      <button type="button" class="btn-hk btn-hk-primary" onclick="startCleaning('${room.id}')">
        <i class="ph-bold ph-play"></i> Iniciar
      </button>
      <button type="button" class="btn-hk btn-hk-emerald" onclick="openCompleteModal('${room.id}')">
        <i class="ph-bold ph-check"></i> Notificar Limpia
      </button>
      <button type="button" class="btn-hk btn-hk-amber" onclick="openDndModal('${room.id}')">
        <i class="ph-bold ph-prohibit"></i> No Molestar
      </button>
    `;
  }
  if (room.estado === 'EN_LIMPIEZA') {
    return `
      <button type="button" class="btn-hk btn-hk-emerald" onclick="openCompleteModal('${room.id}')">
        <i class="ph-bold ph-bell-ringing"></i> Finalizar & Notificar Limpia
      </button>
      <button type="button" class="btn-hk btn-hk-amber" onclick="openDndModal('${room.id}')">
        <i class="ph-bold ph-prohibit"></i> Posponer
      </button>
    `;
  }
  if (room.estado === 'NO_MOLESTAR') {
    return `
      <button type="button" class="btn-hk btn-hk-primary" onclick="startCleaning('${room.id}')">
        <i class="ph-bold ph-arrow-counter-clockwise"></i> Reanudar Limpieza
      </button>
      <button type="button" class="btn-hk btn-hk-emerald" onclick="openCompleteModal('${room.id}')">
        <i class="ph-bold ph-check"></i> Notificar Limpia
      </button>
    `;
  }
  return `
    <button type="button" class="btn-hk btn-hk-primary" onclick="reopenCleaning('${room.id}')">
      <i class="ph-bold ph-arrow-clockwise"></i> Repaso / Nueva Limpieza
    </button>
  `;
}

function renderLogs() {
  const tbody = document.getElementById('hk-log-tbody');
  if (!tbody) return;

  if (SGH_HK_STATE.logs.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center; padding: 2rem; color: var(--text-muted);">
          Aún no hay notificaciones registradas en el turno.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = SGH_HK_STATE.logs.map(log => `
    <tr>
      <td><strong>${log.hora}</strong></td>
      <td><span style="font-weight:700; color:var(--navy-900);">${log.habitacion}</span></td>
      <td>${log.evento}</td>
      <td>${log.detalle}</td>
      <td>${log.responsable}</td>
    </tr>
  `).join('');
}

function updateHkKPIs() {
  const pend = SGH_HK_STATE.rooms.filter(r => r.estado === 'PENDIENTE').length;
  const prog = SGH_HK_STATE.rooms.filter(r => r.estado === 'EN_LIMPIEZA').length;
  const clean = SGH_HK_STATE.rooms.filter(r => r.estado === 'LIMPIA').length;
  const dnd = SGH_HK_STATE.rooms.filter(r => r.estado === 'NO_MOLESTAR').length;

  const setText = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  setText('kpi-pend-rooms', pend);
  setText('kpi-prog-rooms', prog);
  setText('kpi-clean-rooms', clean);
  setText('kpi-dnd-rooms', dnd);
  setText('badge-pending-rooms', pend + prog);
}

/**
 * 4. Acciones de estado de limpieza
 */
function startCleaning(roomId) {
  const room = SGH_HK_STATE.rooms.find(r => r.id === roomId);
  if (!room) return;

  room.estado = 'EN_LIMPIEZA';
  room.nota = `Limpieza iniciada por ${SGH_HK_STATE.staffName} (${formatShortTime()}).`;
  saveHkState();
  renderRooms();
  updateHkKPIs();
  showHkToast(`Limpieza iniciada en Suite ${room.numero}.`, 'info');
}

function reopenCleaning(roomId) {
  const room = SGH_HK_STATE.rooms.find(r => r.id === roomId);
  if (!room) return;

  room.estado = 'PENDIENTE';
  room.nota = 'Reabierta para nuevo repaso de limpieza.';
  saveHkState();
  renderRooms();
  updateHkKPIs();
  showHkToast(`Suite ${room.numero} marcada nuevamente como pendiente.`, 'info');
}

/**
 * 5. Modales: Completar Limpieza, No Molestar y Reportar Avería
 */
function initHkModals() {
  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-close-modal');
      const modal = document.getElementById(id);
      if (modal) modal.classList.remove('active');
    });
  });

  document.querySelectorAll('.hk-modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.classList.remove('active');
    });
  });

  const checkItems = document.querySelectorAll('.hk-check-item');
  checkItems.forEach(item => item.addEventListener('change', updateChecklistProgress));

  const formComplete = document.getElementById('form-complete-cleaning');
  if (formComplete) {
    formComplete.addEventListener('submit', (e) => {
      e.preventDefault();
      const roomId = document.getElementById('complete-room-id').value;
      const notes = document.getElementById('complete-notes').value.trim();
      const room = SGH_HK_STATE.rooms.find(r => r.id === roomId);
      if (!room) return;

      const checkedCount = document.querySelectorAll('.hk-check-item:checked').length;
      const totalCount = document.querySelectorAll('.hk-check-item').length;
      if (checkedCount < totalCount) {
        showHkToast('Complete todos los puntos de higiene antes de notificar al sistema.', 'error');
        return;
      }

      room.estado = 'LIMPIA';
      room.nota = notes || `Higienizada y notificada al sistema (${formatShortTime()}).`;
      saveHkState();

      addLogEntry(
        `Suite ${room.numero}`,
        'Habitación Notificada Limpia',
        notes || 'Checklist 4/4 completado. Disponible para recepción.'
      );

      document.getElementById('modal-complete-cleaning').classList.remove('active');
      renderRooms();
      updateHkKPIs();
      showHkToast(`Suite ${room.numero} notificada como LIMPIA al sistema.`, 'success');
    });
  }

  const formDnd = document.getElementById('form-dnd');
  if (formDnd) {
    formDnd.addEventListener('submit', (e) => {
      e.preventDefault();
      const roomId = document.getElementById('dnd-room-id').value;
      const reason = document.getElementById('dnd-reason').value;
      const returnTime = document.getElementById('dnd-return-time').value.trim();
      const room = SGH_HK_STATE.rooms.find(r => r.id === roomId);
      if (!room) return;

      const detail = returnTime ? `${reason}. Reintentar: ${returnTime}.` : reason;
      room.estado = 'NO_MOLESTAR';
      room.nota = detail;
      saveHkState();

      addLogEntry(`Suite ${room.numero}`, 'Registrado "No Molestar"', detail);

      document.getElementById('modal-dnd').classList.remove('active');
      renderRooms();
      updateHkKPIs();
      showHkToast(`Suite ${room.numero} registrada como No Molestar / Pospuesta.`, 'warning');
    });
  }

  const openGlobalDefect = document.getElementById('btn-open-defect-global');
  if (openGlobalDefect) {
    openGlobalDefect.addEventListener('click', () => openDefectModal(''));
  }

  const formDefect = document.getElementById('form-defect');
  if (formDefect) {
    formDefect.addEventListener('submit', (e) => {
      e.preventDefault();
      const roomId = document.getElementById('defect-room').value;
      const priority = document.getElementById('defect-priority').value;
      const title = document.getElementById('defect-title').value.trim();
      const desc = document.getElementById('defect-desc').value.trim();

      const room = SGH_HK_STATE.rooms.find(r => r.id === roomId);
      const roomLabel = room ? `Suite ${room.numero} - ${room.nombre}` : 'Área Común';
      const roomNum = room ? room.numero : 'GRAL';

      const newInc = {
        id: 'INC-' + (2050 + Math.floor(Math.random() * 900)),
        habitacion: roomNum,
        area: roomLabel,
        titulo: title,
        descripcion: desc,
        prioridad: priority,
        reportadoPor: `Personal Limpieza (${SGH_HK_STATE.staffName})`,
        tiempo: 'Hace instantes',
        estado: 'PENDIENTE',
        repuestosEstimados: 'Pendiente de diagnóstico técnico'
      };

      try {
        const existing = JSON.parse(localStorage.getItem(MAINT_INCIDENTS_KEY) || 'null');
        if (Array.isArray(existing)) {
          existing.unshift(newInc);
          localStorage.setItem(MAINT_INCIDENTS_KEY, JSON.stringify(existing));
        } else {
          localStorage.setItem(MAINT_INCIDENTS_KEY, JSON.stringify([newInc]));
        }
      } catch (err) {
        // Ignorar si localStorage falla
      }

      addLogEntry(
        room ? `Suite ${room.numero}` : 'Área Común',
        `Avería Reportada (${newInc.id})`,
        `[${priority}] ${title}`
      );

      formDefect.reset();
      document.getElementById('modal-defect').classList.remove('active');
      showHkToast(`Reporte ${newInc.id} enviado al Encargado de Mantenimiento.`, 'success');
    });
  }
}

function updateChecklistProgress() {
  const checked = document.querySelectorAll('.hk-check-item:checked').length;
  const total = document.querySelectorAll('.hk-check-item').length;
  const el = document.getElementById('checklist-progress');
  if (el) el.textContent = `${checked}/${total}`;
}

function openCompleteModal(roomId) {
  const room = SGH_HK_STATE.rooms.find(r => r.id === roomId);
  if (!room) return;

  document.getElementById('complete-room-id').value = room.id;
  document.getElementById('complete-modal-title').textContent = `Suite ${room.numero} — ${room.nombre}`;
  document.getElementById('complete-notes').value = '';
  document.querySelectorAll('.hk-check-item').forEach(cb => { cb.checked = true; });
  updateChecklistProgress();

  document.getElementById('modal-complete-cleaning').classList.add('active');
}

function openDndModal(roomId) {
  const room = SGH_HK_STATE.rooms.find(r => r.id === roomId);
  if (!room) return;

  document.getElementById('dnd-room-id').value = room.id;
  document.getElementById('dnd-modal-title').textContent = `Suite ${room.numero} — ${room.nombre}`;
  document.getElementById('modal-dnd').classList.add('active');
}

function openDefectModal(preselectedRoomId) {
  const select = document.getElementById('defect-room');
  if (select) {
    select.innerHTML =
      SGH_HK_STATE.rooms
        .map(r => `<option value="${r.id}">Suite ${r.numero} — ${r.nombre}</option>`)
        .join('') +
      `<option value="AREA_COMUN">Áreas Comunes / Pasillos</option>`;
    if (preselectedRoomId) {
      select.value = preselectedRoomId;
    }
  }
  document.getElementById('modal-defect').classList.add('active');
}

function showHkToast(message, type = 'info') {
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
