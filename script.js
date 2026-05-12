// ─── Target Dates (Mexico City, UTC-6) ───

// Home / Apartment: December 17, 2027 at 3:00 PM
const homeTargetDate = new Date('2027-12-17T15:00:00-06:00');

// New Car 2028: November 1, 2028 at 12:00 PM
const crvTargetDate = new Date('2028-11-01T12:00:00-06:00');

// Mommy Makeover recovery milestones
const MAKEOVER_FIRST_RECOVERY_TS = new Date('2026-06-01T00:00:00-06:00').getTime();
const MAKEOVER_FULL_RECOVERY_TS = new Date('2026-08-17T00:00:00-06:00').getTime();

// Birthday Beach Trip: June 4, 2026 at 4:00 AM
const birthdayTargetDate = new Date('2026-06-04T04:00:00-06:00');

const citrusTargetDate = new Date('2029-02-24T00:00:00-06:00');

const CITRUS_SIGNING_TS = new Date('2025-02-24T00:00:00-06:00').getTime();
const CITRUS_INITIAL_AMOUNT = 72600;
const CITRUS_MONTHLY_AMOUNT = 3520;
const CITRUS_MONTHLY_PAYMENTS = 48;
const CITRUS_TOTAL_PAYMENTS = 1 + CITRUS_MONTHLY_PAYMENTS;
const CITRUS_TOTAL_AMOUNT = CITRUS_INITIAL_AMOUNT + CITRUS_MONTHLY_PAYMENTS * CITRUS_MONTHLY_AMOUNT;
const CITRUS_MONTHLY_START_YEAR = 2025;
const CITRUS_MONTHLY_START_MONTH = 3;

// ─── Utilities ───

function pluralize(value, singular, plural) {
    return value === 1 ? singular : plural;
}

// ─── Shared Adaptive Countdown ───
// Shows Years/Months/Days when years > 0,
// then Months/Days/Hours when months > 0,
// then Days/Hours/Minutes when days > 0,
// then Hours/Minutes/Seconds, cascading down.

