-- =============================================================================
-- 620 SGH - SISTEMA DE GESTIÓN HOTELERA
-- Script de Creación de Base de Datos e Inserción de Datos Iniciales
-- Motor compatible: MySQL 8.0+ / MariaDB 10.4+
-- =============================================================================

CREATE DATABASE IF NOT EXISTS sgh_620
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE sgh_620;

-- Limpieza ordenada para re-ejecución segura
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS informes_mantenimiento;
DROP TABLE IF EXISTS incidencias_mantenimiento;
DROP TABLE IF EXISTS reportes_gerencia;
DROP TABLE IF EXISTS auditoria_reservas;
DROP TABLE IF EXISTS reservas;
DROP TABLE IF EXISTS habitaciones;
DROP TABLE IF EXISTS sesiones;
DROP TABLE IF EXISTS usuarios;
SET FOREIGN_KEY_CHECKS = 1;

-- =============================================================================
-- 1. TABLA DE USUARIOS (LOGIN, REGISTRO Y ROLES SGH)
-- =============================================================================
CREATE TABLE usuarios (
  id              VARCHAR(20)  NOT NULL,
  nombre          VARCHAR(120) NOT NULL,
  email           VARCHAR(160) NOT NULL,
  password_hash   CHAR(64)     NOT NULL COMMENT 'Hash SHA-256 de la contraseña',
  rol             ENUM('GERENTE', 'CLIENTE', 'LIMPIEZA', 'MANTENIMIENTO') NOT NULL DEFAULT 'CLIENTE',
  departamento    VARCHAR(120) NOT NULL,
  estado          ENUM('ACTIVO', 'INHABILITADO') NOT NULL DEFAULT 'ACTIVO',
  iniciales       VARCHAR(5)   NOT NULL,
  ultimo_acceso   DATETIME     NULL,
  creado_en       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_usuarios_email (email),
  KEY idx_usuarios_rol (rol),
  KEY idx_usuarios_estado (estado)
) ENGINE=InnoDB;

