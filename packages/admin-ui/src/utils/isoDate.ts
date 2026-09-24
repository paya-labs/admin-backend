export const MONTH_NAMES = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

export const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const pad = (n: number): string => String(n).padStart(2, '0');

// Local-time on purpose: new Date('YYYY-MM-DD') parses as UTC and shifts the
// day west of Greenwich.
export const parseIsoDate = (iso?: string): Date | null => {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso ?? '');
    return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null;
};

export const toIsoDate = (d: Date): string =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const addDays = (d: Date, n: number): Date =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

/** "2026-09-23" -> "Wed, 23 Sep 2026" */
export const formatIsoDate = (iso: string): string => {
    const d = parseIsoDate(iso);
    if (!d) return iso;
    return `${DAY_NAMES[(d.getDay() + 6) % 7]}, ${d.getDate()} ${MONTH_NAMES[d.getMonth()].slice(0, 3)} ${d.getFullYear()}`;
};