function updateCountdown(prefix, targetDate, daysOnly = false) {
    const now = new Date();
    const diff = targetDate - now;

    const el1 = document.getElementById(`${prefix}-1`);
    const el2 = document.getElementById(`${prefix}-2`);
    const el3 = document.getElementById(`${prefix}-3`);
    const lbl1 = document.getElementById(`${prefix}-1-label`);
    const lbl2 = document.getElementById(`${prefix}-2-label`);
    const lbl3 = document.getElementById(`${prefix}-3-label`);

    if (!el1 || !el2 || !el3) return;

    if (diff <= 0) {
        el1.textContent = '00';
        el2.textContent = '00';
        el3.textContent = '00';
        return;
    }

    const SEC = 1000;
    const MIN = SEC * 60;
    const HOUR = MIN * 60;
    const DAY = HOUR * 24;

    const totalDays = Math.floor(diff / DAY);
    const years = Math.floor(totalDays / 365.25);
    const remainAfterYears = Math.floor(totalDays - (years * 365.25));
    const months = Math.floor(remainAfterYears / 30.44);
    const daysAfterMonths = Math.floor(remainAfterYears - (months * 30.44));

    const totalMonths = Math.floor(totalDays / 30.44);
    const daysAfterTotalMonths = Math.floor(totalDays - (totalMonths * 30.44));

    const hours = Math.floor((diff % DAY) / HOUR);
    const mins = Math.floor((diff % HOUR) / MIN);
    const secs = Math.floor((diff % MIN) / SEC);

    let v1, v2, v3, l1, l2, l3;
    let showThird = false;

    if (daysOnly) {
        v1 = totalDays; l1 = pluralize(totalDays, 'Day', 'Days');
        v2 = null;
    } else if (years > 0) {
        v1 = years;  l1 = pluralize(years, 'Year', 'Years');
        v2 = months; l2 = pluralize(months, 'Month', 'Months');
        v3 = daysAfterMonths; l3 = pluralize(daysAfterMonths, 'Day', 'Days');
        showThird = true;
    } else if (totalMonths > 0) {
        v1 = totalMonths; l1 = pluralize(totalMonths, 'Month', 'Months');
        v2 = daysAfterTotalMonths; l2 = pluralize(daysAfterTotalMonths, 'Day', 'Days');
    } else if (totalDays > 0) {
        v1 = totalDays; l1 = pluralize(totalDays, 'Day', 'Days');
        v2 = hours; l2 = pluralize(hours, 'Hour', 'Hours');
    } else if (hours > 0) {
        v1 = hours; l1 = pluralize(hours, 'Hour', 'Hours');
        v2 = mins; l2 = pluralize(mins, 'Minute', 'Minutes');
    } else if (mins > 0) {
        v1 = mins; l1 = pluralize(mins, 'Minute', 'Minutes');
        v2 = secs; l2 = pluralize(secs, 'Second', 'Seconds');
    } else {
        v1 = secs; l1 = pluralize(secs, 'Second', 'Seconds');
        v2 = null;
    }

    el1.textContent = String(v1).padStart(2, '0');
    if (lbl1) lbl1.textContent = l1;

    // Show/hide slot 2
    const unit2 = el2.closest('.countdown-unit');
    const sep1 = unit2?.previousElementSibling;
    if (v2 != null) {
        el2.textContent = String(v2).padStart(2, '0');
        if (lbl2) lbl2.textContent = l2;
        if (unit2) unit2.style.display = '';
        if (sep1) sep1.style.display = '';
    } else {
        if (unit2) unit2.style.display = 'none';
        if (sep1) sep1.style.display = 'none';
    }

    // Show/hide slot 3 + its separator
    const unit3 = el3.closest('.countdown-unit');
    const sep2 = unit3?.previousElementSibling;
    if (showThird) {
        el3.textContent = String(v3).padStart(2, '0');
        if (lbl3) lbl3.textContent = l3;
        if (unit3) unit3.style.display = '';
        if (sep2) sep2.style.display = '';
    } else {
        if (unit3) unit3.style.display = 'none';
        if (sep2) sep2.style.display = 'none';
    }
}

// ─── Citrus Payment Tracker ───

const MXN_FORMATTER = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
});

const CITRUS_MONTHLY_TS = Array.from({ length: CITRUS_MONTHLY_PAYMENTS }, (_, i) => {
    const totalMonths = (CITRUS_MONTHLY_START_MONTH - 1) + i;
    const year = CITRUS_MONTHLY_START_YEAR + Math.floor(totalMonths / 12);
    const month = String((totalMonths % 12) + 1).padStart(2, '0');
    return new Date(`${year}-${month}-01T00:00:00-06:00`).getTime();
});

let citrusDom = null;
let citrusLastPaid = -1;