-- =============================================================================
-- 2. TABLA DE SESIONES ACTIVAS (OPCIONAL PARA BACKEND)
-- =============================================================================
CREATE TABLE sesiones (
  token           CHAR(64)     NOT NULL,
  usuario_id      VARCHAR(20)  NOT NULL,
  recordar        TINYINT(1)   NOT NULL DEFAULT 0,
  expira_en       DATETIME     NOT NULL,
  creado_en       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (token),
  KEY idx_sesiones_usuario (usuario_id),
  CONSTRAINT fk_sesiones_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- =============================================================================
-- 3. TABLA DE HABITACIONES / SUITES
-- =============================================================================
CREATE TABLE habitaciones (
  id              VARCHAR(20)   NOT NULL,
  numero          VARCHAR(10)   NOT NULL,
  nombre          VARCHAR(120)  NOT NULL,
  categoria       VARCHAR(80)   NOT NULL,
  precio_noche    DECIMAL(10,2) NOT NULL,
  capacidad       TINYINT UNSIGNED NOT NULL,
  superficie_m2   SMALLINT UNSIGNED NOT NULL,
  cama            VARCHAR(80)   NOT NULL,
  vista           VARCHAR(120)  NOT NULL,
  descripcion     TEXT          NOT NULL,
  imagen_url      VARCHAR(255)  NULL,
  badge           VARCHAR(60)   NULL,
  estado          ENUM('DISPONIBLE', 'OCUPADA', 'LIMPIEZA', 'MANTENIMIENTO') NOT NULL DEFAULT 'DISPONIBLE',
  PRIMARY KEY (id),
  UNIQUE KEY uq_habitaciones_numero (numero),
  KEY idx_habitaciones_estado (estado)
) ENGINE=InnoDB;

-- =============================================================================
-- 4. TABLA DE RESERVAS
-- =============================================================================
CREATE TABLE reservas (
  id                VARCHAR(20)   NOT NULL,
  usuario_id        VARCHAR(20)   NULL,
  huesped_nombre    VARCHAR(120)  NOT NULL,
  huesped_email     VARCHAR(160)  NOT NULL,
  huesped_telefono  VARCHAR(40)   NULL,
  habitacion_id     VARCHAR(20)   NOT NULL,
  check_in          DATE          NOT NULL,
  check_out         DATE          NOT NULL,
  noches            SMALLINT UNSIGNED NOT NULL,
  huespedes         TINYINT UNSIGNED NOT NULL DEFAULT 2,
  monto_total       DECIMAL(12,2) NOT NULL,
  estado            ENUM('CHECK_IN', 'CONFIRMADA', 'PENDIENTE_PAGO', 'CANCELADA') NOT NULL DEFAULT 'CONFIRMADA',
  estado_pago       ENUM('PAGADO', 'PENDIENTE', 'REEMBOLSADO') NOT NULL DEFAULT 'PAGADO',
  metodo_pago       VARCHAR(120)  NOT NULL,
  creado_en         TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_reservas_usuario (usuario_id),
  KEY idx_reservas_habitacion (habitacion_id),
  KEY idx_reservas_estado (estado),
  CONSTRAINT fk_reservas_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_reservas_habitacion
    FOREIGN KEY (habitacion_id) REFERENCES habitaciones (id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT chk_reservas_fechas CHECK (check_out > check_in)
) ENGINE=InnoDB;

-- =============================================================================
-- 5. TABLA DE AUDITORÍA DE RESERVAS
-- =============================================================================
CREATE TABLE auditoria_reservas (
  id                      BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  reserva_id              VARCHAR(20)     NOT NULL,
  fecha_evento            DATETIME        NOT NULL,
  accion                  TEXT            NOT NULL,
  usuario_responsable_id  VARCHAR(20)     NULL,
  PRIMARY KEY (id),
  KEY idx_auditoria_reserva (reserva_id),
  CONSTRAINT fk_auditoria_reserva
    FOREIGN KEY (reserva_id) REFERENCES reservas (id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_auditoria_usuario
    FOREIGN KEY (usuario_responsable_id) REFERENCES usuarios (id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

-- =============================================================================
-- 6. TABLA DE REPORTES DE GERENCIA
-- =============================================================================
CREATE TABLE reportes_gerencia (
  id               VARCHAR(30)  NOT NULL,
  titulo           VARCHAR(180) NOT NULL,
  categoria        VARCHAR(80)  NOT NULL,
  fecha_emision    DATETIME     NOT NULL,
  generado_por_id  VARCHAR(20)  NOT NULL,
  destinatarios    VARCHAR(255) NOT NULL,
  estado_envio     ENUM('ENVIADO', 'PENDIENTE', 'ERROR') NOT NULL DEFAULT 'ENVIADO',
  resumen          TEXT         NULL,
  PRIMARY KEY (id),
  KEY idx_reportes_generado_por (generado_por_id),
  CONSTRAINT fk_reportes_usuario
    FOREIGN KEY (generado_por_id) REFERENCES usuarios (id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

-- =============================================================================
-- 7. TABLA DE INCIDENCIAS DE MANTENIMIENTO
-- =============================================================================
CREATE TABLE incidencias_mantenimiento (
  id                   VARCHAR(20) NOT NULL,
  habitacion_id        VARCHAR(20) NULL,
  ubicacion_codigo     VARCHAR(20) NOT NULL,
  area                 VARCHAR(140) NOT NULL,
  titulo               VARCHAR(160) NOT NULL,
  descripcion          TEXT        NOT NULL,
  prioridad            ENUM('URGENTE', 'ALTA', 'MEDIA', 'BAJA') NOT NULL DEFAULT 'MEDIA',
  reportado_por        VARCHAR(120) NOT NULL,
  reportado_por_id     VARCHAR(20) NULL,
  estado               ENUM('PENDIENTE', 'EN_CURSO', 'RESUELTO', 'POSPUESTO') NOT NULL DEFAULT 'PENDIENTE',
  repuestos_estimados  VARCHAR(200) NULL,
  fecha_reporte        DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_incidencias_estado (estado),
  KEY idx_incidencias_prioridad (prioridad),
  CONSTRAINT fk_incidencias_habitacion
    FOREIGN KEY (habitacion_id) REFERENCES habitaciones (id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_incidencias_usuario
    FOREIGN KEY (reportado_por_id) REFERENCES usuarios (id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

-- =============================================================================
-- 8. TABLA DE INFORMES TÉCNICOS / HISTORIAL DE MANTENIMIENTO
-- =============================================================================
CREATE TABLE informes_mantenimiento (
  id                     BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  incidencia_id          VARCHAR(20)   NOT NULL,
  tecnico_id             VARCHAR(20)   NULL,
  reparado_por_nombre    VARCHAR(120)  NOT NULL,
  diagnostico            TEXT          NOT NULL,
  acciones_correctivas   TEXT          NULL,
  repuestos_utilizados   VARCHAR(255)  NULL,
  costo_usd              DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  horas_empleadas        DECIMAL(4,2)  NOT NULL DEFAULT 0.00,
  habitacion_habilitada  TINYINT(1)    NOT NULL DEFAULT 1,
  fecha_resolucion       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_informes_incidencia (incidencia_id),
  CONSTRAINT fk_informes_incidencia
    FOREIGN KEY (incidencia_id) REFERENCES incidencias_mantenimiento (id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_informes_tecnico
    FOREIGN KEY (tecnico_id) REFERENCES usuarios (id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

-- =============================================================================
-- DATOS INICIALES (SEED)
-- =============================================================================

-- Contraseñas iniciales (almacenadas con SHA-256):
--   Gerentes:       Gerente2026*
--   Clientes:       Cliente2026*
--   Limpieza:       Limpieza2026*
--   Mantenimiento:  Mantenimiento2026*
INSERT INTO usuarios
  (id, nombre, email, password_hash, rol, departamento, estado, iniciales, ultimo_acceso)
VALUES
  ('USR-001', 'Lic. Mateo González',     'mateo.gonzalez@620sgh.com',    SHA2('Gerente2026*', 256),       'GERENTE',       'Dirección General & Operaciones',      'ACTIVO',       'MG', '2026-10-26 17:00:00'),
  ('USR-002', 'Clara Domínguez',         'c.dominguez@620sgh.com',       SHA2('Gerente2026*', 256),       'GERENTE',       'Gerencia de Finanzas & Auditoría',     'ACTIVO',       'CD', '2026-10-26 10:15:00'),
  ('USR-003', 'Rosaura Mendez',          'r.mendez@620sgh.com',          SHA2('Limpieza2026*', 256),      'LIMPIEZA',      'Housekeeping Pisos 3 y 4',             'ACTIVO',       'RM', '2026-10-26 13:20:00'),
  ('USR-004', 'Carmen Vega',             'carmen.vega@620sgh.com',       SHA2('Limpieza2026*', 256),      'LIMPIEZA',      'Housekeeping Turno Matutino',          'ACTIVO',       'CV', '2026-10-26 14:00:00'),
  ('USR-005', 'Javier Morales',          'j.morales@620sgh.com',         SHA2('Limpieza2026*', 256),      'LIMPIEZA',      'Housekeeping Penthouse',               'INHABILITADO', 'JM', '2026-10-23 11:00:00'),
  ('USR-006', 'Ing. Darío Silva',        'dario.silva@620sgh.com',       SHA2('Mantenimiento2026*', 256), 'MANTENIMIENTO', 'Jefatura de Mantenimiento & Clima',    'ACTIVO',       'DS', '2026-10-26 12:45:00'),
  ('USR-007', 'Ing. Roberto Benítez',    'r.benitez@620sgh.com',         SHA2('Mantenimiento2026*', 256), 'MANTENIMIENTO', 'Electromecánica & Bombas',             'ACTIVO',       'RB', '2026-10-26 09:12:00'),
  ('USR-008', 'Emilio Varela',           'e.varela@620sgh.com',          SHA2('Mantenimiento2026*', 256), 'MANTENIMIENTO', 'Servicios Edilicios',                  'ACTIVO',       'EV', '2026-10-25 18:30:00'),
  ('USR-009', 'Dra. Elena Rostova',      'elena.rostova@geneva-health.ch', SHA2('Cliente2026*', 256),     'CLIENTE',       'Huésped Registrado',                   'ACTIVO',       'ER', '2026-10-24 16:00:00'),
  ('USR-010', 'Sr. George H. Vance',     'g.vance@vanceholdings.com',    SHA2('Cliente2026*', 256),       'CLIENTE',       'Huésped Frecuente',                    'ACTIVO',       'GV', '2026-10-24 12:00:00'),
  ('USR-011', 'Madame Sophie Delacroix', 's.delacroix@parisart.fr',      SHA2('Cliente2026*', 256),       'CLIENTE',       'Membresía Presidencial',               'ACTIVO',       'SD', '2026-10-20 19:10:00');

-- Habitaciones & Suites iniciales
INSERT INTO habitaciones
  (id, numero, nombre, categoria, precio_noche, capacidad, superficie_m2, cama, vista, descripcion, imagen_url, badge, estado)
VALUES
  ('STE-501', '501', 'Penthouse Imperial',      'Royal Master Suite',     2500.00, 4, 220, '1 King Size Imperial + 1 Queen', 'Panorámica 360° al Lago y Ciudad', 'La cúspide del refinamiento y privacidad. Chimenea de mármol italiano, terraza privada con jacuzzi exterior, servicio de mayordomo las 24 horas y ascensor de acceso directo.', 'img/suite_penthouse.jpg', 'La Joya del Hotel',       'OCUPADA'),
  ('STE-404', '404', 'Suite Embajador',         'Executive Corner Suite', 1300.00, 2, 135, '1 King Size Premium',            'Vista Frontal al Lago y Bosque',   'Diseñada para la máxima tranquilidad y distinción diplomática. Balcón panorámico con ventanales de suelo a techo, área de reuniones ejecutivas y cava de vinos privada.',       'img/suite_embajador.jpg', 'Más Elegida',             'DISPONIBLE'),
  ('STE-302', '302', 'Gran Terraza Jardín',     'Deluxe Family Suite',    1100.00, 5, 160, '2 King Size + 1 Sofá Cama',      'Jardines Franceses Privados',      'Espacios generosos y calidez residencial de ensueño. Salón comedor integrado, baño de mármol con doble lavabo y terraza con acceso exclusivo a los jardines del palacio.',      'img/suite_embajador.jpg', 'Familiar Exclusiva',      'DISPONIBLE'),
  ('STE-205', '205', 'Vista al Lago Superior',  'Premium King Room',       975.00, 2,  95, '1 King Size',                    'Atardecer sobre el Lago',          'Intimidad y sobriedad ejecutiva. Bañera hidromasaje independiente, ropa de cama de algodón egipcio de 1000 hilos y sistema de iluminación bioadaptativa.',                       'img/suite_penthouse.jpg', 'Disponibilidad Inmediata','DISPONIBLE'),
  ('STE-410', '410', 'Suite Ejecutiva',         'Executive Corner Suite', 1300.00, 2, 130, '1 King Size Premium',            'Vista Panorámica Ciudad',          'Suite ejecutiva equipada con sala de trabajo privada y terraza.',                                                                                                                'img/suite_embajador.jpg', NULL,                      'DISPONIBLE'),
  ('STE-314', '314', 'Deluxe Superior',         'Deluxe Room',             900.00, 2,  78, '1 King Size',                    'Jardín Interior',                  'Habitación superior con acabados en roble y mármol travertino.',                                                                                                                'img/suite_penthouse.jpg', NULL,                      'DISPONIBLE'),
  ('STE-304', '304', 'Gran Terraza',            'Deluxe Family Suite',    1050.00, 4, 145, '2 Queen Size',                   'Vista al Lago',                    'Suite de amplio metraje con terraza privada en tercer piso.',                                                                                                                    'img/suite_embajador.jpg', NULL,                      'MANTENIMIENTO'),
  ('STE-101', '101', 'Suite Jardín Planta Baja','Deluxe Room',             850.00, 2,  75, '1 King Size',                    'Parque Central',                   'Suite con acceso directo al parque y cerradura electrónica RFID.',                                                                                                               'img/suite_penthouse.jpg', NULL,                      'DISPONIBLE');

-- Reservas iniciales
INSERT INTO reservas
  (id, usuario_id, huesped_nombre, huesped_email, huesped_telefono, habitacion_id, check_in, check_out, noches, huespedes, monto_total, estado, estado_pago, metodo_pago)
VALUES
  ('RES-8921', NULL,      'Conde Alessandro Vieri',         'a.vieri@florenceholding.it',     '+39 055 918234', 'STE-501', '2026-10-26', '2026-10-31', 5, 2, 12500.00, 'CHECK_IN',       'PAGADO',      'Transferencia Amex Platinum'),
  ('RES-8922', 'USR-009', 'Dra. Elena Rostova',             'elena.rostova@geneva-health.ch', '+41 22 710 4920','STE-404', '2026-10-27', '2026-11-02', 6, 2,  7800.00, 'CONFIRMADA',     'PAGADO',      'Tarjeta Corporativa Visa Signature'),
  ('RES-8923', NULL,      'Arq. Santiago Bilbao & Familia', 'santiago@bilbaostudio.es',       '+34 914 883 112','STE-302', '2026-10-28', '2026-11-01', 4, 4,  4400.00, 'CONFIRMADA',     'PAGADO',      'Mastercard Black'),
  ('RES-8924', NULL,      'Marcus Sterling',                'm.sterling@capital-partners.co.uk','+44 20 7946 0912','STE-205','2026-10-29', '2026-10-31', 2, 1,  1950.00, 'PENDIENTE_PAGO', 'PENDIENTE',   'En espera de liquidación bancaria SWIFT'),
  ('RES-8925', NULL,      'Valentin Laurent',               'v.laurent@luxury-spirits.fr',    '+33 1 42 68 55 00','STE-410','2026-10-30', '2026-11-04', 5, 2,  6500.00, 'CONFIRMADA',     'PAGADO',      'Amex Centurion'),
  ('RES-8920', NULL,      'Kenji Takahashi',                'takahashi.k@tokyotech.jp',       '+81 3 5555 0143','STE-314', '2026-10-25', '2026-10-28', 3, 1,  2700.00, 'CANCELADA',      'REEMBOLSADO', 'Reembolso total gerencial ejecutado');

-- Auditoría de reservas
INSERT INTO auditoria_reservas
  (reserva_id, fecha_evento, accion, usuario_responsable_id)
VALUES
  ('RES-8921', '2026-10-20 14:10:00', 'Reserva creada vía Portal Cliente', NULL),
  ('RES-8921', '2026-10-20 14:15:00', 'Pago de garantía completado ($12,500.00)', NULL),
  ('RES-8921', '2026-10-26 12:30:00', 'Suite inspeccionada y entregada con amenidades especiales', 'USR-003'),
  ('RES-8921', '2026-10-26 13:45:00', 'Check-in presencial validado con pasaporte diplomático', 'USR-001'),
  ('RES-8922', '2026-10-22 09:20:00', 'Reserva confirmada con tarifa corporativa', 'USR-009'),
  ('RES-8922', '2026-10-22 09:25:00', 'Cobro verificado satisfactoriamente', 'USR-009'),
  ('RES-8923', '2026-10-24 18:02:00', 'Reserva directa con solicitud de cuna y servicio de transfers', NULL),
  ('RES-8924', '2026-10-25 11:40:00', 'Pre-reserva efectuada. Vencimiento de plazo en 24h', NULL),
  ('RES-8925', '2026-10-25 16:15:00', 'Reserva asegurada con paquete gastronómico', NULL),
  ('RES-8920', '2026-10-23 10:00:00', 'Reserva creada', NULL),
  ('RES-8920', '2026-10-25 08:30:00', 'Cancelación manual gerencial por reprogramación de vuelo', 'USR-001');

-- Reportes de gerencia
INSERT INTO reportes_gerencia
  (id, titulo, categoria, fecha_emision, generado_por_id, destinatarios, estado_envio, resumen)
VALUES
  ('REP-2026-104', 'Auditoría Mensual de Ocupación & RevPAR',                'Ocupación & Reservas',        '2026-10-26 17:30:00', 'USR-001', 'directorio@620sgh.com',    'ENVIADO', 'Ocupación media del 88.4%. Mayor demanda en suites Penthouse y Master.'),
  ('REP-2026-103', 'Consolidado Financiero Cierre Q3 & Proyección Q4',       'Financiero & Ingresos',       '2026-10-24 11:15:00', 'USR-002', 'auditoria@620sgh.com',     'ENVIADO', 'Superávit operativo del 18.5% respecto a metas trimestrales.'),
  ('REP-2026-102', 'Informe de Eficiencia Operativa Housekeeping & Tiempos', 'Operaciones & Limpieza',      '2026-10-21 16:40:00', 'USR-001', 'operaciones@620sgh.com',   'ENVIADO', 'Tiempo promedio de limpieza reducido a 24 minutos por habitación estándar.'),
  ('REP-2026-101', 'Reporte Técnico de Mantenimiento de Climatización Central','Mantenimiento & Incidencias','2026-10-18 09:20:00', 'USR-001', 'mantenimiento@620sgh.com', 'ENVIADO', 'Certificación de calderas y chillers efectuada conforme a normativa.');

-- Incidencias de mantenimiento (activas + resueltas)
INSERT INTO incidencias_mantenimiento
  (id, habitacion_id, ubicacion_codigo, area, titulo, descripcion, prioridad, reportado_por, reportado_por_id, estado, repuestos_estimados, fecha_reporte)
VALUES
  ('INC-2041', 'STE-304', '304',   'Suite 304 - Gran Terraza',                     'Avería en Climatizador Chiller (Falta de enfriamiento)', 'El huésped reporta que la unidad fan-coil no desciende de 24°C y emite un ligero zumbido intermitente.', 'URGENTE', 'Personal Limpieza (Carmen Vega)', 'USR-004', 'PENDIENTE', 'Filtro HEPA / Válvula de 3 vías',          '2026-10-26 17:35:00'),
  ('INC-2042', 'STE-404', '404',   'Suite 404 - Suite Embajador',                  'Goteo en Grifería Termostática de Hidromasaje',          'Pérdida continua de agua caliente por la junta del mezclador principal de la bañera de hidromasaje.',    'ALTA',    'Huésped (Dra. Elena Rostova)',    'USR-009', 'EN_CURSO',  'Cartucho cerámico termostático 1/2',       '2026-10-26 17:00:00'),
  ('INC-2043', NULL,      'PISC',  'Áreas Comunes - Piscina Climatizada',          'Descalibración en Sistema de Bomba Calorífica',          'La temperatura del agua descendió a 22°C (estándar 29°C). Requiere rearme manual del presostato.',       'MEDIA',   'Inspección de Turno Mañana',       NULL,      'PENDIENTE', 'Sonda NTC de temperatura',                 '2026-10-26 15:00:00'),
  ('INC-2044', 'STE-501', '501',   'Suite 501 - Penthouse Imperial',               'Bloqueo en Motor de Cortinas Blackout Panorámicas',      'El servomotor lateral del riel este se trabó en posición semiabierta. Requiere lubricación y reseteo.',   'MEDIA',   'Mayordomía',                      NULL,      'PENDIENTE', 'Fusible térmico 2A / Grasa dieléctrica',   '2026-10-26 14:00:00'),
  ('INC-2045', NULL,      'ASC-B', 'Infraestructura - Ascensor Panorámico Torre B','Revisión Periódica de Patines y Sensores de Puerta',     'Mantenimiento preventivo quincenal programado para garantizar suavidad de marcha y seguridad biométrica.','BAJA',   'Plan Director SGH',               NULL,      'EN_CURSO',  'Kit de escobillas de grafito',             '2026-10-26 08:00:00'),
  ('INC-2038', 'STE-205', '205',   'Suite 205 - Vista al Lago Superior',           'Sustitución de Luminarias LED Dimerizables',             'Falla de iluminación principal por fluctuación eléctrica.',                                               'MEDIA',   'Inspección de Turno',             NULL,      'RESUELTO',  '2x Lámpara LED Warm 2700K + Driver MeanWell','2026-10-25 15:00:00'),
  ('INC-2039', 'STE-302', '302',   'Suite 302 - Gran Terraza Jardín',              'Desobstrucción y Sellado de Drenaje Jacuzzi',            'Drenaje lento en jacuzzi exterior de terraza.',                                                          'MEDIA',   'Personal Limpieza',               'USR-003', 'RESUELTO',  'Sellador polímero neutro + Filtro sifón',  '2026-10-25 11:00:00'),
  ('INC-2040', 'STE-101', '101',   'Suite 101 - Suite Jardín Planta Baja',         'Reprogramación de Cerradura Electrónica RFID',           'La tarjeta maestra no habilita el acceso a la suite.',                                                   'ALTA',    'Recepción',                       NULL,      'RESUELTO',  '4x Baterías Litio AA Industrial',          '2026-10-24 10:00:00');

-- Historial técnico de reparaciones
INSERT INTO informes_mantenimiento
  (incidencia_id, tecnico_id, reparado_por_nombre, diagnostico, acciones_correctivas, repuestos_utilizados, costo_usd, horas_empleadas, habitacion_habilitada, fecha_resolucion)
VALUES
  ('INC-2038', 'USR-006', 'Ing. Darío Silva', 'Driver electrónico de 24V quemado por fluctuación de tensión.', 'Sustitución completa de driver y verificación de dimerización.', '2x Lámpara LED Warm 2700K + Driver MeanWell', 115.00, 1.20, 1, '2026-10-25 16:30:00'),
  ('INC-2039', NULL,      'Téc. Marcelo Paz', 'Obstrucción parcial por sedimentación en sifón secundario.',     'Limpieza de conducto, cambio de filtro y sellado perimetral.',  'Sellador polímero neutro + Filtro sifón',      80.00, 0.80, 1, '2026-10-25 14:10:00'),
  ('INC-2040', 'USR-006', 'Ing. Darío Silva', 'Batería de respaldo agotada y desincronización con el servidor de llaves maestras.', 'Reemplazo de celdas y resincronización RFID.', '4x Baterías Litio AA Industrial', 45.00, 0.50, 1, '2026-10-24 11:20:00');
