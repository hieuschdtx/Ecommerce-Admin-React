import { format, getTime, formatDistanceToNow, isAfter, parseISO } from 'date-fns';

export const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export function fDate(date, newFormat) {
  const fm = newFormat || 'dd-MM-yyyy';

  return date ? format(new Date(date), fm) : '';
}

export function fDateTime(date, newFormat) {
  const fm = newFormat || 'dd-MM-yyyy p';

  return date ? format(new Date(date), fm) : '';
}

export function fTimestamp(date) {
  return date ? getTime(new Date(date)) : '';
}

export function fToNow(date) {
  return date
    ? formatDistanceToNow(new Date(date), {
        addSuffix: true,
      })
    : '';
}

export function fCompareTime(date) {
  const targetDate = new Date(date);
  const currentDate = new Date();

  return isAfter(targetDate, currentDate);
}

export function fStringToDate(date) {
  return date ? parseISO(date) : '';
}

export function getPreviousMonth() {
  const currentDate = new Date();
  let previousMonth = currentDate.getMonth() - 1;
  if (previousMonth < 0) {
    previousMonth = 11;
  }
  return previousMonth + 1;
}

export function getPreviousYear() {
  const currentDate = new Date();
  let year = currentDate.getFullYear();
  if (getPreviousMonth() < 0) {
    year--;
  }
  return year;
}

export function getCurrentYear() {
  return new Date().getFullYear();
}
export function getCurrentMonth() {
  return new Date().getMonth() + 1;
}

export const getDateTime = {
  previousMonth: getPreviousMonth(),
  previousYear: getPreviousYear(),
  currentMonth: getCurrentMonth(),
  currentYear: getCurrentYear(),
};

export function GenerateDateTimeInYear(year) {
  const result = [];
  for (let i = 0; i < 12; i++) {
    result.push(`${i + 1}/01/${year}`);
  }
  return result;
}

export function GenerateDayInMonth() {
  const result = [];
  for (let i = 1; i <= 31; i++) {
    result.push(i < 10 ? `0${i}` : i);
  }
  return result;
}

export function getListYear() {
  var currentYear = new Date().getFullYear();
  var arr = [];
  for (var year = 2020; year <= currentYear; year++) {
    arr.push(year);
  }
  return arr;
}

export function getListMonth() {
  var arr = [];
  for (var i = 0; i < 12; i++) {
    arr.push(i + 1);
  }
  return arr;
}