function updateCitrusPayments() {
    const now = Date.now();
    const initialPaid = now >= CITRUS_SIGNING_TS ? 1 : 0;
    let monthlyPaid = 0;
    while (monthlyPaid < CITRUS_MONTHLY_PAYMENTS && CITRUS_MONTHLY_TS[monthlyPaid] <= now) monthlyPaid++;
    const paid = initialPaid + monthlyPaid;
    if (paid === citrusLastPaid) return;
    citrusLastPaid = paid;

    if (!citrusDom) {
        citrusDom = {
            paidCount: document.getElementById('ct-paid-count'),
            remainingCount: document.getElementById('ct-remaining-count'),
            paidAmount: document.getElementById('ct-paid-amount'),
            remainingAmount: document.getElementById('ct-remaining-amount'),
            fill: document.getElementById('ct-progress-fill'),
        };
        document.getElementById('ct-total').textContent = CITRUS_TOTAL_PAYMENTS;
        const initFmt = MXN_FORMATTER.format(CITRUS_INITIAL_AMOUNT);
        const moFmt = MXN_FORMATTER.format(CITRUS_MONTHLY_AMOUNT);
        const totalFmt = MXN_FORMATTER.format(CITRUS_TOTAL_AMOUNT);
        document.getElementById('ct-tagline').textContent =
            `Aporte ${initFmt} + ${CITRUS_MONTHLY_PAYMENTS} × ${moFmt} MXN · Total ${totalFmt}`;
    }

    const paidAmount = initialPaid * CITRUS_INITIAL_AMOUNT + monthlyPaid * CITRUS_MONTHLY_AMOUNT;
    const remainingAmount = CITRUS_TOTAL_AMOUNT - paidAmount;
    const remaining = CITRUS_TOTAL_PAYMENTS - paid;

    citrusDom.paidCount.textContent = paid;
    citrusDom.remainingCount.textContent = remaining;
    citrusDom.paidAmount.textContent = MXN_FORMATTER.format(paidAmount);
    citrusDom.remainingAmount.textContent = MXN_FORMATTER.format(remainingAmount);
    citrusDom.fill.style.width = `${(paidAmount / CITRUS_TOTAL_AMOUNT) * 100}%`;
}

// ─── Makeover Recovery Milestones ───

const MS_PER_DAY = 86400000;
let makeoverDom = null;
let makeoverLastFirst = -1;
let makeoverLastFull = -1;

function updateMakeoverRecoveries() {
    const now = Date.now();
    const first = Math.max(0, Math.floor((MAKEOVER_FIRST_RECOVERY_TS - now) / MS_PER_DAY));
    const full = Math.max(0, Math.floor((MAKEOVER_FULL_RECOVERY_TS - now) / MS_PER_DAY));
    if (first === makeoverLastFirst && full === makeoverLastFull) return;
    makeoverLastFirst = first;
    makeoverLastFull = full;
    if (!makeoverDom) {
        makeoverDom = {
            first: document.getElementById('mk-first-n'),
            full: document.getElementById('mk-full-n'),
        };
    }
    makeoverDom.first.textContent = first;
    makeoverDom.full.textContent = full;
}

// ─── Protocolo: data ───

