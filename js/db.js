/**
 * SGH - SISTEMA DE GESTIÓN HOTELERA | 620 SGH
 * Base de Datos Inicial (localStorage) & Controlador de Sesiones
 */

(function (global) {
  const USERS_KEY = 'sgh_users_db_v1';
  const SESSION_KEY = 'sgh_active_session_v1';

  /**
   * Hash determinístico síncrono para no almacenar contraseñas en texto plano.
   * Compatible con http://localhost, https:// y file://.
   */
  function hashPassword(password) {
    const input = 'SGH620::' + String(password);
    let h1 = 0xdeadbeef;
    let h2 = 0x41c6ce57;
    for (let i = 0; i < input.length; i++) {
      const ch = input.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return (
      'sgh$' +
      (h2 >>> 0).toString(16).padStart(8, '0') +
      (h1 >>> 0).toString(16).padStart(8, '0')
    );
  }

  function getInitials(nombre) {
    const clean = String(nombre || '')
      .replace(/^(Lic\.|Dra\.|Dr\.|Ing\.|Sr\.|Sra\.|Arq\.|Madame|Conde)\s+/i, '')
      .trim();
    const parts = clean.split(/\s+/).filter(Boolean);
    if (parts.length === 0) return 'US';
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  function getDefaultDepartment(rol) {
    switch (rol) {
      case 'GERENTE':
        return 'Dirección General & Operaciones';
      case 'LIMPIEZA':
        return 'Housekeeping & Gobernanza';
      case 'MANTENIMIENTO':
        return 'Ingeniería & Mantenimiento';
      case 'CLIENTE':
      default:
        return 'Huésped Registrado';
    }
  }

  /**
   * Semilla inicial de usuarios del sistema 620 SGH
   */
  function buildSeedUsers() {
    const rawSeed = [
      {
        id: 'USR-001',
        nombre: 'Lic. Mateo González',
        email: 'mateo.gonzalez@620sgh.com',
        pass: 'Gerente2026*',
        rol: 'GERENTE',
        departamento: 'Dirección General & Operaciones',
        estado: 'ACTIVO',
        ultimoAcceso: 'Hace 2 horas',
        iniciales: 'MG'
      },
      {
        id: 'USR-002',
        nombre: 'Clara Domínguez',
        email: 'c.dominguez@620sgh.com',
        pass: 'Gerente2026*',
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
        pass: 'Limpieza2026*',
        rol: 'LIMPIEZA',
        departamento: 'Housekeeping Pisos 3 y 4',
        estado: 'ACTIVO',
        ultimoAcceso: 'Hoy, 13:20',
        iniciales: 'RM'
      },
      {
        id: 'USR-004',
        nombre: 'Carmen Vega',
        email: 'carmen.vega@620sgh.com',
        pass: 'Limpieza2026*',
        rol: 'LIMPIEZA',
        departamento: 'Housekeeping Turno Matutino',
        estado: 'ACTIVO',
        ultimoAcceso: 'Hoy, 14:00',
        iniciales: 'CV'
      },
      {
        id: 'USR-005',
        nombre: 'Javier Morales',
        email: 'j.morales@620sgh.com',
        pass: 'Limpieza2026*',
        rol: 'LIMPIEZA',
        departamento: 'Housekeeping Penthouse',
        estado: 'INHABILITADO',
        ultimoAcceso: 'Hace 3 días',
        iniciales: 'JM'
      },
      {
        id: 'USR-006',
        nombre: 'Ing. Darío Silva',
        email: 'dario.silva@620sgh.com',
        pass: 'Mantenimiento2026*',
        rol: 'MANTENIMIENTO',
        departamento: 'Jefatura de Mantenimiento & Clima',
        estado: 'ACTIVO',
        ultimoAcceso: 'Hoy, 12:45',
        iniciales: 'DS'
      },
      {
        id: 'USR-007',
        nombre: 'Ing. Roberto Benítez',
        email: 'r.benitez@620sgh.com',
        pass: 'Mantenimiento2026*',
        rol: 'MANTENIMIENTO',
        departamento: 'Electromecánica & Bombas',
        estado: 'ACTIVO',
        ultimoAcceso: 'Hoy, 09:12',
        iniciales: 'RB'
      },
      {
        id: 'USR-008',
        nombre: 'Emilio Varela',
        email: 'e.varela@620sgh.com',
        pass: 'Mantenimiento2026*',
        rol: 'MANTENIMIENTO',
        departamento: 'Servicios Edilicios',
        estado: 'ACTIVO',
        ultimoAcceso: 'Ayer, 18:30',
        iniciales: 'EV'
      },
      {
        id: 'USR-009',
        nombre: 'Dra. Elena Rostova',
        email: 'elena.rostova@geneva-health.ch',
        pass: 'Cliente2026*',
        rol: 'CLIENTE',
        departamento: 'Huésped Registrado',
        estado: 'ACTIVO',
        ultimoAcceso: '24 Oct 2026',
        iniciales: 'ER'
      },
      {
        id: 'USR-010',
        nombre: 'Sr. George H. Vance',
        email: 'g.vance@vanceholdings.com',
        pass: 'Cliente2026*',
        rol: 'CLIENTE',
        departamento: 'Huésped Frecuente',
        estado: 'ACTIVO',
        ultimoAcceso: '24 Oct 2026',
        iniciales: 'GV'
      },
      {
        id: 'USR-011',
        nombre: 'Madame Sophie Delacroix',
        email: 's.delacroix@parisart.fr',
        pass: 'Cliente2026*',
        rol: 'CLIENTE',
        departamento: 'Membresía Presidencial',
        estado: 'ACTIVO',
        ultimoAcceso: '20 Oct 2026',
        iniciales: 'SD'
      }
    ];

    return rawSeed.map(({ pass, ...rest }) => ({
      ...rest,
      passwordHash: hashPassword(pass)
    }));
  }

  function init() {
    try {
      const existing = localStorage.getItem(USERS_KEY);
      if (!existing) {
        localStorage.setItem(USERS_KEY, JSON.stringify(buildSeedUsers()));
        return;
      }
      const parsed = JSON.parse(existing);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        localStorage.setItem(USERS_KEY, JSON.stringify(buildSeedUsers()));
      }
    } catch (err) {
      localStorage.setItem(USERS_KEY, JSON.stringify(buildSeedUsers()));
    }
  }

  function getUsers() {
    init();
    try {
      return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
    } catch (err) {
      return buildSeedUsers();
    }
  }

  function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  function findUserByEmail(email) {
    const normalized = String(email || '').trim().toLowerCase();
    return getUsers().find((u) => u.email.toLowerCase() === normalized) || null;
  }

  function sanitizeUser(user) {
    if (!user) return null;
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }

  function formatNow() {
    const now = new Date();
    return now.toLocaleString('es-ES', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function saveSession(user, rememberMe) {
    const payload = JSON.stringify({
      userId: user.id,
      email: user.email,
      rol: user.rol,
      loginAt: new Date().toISOString()
    });

    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SESSION_KEY);

    if (rememberMe) {
      localStorage.setItem(SESSION_KEY, payload);
    } else {
      sessionStorage.setItem(SESSION_KEY, payload);
    }
  }

  function authenticate(email, password, rememberMe = false) {
    const normalizedEmail = String(email || '').trim().toLowerCase();
    const rawPassword = String(password || '');

    if (!normalizedEmail || !rawPassword) {
      return { ok: false, error: 'Ingrese su correo electrónico y contraseña.' };
    }

    const users = getUsers();
    const index = users.findIndex((u) => u.email.toLowerCase() === normalizedEmail);
    if (index === -1) {
      return { ok: false, error: 'No existe una cuenta registrada con ese correo electrónico.' };
    }

    const user = users[index];
    if (user.estado === 'INHABILITADO') {
      return { ok: false, error: 'Su cuenta se encuentra inhabilitada. Contacte a Gerencia.' };
    }

    if (user.passwordHash !== hashPassword(rawPassword)) {
      return { ok: false, error: 'Contraseña incorrecta. Verifique sus credenciales.' };
    }

    users[index] = {
      ...user,
      ultimoAcceso: 'Ahora mismo (' + formatNow() + ')'
    };
    saveUsers(users);
    saveSession(users[index], rememberMe);

    return { ok: true, user: sanitizeUser(users[index]) };
  }

  function registerUser({ nombre, email, password, rol }) {
    const cleanName = String(nombre || '').trim();
    const cleanEmail = String(email || '').trim().toLowerCase();
    const rawPassword = String(password || '');
    const validRoles = ['GERENTE', 'CLIENTE', 'LIMPIEZA', 'MANTENIMIENTO'];
    const cleanRole = validRoles.includes(rol) ? rol : 'CLIENTE';

    if (!cleanName || cleanName.length < 3) {
      return { ok: false, error: 'Ingrese su nombre y apellido completo.' };
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return { ok: false, error: 'Ingrese un correo electrónico válido.' };
    }

    if (rawPassword.length < 8) {
      return { ok: false, error: 'La contraseña debe tener al menos 8 caracteres.' };
    }

    const users = getUsers();
    if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      return { ok: false, error: 'Ya existe una cuenta registrada con este correo electrónico.' };
    }

    const maxNum = users.reduce((max, u) => {
      const m = /^USR-(\d+)$/.exec(u.id);
      return m ? Math.max(max, parseInt(m[1], 10)) : max;
    }, 0);

    const newUser = {
      id: 'USR-' + String(maxNum + 1).padStart(3, '0'),
      nombre: cleanName,
      email: cleanEmail,
      passwordHash: hashPassword(rawPassword),
      rol: cleanRole,
      departamento: getDefaultDepartment(cleanRole),
      estado: 'ACTIVO',
      ultimoAcceso: 'Recién registrado',
      iniciales: getInitials(cleanName)
    };

    users.push(newUser);
    saveUsers(users);

    return { ok: true, user: sanitizeUser(newUser) };
  }

  function updateUser(userId, patch) {
    const users = getUsers();
    const index = users.findIndex((u) => u.id === userId);
    if (index === -1) return null;

    users[index] = {
      ...users[index],
      ...patch
    };
    saveUsers(users);
    return sanitizeUser(users[index]);
  }

  function requestPasswordReset(email) {
    const user = findUserByEmail(email);
    if (!user) {
      return { ok: false, error: 'No encontramos ninguna cuenta asociada a ese correo.' };
    }
    if (user.estado === 'INHABILITADO') {
      return { ok: false, error: 'La cuenta está inhabilitada. Contacte a Gerencia.' };
    }
    return { ok: true, email: user.email };
  }

  function getSession() {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      const user = getUsers().find((u) => u.id === parsed.userId);
      if (!user || user.estado === 'INHABILITADO') {
        logout();
        return null;
      }
      return sanitizeUser(user);
    } catch (err) {
      return null;
    }
  }

  function logout() {
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SESSION_KEY);
  }

  function getPortalUrl(rol) {
    switch (rol) {
      case 'GERENTE':
        return 'index.html';
      case 'CLIENTE':
        return 'cliente.html';
      case 'MANTENIMIENTO':
        return 'mantenimiento.html';
      case 'LIMPIEZA':
        return 'limpieza.html';
      default:
        return null;
    }
  }

  function requireAuth(allowedRoles = []) {
    const user = getSession();
    if (!user) {
      window.location.replace('login.html');
      return null;
    }
    if (Array.isArray(allowedRoles) && allowedRoles.length > 0 && !allowedRoles.includes(user.rol)) {
      const fallback = getPortalUrl(user.rol) || 'login.html';
      window.location.replace(fallback);
      return null;
    }
    return user;
  }

  init();

  global.SGH_DB = {
    init,
    getUsers: () => getUsers().map(sanitizeUser),
    findUserByEmail: (email) => sanitizeUser(findUserByEmail(email)),
    authenticate,
    registerUser,
    updateUser,
    requestPasswordReset,
    getSession,
    logout,
    getPortalUrl,
    requireAuth,
    getInitials
  };
})(window);
