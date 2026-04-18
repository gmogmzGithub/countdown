// ─── Target Dates (Mexico City, UTC-6) ───

// Home / Apartment: December 17, 2027 at 3:00 PM
const homeTargetDate = new Date('2027-12-17T15:00:00-06:00');

// New Car 2028: November 1, 2028 at 12:00 PM
const crvTargetDate = new Date('2028-11-01T12:00:00-06:00');

// Mommy Makeover: August 8, 2026 at 11:30 AM
const makeoverTargetDate = new Date('2026-08-08T11:30:00-06:00');

// Birthday Beach Trip: June 4, 2026 at 4:00 AM
const birthdayTargetDate = new Date('2026-06-04T04:00:00-06:00');

// Citrus Patrimonial: projected delivery February 2029
const citrusTargetDate = new Date('2029-02-01T00:00:00-06:00');

// Citrus payment plan: 36 monthly installments of $3,520 MXN
// First: March 1, 2026 · Last: February 1, 2029 · Due on the 1st of each month
const CITRUS_PAYMENT_AMOUNT = 3520;
const CITRUS_TOTAL_PAYMENTS = 36;
const CITRUS_FIRST_PAYMENT_YEAR = 2026;
const CITRUS_FIRST_PAYMENT_MONTH = 2; // March (0-indexed)

// ─── Utilities ───

function pluralize(value, singular, plural) {
    return value === 1 ? singular : plural;
}

// ─── Shared Adaptive Countdown ───
// Shows Years/Months/Days when years > 0,
// then Months/Days/Hours when months > 0,
// then Days/Hours/Minutes when days > 0,
// then Hours/Minutes/Seconds, cascading down.

function updateCountdown(prefix, targetDate) {
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

    if (years > 0) {
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

const SPANISH_MONTHS = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];

function citrusPaymentDate(index) {
    return new Date(
        CITRUS_FIRST_PAYMENT_YEAR,
        CITRUS_FIRST_PAYMENT_MONTH + index,
        1,
        0, 0, 0, 0,
    );
}

function updateCitrusPayments() {
    const now = new Date();
    let paid = 0;
    for (let i = 0; i < CITRUS_TOTAL_PAYMENTS; i++) {
        if (citrusPaymentDate(i) <= now) paid++;
    }
    const remaining = CITRUS_TOTAL_PAYMENTS - paid;
    const paidAmount = paid * CITRUS_PAYMENT_AMOUNT;
    const remainingAmount = remaining * CITRUS_PAYMENT_AMOUNT;
    const percent = (paid / CITRUS_TOTAL_PAYMENTS) * 100;

    const paidCountEl = document.getElementById('ct-paid-count');
    const remainingCountEl = document.getElementById('ct-remaining-count');
    const paidAmountEl = document.getElementById('ct-paid-amount');
    const remainingAmountEl = document.getElementById('ct-remaining-amount');
    const fillEl = document.getElementById('ct-progress-fill');
    const nextEl = document.getElementById('ct-next');

    if (paidCountEl) paidCountEl.textContent = paid;
    if (remainingCountEl) remainingCountEl.textContent = remaining;
    if (paidAmountEl) paidAmountEl.textContent = MXN_FORMATTER.format(paidAmount);
    if (remainingAmountEl) remainingAmountEl.textContent = MXN_FORMATTER.format(remainingAmount);
    if (fillEl) fillEl.style.width = `${percent}%`;

    if (nextEl) {
        if (paid >= CITRUS_TOTAL_PAYMENTS) {
            nextEl.textContent = 'Plan completado';
        } else {
            const next = citrusPaymentDate(paid);
            const monthName = SPANISH_MONTHS[next.getMonth()];
            const year = next.getFullYear();
            nextEl.textContent = `Próxima: ${MXN_FORMATTER.format(CITRUS_PAYMENT_AMOUNT)} · 1 de ${monthName} ${year}`;
        }
    }
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

function updateAll() {
    updateCountdown('hm', homeTargetDate);
    updateCountdown('crv', crvTargetDate);
    updateCountdown('mk', makeoverTargetDate);
    updateCountdown('bd', birthdayTargetDate);
    updateCountdown('ct', citrusTargetDate);
    updateCitrusPayments();
}

initTabs();
updateAll();
setInterval(updateAll, 1000);