const PROTOCOL_TASKS = [
    { id: 'kegel-1', phase: 1, icon: '🏋️', name: 'Kegel · Fase 1', short: 'Contraer 3s · Relajar 3s · 15 reps × 3 series',
      type: 'Ejercicio', frequency: 'Diario',
      how: 'Contrae el músculo pubococcígeo (el que usas para detener la orina) durante 3 segundos. Relaja completamente durante 3 segundos. Repite 15 veces — eso es 1 serie. Haz 3 series, descansando 30s entre series.',
      why: 'BJU International: 82.5% de hombres con eyaculación precoz mejoraron significativamente entrenando el suelo pélvico.',
      warning: 'También practica la RELAJACIÓN — un músculo PC hipertónico empeora la EP.',
      kegel: { contract: 3, relax: 3, reps: 15, sets: 3, rest: 30 } },
    { id: 'zinc', phase: 1, icon: '💊', name: 'Zinc', short: '25–45 mg con comida',
      type: 'Suplemento', frequency: 'Diario',
      how: 'Tomar 25–45 mg de zinc con alguna comida del día (preferentemente que contenga proteína).',
      why: 'Cofactor crítico para la síntesis de testosterona. Deficiencia se asocia con hipogonadismo y baja libido.' },
    { id: 'd3', phase: 1, icon: '💊', name: 'Vitamina D3 + K2', short: '5,000 UI con comida con grasa',
      type: 'Suplemento', frequency: 'Diario',
      how: 'Tomar 5,000 UI de D3 + K2 con una comida que contenga grasa (mejora la absorción).',
      why: 'Niveles óptimos de D3 correlacionan con mayor testosterona libre y mejor función eréctil.' },
    { id: 'mg', phase: 1, icon: '💊', name: 'Magnesio Glicinato', short: '300–400 mg antes de dormir',
      type: 'Suplemento', frequency: 'Diario',
      how: 'Tomar 300–400 mg de magnesio glicinato 30–60 minutos antes de dormir.',
      why: 'Mejora la calidad del sueño profundo y la regulación del eje hormonal nocturno donde se produce el pico de testosterona.' },
    { id: 'omega3', phase: 1, icon: '💊', name: 'Omega-3', short: '2–3 g EPA+DHA con comida',
      type: 'Suplemento', frequency: 'Diario',
      how: 'Tomar 2–3 gramos de EPA+DHA combinados (no aceite de pescado total) con alguna comida.',
      why: 'Reduce inflamación sistémica que afecta función endotelial y respuesta eréctil.' },
    { id: 'training', phase: 1, icon: '🏃', name: 'Fuerza o cardio', short: '4 días por semana',
      type: 'Ejercicio', frequency: '4×/semana',
      how: 'Entrenamiento de fuerza (compuestos: sentadilla, peso muerto, press) o cardio moderado-intenso. 4 sesiones por semana.',
      why: 'El ejercicio agudo eleva testosterona; el crónico mejora sensibilidad a insulina y salud endotelial.' },
    { id: 'sleep', phase: 1, icon: '😴', name: 'Dormir 7–9 horas', short: 'En horario consistente',
      type: 'Hábito', frequency: 'Diario',
      how: 'Acostarte y levantarte a la misma hora ± 30 min, en oscuridad total. Pantallas off 30 min antes de dormir.',
      why: 'La testosterona se produce mayormente en sueño profundo. 5 noches de mal sueño bajan testosterona 10–15%.' },

    { id: 'stop-start', phase: 2, icon: '🧘', name: 'Técnica Stop-Start', short: '3–4 veces por semana',
      type: 'Entrenamiento', frequency: '3–4×/semana',
      how: 'Masturbación controlada: al llegar al 70–80% del umbral eyaculatorio, pausa por completo hasta que la sensación baje al 30–40%. Repite 4–5 ciclos antes de permitir eyaculación.',
      why: 'Entrena el control consciente del umbral eyaculatorio y desensibiliza el reflejo automático.' },
    { id: 'kegel-2', phase: 2, icon: '🏋️', name: 'Kegel · Fase 2', short: 'Contraer 5s · Relajar 5s · 20 reps × 3 series',
      type: 'Ejercicio', frequency: 'Diario',
      how: 'Contrae el PC durante 5 segundos, relaja completamente 5 segundos. 20 reps por serie × 3 series, con 30s de descanso entre series.',
      why: 'Fortalecimiento progresivo del suelo pélvico; mejora capacidad de mantener contracción bajo demanda.',
      warning: 'Mantén la atención en la relajación — no dejes el músculo tenso entre reps.',
      kegel: { contract: 5, relax: 5, reps: 20, sets: 3, rest: 30 } },
    { id: 'ashwagandha', phase: 2, icon: '💊', name: 'Ashwagandha KSM-66', short: '300–600 mg con comida',
      type: 'Suplemento', frequency: 'Diario',
      how: 'Tomar 300–600 mg de extracto estandarizado KSM-66 con una comida.',
      why: 'Reduce cortisol (antagonista hormonal de testosterona) y mejora respuesta al estrés.' },
    { id: 'citrulina', phase: 2, icon: '💊', name: 'L-Citrulina', short: '3–6 g en ayunas',
      type: 'Suplemento', frequency: 'Diario',
      how: 'Tomar 3–6 g en ayunas o 30–60 min antes de entrenar/actividad sexual.',
      why: 'Precursor de arginina → óxido nítrico → vasodilatación. Mejora rigidez y respuesta eréctil.' },
    { id: 'hiit', phase: 2, icon: '⚡', name: 'HIIT', short: '20–30 min · 2 veces por semana',
      type: 'Ejercicio', frequency: '2×/semana',
      how: 'Intervalos de alta intensidad (e.g., 30s al máximo / 90s recuperación) durante 20–30 min. 2 sesiones por semana.',
      why: 'Incrementa hormona de crecimiento y testosterona aguda más que el cardio steady-state.' },

    { id: 'kegel-3', phase: 3, icon: '🏋️', name: 'Kegel · Fase 3', short: 'Flutter + Largas combinadas',
      type: 'Ejercicio', frequency: 'Diario',
      how: 'Flutter: contracciones rápidas (0.5s on / 0.5s off) × 20. Largas: contracciones de 10s × 10. Combina ambas en 3 series.',
      why: 'Desarrolla resistencia (fibras lentas) y respuesta rápida (fibras rápidas) del músculo PC.',
      kegel: { compound: true, parts: [
          { label: 'Flutter', contract: 0.5, relax: 0.5, reps: 20 },
          { label: 'Largas', contract: 10, relax: 10, reps: 10 }
      ], sets: 3, rest: 45 } },
    { id: 'relax-pc', phase: 3, icon: '🧘', name: 'Relajación PC', short: '10 reps de relajación completa',
      type: 'Ejercicio', frequency: 'Diario',
      how: 'Sentado o acostado, identifica el músculo PC y relájalo completamente durante 10–15 segundos. 10 reps.',
      why: 'La hipertonía del suelo pélvico empeora la EP. Este ejercicio enseña el opuesto a la contracción.' },
    { id: 'tongkat', phase: 3, icon: '💊', name: 'Tongkat Ali', short: '200–400 mg estandarizado 2%',
      type: 'Suplemento', frequency: 'Diario',
      how: 'Tomar 200–400 mg de extracto estandarizado al 2% de eurycomanona, con comida.',
      why: 'Incrementa testosterona libre y biodisponible; reduce SHBG.' },
];

