import { format, formatDistanceToNow, parseISO, isAfter, isBefore, addDays } from 'date-fns';

export function formatDate(dateString: string): string {
  try {
    return format(parseISO(dateString), 'MMM d, yyyy');
  } catch {
    return dateString;
  }
}

export function formatDateLong(dateString: string): string {
  try {
    return format(parseISO(dateString), 'MMMM d, yyyy');
  } catch {
    return dateString;
  }
}

export function formatRelativeDate(dateString: string): string {
  try {
    return formatDistanceToNow(parseISO(dateString), { addSuffix: true });
  } catch {
    return dateString;
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

export function isDateOverdue(dateString: string): boolean {
  try {
    return isBefore(parseISO(dateString), new Date());
  } catch {
    return false;
  }
}

export function isDateUpcoming(dateString: string, days: number = 30): boolean {
  try {
    const date = parseISO(dateString);
    const now = new Date();
    const futureDate = addDays(now, days);
    return isAfter(date, now) && isBefore(date, futureDate);
  } catch {
    return false;
  }
}

export function calculateAge(installDateString: string): number {
  try {
    const installDate = parseISO(installDateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - installDate.getTime());
    const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);
    return Math.floor(diffYears);
  } catch {
    return 0;
  }
}

export function calculateRemainingLife(installDateString: string, expectedLifespan: number): number {
  const age = calculateAge(installDateString);
  return Math.max(0, expectedLifespan - age);
}

export function calculateLifePercentage(installDateString: string, expectedLifespan: number): number {
  const age = calculateAge(installDateString);
  return Math.min(100, Math.round((age / expectedLifespan) * 100));
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}
