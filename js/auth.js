/**
 * SGH - SISTEMA DE GESTIÓN HOTELERA | AUTHENTICATION CONTROLLER
 * Interactividad frontend para inicio de sesión, creación de cuenta y roles
 */

document.addEventListener('DOMContentLoaded', () => {
  initAuthTabs();
  initDemoChips();
  initPasswordToggles();
  initPasswordStrengthMeter();
  initRoleSelectors();
  initFormSubmissions();
  initRecoveryModal();
});

// Credenciales demo para agilizar pruebas
const DEMO_ACCOUNTS = {
  GERENTE: {
    email: 'mateo.gonzalez@grandsgh.com',
    pass: 'Gerente2026*',
    role: 'GERENTE',
    nombre: 'Lic. Mateo González'
  },
  CLIENTE: {
    email: 'elena.rostova@geneva-health.ch',
    pass: 'Cliente2026*',
    role: 'CLIENTE',
    nombre: 'Dra. Elena Rostova'
  },
  LIMPIEZA: {
    email: 'carmen.vega@grandsgh.com',
    pass: 'Limpieza2026*',
    role: 'LIMPIEZA',
    nombre: 'Carmen Vega'
  },
  MANTENIMIENTO: {
    email: 'dario.silva@grandsgh.com',
    pass: 'Mantenimiento2026*',
    role: 'MANTENIMIENTO',
    nombre: 'Ing. Darío Silva'
  }
};

/**
 * 1. Pestañas entre Iniciar Sesión y Crear Cuenta
 */
function initAuthTabs() {
  const tabLogin = document.getElementById('tab-login-btn');
  const tabRegister = document.getElementById('tab-register-btn');
  const formLogin = document.getElementById('form-login');
  const formRegister = document.getElementById('form-register');
  const headline = document.getElementById('auth-headline');
  const subhead = document.getElementById('auth-subhead');

  if (!tabLogin || !tabRegister) return;

  tabLogin.addEventListener('click', () => {
    tabLogin.classList.add('active');
    tabRegister.classList.remove('active');
    formLogin.style.display = 'flex';
    formRegister.style.display = 'none';
    headline.textContent = 'Acceso al Portal SGH';
    subhead.textContent = 'Ingrese sus credenciales certificadas de usuario para ingresar al sistema.';
  });

  tabRegister.addEventListener('click', () => {
    tabRegister.classList.add('active');
    tabLogin.classList.remove('active');
    formLogin.style.display = 'none';
    formRegister.style.display = 'flex';
    headline.textContent = 'Crear Nueva Cuenta';
    subhead.textContent = 'Complete sus datos y seleccione su rol funcional dentro del ecosistema SGH.';
  });
}

/**
 * 2. Chips de Acceso Rápido Demo
 */
function initDemoChips() {
  const chips = document.querySelectorAll('.demo-chip');
  const emailInput = document.getElementById('login-email');
  const passInput = document.getElementById('login-pass');

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const roleKey = chip.getAttribute('data-demo-role');
      const account = DEMO_ACCOUNTS[roleKey];
      if (account && emailInput && passInput) {
        emailInput.value = account.email;
        passInput.value = account.pass;
        showAuthToast(`Perfil cargado: ${account.nombre} (${roleKey})`, 'info');
      }
    });
  });
}

/**
 * 3. Visibilidad de Contraseña (Toggle Ver / Ocultar)
 */
function initPasswordToggles() {
  const toggleBtns = document.querySelectorAll('.toggle-password-btn');
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const input = document.getElementById(targetId);
      const icon = btn.querySelector('i');
      if (!input || !icon) return;

      if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'ph ph-eye-slash';
      } else {
        input.type = 'password';
        icon.className = 'ph ph-eye';
      }
    });
  });
}

/**
 * 4. Medidor de Fortaleza de Contraseña en Registro
 */
function initPasswordStrengthMeter() {
  const regPass = document.getElementById('reg-pass');
  const fill = document.getElementById('meter-fill');
  const text = document.getElementById('meter-text');

  if (!regPass || !fill || !text) return;

  regPass.addEventListener('input', () => {
    const val = regPass.value;
    let score = 0;

    if (val.length >= 6) score += 25;
    if (val.length >= 10) score += 25;
    if (/[A-Z]/.test(val) && /[0-9]/.test(val)) score += 25;
    if (/[^A-Za-z0-9]/.test(val)) score += 25;

    fill.style.width = score + '%';

    if (score === 0) {
      fill.style.backgroundColor = 'transparent';
      text.textContent = 'Seguridad';
      text.style.color = 'var(--text-muted)';
    } else if (score <= 25) {
      fill.style.backgroundColor = 'var(--status-danger)';
      text.textContent = 'Débil';
      text.style.color = 'var(--status-danger)';
    } else if (score <= 50) {
      fill.style.backgroundColor = 'var(--accent-gold)';
      text.textContent = 'Media';
      text.style.color = 'var(--accent-gold)';
    } else if (score <= 75) {
      fill.style.backgroundColor = 'var(--navy-600)';
      text.textContent = 'Buena';
      text.style.color = 'var(--navy-700)';
    } else {
      fill.style.backgroundColor = 'var(--status-success)';
      text.textContent = 'Segura';
      text.style.color = 'var(--status-success)';
    }
  });
}