const PHASE_NAMES = ['', 'Reset Neurológico', 'Entrenamiento Activo', 'Consolidación'];
const PHASE_RANGES = [null, [1, 28], [29, 56], [57, 112]];
const PROTOCOL_TOTAL_DAYS = 112;
const PROTOCOL_STATE_KEY = 'protocolo:state';

// ─── Protocolo: state ───

function todayKey() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function loadProtocolState() {
    try {
        const raw = localStorage.getItem(PROTOCOL_STATE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed && parsed.startDate) return parsed;
        }
    } catch {}
    const state = { startDate: todayKey(), done: {} };
    saveProtocolState(state);
    return state;
}

function saveProtocolState(state) {
    localStorage.setItem(PROTOCOL_STATE_KEY, JSON.stringify(state));
}

function resetProtocolState() {
    const state = { startDate: todayKey(), done: {} };
    saveProtocolState(state);
    return state;
}

function getProtocolStatus() {
    const state = loadProtocolState();
    const start = new Date(state.startDate + 'T00:00:00');
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dayNum = Math.floor((today - start) / 86400000) + 1;
    const week = Math.ceil(dayNum / 7);
    let phase;
    if (dayNum < 1) phase = 0;
    else if (dayNum <= 28) phase = 1;
    else if (dayNum <= 56) phase = 2;
    else if (dayNum <= PROTOCOL_TOTAL_DAYS) phase = 3;
    else phase = 4;
    return { dayNum, week, phase, state };
}

function tasksForPhase(phase) {
    if (phase < 1 || phase > 3) return [];
    return PROTOCOL_TASKS.filter(t => t.phase <= phase);
}

function isTaskDoneToday(taskId, state) {
    return (state.done[todayKey()] || []).includes(taskId);
}

function toggleTaskDone(taskId) {
    const state = loadProtocolState();
    const today = todayKey();
    if (!state.done[today]) state.done[today] = [];
    const idx = state.done[today].indexOf(taskId);
    if (idx >= 0) state.done[today].splice(idx, 1);
    else state.done[today].push(taskId);
    saveProtocolState(state);
}

