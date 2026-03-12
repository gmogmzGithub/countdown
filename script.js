// ─── Target Dates ───

// Home / Apartment: December 17, 2027 at 3:00 PM CST (UTC-6)
const homeTargetDate = new Date('2027-12-17T15:00:00-06:00');

// New Car 2028: November 1, 2028 at 12:00 PM CST (UTC-6)
const crvTargetDate = new Date('2028-11-01T12:00:00-06:00');

// Mommy Makeover: April 11, 2026 at 11:30 AM CST (UTC-6)
const makeoverTargetDate = new Date('2026-04-11T11:30:00-06:00');

// Birthday Beach Trip: June 4, 2026 at 4:00 AM CST (UTC-6)
const birthdayTargetDate = new Date('2026-06-04T04:00:00-06:00');

// ─── Utilities ───

function pluralize(value, singular, plural) {
    return value === 1 ? singular : plural;
}

// ─── Home / Apartment Countdown ───

function updateHomeCountdown() {
    const now = new Date();
    const diff = homeTargetDate - now;

    const ids = ['hm-days', 'hm-hours', 'hm-mins', 'hm-secs'];

    if (diff <= 0) {
        ids.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = '00';
        });
        return;
    }

    const sec = 1000;
    const min = sec * 60;
    const hour = min * 60;
    const day = hour * 24;

    const days = Math.floor(diff / day);
    const hours = Math.floor((diff % day) / hour);
    const mins = Math.floor((diff % hour) / min);
    const secs = Math.floor((diff % min) / sec);

    const values = { 'hm-days': days, 'hm-hours': hours, 'hm-mins': mins, 'hm-secs': secs };

    for (const [id, value] of Object.entries(values)) {
        const el = document.getElementById(id);
        if (el) el.textContent = String(value).padStart(2, '0');
    }

    const labels = {
        'hm-days': pluralize(days, 'Day', 'Days'),
        'hm-hours': pluralize(hours, 'Hour', 'Hours'),
        'hm-mins': pluralize(mins, 'Minute', 'Minutes'),
        'hm-secs': pluralize(secs, 'Second', 'Seconds'),
    };

    for (const [id, label] of Object.entries(labels)) {
        const el = document.getElementById(id);
        if (el) {
            const labelEl = el.parentElement?.querySelector('.countdown-unit-label');
            if (labelEl) labelEl.textContent = label;
        }
    }
}

// ─── New Car 2028 Countdown ───

function updateCrvCountdown() {
    const now = new Date();
    const diff = crvTargetDate - now;

    const ids = ['crv-years', 'crv-months', 'crv-days', 'crv-hours'];

    if (diff <= 0) {
        ids.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = '0';
        });
        return;
    }

    const hour = 1000 * 60 * 60;
    const day = hour * 24;
    const totalDays = Math.floor(diff / day);

    const years = Math.floor(totalDays / 365.25);
    let remaining = Math.floor(totalDays - (years * 365.25));
    const months = Math.floor(remaining / 30.44);
    const days = Math.floor(remaining - (months * 30.44));
    const hours = Math.floor((diff % day) / hour);

    const values = { 'crv-years': years, 'crv-months': months, 'crv-days': days, 'crv-hours': hours };

    for (const [id, value] of Object.entries(values)) {
        const el = document.getElementById(id);
        if (el) el.textContent = String(value).padStart(2, '0');
    }

    // Update unit labels for singular/plural
    const labels = {
        'crv-years': pluralize(years, 'Year', 'Years'),
        'crv-months': pluralize(months, 'Month', 'Months'),
        'crv-days': pluralize(days, 'Day', 'Days'),
        'crv-hours': pluralize(hours, 'Hour', 'Hours'),
    };

    for (const [id, label] of Object.entries(labels)) {
        const el = document.getElementById(id);
        if (el) {
            const labelEl = el.parentElement?.querySelector('.countdown-unit-label');
            if (labelEl) labelEl.textContent = label;
        }
    }
}

// ─── Mommy Makeover Countdown ───

function updateMakeoverCountdown() {
    const now = new Date();
    const diff = makeoverTargetDate - now;

    const ids = ['mk-days', 'mk-hours', 'mk-mins', 'mk-secs'];

    if (diff <= 0) {
        ids.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = '00';
        });
        return;
    }

    const sec = 1000;
    const min = sec * 60;
    const hour = min * 60;
    const day = hour * 24;

    const days = Math.floor(diff / day);
    const hours = Math.floor((diff % day) / hour);
    const mins = Math.floor((diff % hour) / min);
    const secs = Math.floor((diff % min) / sec);

    const values = { 'mk-days': days, 'mk-hours': hours, 'mk-mins': mins, 'mk-secs': secs };

    for (const [id, value] of Object.entries(values)) {
        const el = document.getElementById(id);
        if (el) el.textContent = String(value).padStart(2, '0');
    }

    const labels = {
        'mk-days': pluralize(days, 'Day', 'Days'),
        'mk-hours': pluralize(hours, 'Hour', 'Hours'),
        'mk-mins': pluralize(mins, 'Minute', 'Minutes'),
        'mk-secs': pluralize(secs, 'Second', 'Seconds'),
    };

    for (const [id, label] of Object.entries(labels)) {
        const el = document.getElementById(id);
        if (el) {
            const labelEl = el.parentElement?.querySelector('.countdown-unit-label');
            if (labelEl) labelEl.textContent = label;
        }
    }
}

// ─── Birthday Beach Trip Countdown ───

function updateBirthdayCountdown() {
    const now = new Date();
    const diff = birthdayTargetDate - now;

    const ids = ['bd-days', 'bd-hours', 'bd-mins', 'bd-secs'];

    if (diff <= 0) {
        ids.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = '00';
        });
        return;
    }

    const sec = 1000;
    const min = sec * 60;
    const hour = min * 60;
    const day = hour * 24;

    const days = Math.floor(diff / day);
    const hours = Math.floor((diff % day) / hour);
    const mins = Math.floor((diff % hour) / min);
    const secs = Math.floor((diff % min) / sec);

    const values = { 'bd-days': days, 'bd-hours': hours, 'bd-mins': mins, 'bd-secs': secs };

    for (const [id, value] of Object.entries(values)) {
        const el = document.getElementById(id);
        if (el) el.textContent = String(value).padStart(2, '0');
    }

    const labels = {
        'bd-days': pluralize(days, 'Day', 'Days'),
        'bd-hours': pluralize(hours, 'Hour', 'Hours'),
        'bd-mins': pluralize(mins, 'Minute', 'Minutes'),
        'bd-secs': pluralize(secs, 'Second', 'Seconds'),
    };

    for (const [id, label] of Object.entries(labels)) {
        const el = document.getElementById(id);
        if (el) {
            const labelEl = el.parentElement?.querySelector('.countdown-unit-label');
            if (labelEl) labelEl.textContent = label;
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

            // Update buttons
            buttons.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');

            // Update panels
            panels.forEach(panel => {
                const isTarget = panel.id === `panel-${tabId}`;
                panel.classList.toggle('active', isTarget);
                panel.hidden = !isTarget;
            });
        });

        // Keyboard navigation between tabs
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

initTabs();
updateHomeCountdown();
updateCrvCountdown();
updateMakeoverCountdown();
updateBirthdayCountdown();

setInterval(updateHomeCountdown, 1000);
setInterval(updateCrvCountdown, 1000);
setInterval(updateMakeoverCountdown, 1000);
setInterval(updateBirthdayCountdown, 1000);