/**
 * 5. Selector de Roles en Registro
 */
function initRoleSelectors() {
  const roleCards = document.querySelectorAll('.role-choice-card');
  roleCards.forEach(card => {
    card.addEventListener('click', () => {
      roleCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');

      const radio = card.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
    });
  });
}

/**
 * 6. Manejo de Formularios y Redirección
 */
function initFormSubmissions() {
  const formLogin = document.getElementById('form-login');
  const formRegister = document.getElementById('form-register');

  // Enviar Login
  if (formLogin) {
    formLogin.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value.trim();
      const pass = document.getElementById('login-pass').value.trim();
      const submitBtn = formLogin.querySelector('.btn-submit-auth');

      if (!email || !pass) {
        showAuthToast('Por favor complete su correo y contraseña.', 'error');
        return;
      }

      // Animación de carga
      const originalHtml = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="ph-bold ph-spinner animate-spin"></i> Verificando credenciales...';

      setTimeout(() => {
        submitBtn.innerHTML = '<i class="ph-bold ph-check-circle"></i> Acceso concedido';
        const lowerEmail = email.toLowerCase();
        let targetPortal = 'index.html';
        let portalName = 'panel ejecutivo gerencial';

        if (lowerEmail.includes('elena') || lowerEmail.includes('cliente')) {
          targetPortal = 'cliente.html';
          portalName = 'portal del huésped VIP';
        } else if (lowerEmail.includes('dario') || lowerEmail.includes('mantenimiento') || lowerEmail.includes('silva')) {
          targetPortal = 'mantenimiento.html';
          portalName = 'portal de operaciones de mantenimiento';
        }
        
        showAuthToast(`Sesión validada. Redirigiendo al ${portalName}...`, 'success');

        setTimeout(() => {
          window.location.href = targetPortal;
        }, 1000);
      }, 1000);
    });
  }

  // Enviar Registro
  if (formRegister) {
    formRegister.addEventListener('submit', (e) => {
      e.preventDefault();
      const nombre = document.getElementById('reg-nombre').value.trim();
      const email = document.getElementById('reg-email').value.trim();
      const pass = document.getElementById('reg-pass').value.trim();
      const passConf = document.getElementById('reg-pass-conf').value.trim();
      const selectedRole = document.querySelector('input[name="role-select"]:checked')?.value || 'CLIENTE';
      const submitBtn = formRegister.querySelector('.btn-submit-auth');

      if (!nombre || !email || !pass) {
        showAuthToast('Por favor ingrese todos los campos requeridos.', 'error');
        return;
      }

      if (pass !== passConf) {
        showAuthToast('Las contraseñas no coinciden.', 'error');
        return;
      }

      // Animación de carga
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="ph-bold ph-spinner animate-spin"></i> Registrando usuario...';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>Crear Cuenta en SGH</span> <i class="ph-bold ph-arrow-right"></i>';
        showAuthToast(`¡Cuenta creada con éxito para ${nombre}! Rol: ${selectedRole}. Ahora puede iniciar sesión.`, 'success');

        // Cambiar a pestaña de login
        document.getElementById('tab-login-btn').click();
        document.getElementById('login-email').value = email;
        document.getElementById('login-pass').value = '';
      }, 1200);
    });
  }
}

/**
 * 7. Modal de Recuperación de Contraseña
 */
function initRecoveryModal() {
  const modal = document.getElementById('modal-recovery');
  const openLink = document.getElementById('link-forgot-pass');
  const closeBtn = document.getElementById('btn-close-modal');
  const formRecovery = document.getElementById('form-recovery');

  if (!modal || !openLink) return;

  openLink.addEventListener('click', (e) => {
    e.preventDefault();
    modal.classList.add('active');
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });

  if (formRecovery) {
    formRecovery.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('recovery-email').value.trim();
      if (!email) {
        showAuthToast('Ingrese un correo válido.', 'error');
        return;
      }

      modal.classList.remove('active');
      showAuthToast(`Enlace de restablecimiento enviado a ${email}. Verifique su bandeja de entrada.`, 'success');
    });
  }
}

/**
 * 8. Notificaciones Flotantes Toast
 */
function showAuthToast(message, type = 'info') {
  const existing = document.querySelector('.auth-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `auth-toast ${type}`;

  let iconName = 'ph-info';
  if (type === 'success') iconName = 'ph-check-circle';
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