// ─── Protocolo: render ───

let protocoloLastRenderKey = '';
let protocoloView = 'list';
let currentKegelTaskId = null;

function renderProtocolo() {
    if (protocoloView === 'kegel') {
        renderKegelView();
        return;
    }
    renderListView();
}

function showView(view) {
    protocoloView = view;
    document.getElementById('protocolo-view-list').hidden = view !== 'list';
    document.getElementById('protocolo-view-kegel').hidden = view !== 'kegel';
    if (view === 'list') {
        protocoloLastRenderKey = '';
        renderListView();
    }
}

function renderListView() {
    const { dayNum, phase, state } = getProtocolStatus();
    const tasks = tasksForPhase(phase);
    const doneToday = state.done[todayKey()] || [];
    const doneCount = tasks.filter(t => doneToday.includes(t.id)).length;

    const key = `${todayKey()}|${phase}|${dayNum}|${doneCount}|${tasks.length}`;
    if (key === protocoloLastRenderKey) return;
    protocoloLastRenderKey = key;

    const dayLine = document.getElementById('protocolo-day-line');
    const container = document.getElementById('protocolo-tasks');
    if (!dayLine || !container) return;

    if (phase === 4) {
        dayLine.textContent = `Día ${dayNum} · Mantenimiento`;
        container.innerHTML = `<div class="protocolo-empty">Protocolo de 112 días completado. Mantén Kegel + suplementos clave como hábito sostenido.</div>`;
        return;
    }

    if (phase === 0) {
        dayLine.textContent = `Empieza en ${Math.abs(dayNum - 1)} día(s)`;
        container.innerHTML = '';
        return;
    }

    dayLine.textContent = `Fase ${phase} · ${PHASE_NAMES[phase]} · Día ${dayNum} · ${doneCount}/${tasks.length}`;

    container.innerHTML = '';
    for (const task of tasks) {
        const done = doneToday.includes(task.id);
        const isKegel = !!task.kegel;
        const item = document.createElement('button');
        item.className = `protocolo-task${done ? ' done' : ''}${isKegel ? ' has-detail' : ''}`;
        item.dataset.id = task.id;
        item.innerHTML = `
            <span class="protocolo-task-check">✓</span>
            <span class="protocolo-task-icon">${task.icon}</span>
            <div class="protocolo-task-info">
                <div class="protocolo-task-name">${task.name}</div>
                <div class="protocolo-task-short">${task.short}</div>
            </div>
            ${isKegel ? '<span class="protocolo-task-chev">›</span>' : ''}
        `;
        item.addEventListener('click', () => {
            if (isKegel) {
                openKegelView(task.id);
            } else {
                toggleTaskDone(task.id);
                protocoloLastRenderKey = '';
                renderListView();
            }
        });
        container.appendChild(item);
    }
}

function openKegelView(taskId) {
    currentKegelTaskId = taskId;
    showView('kegel');
}

function closeKegelView() {
    if (kegelState.phase !== 'idle') resetKegelTimer();
    currentKegelTaskId = null;
    showView('list');
}

