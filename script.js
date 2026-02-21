// ─── Target Dates ───

// Home: December 17, 2027 at 3:00 PM CST (UTC-6)
const homeTargetDate = new Date('2027-12-17T15:00:00-06:00');

// CR-V 2028: November 1, 2028 at 12:00 PM CST (UTC-6)
const crvTargetDate = new Date('2028-11-01T12:00:00-06:00');

// ─── Utilities ───

function pluralize(value, singular, plural) {
    return value === 1 ? singular : plural;
}

// ─── Home Countdown ───

function calculateHomeCountdown() {
    const now = new Date();
    const diff = homeTargetDate - now;

    if (diff <= 0) {
        return "Time's Up!";
    }

    const day = 1000 * 60 * 60 * 24;
    const totalDays = Math.floor(diff / day);
    const years = Math.floor(totalDays / 365.25);
    let remainingDays = Math.floor(totalDays - (years * 365.25));
    const months = Math.floor(remainingDays / 30.44);
    const days = Math.floor(remainingDays - (months * 30.44));

    if (years > 0) {
        return `${years} ${pluralize(years, 'year', 'years')}, ${months} ${pluralize(months, 'month', 'months')} and ${days} ${pluralize(days, 'day', 'days')}`;
    }

    const totalMonths = Math.floor(totalDays / 30.44);
    const daysAfterMonths = Math.floor(totalDays - (totalMonths * 30.44));

    if (totalMonths > 0) {
        return `${totalMonths} ${pluralize(totalMonths, 'month', 'months')}, ${daysAfterMonths} ${pluralize(daysAfterMonths, 'day', 'days')}`;
    }

    return `${totalDays} ${pluralize(totalDays, 'day', 'days')}`;
}

function updateHomeCountdown() {
    const el = document.getElementById('countdown-home');
    if (el) el.textContent = calculateHomeCountdown();
}

// ─── CR-V 2028 Countdown ───

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

setInterval(updateHomeCountdown, 1000);
setInterval(updateCrvCountdown, 1000);