function renderKegelView() {
    const task = PROTOCOL_TASKS.find(t => t.id === currentKegelTaskId);
    if (!task) { closeKegelView(); return; }

    const detail = document.getElementById('kegel-detail');
    const warningHtml = task.warning
        ? `<div class="kegel-warning"><span>⚠️</span><span>${task.warning}</span></div>` : '';
    const isCompound = task.kegel?.compound;

    detail.innerHTML = `
        <div class="kegel-title">
            <span class="kegel-title-icon">${task.icon}</span>
            <div>
                <div class="kegel-title-name">${task.name}</div>
                <div class="kegel-title-meta">${task.type} · ${task.frequency}</div>
            </div>
        </div>
        <div class="kegel-summary">${task.short}</div>
        <div class="kegel-section">
            <div class="kegel-section-label">Cómo hacerlo</div>
            <div class="kegel-section-body">${task.how}</div>
        </div>
        <div class="kegel-section">
            <div class="kegel-section-label">¿Por qué?</div>
            <div class="kegel-section-body">${task.why}</div>
        </div>
        ${warningHtml}
        ${isCompound ? '<div class="kegel-note">El timer guiado para Fase 3 (Flutter + Largas) está en desarrollo. Sigue las instrucciones manualmente y marca como hecho al terminar.</div>' : ''}
    `;

    const done = isTaskDoneToday(task.id, loadProtocolState());
    const doneBtn = document.getElementById('kegel-done');
    doneBtn.textContent = done ? '↩ Desmarcar' : '✓ Marcar como hecho';

    document.getElementById('kegel-rep-total').textContent = task.kegel.reps || '—';
    document.getElementById('kegel-set-total').textContent = task.kegel.sets || '—';
    document.getElementById('kegel-rep').textContent = '0';
    document.getElementById('kegel-set').textContent = '1';
    document.getElementById('kegel-count').textContent = '—';
    document.getElementById('kegel-state').textContent = 'LISTO';
    document.getElementById('kegel-pulse').className = 'kegel-pulse';

    const startBtn = document.getElementById('kegel-start');
    startBtn.textContent = '▶ Iniciar timer';
    startBtn.disabled = !!isCompound;
    startBtn.style.opacity = isCompound ? '0.4' : '1';
}

// ─── Kegel timer state machine ───

const kegelState = {
    task: null,
    set: 1,
    rep: 0,
    phase: 'idle',
    phaseStartMs: 0,
    phaseDurationMs: 0,
    paused: false,
    pausedAtMs: 0,
    rafId: null,
};

function startKegelTimer() {
    const task = PROTOCOL_TASKS.find(t => t.id === currentKegelTaskId);
    if (!task || task.kegel.compound) return;

    if (kegelState.phase === 'idle') {
        kegelState.task = task;
        kegelState.set = 1;
        kegelState.rep = 0;
        kegelState.paused = false;
        document.getElementById('kegel-start').textContent = '⏸ Pausar';
        enterKegelPhase('ready', 3000);
    } else {
        toggleKegelPause();
    }
}

function enterKegelPhase(phase, durationMs) {
    kegelState.phase = phase;
    kegelState.phaseDurationMs = durationMs;
    kegelState.phaseStartMs = performance.now();

    const labels = { ready: 'PREPÁRATE', contract: 'CONTRAE', relax: 'RELAJA', rest: 'DESCANSA' };
    document.getElementById('kegel-state').textContent = labels[phase];
    const pulse = document.getElementById('kegel-pulse');
    pulse.className = 'kegel-pulse';
    if (phase === 'contract') pulse.classList.add('contract');
    else if (phase === 'relax') pulse.classList.add('relax');
    else if (phase === 'rest') pulse.classList.add('rest');
    document.getElementById('kegel-rep').textContent = kegelState.rep;
    document.getElementById('kegel-set').textContent = kegelState.set;

    if (kegelState.rafId) cancelAnimationFrame(kegelState.rafId);
    tickKegel();
}

function tickKegel() {
    if (kegelState.paused) return;
    const elapsed = performance.now() - kegelState.phaseStartMs;
    const remaining = kegelState.phaseDurationMs - elapsed;
    if (remaining <= 0) {
        advanceKegelPhase();
        return;
    }
    document.getElementById('kegel-count').textContent = Math.ceil(remaining / 1000);
    kegelState.rafId = requestAnimationFrame(tickKegel);
}

function advanceKegelPhase() {
    const t = kegelState.task.kegel;
    const phase = kegelState.phase;

    if (phase === 'ready') {
        kegelState.rep = 1;
        enterKegelPhase('contract', t.contract * 1000);
    } else if (phase === 'contract') {
        enterKegelPhase('relax', t.relax * 1000);
    } else if (phase === 'relax') {
        if (kegelState.rep < t.reps) {
            kegelState.rep++;
            enterKegelPhase('contract', t.contract * 1000);
        } else if (kegelState.set < t.sets) {
            kegelState.set++;
            kegelState.rep = 0;
            enterKegelPhase('rest', (t.rest || 30) * 1000);
        } else {
            completeKegel();
        }
    } else if (phase === 'rest') {
        kegelState.rep = 1;
        enterKegelPhase('contract', t.contract * 1000);
    }
}

function completeKegel() {
    document.getElementById('kegel-state').textContent = '¡COMPLETO!';
    document.getElementById('kegel-count').textContent = '✓';
    document.getElementById('kegel-pulse').className = 'kegel-pulse complete';
    if (!isTaskDoneToday(kegelState.task.id, loadProtocolState())) {
        toggleTaskDone(kegelState.task.id);
    }
    kegelState.phase = 'idle';
    document.getElementById('kegel-start').textContent = '▶ Iniciar de nuevo';
    setTimeout(() => closeKegelView(), 1800);
}

function toggleKegelPause() {
    if (kegelState.phase === 'idle') return;
    if (!kegelState.paused) {
        kegelState.paused = true;
        kegelState.pausedAtMs = performance.now();
        document.getElementById('kegel-start').textContent = '▶ Reanudar';
        if (kegelState.rafId) cancelAnimationFrame(kegelState.rafId);
    } else {
        const pauseDuration = performance.now() - kegelState.pausedAtMs;
        kegelState.phaseStartMs += pauseDuration;
        kegelState.paused = false;
        document.getElementById('kegel-start').textContent = '⏸ Pausar';
        tickKegel();
    }
}

function resetKegelTimer() {
    if (kegelState.rafId) cancelAnimationFrame(kegelState.rafId);
    kegelState.rafId = null;
    kegelState.phase = 'idle';
    kegelState.paused = false;
    kegelState.set = 1;
    kegelState.rep = 0;
}

function initProtocolo() {
    document.getElementById('kegel-back').addEventListener('click', closeKegelView);
    document.getElementById('kegel-start').addEventListener('click', startKegelTimer);
    document.getElementById('kegel-done').addEventListener('click', () => {
        if (!currentKegelTaskId) return;
        toggleTaskDone(currentKegelTaskId);
        closeKegelView();
    });
    renderProtocolo();
}

// ─── Tab Navigation ───

function initTabs() {
    const buttons = document.querySelectorAll('.tab-btn');
    const panels = document.querySelectorAll('.panel');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.dataset.tab;

            buttons.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');

            panels.forEach(panel => {
                const isTarget = panel.id === `panel-${tabId}`;
                panel.classList.toggle('active', isTarget);
                panel.hidden = !isTarget;
            });
        });

        btn.addEventListener('keydown', (e) => {
            const btns = [...buttons];
            const idx = btns.indexOf(btn);
            let target = null;

            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                target = btns[(idx + 1) % btns.length];
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                target = btns[(idx - 1 + btns.length) % btns.length];
            } else if (e.key === 'Home') {
                target = btns[0];
            } else if (e.key === 'End') {
                target = btns[btns.length - 1];
            }

            if (target) {
                e.preventDefault();
                target.focus();
                target.click();
            }
        });
    });
}

// ─── Init ───

let lastProtocoloDayKey = todayKey();

function updateAll() {
    updateCountdown('hm', homeTargetDate);
    updateCountdown('crv', crvTargetDate);
    updateCountdown('bd', birthdayTargetDate);
    updateCountdown('ct', citrusTargetDate);
    updateCitrusPayments();
    updateMakeoverRecoveries();
    const dayKey = todayKey();
    if (dayKey !== lastProtocoloDayKey) {
        lastProtocoloDayKey = dayKey;
        protocoloLastRenderKey = '';
        renderProtocolo();
    }
}

initTabs();
initProtocolo();
updateAll();
setInterval(updateAll, 1000);
